import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'

import '@/assets/bootstrap.min.css'
import '@/assets/social.css'
import '@/assets/custom.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
