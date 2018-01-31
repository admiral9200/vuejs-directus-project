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
  }
}

const getters = {
  // Get all items by table and return
  // a function so we can pass table name as an argument
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
