import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import VueNumeric from 'vue-numeric'

import '@/assets/bootstrap/css/bootstrap.min.css'
import '@/assets/custom.css'
Vue.use(VueNumeric)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
