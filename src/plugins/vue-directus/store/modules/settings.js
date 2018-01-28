/* eslint-disable padding-line-between-statements */
import client from '@/api'

const namespaced = true

const state = {
  directus: {
    files: {},
    global: {}
  }
}

const mutations = {
  SETTINGS: (state, payload) => {
    state.directus = payload
  }
}

const actions = {
  async fetch({ commit }) {
    await client
      .getSettings()
      .then(resp => {
        return commit('SETTINGS', resp.data)
      })
      .catch(() => {
        throw Error('Failed to connect to directus backend')
      })
  }
}

const getters = {
  directus: state => state.directus
}

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions
}
