import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import VueDirectus from '@/plugins/vue-directus'
import 'reset-css/reset.css'

Vue.config.productionTip = false

Vue.use(VueDirectus, { store })

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
