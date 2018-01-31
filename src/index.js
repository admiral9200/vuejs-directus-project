import Vue from 'vue'
import App from '@/App'
import store from '@/store'

import 'reset-css/reset.css'

Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
