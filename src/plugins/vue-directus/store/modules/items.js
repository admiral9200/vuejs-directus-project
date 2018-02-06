/* eslint-disable padding-line-between-statements */
import _ from 'lodash'
import shortid from 'shortid'
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
    _.each(resp.data, (obj, index) => {
      obj.sort = index
      obj._id = shortid()
    })
    state.remote = { ...state.remote, [table]: resp }
  },

  SYNC: state => {
    state.local = _.cloneDeep(state.remote)
  },

  SORT: (state, table) => {
    _.each(state.local[table].data, (obj, index) => (obj.sort = index))
  },

  ADD: (state, { table, item }) => {
    state.local[table].data.push(item)
  },

  REMOVE: (state, { table, index }) => {
    state.local[table].data.splice(index, 1)
  }
}

const actions = {
  // Connect to backend and save results in local branch
  // and apply sorting and internal _ID to all items
  async fetch({ commit }, table) {
    commit('BUSY', true)
    return VueDirectusApi.getItems(table)
      .then(resp => {
        commit('SAVE', { table, resp })
        commit('SYNC')
        commit('BUSY', false)
        return true
      })
      .catch(() => {
        throw Error(`Failed to fetch items from table '${table}'`)
      })
  },

  // Apply sorting by setting item.sort
  // to its current array index
  sort({ commit }, table) {
    commit('BUSY', true)
    commit('SORT', table)
    commit('BUSY', false)
  },

  // Add item to local branch by cloning
  // the most recent item from local branch
  add({ commit, getters }, table) {
    commit('BUSY', true)

    // Clone most recent item from the local branch
    const item = _.cloneDeep(_.last(getters.table(table)))

    // Remove the cloned ID, increase sort value
    // and generate new internal _ID
    item.id = undefined
    item.sort += 1
    item._id = shortid()

    // Push new item to local branch & resort table
    commit('ADD', { table, item })
    commit('SORT', table)

    commit('BUSY', false)
  },

  // Delete item from local branch
  // by using its array index
  remove({ commit }, { table, id }) {
    commit('BUSY', true)

    // Get the item´s array index
    const index = parseInt(_.findKey(state.local[table].data, obj => obj._id === id))

    // Remove item from local branch & resort table
    commit('REMOVE', { table, index })
    commit('SORT', table)

    commit('BUSY', false)
  },

  // Save all changes from local branch in server
  // and sync with remote branch
  save({ commit, getters, dispatch }) {
    let promise = Promise.resolve()

    Object.entries(getters.diff).forEach(([table, set]) => {
      commit('BUSY', true)

      if (set.toDelete.length > 0) {
        promise = VueDirectusApi.deleteBulk(table, set.toDelete).catch(() => {
          throw Error(`Failed to delete item(s) in table '${table}'`)
        })
      }
      if (set.toCreate.length > 0) {
        promise = VueDirectusApi.createBulk(table, set.toCreate).catch(() => {
          throw Error(`Failed to create item(s) in table '${table}'`)
        })
      }
      if (set.toUpdate.length > 0) {
        promise = VueDirectusApi.updateBulk(table, set.toUpdate).catch(() => {
          throw Error(`Failed to update item(s) in table '${table}'`)
        })
      }

      // Fetch items to sync remote and local state
      // this also resets `busy` state
      promise.then(() => {
        dispatch('fetch', table)
        return true
      })
    })
  }
}

const getters = {
  // Get busy status
  busy: state => state.busy,

  // Get all items in table
  table(state) {
    return table => (state.local[table] ? state.local[table].data : [])
  },

  // Return wheter the local state contains uncommited diffs
  modified(state, getters) {
    return _.find(getters.diff, (set, table) => {
      return !_.isEmpty(set.toDelete) || !_.isEmpty(set.toCreate) || !_.isEmpty(set.toUpdate)
    })
  },

  // Gett diff between local and remote branch
  diff(state) {
    let diff = {}

    // Loop over all data sets in local branch
    _.forOwn(state.local, (set, table) => {
      const local = set.data
      const remote = state.remote[table].data
      const toDelete = []
      const toCreate = []
      const toUpdate = []

      // Find missing items
      _.forOwn(remote, el => {
        if (!_.find(local, el)) {
          toDelete.push(el)
        }
      })

      // Find new items
      _.forOwn(local, el => {
        if (!_.find(remote, el)) {
          toCreate.push(el)
        }
      })

      // Find changed items
      _.forOwn(local, el => {
        let copy = _.find(remote, el)
        if (!_.isEqual(copy, el) && !_.includes(toCreate, el) && !_.includes(toDelete, el)) {
          toUpdate.push(el)
        }
      })

      // Merge all arrays
      diff = _.set(diff, `${table}.toDelete`, toDelete)
      diff = _.set(diff, `${table}.toCreate`, toCreate)
      diff = _.set(diff, `${table}.toUpdate`, toUpdate)
    })

    return diff
  }
}

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions
}
