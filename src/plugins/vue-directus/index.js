import VueDirectusApi from './api'
import * as VueDirectusStore from './store'
import * as VueDirectusComponents from './components'

const VueDirectus = {
  install(Vue, { store }) {
    if (!store) {
      throw Error(`VueDirectus requires the vuex store.`)
    }

    if (!VueDirectusApi) {
      throw Error(`VueDirectus requires the directus-sdk client.`)
    }

    // Register new store module
    store.registerModule('VueDirectus', {
      namespaced: true,
      state: {
        commited: [],
        busy: false
      },
      modules: {
        ...VueDirectusStore
      },
      getters: {
        isBusy: state => state.busy,
        // Return length of mutations ignoring all SYNC and FETCH mutations
        hasCommits: state => state.commited.filter(m => !/SYNC|FETCH/.test(m.type)).length > 0
      },
      mutations: {
        RESET_ITEMS(state) {
          state.items.fetched = []
        },
        SET_STATUS(state, payload) {
          state.busy = payload
        }
      },
      actions: {
        busy({ commit }, payload) {
          commit('SET_STATUS', payload)
        },
        undo({ state, commit }) {
          state.commited.pop()
          commit('RESET_ITEMS')
          // Recommit all previous commits except the last one, which we
          // have just removed. Than remove the restored commits from the history.
          state.commited.forEach(({ type, payload }) => {
            commit(type, payload, { root: true })
            state.commited.pop()
          })
        }
      }
    })

    // Subscribe to item mutations
    // Ignore internal STATUS and RESET mutations
    store.subscribe((mutation, state) => {
      if (!/STATUS|RESET/.test(mutation.type)) {
        state.VueDirectus.commited.push(mutation)
      }
    })

    // Register plugin components
    Object.entries(VueDirectusComponents).forEach(([name, component]) =>
      Vue.component(name, component)
    )
  }
}

export default VueDirectus
