/* eslint-disable padding-line-between-statements */
import VueDirectusApi from '../../api'

const namespaced = true

const state = {
  directus: {}
}

const mutations = {
  FETCH: (state, payload) => {
    state.directus = payload
  }
}

const actions = {
  async fetch({ commit }) {
    await VueDirectusApi.getSettings()
      .then(resp => {
        return commit('FETCH', resp.data)
      })
      .catch(() => {
        throw Error(`Failed to fetch directus settings`)
      })
  }
}

const getters = {
  all: state => state
}

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions
}
