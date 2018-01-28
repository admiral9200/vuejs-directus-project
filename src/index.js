import Vue from 'vue'
import { RemoteInstance } from 'directus-sdk-javascript'
import App from '@/App'
import VueDirectus from '@/plugins/vue-directus'
import store from '@/store'
import 'reset-css/reset.css'

Vue.config.productionTip = false

const client = new RemoteInstance({
  url: 'http://192.168.33.6/api/1.1/',
  accessToken: 'xMV8l9zJORKBnkllHB6A0XIUPMy8CAt5'
})

Vue.use(VueDirectus, { store, client })

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
