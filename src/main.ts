import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/assets/bootstrap.min.css'
import '@/assets/social.css'
import '@/assets/custom.css'

createApp(App).use(router).mount('#app')
