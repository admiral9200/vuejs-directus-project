import VueDragula from 'vue-dragula'
import VueQuillEditor, { Quill } from 'vue-quill-editor'
import ImageResize from 'quill-image-resize-module'
import { ImageDrop } from 'quill-image-drop-module'
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

    if (!VueQuillEditor || !ImageResize || !ImageDrop) {
      throw Error('VueDirectus requires the quill editor and its image resize and drop modules.')
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

    // Mount dragula as global component
    Vue.use(VueDragula)

    // Mount editor as global component
    Vue.use(VueQuillEditor)

    // Require editor styles
    require('./assets/css/lib/quill.core.css')
    require('./assets/css/lib/quill.theme.css')

    // Register editor modules
    Quill.register('modules/imageResize', ImageResize)
    Quill.register('modules/imageDrop', ImageDrop)

    // Setup global helpers
    Vue.mixin({
      methods: {
        setImagePaths: str => {
          let images = str.match(/<img[^>]+>/)
          let storageUrl = client.url.substring(0, client.url.indexOf('api')).replace(/\/$/, '')

          if (!images) {
            return str
          }

          images.forEach(img => {
            if (!img.includes(storageUrl)) {
              str = str.replace(img, img.replace('/storage/', `${storageUrl}/storage/`))
            }
          })

          return str
        }
      }
    })

    // Mount plugin components
    Object.entries(AppComponent).forEach(component => {
      Vue.component(component[1].name, component[1])
    })
  }
}

export default VueDirectus
