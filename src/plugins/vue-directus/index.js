const VueDirectus = {
  install(Vue, { store, client }) {
    if (!store) {
      throw Error('VueDirectus requires the vuex store.')
    }

    if (!client) {
      throw Error('VueDirectus requires the directus javascript sdk.')
    }
  }
}

export default VueDirectus
