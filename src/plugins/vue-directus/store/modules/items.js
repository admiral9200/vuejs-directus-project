/* eslint-disable padding-line-between-statements */
import VueDirectusApi from '../../api'

const namespaced = true

const state = {
  fetched: {}
}

const mutations = {
  FETCH: (state, payload) => {
    state.fetched = payload
  }
}

const actions = {
  // Fetch item by table and
  // save items with table name as key
  async fetch({ commit }, table) {
    await VueDirectusApi.getItems(table)
      .then(resp => {
        const data = {}
        data[table] = resp
        return commit('FETCH', data)
      })
      .catch(() => {
        throw Error('Failed to fetch items from directus backend')
      })
  }
}

const getters = {
  // Get all items by table and return
  // a function so we can pass table name as an argument
  itemsByTable(state) {
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
