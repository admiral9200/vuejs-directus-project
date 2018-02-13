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

    // Empty array for all store mutations
    const done = []

    // Register new store module
    store.registerModule('VueDirectus', {
      namespaced: true,
      state: {
        busy: false
      },
      // Include all external modules
      modules: {
        ...VueDirectusStore
      },
      getters: {
        isBusy: state => state.busy
      },
      mutations: {
        RESET_ITEMS(state) {
          state.items.remote = {}
          state.items.local = {}
        },
        SET_STATUS(state, payload) {
          state.busy = payload
        }
      },
      actions: {
        busy({ commit }, payload) {
          commit('SET_STATUS', payload)
        },
        undo({ commit }) {
          // Remove latest commit
          done.pop()
          // Undo all previous commits
          commit('RESET_ITEMS')
          // Recommit all previous commits except the last one
          // which we have just removed
          done.forEach(({ type, payload }) => {
            commit(type, payload, { root: true })
            // Remove commit from history
            done.pop()
          })
        }
      }
    })

    // Subscribe to item mutations but
    // skip sorting and busy mutations
    store.subscribe(mutation => {
      if (
        mutation.type.includes('items/') &&
        !mutation.type.includes('BUSY') &&
        !mutation.type.includes('RESORT')
      ) {
        done.push(mutation)
      }
    })

    // Register plugin components
    Object.entries(VueDirectusComponents).forEach(([name, component]) =>
      Vue.component(name, component)
    )
  }
}

export default VueDirectus
