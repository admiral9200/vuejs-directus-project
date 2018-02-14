/* eslint-disable padding-line-between-statements */
import _ from 'lodash'
import shortid from 'shortid'
import VueDirectusApi from '../../api'

const namespaced = true

const state = {
  local: {},
  remote: {}
}

const mutations = {
  SYNC: state => {
    state.local = _.cloneDeep(state.remote)
  },

  FETCH: (state, { table, items }) => {
    state.remote = { ...state.remote, [table]: items }
  },

  ADD: (state, { table, item }) => {
    state.local[table].data.push(item)
  },

  REMOVE: (state, { table, index }) => {
    state.local[table].data.splice(index, 1)
  },

  EDIT: (state, { table, index, column, value }) => {
    state.local[table].data[index][column] = value
  }
}

const actions = {
  async fetch({ commit, dispatch }, table) {
    dispatch('VueDirectus/busy', true, { root: true })

    // Fetch items from API
    const items = await VueDirectusApi.getItems(table)
    const payload = items.data

    // Modify fetched items
    _.each(payload, (set, index) => {
      set.sort = index
      set._id = shortid()
      set._hasImage = !!_.find(set, o => _.isObject(o) && _.get(o, 'data.type').includes('image'))
    })

    // Save fetched items and sync with local branch
    commit('FETCH', { table, items })
    commit('SYNC')

    dispatch('VueDirectus/busy', false, { root: true })
  },

  add({ commit }, table) {
    // Clone previous sibling
    let item = _.clone(_.last(state.local[table].data))

    // Change _id and increase sort
    item._id = shortid()
    item.sort += 1

    // Add clone to local branch
    commit('ADD', { table, item })
  },

  remove({ commit }, { table, id }) {
    // Get index of item
    const index = _.findIndex(state.local[table].data, set => set._id === id)

    commit('REMOVE', { table, index })
  },

  edit({ commit }, { table, id, column, value }) {
    // Get index of item
    const index = _.findIndex(state.local[table].data, set => set._id === id)

    commit('EDIT', { table, index, column, value })
  },

  save({ commit, getters }) {
    // Get changed items
    const diff = getters.diff

    console.log(diff)
  }
}

const getters = {
  // Return all items of a given table
  byTable: state => table => (state.local[table] ? state.local[table].data : []),

  // Return wheter the local state contains uncommited diffs
  hasDiff: (state, getters) => {
    return (
      _.size(
        _.find(getters.diff, (set, table) => {
          return !_.isEmpty(set.toDelete) || !_.isEmpty(set.toCreate) || !_.isEmpty(set.toUpdate)
        })
      ) > 0
    )
  },

  // Get diff between local and remote state
  diff: state => {
    let diff = {}

    // Loop over all data sets in local branch
    _.forOwn(state.local, (set, table) => {
      const remote = state.remote[table].data
      const local = set.data
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
