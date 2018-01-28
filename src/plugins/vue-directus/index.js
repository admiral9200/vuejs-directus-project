import VueQuillEditor from 'vue-quill-editor'

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

    // Require editor styles
    require('quill/dist/quill.core.css')
    require('quill/dist/quill.bubble.css')

    // Mount editor as global component
    Vue.use(VueQuillEditor)
  }
}

export default VueDirectus
