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
      modules: { ...VueDirectusStore },
      mutations: {
        EMPTY_ITEMS(state) {
          state.items.remote = {}
          state.items.local = {}
        }
      },
      actions: {
        undo({ commit }) {
          done.pop()
          commit('EMPTY_ITEMS')
          done.forEach(({ type, payload }) => {
            commit(type, payload, { root: true })
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
        !mutation.type.includes('items/BUSY') &&
        !mutation.type.includes('items/RESORT')
      ) {
        done.push(mutation)
      }
    })

    // Register components
    Object.entries(VueDirectusComponents).forEach(([name, component]) =>
      Vue.component(name, component)
    )
  }
}

export default VueDirectus
