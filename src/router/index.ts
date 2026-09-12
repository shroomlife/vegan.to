import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { anchorOffset, scrollBehavior as motionPreference } from '@/utils/scroll'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: { title: 'Tiermorde in Deutschland: Echtzeit-Zähler | vegan.to' },
    },
    {
      path: '/quellen',
      name: 'Sources',
      component: () => import('@/views/SourcesView.vue'),
      meta: { title: 'Quellen und Methodik | vegan.to' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Seite nicht gefunden | vegan.to' },
    },
  ],
  scrollBehavior(to, _from, savedPosition) {
    // Back and forward restore where the visitor was
    if (savedPosition) return savedPosition
    const behavior = motionPreference()
    if (to.hash) return { el: to.hash, top: anchorOffset(), behavior }
    return { top: 0, behavior }
  },
})

router.afterEach((to) => {
  if (to.meta.title) document.title = to.meta.title
})

export default router
