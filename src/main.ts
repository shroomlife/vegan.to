import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { applyStoredConsent } from '@/composables/useConsent'
import { reveal } from '@/directives/reveal'
import { markFirstRouteShown } from '@/utils/prerendered'

import '@/assets/base.css'
import '@/assets/social.css'
import '@/assets/custom.css'

/*
 * Every route ships as prerendered HTML (scripts/prerender.ts), snapshotted
 * from a client render. That markup has no SSR fragment anchors, so Vue can
 * not hydrate it; createApp replaces it once the bundle has loaded.
 * Fonts are self-hosted (base.css), so no visitor request reaches Google.
 */
const app = createApp(App).use(router).directive('reveal', reveal)
// Mount once the lazy route chunk is in; an empty <RouterView> would pull the footer into view for a moment
router.isReady().then(() => {
  app.mount('#app')
  markFirstRouteShown()
})
applyStoredConsent()
