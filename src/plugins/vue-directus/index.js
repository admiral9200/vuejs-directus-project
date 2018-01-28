import VueQuillEditor from 'vue-quill-editor'
import * as AppStore from './store'
import * as AppComponent from './components'

const VueDirectus = {
  install(Vue, { store, client }) {
    if (!store) {
      throw Error('VueDirectus requires the vuex store.')
    }

    if (!client) {
      throw Error('VueDirectus requires the directus javascript sdk.')
    }

    if (!VueQuillEditor) {
      throw Error('VueDirectus requires the quill editor.')
    }

    // Register store module
    store.registerModule('VueDirectus', {
      namespaced: true,
      modules: {
        items: AppStore.items,
        users: AppStore.users,
        settings: AppStore.settings
      }
    })

    // Require editor styles
    require('./assets/css/lib/quill.core.css')
    require('./assets/css/lib/quill.theme.css')

    // Mount editor as global component
    Vue.use(VueQuillEditor)

    // Mount plugin components
    Object.entries(AppComponent).forEach(component => {
      Vue.component(component[1].name, component[1])
    })
  }
}

export default VueDirectus
