/* eslint-disable padding-line-between-statements */
import _ from 'lodash'
import VueDirectusApi from '../../api'

const namespaced = true

const state = {
  remote: {},
  local: {}
}

const mutations = {
  SAVE_REMOTE: (state, { table, resp }) => {
    state.remote[table] = _.cloneDeep(resp)
  },

  SAVE_LOCAL: (state, { table, resp }) => {
    state.local = { ...state.local, [table]: resp }
  },

  ADD: (state, { table, payload }) => {
    state.remote[table].data.push(payload)
    state.local[table].data.push(payload)
  },

  DELETE: (state, { table, index }) => {
    state.remote[table].data.splice(index, 1)
    state.local[table].data.splice(index, 1)
  },

  SORT: (state, { branch, table }) => {
    _.each(state[branch][table].data, (obj, index) => (obj.sort = index))
  }
}

const actions = {
  // Fetch items by table and save & sort local and remote branch
  // by setting each items sort value to its array index.
  // The remote branch acts as reference point when saving modified items
  async fetch({ commit }, table) {
    await VueDirectusApi.getItems(table)
      .then(resp => {
        commit('SAVE_REMOTE', { table, resp })
        commit('SORT', { branch: 'remote', table })
        commit('SAVE_LOCAL', { table, resp })
        commit('SORT', { branch: 'local', table })
        return true
      })
      .catch(() => {
        throw Error(`Failed to fetch items from table '${table}'`)
      })
  },

  // Add item by cloning the last local item
  // and commit it to the local and remote branch
  async add({ commit, getters }, table) {
    const items = getters.table(table)

    if (_.isEmpty(items)) {
      throw Error('Failed to add item. Make sure the collection contains at least one item.')
    }

    // Get the most recent item & clone it
    // than remove id and increase sort value by one
    const clone = _.cloneDeepWith(_.last(items))
    delete clone.id
    clone.sort += 1

    // Create item and commit it to the local and remote branch
    await VueDirectusApi.createItem(table, clone)
      .then(resp => {
        return commit('ADD', { table, payload: resp.data })
      })
      .catch(() => {
        throw Error(`Failed to add item to table '${table}'`)
      })
  },

  // Remove an item from the server and than
  // remove it from the local and remote branch
  async remove({ commit }, { table, id }) {
    const index = _.findKey(state.local[table].data, obj => obj.id === id)

    // Delete item from local branch as soon as
    // it is deleted from the server
    await VueDirectusApi.deleteItem(table, id)
      .then(resp => {
        return commit('DELETE', { table, index })
      })
      .catch(() => {
        throw Error(`Failed to delete item '${id}' from table '${table}'`)
      })
  },

  // Sort items based on its current
  // position in local branch
  sort({ commit }, table) {
    commit('SORT', { branch: 'local', table })
  }
}

const getters = {
  // Get items for given table
  table(state) {
    return table => (state.local[table] ? state.local[table].data : [])
  },

  // Return the difference between local and
  // remote state for all tables
  diff(state) {
    const changed = []
    _.each(_.keys(state.local), key => {
      if (state.local[key] && state.remote[key]) {
        const diff = _.differenceWith(state.local[key].data, state.remote[key].data, _.isEqual)
        if (diff.length > 0) {
          changed.push(diff)
        }
      }
    })
    return changed
  }
}

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions
}
