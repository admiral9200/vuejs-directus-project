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
        // This holds all commited mutations
        commited: [],
        busy: false
      },
      // Include all external modules
      modules: {
        ...VueDirectusStore
      },
      getters: {
        isBusy: state => state.busy,
        // Ignore the first two `FETCH & SYNC` mutations
        hasCommits: state => state.commited.length > 2
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
          // Remove latest commit
          state.commited.pop()
          // Undo all previous commits
          commit('RESET_ITEMS')
          // Recommit all previous commits except the last one
          // which we have just removed
          state.commited.forEach(({ type, payload }) => {
            commit(type, payload, { root: true })
            // Remove commit from history
            state.commited.pop()
          })
        }
      }
    })

    // Subscribe to item mutations
    store.subscribe((mutation, state) => {
      // Skip mutations that contain the following
      const blacklist = ['SET_STATUS', 'RESET_ITEMS']
      const exclude = blacklist.some(el => mutation.type.includes(el))

      if (!exclude) {
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
