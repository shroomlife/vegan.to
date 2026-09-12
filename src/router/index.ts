import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

/** Sticky header height plus a little air, so anchors are not hidden behind it */
const ANCHOR_OFFSET = 84

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
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, top: ANCHOR_OFFSET, behavior: 'smooth' }
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const title = to.meta.title
  if (typeof title === 'string') document.title = title
})

export default router
