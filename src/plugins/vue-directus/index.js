import VueDirectusApi from './api'
import * as VueDirectusStore from './store'

const VueDirectus = {
  install(Vue, { store }) {
    if (!store) {
      throw Error('VueDirectus requires the vuex store.')
    }

    if (!VueDirectusApi) {
      throw Error('VueDirectus requires the directus-sdk client.')
    }

    // Register new store module
    store.registerModule('VueDirectus', {
      namespaced: true,
      modules: {
        settings: VueDirectusStore.settings,
        users: VueDirectusStore.users,
        items: VueDirectusStore.items
      }
    })
  }
}

export default VueDirectus
