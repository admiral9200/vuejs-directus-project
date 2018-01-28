import Vue from 'vue'
import App from '@/App'
import VueDirectus from '@/plugins/vue-directus'
import store from '@/store'
import client from '@/api'

Vue.config.productionTip = false

Vue.use(VueDirectus, { store, client })

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
