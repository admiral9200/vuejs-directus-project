/* eslint-disable padding-line-between-statements */
import _ from 'lodash'
import VueDirectusApi from '../../api'

const namespaced = true

const state = {
  busy: false,
  remote: {},
  local: {}
}

const mutations = {
  BUSY: (state, payload) => {
    state.busy = payload
  },

  SAVE: (state, { table, resp }) => {
    state.remote = { ...state.remote, [table]: resp }
  },

  SYNC: state => {
    state.local = _.cloneDeep(state.remote)
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
  // Sort items based on its current position in the local branch
  sort({ commit }, table) {
    commit('SORT', { branch: 'local', table })
  },

  // Fetch items by table and save & sort remote branch
  // Than sync to local branch and keep remote for reference
  async fetch({ commit }, table) {
    await VueDirectusApi.getItems(table)
      .then(resp => {
        commit('SAVE', { table, resp })
        commit('SORT', { branch: 'remote', table })
        commit('SYNC')
        return true
      })
      .catch(() => {
        throw Error(`Failed to fetch items from table '${table}'`)
      })
  },

  // Add item by cloning the last local item
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

    // Create item and save it in the remote & local branch
    await VueDirectusApi.createItem(table, clone)
      .then(resp => {
        return commit('ADD', { table, payload: resp.data })
      })
      .catch(() => {
        throw Error(`Failed to add item to table '${table}'`)
      })
  },

  // Remove an item
  async remove({ commit }, { table, id }) {
    const index = _.findKey(state.local[table].data, obj => obj.id === id)

    // Delete item and remove it from the remote & local branch
    await VueDirectusApi.deleteItem(table, id)
      .then(resp => {
        return commit('DELETE', { table, index })
      })
      .catch(() => {
        throw Error(`Failed to delete item '${id}' from table '${table}'`)
      })
  },

  // Save all items that were modified in the local branch
  async save({ commit, getters }) {
    const diff = getters.diff
    await _.each(diff, async obj => {
      const table = _.keys(obj)[0]
      const items = obj[table]

      // Disable race conditions when saving
      commit('BUSY', true)

      // Await update resp from serv and than re-sync remote branch
      await VueDirectusApi.updateBulk(table, items)
        .then(resp => {
          return commit('BUSY', false)
        })
        .catch(() => {
          throw Error(`Failed to save items to table '${table}'`)
        })

      // Sync local to remote branch
      commit('SYNC')
    })
  }
}

const getters = {
  // Get current status
  busy: state => state.busy,

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
          changed.push({ [key]: diff })
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
