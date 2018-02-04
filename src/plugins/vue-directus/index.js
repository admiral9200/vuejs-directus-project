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
      modules: { ...VueDirectusStore }
    })

    // Register components
    Object.entries(VueDirectusComponents).forEach(([name, component]) =>
      Vue.component(name, component)
    )
  }
}

export default VueDirectus
