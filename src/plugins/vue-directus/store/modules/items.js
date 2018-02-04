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
  // as template and push it to the fetched items
  async add({ commit, getters }, table) {
    const items = getters.table(table)

    // Get the most recent item
    let item = _.last(items)

    // Clone the item, remove id and reset sort value
    let clone = _.cloneWith(item, value => {
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
