import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { anchorOffset, scrollBehavior as motionPreference } from '@/utils/scroll'
import { applyRouteMeta } from '@/utils/documentMeta'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView,
      meta: {
        title: 'Wie viele Tiere sterben in Deutschland? Live-Zähler | vegan.to',
        description: 'Jede Sekunde sterben in Deutschland rund 164 Tiere für unser Essen. Der Live-Zähler rechnet die amtlichen Schlachtzahlen (Destatis 2025) auf den Moment herunter, Fische geschätzt. Mit Quellen, Fakten und dem, was deine nächste Mahlzeit ändert.',
      },
    },
    {
      path: '/quellen',
      name: 'Sources',
      component: () => import('@/views/SourcesView.vue'),
      meta: {
        title: 'Quellen und Methodik: Woher die Zahlen kommen | vegan.to',
        description: 'Jede Zahl auf vegan.to führt auf eine Quelle zurück: Destatis-Schlachtstatistik 2025, fishcount, Scarborough et al. 2023, Gesetzestexte und Forschung. Plus die Rechnung vom Jahreswert zur Sekunde.',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: {
        title: 'Seite nicht gefunden | vegan.to',
        description: 'Diese Seite gibt es nicht. Der Live-Zähler und die Quellen sind einen Klick entfernt.',
      },
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

router.afterEach(applyRouteMeta)

export default router
