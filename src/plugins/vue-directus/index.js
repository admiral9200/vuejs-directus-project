import VueQuillEditor from 'vue-quill-editor'
import * as AppStore from './store'

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
    require('quill/dist/quill.core.css')
    require('quill/dist/quill.bubble.css')

    // Mount editor as global component
    Vue.use(VueQuillEditor)
  }
}

export default VueDirectus
