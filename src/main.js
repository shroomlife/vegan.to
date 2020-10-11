import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import shareIt from 'vue-share-it'
import vuesocial from '@growthbunker/vuesocial'

import '@/assets/bootstrap/css/bootstrap.min.css'
import '@/assets/social.css'
import '@/assets/custom.css'

Vue.use(vuesocial)
Vue.use(shareIt)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
