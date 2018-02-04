/* eslint-disable padding-line-between-statements */
import _ from 'lodash'
import VueDirectusApi from '../../api'

const namespaced = true

const state = {
  fetched: {}
}

const mutations = {
  FETCH: (state, payload) => {
    state.fetched = payload
  },

  ADD: (state, { table, payload }) => {
    state.fetched[table].data.push(payload)
  },

  DELETE: (state, { table, index }) => {
    state.fetched[table].data.splice(index, 1)
  },

  SORT: (state, { table, items }) => {
    state.fetched[table].data = items
  }
}

const actions = {
  // Fetch items by table and save them all
  // in a new object with table name as key
  async fetch({ commit }, table) {
    await VueDirectusApi.getItems(table)
      .then(resp => {
        return commit('FETCH', { ...state.fetched, [table]: resp })
      })
      .catch(() => {
        throw Error(`Failed to fetch items from table '${table}'`)
      })
  },

  // Add item by cloning the last fetched item
  // and commit it to the fetched items
  async add({ commit, getters }, table) {
    const items = getters.table(table)

    // Get the most recent item & clone it
    // than remove id and reset sort value
    const clone = _.cloneWith(_.last(items), value => {
      delete value.id
      value.sort = 0
    })

    // Create item and commit it to the fetched items
    await VueDirectusApi.createItem(table, clone)
      .then(resp => {
        return commit('ADD', { table, payload: resp.data })
      })
      .catch(() => {
        throw Error(`Failed to add item to table '${table}'`)
      })
  },

  // Remove an item from the fetched items
  // and remove it from the server
  async remove({ commit }, { table, id }) {
    const index = _.findKey(state.fetched[table].data, o => o.id === id)

    // Delete item from fetched items as soon as
    // it is deleted from the server
    await VueDirectusApi.deleteItem(table, id)
      .then(resp => {
        return commit('DELETE', { table, index })
      })
      .catch(() => {
        throw Error(`Failed to delete item '${id}' from table '${table}'`)
      })
  },

  // Sort items based on its current position in fetched items
  // by settings the obj.sort value to the current array index
  sort({ commit, getters }, table) {
    const items = getters.table(table)

    _.each(items, (o, index) => (o.sort = index))
    commit('SORT', { table, items })
  }
}

const getters = {
  // Get all items by table and return a function
  // so we can pass the table name as an argument
  table(state) {
    return table => (state.fetched[table] ? state.fetched[table].data : [])
  }
}

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions
}
