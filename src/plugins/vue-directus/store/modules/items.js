/* eslint-disable padding-line-between-statements */
import _ from 'lodash'
import * as DeepDiff from 'deep-object-diff'
import VueDirectusApi from '../../api'

const namespaced = true

const setInternalId = () =>
  Math.random()
    .toString(36)
    .substr(2, 9)

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
    _.each(state.remote[table].data, (obj, index) => {
      obj.sort = index
      obj._id = setInternalId()
    })
  },

  SORT: (state, table) => {
    _.each(state.local[table].data, (obj, index) => (obj.sort = index))
  },

  SYNC: state => {
    state.local = _.cloneDeep(state.remote)
  },

  ADD: (state, { table, item }) => {
    state.local[table].data.push(item)
  },

  REMOVE: (state, { table, index }) => {
    state.local[table].data.splice(index, 1)
  }
}

const actions = {
  // Fetch items from backend
  async fetch({ commit }, table) {
    commit('BUSY', true)

    // Await repsonse from server
    await VueDirectusApi.getItems(table)
      .then(resp => {
        // Save items in remote branch, create a new internal _id and
        // map array index to obj.sort value
        commit('SAVE', { table, resp })

        // Sync remote branch to local branch
        commit('SYNC')

        return commit('BUSY', false)
      })
      .catch(() => {
        throw Error(`Failed to fetch items from table '${table}'`)
      })
  },

  // Apply sorting to all items
  sort({ commit }, table) {
    commit('BUSY', true)
    commit('SORT', table)
    commit('BUSY', false)
  },

  // Add item to local branch
  add({ commit, getters }, table) {
    commit('BUSY', true)

    // Clone most recent item from the local branch
    const item = _.cloneDeep(_.last(getters.table(table)))

    // Delete id, generate internal _id and increase sort index
    delete item.id
    item._id = setInternalId()
    item.sort += 1

    // Add new item to local branch & sort branch
    commit('ADD', { table, item })
    commit('SORT', table)

    return commit('BUSY', false)
  },

  // Remove item from local branch
  remove({ commit }, { table, id }) {
    commit('BUSY', true)

    // Get the item´s index
    const index = parseInt(_.findKey(state.local[table].data, obj => obj._id === id))

    // Remove item from local branch & sort branch
    commit('REMOVE', { table, index })
    commit('SORT', table)

    return commit('BUSY', false)
  }
}

const getters = {
  // Get current status
  busy: state => state.busy,

  // Get items for given table
  table(state) {
    return table => (state.local[table] ? state.local[table].data : [])
  },

  // Get difference between local and remote branch
  diff() {
    const changed = []
    _.each(state.remote, obj => {
      const table = obj.meta.table
      const diff = DeepDiff.diff(state.remote[table], state.local[table])
      // Push modified objects
      if (!_.isEmpty(diff)) {
        changed.push(diff)
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
