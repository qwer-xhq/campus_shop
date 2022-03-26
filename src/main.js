import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/global.css'
import './plugins/element'
import http from './network'
import {formatDate} from 'common/utils'

Vue.config.productionTip = false

Vue.prototype.$http = http
Vue.prototype.$formatDate = formatDate

new Vue({
  router,
  store,
  beforeCreate(){
    Vue.prototype.$bus = this
  },
  render: h => h(App)
}).$mount('#app')
