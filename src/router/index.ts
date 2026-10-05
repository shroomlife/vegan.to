import { createRouter, createWebHistory, type RouteRecordSingleView } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { hashPosition, scrollBehavior as motionPreference } from '@/utils/scroll'
import { applyRouteMeta } from '@/utils/documentMeta'
import { topicPages, type TopicName } from '@/data/topics'

/** One lazy view per background page; the record makes a missing view a type error */
const topicViews: Record<TopicName, RouteRecordSingleView['component']> = {
  World: () => import('@/views/topics/WorldView.vue'),
  Livestock: () => import('@/views/topics/LivestockView.vue'),
  SlaughterAge: () => import('@/views/topics/SlaughterAgeView.vue'),
  PerCapita: () => import('@/views/topics/PerCapitaView.vue'),
  SlaughterStats: () => import('@/views/topics/SlaughterStatsView.vue'),
  Chicks: () => import('@/views/topics/ChicksView.vue'),
  Dairy: () => import('@/views/topics/DairyView.vue'),
  Losses: () => import('@/views/topics/LossesView.vue'),
  Transport: () => import('@/views/topics/TransportView.vue'),
  Stunning: () => import('@/views/topics/StunningView.vue'),
  Comparison: () => import('@/views/topics/ComparisonView.vue'),
  Timeline: () => import('@/views/topics/ZeitreiseView.vue'),
}

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
      path: '/tiere',
      name: 'Species',
      component: () => import('@/views/SpeciesIndexView.vue'),
      meta: {
        title: 'Alle Tierarten: Wie viele Tiere in Deutschland sterben | vegan.to',
        description: 'Hühner, Schweine, Rinder, Fische und sechs weitere Arten: Wie viele Tiere in Deutschland pro Jahr, pro Tag und pro Sekunde für unser Essen sterben, mit amtlichen Zahlen und Quellen.',
      },
    },
    {
      // title and description come from the species data, set by the view
      path: '/tiere/:slug',
      name: 'SpeciesDetail',
      component: () => import('@/views/SpeciesView.vue'),
    },
    ...topicPages.map((topic) => ({
      path: topic.path,
      name: topic.name,
      component: topicViews[topic.name],
      meta: { title: topic.title, description: topic.description },
    })),
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
      path: '/impressum',
      name: 'Imprint',
      component: () => import('@/views/ImprintView.vue'),
      meta: {
        title: 'Impressum | vegan.to',
        description: 'Impressum von vegan.to: wer hinter dem Live-Zähler steht und wie du Kontakt aufnimmst.',
      },
    },
    {
      path: '/datenschutz',
      name: 'Privacy',
      component: () => import('@/views/PrivacyView.vue'),
      meta: {
        title: 'Datenschutzerklärung | vegan.to',
        description: 'Was beim Besuch von vegan.to mit deinen Daten passiert: Hosting bei GitHub Pages, lokale Speicherung und Google Analytics nur mit Einwilligung.',
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
  scrollBehavior(to, from, savedPosition) {
    // Back and forward restore where the visitor was
    if (savedPosition) return savedPosition
    // Only a jump within the same page glides; a new page opens where it starts, without
    // scrolling the visitor through everything in between while the reveals fire one after another
    const behavior: ScrollBehavior = to.path === from.path ? motionPreference() : 'auto'
    if (to.hash) {
      const top = hashPosition(to.hash)
      return top === undefined ? { el: to.hash, behavior } : { top, behavior }
    }
    return { top: 0, behavior }
  },
})

router.afterEach(applyRouteMeta)

export default router
