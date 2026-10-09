<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef, watch, type ComponentPublicInstance } from 'vue'
import { useJsonLd } from '@/composables/useJsonLd'
import { span, useSceneProgress, type SceneMode } from '@/composables/useSceneProgress'
import { topicByName } from '@/data/topics'
import {
  cageStations,
  earlyStations,
  foundationStations,
  legalToday,
  todayStations,
  turnStations,
  worldSeries,
  type Station,
} from '@/data/topics/timeline'
import { thirdCountryExports } from '@/data/topics/transport'
import { meatConsumption } from '@/data/topics/perCapita'
import { pigStock } from '@/data/topics/livestock'
import { hensBySystem } from '@/data/topics/chicks'
import { formatNumber } from '@/utils/formatNumber'
import { SITE_URL } from '@/utils/documentMeta'
import SourceLinks from '@/components/SourceLinks.vue'
import SceneImage from '@/components/SceneImage.vue'
import AnchorLink from '@/components/AnchorLink.vue'
import SceneVideo from '@/components/SceneVideo.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'

const topic = topicByName('Timeline')
const { register, progress, page, reducedMotion } = useSceneProgress()
const still = computed(() => reducedMotion.value === 'reduce')

/** Template ref callback that hands the element to the scene tracker, see SceneMode for how its progress is read */
function track(id: string, mode: SceneMode = 'scene') {
  return (el: Element | ComponentPublicInstance | null) => register(id, el instanceof HTMLElement ? el : null, mode)
}
const p = (id: string) => progress[id] ?? 0

/* ── Weltweit: Zahl und Kurve ─────────────────────────────── */
/** Every world figure on this page shows two decimals, so 8,36 and 87,90 read as one series */
const billionsFormat = new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const billions = (value: number) => billionsFormat.format(value)
const first = worldSeries[0] ?? { year: 1961, billions: 8.36 }
const last = worldSeries[worldSeries.length - 1] ?? { year: 2024, billions: 87.9 }
const factor = last.billions / first.billions

/** Linear interpolation along the FAO series for a position 0..1 between 1961 and 2024 */
function worldAt(t: number): { year: number; billions: number } {
  const year = first.year + t * (last.year - first.year)
  for (let i = 0; i < worldSeries.length - 1; i++) {
    const a = worldSeries[i]
    const b = worldSeries[i + 1]
    if (a && b && year <= b.year) {
      return { year, billions: a.billions + (b.billions - a.billions) * ((year - a.year) / (b.year - a.year)) }
    }
  }
  return last
}
const prolog = computed(() => worldAt(p('prolog')))
const curve = computed(() => worldAt(span(p('curve'), 0, 0.85)))

const CHART = { w: 1200, h: 470, base: 420, top: 40, max: 90 }
const chartX = (year: number) => ((year - first.year) / (last.year - first.year)) * CHART.w
const chartY = (value: number) => CHART.base - (value / CHART.max) * (CHART.base - CHART.top)
const curvePath = worldSeries.map((pt, i) => `${i === 0 ? 'M' : 'L'}${chartX(pt.year).toFixed(1)} ${chartY(pt.billions).toFixed(1)}`).join(' ')
const curveArea = `${curvePath} L${CHART.w} ${CHART.base} L0 ${CHART.base} Z`
const curveLine = useTemplateRef<SVGPathElement>('curveLine')
const curveLength = ref(1600)
onMounted(() => {
  curveLength.value = curveLine.value?.getTotalLength() ?? 1600
})
const curveDot = computed(() => {
  const k = span(p('curve'), 0, 0.85)
  const el = curveLine.value
  if (!el) return { x: 0, y: chartY(first.billions) }
  const pt = el.getPointAtLength(curveLength.value * k)
  return { x: pt.x, y: pt.y }
})

/* ── Lichtfeld: ein Punkt je hundert Millionen Tiere ───────── */
const fieldCanvas = useTemplateRef<HTMLCanvasElement>('field')
const DOTS = 879
const dots = Array.from({ length: DOTS }, () => ({ x: Math.random(), y: Math.random(), r: 0.5 + Math.random() * 1.5, v: 0.15 + Math.random() * 0.6 }))
let fieldFrame = 0
let fieldTick = 0
function drawField() {
  const canvas = fieldCanvas.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return
  const ratio = window.devicePixelRatio || 1
  const w = canvas.clientWidth
  const h = canvas.clientHeight
  if (canvas.width !== Math.round(w * ratio)) {
    canvas.width = Math.round(w * ratio)
    canvas.height = Math.round(h * ratio)
  }
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
  ctx.clearRect(0, 0, w, h)
  const visible = Math.round((prolog.value.billions / last.billions) * DOTS)
  // Two fills per frame instead of one per dot: every ninth dot is an ember, the rest are blood red
  for (const [stride, fillStyle] of [[0, 'rgba(255, 106, 61, 0.9)'], [1, 'rgba(231, 76, 60, 0.6)']] as const) {
    ctx.fillStyle = fillStyle
    ctx.beginPath()
    for (let i = 0; i < visible; i++) {
      const d = dots[i]
      if (!d || (i % 9 === 0) !== (stride === 0)) continue
      const x = d.x * w
      const y = (d.y * h + (still.value ? 0 : fieldTick * d.v * 0.2)) % h
      ctx.moveTo(x + d.r, y)
      ctx.arc(x, y, d.r, 0, Math.PI * 2)
    }
    ctx.fill()
  }
  fieldTick++
  // The field drifts only while the prolog is on screen; further down nobody sees it
  fieldFrame = !still.value && p('prolog') < 1 ? requestAnimationFrame(drawField) : 0
}
onMounted(() => {
  drawField()
})
onUnmounted(() => cancelAnimationFrame(fieldFrame))
watch(reducedMotion, () => drawField())
watch(
  () => p('prolog') < 1,
  (onScreen) => {
    if (onScreen && fieldFrame === 0) drawField()
  },
)

/* ── Akt I: eine Station nach der anderen ────────────────── */
/** With reduced motion the scenes are not pinned (see the styles), so every slide simply stays in the flow */
const earlyPinned = computed(() => !still.value)
/** The intro counts as the first slide */
const EARLY_SLIDES = earlyStations.length + 1
/** Where the scroll stands, in slides: 0.5 is the middle of the first, EARLY_SLIDES - 0.5 the middle of the last */
const earlySlot = computed(() => 0.5 + p('early') * (EARLY_SLIDES - 1))
const earlyActive = computed(() => Math.min(EARLY_SLIDES - 1, Math.max(0, Math.round(earlySlot.value - 0.5))))
/**
 * One slide fades and lifts with its distance to the scroll position. It holds for
 * the middle 60 % of its slot and is gone at the slot's edge: the leaving slide
 * rises out while the next one is still invisible, so two texts never overlap.
 */
function earlySlide(index: number): Record<string, string> | undefined {
  if (!earlyPinned.value) return undefined
  const distance = earlySlot.value - (index + 0.5)
  const away = Math.max(0, Math.abs(distance) - 0.3) / 0.2
  const visible = Math.max(0, 1 - away)
  return {
    opacity: visible.toFixed(3),
    transform: `translate3d(0, ${(-distance * 120).toFixed(1)}px, 0)`,
  }
}

/* ── Zitate Wort für Wort ─────────────────────────────────── */
// A non-breaking space keeps "zur" with its noun, so no line ends on that one short word
const QUOTE_1971 = '„Die Entwicklung zur\u00a0Massentierhaltung ist im letzten Jahrzehnt weltweit erfolgt; sie muß als ökonomisch gegeben angesehen werden.“'
const QUOTE_2009 = '„… dass solch eine Empfehlung derzeit in der EU aus wirtschaftlicher Sicht nicht tragbar ist.“'
const words1971 = QUOTE_1971.split(' ')
const words2009 = QUOTE_2009.split(' ')
const lit = (id: string, total: number) => Math.round(span(p(id), 0.05, 0.8) * total)

/* ── Käfig, Uhr, Countdown ───────────────────────────────── */
const A4_WIDTH_CM = 21
const A4_CM2 = A4_WIDTH_CM * 29.7
const CAGE_CM2 = 450
/** The cage drawn across the full width of the sheet: 450 cm² are 21 × 21,4 cm, 72 % of an A4 */
const cageShare = CAGE_CM2 / A4_CM2
const cageHeightCm = CAGE_CM2 / A4_WIDTH_CM
const CLOCK_LENGTH = 804.2
const clockHours = computed(() => Math.round(span(p('transport'), 0.05, 0.9) * 24))
/** BZL figure for the years before the ban; the ministry says about 40 million, see /kueken-und-legehennen */
const CHICKS_BEFORE_BAN = 45_000_000
const countdown = computed(() => (still.value ? CHICKS_BEFORE_BAN : Math.round(CHICKS_BEFORE_BAN * (1 - span(p('countdown'), 0.05, 0.85)))))

/* ── Deutschland heute: Exporte ──────────────────────────── */
const exportsMax = Math.max(...thirdCountryExports.map((entry) => entry.cattle))
const exportsFirst = thirdCountryExports[0]
const exportsLast = thirdCountryExports[thirdCountryExports.length - 1]
/** 2025 was a year with foot-and-mouth disease, so the drop is measured to the year before */
const exportsBefore = thirdCountryExports[thirdCountryExports.length - 2]
const exportsDrop = exportsFirst && exportsBefore ? ((exportsFirst.cattle - exportsBefore.cattle) / exportsFirst.cattle) * 100 : 0

const meatPeak = meatConsumption.reduce((max, entry) => (entry.total > max.total ? entry : max))
const meatLatest = meatConsumption[meatConsumption.length - 1] ?? meatPeak
const meatDrop = ((meatPeak.total - meatLatest.total) / meatPeak.total) * 100
const organicHens = hensBySystem.find((entry) => entry.system === 'Ökologische Erzeugung')

/* ── Kapitel und Jahresanzeige ───────────────────────────── */
const acts = [
  { id: 'prolog', label: 'Prolog', year: `${first.year}` },
  { id: 'akt-1', label: 'Die Anfänge', year: '1867' },
  { id: 'akt-2', label: 'Die Fabrik', year: '1971' },
  { id: 'akt-3', label: 'Der Käfig', year: '1987' },
  { id: 'akt-4', label: 'Unterwegs', year: '2005' },
  { id: 'akt-5', label: 'Die Betäubung', year: '2009' },
  { id: 'akt-6', label: 'Die Wende', year: '2013' },
  { id: 'akt-7', label: 'Heute legal', year: 'heute' },
  { id: 'akt-8', label: 'Die Kurve', year: '2024' },
  { id: 'akt-9', label: 'Lichtblicke', year: '2026' },
] as const
const activeAct = ref<string>('prolog')
const journey = useTemplateRef<HTMLElement>('journey')
/** The fixed progress bar, year badge and chapter dots belong to the journey; they leave with it, before the footer */
const chromeVisible = ref(true)
/** The act whose section has passed the middle of the viewport; measured together with the scenes */
function measureAct() {
  const middle = window.innerHeight / 2
  let current: string = acts[0].id
  for (const act of acts) {
    const el = document.getElementById(act.id)
    if (el && el.getBoundingClientRect().top <= middle) current = act.id
  }
  activeAct.value = current
  const bottom = journey.value?.getBoundingClientRect().bottom
  chromeVisible.value = bottom === undefined || bottom > window.innerHeight * 0.75
}
onMounted(measureAct)
watch(page, measureAct)
const badge = computed(() => {
  if (activeAct.value === 'prolog') return String(Math.round(prolog.value.year))
  if (activeAct.value === 'akt-8') return String(Math.round(curve.value.year))
  return acts.find((act) => act.id === activeAct.value)?.year ?? ''
})

const kindLabel: Record<Station['kind'], string> = { harm: 'Erlaubt', good: 'Tierschutz', number: 'Zahl', culture: 'Aufbruch', law: 'Gesetz', promise: 'Versprochen' }

/* ── Lichtblicke, Antworten, Strukturdaten ───────────────── */
const brightSpots = [
  {
    label: `${meatPeak.year} bis ${meatLatest.year}`,
    title: 'Weniger Fleisch als 2011',
    text: `${meatPeak.year} lag der Fleischverzehr bei ${formatNumber(meatPeak.total, 1)} Kilogramm pro Kopf, ${meatLatest.year} bei ${formatNumber(meatLatest.total, 1)} Kilogramm, das sind ${formatNumber(meatDrop, 1)} Prozent weniger.`,
    sources: ['bleMeatBalance'] as const,
    picture: { name: 'veggie-bowl', alt: 'Eine Schüssel mit Kichererbsen, Avocado, Reis, Paprika und Nüssen' },
  },
  {
    label: `${exportsFirst?.year} bis ${exportsBefore?.year}`,
    title: 'Fast keine Rinder mehr in Länder außerhalb der EU',
    text: `${exportsFirst?.year}: ${formatNumber(exportsFirst?.cattle ?? 0)} lebende Rinder. ${exportsBefore?.year}: ${formatNumber(exportsBefore?.cattle ?? 0)}, ein Rückgang um ${formatNumber(exportsDrop, 1)} Prozent. ${exportsLast?.year}, im Jahr der Maul- und Klauenseuche, waren es ${formatNumber(exportsLast?.cattle ?? 0)}.`,
    sources: ['btDrs21_7484'] as const,
    picture: { name: 'pasture-golden', alt: 'Kühe auf einer Weide im Morgenlicht' },
  },
  {
    label: '2010 bis 2026',
    title: 'Ein Fünftel weniger Schweine',
    text: `Im Mai 2010 standen ${formatNumber(pigStock.may2010)} Schweine in deutschen Ställen, im Mai 2026 waren es ${formatNumber(pigStock.may2026)}.`,
    sources: ['destatisPigStock'] as const,
    picture: { name: 'pig-safe', alt: 'Ein Schwein liegt entspannt in der Sonne' },
  },
  {
    label: '2015 bis 2025',
    title: 'Fast doppelt so viele Hennen in Bio-Haltung',
    text: `2015 lebten ${formatNumber(organicHens?.hens2015 ?? 0)} Legehennen in ökologischer Erzeugung, 2025 waren es ${formatNumber(organicHens?.hens2025 ?? 0)}.`,
    sources: ['destatisLayingHens'] as const,
    picture: { name: 'hens-free', alt: 'Hühner laufen frei über eine Wiese im Morgenlicht' },
  },
  {
    label: 'seit 2022',
    title: 'Kükentöten verboten',
    text: 'Seit dem 1. Januar 2022 dürfen in Deutschland keine Küken mehr getötet werden, nur weil sie männlich sind. Vorher waren es etwa 40 bis 45 Millionen im Jahr.',
    sources: ['tierSchG4c', 'bregChicksBan', 'bzlChicks'] as const,
    picture: { name: 'hands-chick', alt: 'Zwei Hände halten ein gelbes Küken im Abendlicht' },
  },
  {
    label: 'seit 2021',
    title: 'Ferkel nur noch mit Betäubung',
    text: 'Seit dem 1. Januar 2021 ist die Kastration von Ferkeln ohne Betäubung verboten.',
    sources: ['bregCastration', 'tierSchG21'] as const,
    picture: { name: 'piglets-straw-video', alt: 'Ferkel drängen sich auf Stroh' },
  },
]

const answers = [
  {
    question: 'Seit wann gibt es Massentierhaltung in Deutschland?',
    answer: 'Die Bundesregierung selbst schrieb 1971 in der Begründung zum Tierschutzgesetz, die Entwicklung zur Massentierhaltung sei „im letzten Jahrzehnt weltweit erfolgt“, also in den 1960er Jahren. In Westdeutschland stieg der Fleischverbrauch schon in den 1950er Jahren stark an.',
  },
  {
    question: 'Wie viele Tiere werden heute im Vergleich zu früher geschlachtet?',
    answer: `${billions(last.billions)} Milliarden Landtiere weltweit im Jahr ${last.year}, laut FAO. ${first.year} waren es ${billions(first.billions)} Milliarden. Das ist das ${formatNumber(factor, 1)}-Fache.`,
  },
  {
    question: 'Seit wann ist Tierschutz im Grundgesetz?',
    answer: 'Seit 2002. Der Bundestag stimmte am 17. Mai 2002 mit 543 Ja-Stimmen dafür, den Tierschutz in Artikel 20a aufzunehmen.',
  },
  {
    question: 'Was hat sich für Tiere zuletzt verbessert?',
    answer: `Seit 2021 dürfen Ferkel nur noch mit Betäubung kastriert werden, seit 2022 ist das Töten männlicher Küken verboten, Käfige für Legehennen laufen aus, und ab 2027 muss Schweinefleisch aus Deutschland die Haltungsform tragen. Die Exporte lebender Rinder in Länder außerhalb der EU sind von 2017 bis 2024 um ${formatNumber(exportsDrop)} Prozent gesunken.`,
  },
]

useJsonLd('page-breadcrumb', {
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'vegan.to', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: topic.label, item: `${SITE_URL}${topic.path}` },
  ],
})
</script>

<template>
  <main ref="journey" class="journey">
    <div v-show="chromeVisible" class="journey-progress" aria-hidden="true"><span :style="{ width: `${(page * 100).toFixed(2)}%` }"></span></div>
    <div v-show="chromeVisible" class="journey-badge" aria-hidden="true">{{ badge }}</div>
    <nav v-show="chromeVisible" class="journey-acts" aria-label="Kapitel">
      <AnchorLink v-for="act in acts" :key="act.id" :hash="`#${act.id}`" :class="{ 'is-active': activeAct === act.id }" :aria-current="activeAct === act.id ? 'true' : undefined">
        <span class="journey-acts-dot"></span>
        <span class="journey-acts-label">{{ act.label }}</span>
      </AnchorLink>
    </nav>

    <!-- Prolog: das Lichtfeld -->
    <section id="prolog" :ref="track('prolog')" class="track" style="--track: 380vh" aria-labelledby="journey-title">
      <div class="stage stage--center">
        <canvas ref="field" class="field" aria-hidden="true"></canvas>
        <div class="prolog">
          <p class="kicker">Zeitreise · Wie wir mit Tieren umgehen</p>
          <p class="prolog-year" aria-hidden="true">{{ Math.round(prolog.year) }}</p>
          <p class="prolog-number"><span class="visually-hidden">Weltweit geschlachtete Landtiere im Jahr {{ Math.round(prolog.year) }}: </span><span class="prolog-value">{{ billions(prolog.billions) }}&nbsp;Mrd.</span></p>
          <h1 id="journey-title" class="prolog-lede">Von {{ billions(first.billions) }} auf {{ billions(last.billions) }}&nbsp;Milliarden Tiere im Jahr.</h1>
          <p class="prolog-text">
            So viele Landtiere wurden weltweit {{ first.year }} und {{ last.year }} geschlachtet, laut FAO.<template v-if="!still"> Scroll, und die Zahl läuft durch 63 Jahre.</template>
          </p>
          <SourceLinks :ids="['faoQcl']" />
          <p v-if="!still" class="prolog-hint" aria-hidden="true">Scrollen</p>
        </div>
      </div>
    </section>

    <!-- Akt I: eine Station nach der anderen, die Jahre als Schiene darunter -->
    <section id="akt-1" :ref="track('early')" class="track" style="--track: 520vh" aria-label="Akt I: Die Anfänge">
      <div class="stage stage--left">
        <div class="early" :class="{ 'early--pinned': earlyPinned }">
          <div class="early-slides">
            <div class="early-slide early-slide--intro" data-ap :style="earlySlide(0)" :inert="earlyPinned && earlyActive !== 0">
              <p class="kicker">Akt I · Die Anfänge</p>
              <h2 class="display">Lange vor der Fabrik.</h2>
              <p class="lede">Als Tiere noch auf Höfen lebten, gab es schon Menschen, die ohne sie aßen. Und ein erstes Gesetz.</p>
            </div>
            <article
              v-for="(station, index) in earlyStations"
              :key="station.title"
              class="early-slide"
              :class="[`early-slide--${station.kind}`, { 'early-slide--pictured': station.picture }]"
              data-ap
              :style="earlySlide(index + 1)"
              :inert="earlyPinned && earlyActive !== index + 1"
            >
              <div class="early-copy">
                <p class="early-year">{{ station.year }}</p>
                <span class="tag">{{ kindLabel[station.kind] }}</span>
                <h3>{{ station.title }}</h3>
                <p>{{ station.text }}</p>
                <SourceLinks :ids="station.sources" />
              </div>
              <figure v-if="station.picture" class="early-picture">
                <SceneImage :name="station.picture.name" :alt="station.picture.alt" sizes="(max-width: 759px) 100vw, 40vw" />
              </figure>
            </article>
          </div>
          <ol v-if="earlyPinned" class="early-rail" aria-hidden="true">
            <li
              v-for="(station, index) in earlyStations"
              :key="station.year"
              class="early-rail-item"
              :class="{ 'is-active': earlyActive === index + 1, 'is-past': earlyActive > index + 1 }"
            >
              <span class="early-rail-year">{{ station.year }}</span>
              <span class="early-rail-title">{{ station.title }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Akt II: 1971, das Zitat -->
    <section id="akt-2" :ref="track('quote71')" class="track" style="--track: 280vh" aria-label="Akt II: Die Fabrik">
      <div class="stage stage--left" :style="{ '--p': p('quote71') }">
        <figure class="backdrop backdrop--zoom">
          <SceneVideo name="broilers" poster="broilers-video" label="Tausende junge Masthühner dicht an dicht in einem Stall" />
        </figure>
        <div class="stage-copy">
          <h2 class="kicker">Akt II · 1971 · Die Regierung schreibt es selbst</h2>
          <blockquote class="quote">
            <span v-for="(word, index) in words1971" :key="index" class="quote-word" :class="{ 'is-lit': index < lit('quote71', words1971.length) }">{{ word }}</span>
          </blockquote>
          <p class="who">Aus der Begründung des Regierungsentwurfs für das Tierschutzgesetz vom 7. September 1971. Dort ist auch von „Intensivtierhaltung mit tausenden von Nutztieren“ die Rede.</p>
          <SourceLinks :ids="['btDrsVI2559']" />
        </div>
      </div>
    </section>

    <section class="flow flow--band" aria-label="1972 bis 1980">
      <figure :ref="track('foundation', 'pass')" class="band band--eye" :style="{ '--p': p('foundation') }" aria-hidden="true">
        <SceneImage name="cow-eye" alt="" />
      </figure>
      <div class="flow-inner">
        <h2 class="kicker">Die Antwort des Gesetzgebers</h2>
        <article v-for="station in foundationStations" :key="station.title" v-reveal="{ y: 36, duration: 0.6 }" class="station" :class="`station--${station.kind}`">
          <p class="station-year">{{ station.year }}</p>
          <div>
            <span class="tag">{{ kindLabel[station.kind] }}</span>
            <h3>{{ station.title }}</h3>
            <p>{{ station.text }}</p>
            <SourceLinks :ids="station.sources" />
          </div>
        </article>
      </div>
    </section>

    <!-- Akt III: der Käfig -->
    <section id="akt-3" :ref="track('cage')" class="track" style="--track: 320vh" aria-label="Akt III: Der Käfig">
      <div class="stage" :style="{ '--p': p('cage') }">
        <figure class="backdrop backdrop--open">
          <SceneImage name="hen-cage" alt="Hennen hinter dem Drahtgitter eines Käfigs" />
        </figure>
        <div class="cage">
          <div class="cage-art" aria-hidden="true">
            <span class="cage-a3-label">DIN A3 · 42 × 29,7 cm · zwei A4</span>
            <div class="cage-a4 cage-a4--blank"><span>DIN A4 · {{ formatNumber(A4_CM2) }}&nbsp;cm²</span></div>
            <div class="cage-a4">
              <span>DIN A4 · {{ formatNumber(A4_CM2) }}&nbsp;cm²</span>
              <div class="cage-hen" :style="{ '--share': cageShare }">
                <span class="cage-hen-size">{{ A4_WIDTH_CM }} × {{ formatNumber(cageHeightCm, 1) }} cm</span>
                <span>{{ CAGE_CM2 }}&nbsp;cm² · eine Henne</span>
              </div>
            </div>
          </div>
          <div class="cage-copy">
            <h2 class="kicker">Akt III · 1987 · Der Käfig</h2>
            <p class="display display--blood">450 cm².</p>
            <p class="lede">So viel Platz erlaubte die Hennenhaltungsverordnung von 1987 einer Legehenne bis zwei Kilogramm im Käfig. Weniger als ein DIN-A4-Blatt. Das Bundesverfassungsgericht beschrieb später, was darin nicht geht: aufbaumen, sandbaden, scharren, ein Ei im Nest legen.</p>
            <SourceLinks :ids="['bverfg1999']" />
          </div>
        </div>
      </div>
    </section>

    <section :ref="track('cageStations')" class="flow flow--split" aria-label="1999 bis 2012">
      <div class="flow-inner flow-inner--split">
        <figure class="side" :style="{ '--p': p('cageStations') }">
          <SceneVideo name="hens-cages" poster="hens-cages-video" label="Weiße Hennen in den Käfigreihen eines Legebetriebs" />
        </figure>
        <div class="stations">
          <h2 class="kicker">Vom Käfig vor Gericht</h2>
          <article v-for="station in cageStations" :key="station.title" v-reveal="{ y: 36, duration: 0.6 }" class="station" :class="`station--${station.kind}`">
            <p class="station-year">{{ station.year }}</p>
            <div>
              <span class="tag">{{ kindLabel[station.kind] }}</span>
              <h3>{{ station.title }}</h3>
              <p>{{ station.text }}</p>
              <SourceLinks :ids="station.sources" />
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Akt IV: unterwegs -->
    <section id="akt-4" :ref="track('transport')" class="track" style="--track: 280vh" aria-label="Akt IV: Unterwegs">
      <div class="stage" :style="{ '--p': p('transport') }">
        <figure class="backdrop backdrop--drive">
          <SceneImage name="cattle-truck" alt="Ein Tiertransporter auf der Straße" />
        </figure>
        <div class="clock">
          <svg class="clock-ring" viewBox="0 0 300 300" aria-hidden="true">
            <circle cx="150" cy="150" r="128" class="clock-track" />
            <circle cx="150" cy="150" r="128" class="clock-arc" :style="{ strokeDasharray: CLOCK_LENGTH, strokeDashoffset: CLOCK_LENGTH * (1 - span(p('transport'), 0.05, 0.9)) }" transform="rotate(-90 150 150)" />
          </svg>
          <div class="clock-copy">
            <h2 class="kicker">Akt IV · 2005 · Unterwegs</h2>
            <p class="clock-hours">{{ clockHours }} Std.</p>
            <p class="lede">So lange dürfen Schweine in zugelassenen Fahrzeugen am Stück transportiert werden, Rinder zweimal 14 Stunden mit einer Stunde Pause. So steht es in der EU-Transportverordnung von 2005, die seit 2007 gilt. Die Grundregel ohne solche Fahrzeuge: acht Stunden.</p>
            <SourceLinks :ids="['euTransport']" />
          </div>
        </div>
      </div>
    </section>

    <!-- Akt V: 2009, CO2 -->
    <section id="akt-5" :ref="track('co2')" class="track" style="--track: 260vh" aria-label="Akt V: Die Betäubung">
      <div class="stage stage--left" :style="{ '--p': p('co2') }">
        <figure class="backdrop backdrop--fade">
          <SceneImage name="pig-eye" alt="Das Auge eines Schweins hinter einem Gatter" />
        </figure>
        <div class="stage-copy">
          <h2 class="kicker">Akt V · 2009 · Die EU entscheidet über die Betäubung</h2>
          <p class="who who--before">Die EFSA hatte empfohlen, die CO2-Betäubung von Schweinen schrittweise einzustellen. Die EU-Schlachtverordnung von 2009 antwortet:</p>
          <blockquote class="quote quote--small">
            <span v-for="(word, index) in words2009" :key="index" class="quote-word" :class="{ 'is-lit': index < lit('co2', words2009.length) }">{{ word }}</span>
          </blockquote>
          <p class="who">Die EFSA stuft hoch konzentriertes CO2 seit 2020 als stark belastend ein: Es verursacht Schmerzen, Angst und Atemnot. Geändert hat sich die Verordnung bis heute nicht.</p>
          <SourceLinks :ids="['vo1099_2009', 'efsaPigs2020']" />
        </div>
      </div>
    </section>

    <!-- Akt VI: die Wende -->
    <section id="akt-6" :ref="track('turn')" class="flow flow--split" aria-label="Akt VI: Die Wende">
      <div class="flow-inner flow-inner--split">
        <figure class="side" :style="{ '--p': p('turn') }">
          <SceneVideo name="pigs-cozy" poster="pigs-cozy-video" label="Schweine in einem Stall mit Stroh schauen in die Kamera" />
        </figure>
        <div class="stations">
          <h2 class="kicker kicker--hope">Akt VI · Was sich verändert hat</h2>
          <article v-for="station in turnStations" :key="station.title" v-reveal="{ y: 36, duration: 0.6 }" class="station" :class="`station--${station.kind}`">
            <p class="station-year">{{ station.year }}</p>
            <div>
              <span class="tag">{{ kindLabel[station.kind] }}</span>
              <h3>{{ station.title }}</h3>
              <p>{{ station.text }}</p>
              <SourceLinks :ids="station.sources" />
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- 2022: Countdown -->
    <section :ref="track('countdown')" class="track" style="--track: 280vh" aria-label="2022: Das Kükentöten endet">
      <div class="stage stage--center" :style="{ '--p': p('countdown') }">
        <figure class="backdrop backdrop--brighten">
          <SceneVideo name="chicks-box" poster="chicks-box-video" label="Eine Kiste voller gelber Küken fährt über ein Förderband" />
        </figure>
        <div class="countdown">
          <p class="kicker kicker--hope">2022 · Ein Lichtblick</p>
          <p class="countdown-number" :class="{ 'is-zero': countdown === 0 }" aria-hidden="true">{{ formatNumber(countdown) }}</p>
          <p class="countdown-label" aria-hidden="true">Küken im Jahr, bis das Verbot kam</p>
          <p class="lede lede--center">Etwa 40 bis 45 Millionen männliche Küken wurden in Deutschland jedes Jahr direkt nach dem Schlupf getötet. Seit dem 1. Januar 2022 ist das verboten.</p>
          <SourceLinks :ids="['tierSchG4c', 'bregChicksBan', 'bzlChicks']" />
        </div>
      </div>
    </section>

    <!-- Deutschland heute -->
    <section class="flow" aria-label="Deutschland heute">
      <div class="flow-inner">
        <h2 class="kicker">Deutschland heute</h2>
        <figure :ref="track('today', 'enter')" class="exports" :style="{ '--p': p('today') }">
          <div class="exports-media">
            <SceneVideo name="truck" poster="truck-video" label="Ein Lastwagen mit Rindern bei Sonnenuntergang" />
          </div>
          <figcaption>
            <p class="kicker">Lebende Rinder, exportiert in Länder außerhalb der EU</p>
            <ol class="exports-rows">
              <li v-for="(entry, index) in thirdCountryExports" :key="entry.year" class="exports-row" :style="{ '--w': entry.cattle / exportsMax, '--i': index }">
                <span class="exports-year">{{ entry.year }}</span>
                <span class="exports-bar" aria-hidden="true"><i></i></span>
                <span class="exports-value">{{ formatNumber(entry.cattle) }}</span>
              </li>
            </ol>
            <p class="exports-note">{{ exportsLast?.year }} war ein Jahr mit Maul- und Klauenseuche in Deutschland.</p>
            <SourceLinks :ids="['btDrs21_7484']" />
          </figcaption>
        </figure>

        <article v-for="station in todayStations" :key="station.title" v-reveal="{ y: 36, duration: 0.6 }" class="station" :class="`station--${station.kind}`">
          <p class="station-year">{{ station.year }}</p>
          <div>
            <span class="tag">{{ kindLabel[station.kind] }}</span>
            <h3>{{ station.title }}</h3>
            <p>{{ station.text }}</p>
            <SourceLinks :ids="station.sources" />
          </div>
        </article>
      </div>
    </section>

    <!-- Akt VII: heute legal -->
    <section id="akt-7" :ref="track('legal')" class="flow flow--split flow--band" aria-label="Akt VII: Heute legal">
      <figure :ref="track('legalBand', 'pass')" class="band" :style="{ '--p': p('legalBand') }">
        <SceneVideo name="piglets-straw" poster="piglets-straw-video" label="Ferkel drängen sich auf Stroh" />
      </figure>
      <div class="flow-inner flow-inner--split flow-inner--swap">
        <figure class="side" :style="{ '--p': p('legal') }">
          <SceneImage name="piglets" alt="Junge Schweine in einem Maststall" sizes="(max-width: 759px) 100vw, 40vw" />
        </figure>
        <div class="stations">
          <p class="kicker">Akt VII · Heute, mitten in Deutschland</p>
          <h2 class="display display--blood">Ohne Betäubung erlaubt.</h2>
          <ul class="legal">
            <li v-for="item in legalToday" :key="item.what" v-reveal="{ x: -24, duration: 0.5 }">{{ item.what }}<span>{{ item.who }}</span></li>
          </ul>
          <p class="who">Das Tierschutzgesetz nimmt diese Eingriffe von der Betäubungspflicht aus, erlaubt sind sie nur unter den Bedingungen von § 5 und § 6. Das Kürzen der Schnabelspitzen bei Legehennenküken, die jünger als zehn Tage sind, dürfen Behörden zusätzlich erlauben.</p>
          <SourceLinks :ids="['tierSchG5', 'tierSchG6']" />
        </div>
      </div>
    </section>

    <!-- Akt VIII: die Kurve -->
    <section id="akt-8" :ref="track('curve')" class="track" style="--track: 360vh" aria-label="Akt VIII: Die Kurve">
      <div class="stage stage--center" :style="{ '--p': p('curve') }">
        <div class="curve">
          <h2 class="kicker">Akt VIII · {{ first.year }} bis {{ last.year }} · Die Kurve</h2>
          <p class="display display--small">Und trotz allem: das {{ formatNumber(factor, 1) }}-Fache.</p>
          <p class="curve-intro">Jedes Gesetz, jedes Verbot, jedes Urteil aus dieser Zeitreise. Und die Zahl der Landtiere, die weltweit in einem Jahr geschlachtet werden, steigt trotzdem weiter.</p>
          <div class="curve-head">
            <span class="curve-now">{{ billions(curve.billions) }}&nbsp;Mrd.</span>
            <span class="curve-year">geschlachtete Landtiere im Jahr {{ Math.round(curve.year) }}, weltweit</span>
          </div>
          <svg class="curve-svg" :viewBox="`0 0 ${CHART.w} ${CHART.h}`" role="img" :aria-label="`Weltweit geschlachtete Landtiere, von ${billions(first.billions)} Milliarden ${first.year} auf ${billions(last.billions)} Milliarden ${last.year}`">
            <line x1="0" :y1="CHART.base" :x2="CHART.w" :y2="CHART.base" class="curve-axis" />
            <line x1="0" :y1="CHART.top" :x2="CHART.w" :y2="CHART.top" class="curve-grid" />
            <text x="0" :y="CHART.top - 8" class="curve-label">{{ CHART.max }} Mrd.</text>
            <path :d="curveArea" class="curve-area" />
            <path ref="curveLine" :d="curvePath" class="curve-line" :style="{ strokeDasharray: curveLength, strokeDashoffset: curveLength * (1 - span(p('curve'), 0, 0.85)) }" />
            <circle :cx="curveDot.x" :cy="curveDot.y" r="9" class="curve-dot" />
            <text v-for="pt in worldSeries" :key="pt.year" :x="chartX(pt.year)" :y="CHART.base + 30" class="curve-label" :text-anchor="pt.year === first.year ? 'start' : pt.year === last.year ? 'end' : 'middle'">{{ pt.year }}</text>
          </svg>
          <p class="curve-note">
            FAO, eigene Summe aus 17 Arten in Milliarden: <template v-for="(pt, index) in worldSeries" :key="pt.year">{{ pt.year }} {{ billions(pt.billions) }}<template v-if="index < worldSeries.length - 1"> · </template></template>.
            Das {{ formatNumber(factor, 1) }}-Fache in 63 Jahren.
          </p>
          <SourceLinks :ids="['faoQcl']" />
        </div>
      </div>
    </section>

    <!-- Akt IX: Morgen -->
    <section id="akt-9" :ref="track('dawn')" class="track track--dawn" style="--track: 240vh" aria-label="Akt IX: Lichtblicke">
      <div class="stage stage--center" :style="{ '--p': p('dawn') }">
        <figure class="backdrop backdrop--dawn">
          <SceneVideo name="cows-misty" poster="cows-misty-video" label="Kühe auf einer Weide im Morgennebel, von oben gesehen" />
        </figure>
        <div class="dawn-copy">
          <p class="kicker kicker--hope">Akt IX · Es geht</p>
          <h2 class="display display--light">Jedes Verbot war einmal undenkbar.</h2>
          <p class="lede lede--center lede--light">Käfige, Kükentöten, Kastration ohne Betäubung: Was lange normal war, ist heute verboten. Die Zahlen zeigen, wo es schon besser wird.</p>
        </div>
      </div>
    </section>

    <section class="finale" aria-label="Lichtblicke und Weiterlesen">
      <div class="finale-inner prose">
        <BrightSpots :items="brightSpots" />
        <div class="finale-cta">
          <figure class="finale-figure">
            <SceneImage name="hands-chick" alt="Zwei Hände halten ein gelbes Küken im Abendlicht" sizes="(max-width: 759px) 100vw, 300px" />
          </figure>
          <div>
            <h2>Die Kurve kann wieder fallen.</h2>
            <p>Gesetze ändern sich langsam. Was auf deinem Teller liegt, entscheidest du heute. Unter <RouterLink to="/#impact">Dein Impact</RouterLink> siehst du, was eine Woche, ein Monat oder ein Jahr ohne Tiere auf dem Teller ändert.</p>
            <RouterLink to="/#mitmachen" class="finale-btn">Mach den ersten Schritt</RouterLink>
          </div>
        </div>
        <QuickAnswers :items="answers" />
        <RelatedTopics current="Timeline" />
      </div>
    </section>
  </main>
</template>

<style scoped>
/* ── Grund ─────────────────────────────────────────────────── */
.journey {
  --night: #070f0a;
  --forest: #0e2114;
  --blood: #e74c3c;
  --ember: #ff6a3d;
  --hope: #4fd08a;
  --paper: var(--brand-cream);
  --muted-light: rgba(246, 241, 231, 0.76);
  --faint-light: rgba(246, 241, 231, 0.6);
  background: var(--night);
  color: var(--paper);
  overflow-x: clip;
}
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
.kicker {
  margin: 0 0 14px;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--ember);
  line-height: 1.4;
}
.kicker--hope {
  color: var(--hope);
}
.display {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 7vw, 6.2rem);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--paper);
  text-wrap: balance;
}
.display--blood {
  color: var(--blood);
}
.display--light {
  color: var(--brand-green);
}
.display--small {
  font-size: clamp(1.8rem, 4.2vw, 3.6rem);
}
.curve-intro {
  margin: 14px 0 26px;
  max-width: 60ch;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.6;
  color: var(--muted-light);
}
.lede {
  margin: 18px 0 0;
  max-width: 40ch;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  line-height: 1.55;
  color: var(--muted-light);
}
.lede--center {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
.lede--light {
  color: #2f4a37;
}
.who {
  margin: 26px 0 12px;
  max-width: 54ch;
  color: var(--muted-light);
  line-height: 1.65;
}
.who--before {
  margin: 0 0 18px;
}
.journey :deep(.source-links) {
  color: var(--faint-light);
}
.journey :deep(.source-links a) {
  color: var(--faint-light);
  text-decoration-color: rgba(246, 241, 231, 0.3);
}
.journey :deep(.source-links a:hover),
.journey :deep(.source-links a:focus-visible) {
  color: var(--paper);
}
.finale :deep(.source-links),
.finale :deep(.source-links a) {
  color: #2f4a37;
  text-decoration-color: rgba(20, 54, 31, 0.35);
}
.finale :deep(.source-links a:hover),
.finale :deep(.source-links a:focus-visible) {
  color: var(--brand-green);
}

/* ── Fixe Elemente ─────────────────────────────────────────── */
.journey-progress {
  position: fixed;
  left: 0;
  top: var(--header-height);
  z-index: 60;
  /* Decorative: must never sit between a finger and a link scrolled beneath it */
  pointer-events: none;
  width: 100%;
  height: 3px;
  background: rgba(246, 241, 231, 0.08);
}
.journey-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, var(--blood), var(--ember) 60%, var(--hope));
}
.journey-badge {
  position: fixed;
  right: 18px;
  top: calc(var(--header-height) + 16px);
  z-index: 60;
  pointer-events: none;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(246, 241, 231, 0.18);
  background: rgba(7, 15, 10, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  color: var(--paper);
  font-variant-numeric: tabular-nums;
}
.journey-acts {
  position: fixed;
  right: 22px;
  top: 50%;
  z-index: 60;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.journey-acts a {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 12px;
  align-items: center;
  justify-items: end;
  gap: 10px;
  min-height: 12px;
  color: var(--paper);
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.journey-acts-label {
  opacity: 0;
  transform: translateX(6px);
  transition: opacity 0.2s, transform 0.2s;
}
.journey-acts a:hover .journey-acts-label,
.journey-acts a:focus-visible .journey-acts-label,
.journey-acts a.is-active .journey-acts-label {
  opacity: 1;
  transform: none;
}
.journey-acts-label {
  order: -1;
  white-space: nowrap;
}
.journey-acts-dot {
  width: 8px;
  height: 8px;
  justify-self: center;
  border-radius: 50%;
  background: rgba(246, 241, 231, 0.3);
  transition: background 0.2s, transform 0.2s;
}
.journey-acts a.is-active .journey-acts-dot {
  background: var(--ember);
  transform: scale(1.4);
}

/* ── Szenen ────────────────────────────────────────────────── */
.track {
  position: relative;
  height: var(--track);
}
.stage {
  position: sticky;
  /* The sticky site header stays above the scene, so the stage starts right below it */
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  height: calc(100svh - var(--header-height));
  overflow: hidden;
  display: grid;
  align-items: center;
  padding-inline: max(16px, 5vw);
  --p: 0;
}
.stage--center {
  justify-items: center;
  text-align: center;
}
.stage--left {
  justify-items: start;
}
.stage-copy {
  position: relative;
  z-index: 2;
  max-width: 900px;
}
.field {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.backdrop {
  position: absolute;
  inset: 0;
  margin: 0;
  z-index: 0;
}
.backdrop::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(7, 15, 10, 0.55), rgba(7, 15, 10, 0.75) 60%, rgba(7, 15, 10, 0.92));
}
.backdrop :deep(:is(img, video)) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.backdrop--zoom :deep(:is(img, video)) {
  transform: scale(calc(1.18 - var(--p) * 0.18));
  transform-origin: 50% 40%;
}
/* Scroll-linked scenes only move opacity and transform: both stay on the compositor, a filter would repaint a 4K frame on every scroll step */
.backdrop--open :deep(:is(img, video)) {
  opacity: calc(0.42 + var(--p) * 0.58);
  transform: scale(calc(1.12 - var(--p) * 0.12));
}
.backdrop--drive :deep(:is(img, video)) {
  transform: translate3d(calc(var(--p) * -6%), 0, 0) scale(1.12);
}
.backdrop--fade :deep(:is(img, video)) {
  opacity: calc(1 - var(--p) * 0.55);
  transform: scale(calc(1.08 + var(--p) * 0.08));
}
/* The colour drains out of the picture: a grey layer in saturation blend takes the saturation with it */
.backdrop--fade::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #8a8a8a;
  mix-blend-mode: saturation;
  opacity: var(--p);
}
.backdrop--brighten :deep(:is(img, video)) {
  opacity: calc(0.3 + var(--p) * 0.7);
  transform: scale(calc(1.15 - var(--p) * 0.1));
}
.backdrop--brighten::after {
  background: linear-gradient(180deg, rgba(7, 15, 10, 0.5), rgba(7, 15, 10, 0.7));
}
/* The morning comes up like light: the picture brightens and settles instead of being cut out of a shape */
.backdrop--dawn :deep(:is(img, video)) {
  opacity: calc(0.12 + var(--p) * 0.88);
  transform: scale(calc(1.12 - var(--p) * 0.12));
}
.backdrop--dawn::after {
  background: linear-gradient(180deg, rgba(233, 241, 234, 0.1), rgba(233, 241, 234, 0.55) 70%, var(--brand-mint));
}

/* Prolog */
.prolog {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.prolog-year {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(4rem, 17vw, 15rem);
  line-height: 0.85;
  letter-spacing: -0.06em;
  color: transparent;
  -webkit-text-stroke: 2px rgba(246, 241, 231, 0.55);
  font-variant-numeric: tabular-nums;
}
.prolog-number {
  margin: 10px 0 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2.6rem, 8.5vw, 7.5rem);
  line-height: 1;
  color: var(--blood);
  font-variant-numeric: tabular-nums;
}
.prolog-lede {
  margin: 16px 0 0;
  max-width: 24ch;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.2rem, 2.4vw, 1.9rem);
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--paper);
  text-wrap: balance;
}
.prolog-text {
  margin: 10px 0 8px;
  max-width: 46ch;
  font-size: clamp(1rem, 1.6vw, 1.2rem);
  line-height: 1.55;
  color: var(--muted-light);
}
.prolog-hint {
  margin: 28px 0 0;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--faint-light);
  animation: hint 2.2s ease-in-out infinite;
}
@keyframes hint {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(6px); }
}

/* Akt I: one station at a time, the years as a rail underneath */
.early {
  position: relative;
  z-index: 2;
  width: min(1180px, 100%);
  margin: 0 auto;
}
.early--pinned {
  height: 100%;
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 4vh;
  padding-block: 4vh 6vh;
}
.early--pinned .early-slides {
  display: grid;
  min-height: 0;
}
.early--pinned .early-slide {
  grid-area: 1 / 1;
  align-self: center;
  will-change: opacity, transform;
}
.early-slide {
  max-width: 860px;
}
/* Text left, photo right: the photo is a tall card that stays inside the pinned stage */
.early-slide--pictured {
  max-width: none;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
  gap: 5vw;
  align-items: center;
}
.early-copy {
  min-width: 0;
}
.early-picture {
  margin: 0;
  aspect-ratio: 4 / 5;
  max-height: 62vh;
  justify-self: end;
  width: 100%;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.early-picture :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.early-slide h3 {
  margin: 6px 0 12px;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.4vw, 3rem);
  letter-spacing: -0.03em;
  line-height: 1.08;
  color: var(--paper);
  text-wrap: balance;
  overflow-wrap: break-word;
}
.early-slide p {
  max-width: 52ch;
  font-size: clamp(1rem, 1.5vw, 1.2rem);
  line-height: 1.6;
  color: var(--muted-light);
}
.early-slide .early-year {
  max-width: none;
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3.4rem, 9vw, 9rem);
  line-height: 0.9;
  letter-spacing: -0.06em;
  color: var(--paper);
  font-variant-numeric: tabular-nums;
}
.early-slide--number .early-year {
  color: var(--blood);
}
.early-slide--law .early-year {
  color: var(--ember);
}
.early-rail {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 24px;
  border-top: 1px solid rgba(246, 241, 231, 0.16);
}
.early-rail-item {
  position: relative;
  padding-top: 18px;
}
.early-rail-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: -5px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(246, 241, 231, 0.3);
  transition: background 0.3s, transform 0.3s;
}
.early-rail-item.is-past::before {
  background: rgba(246, 241, 231, 0.7);
}
.early-rail-item.is-active::before {
  background: var(--ember);
  transform: scale(1.5);
}
.early-rail-year {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: -0.02em;
  color: rgba(246, 241, 231, 0.55);
  transition: color 0.3s;
  font-variant-numeric: tabular-nums;
}
.early-rail-item.is-past .early-rail-year {
  color: rgba(246, 241, 231, 0.8);
}
.early-rail-item.is-active .early-rail-year {
  color: var(--ember);
}
.early-rail-title {
  display: block;
  margin-top: 2px;
  font-size: 0.78rem;
  line-height: 1.4;
  color: rgba(246, 241, 231, 0.45);
  transition: color 0.3s;
}
.early-rail-item.is-active .early-rail-title {
  color: var(--paper);
}

/* Zitate */
.quote {
  margin: 0;
  max-width: 26ch;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.7rem, 4.8vw, 4.4rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--paper);
}
.quote--small {
  font-size: clamp(1.5rem, 4vw, 3.6rem);
}
.quote-word {
  display: inline-block;
  margin-inline-end: 0.28em;
  opacity: 0.16;
  transition: opacity 0.25s linear;
}
.quote-word.is-lit {
  opacity: 1;
}

/* Stationen im Fluss */
.flow {
  position: relative;
  padding-block: 18vh;
  padding-inline: max(16px, 5vw);
}
.flow--band {
  padding-top: 0;
}
.band {
  position: relative;
  margin: 0 calc(-1 * max(16px, 5vw)) 14vh;
  height: 52vh;
  overflow: hidden;
  --p: 0;
}
.band::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, var(--night), transparent 30%, transparent 70%, var(--night));
}
.band :deep(:is(img, video)) {
  width: 100%;
  height: 130%;
  object-fit: cover;
  display: block;
  /* The picture drifts upward slower than the page, a classic parallax layer.
     It is 130 % tall, so it may move up by at most 30 / 130 of its own height before its bottom edge shows */
  transform: translate3d(0, calc(-23% * var(--p)), 0);
}
.band--eye :deep(img) {
  object-position: 50% 42%;
}
.flow-inner {
  max-width: 1120px;
  margin: 0 auto;
  display: grid;
  gap: 7vh;
}
.flow-inner--split {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 5vw;
  align-items: start;
}
.flow-inner--swap {
  direction: rtl;
}
.flow-inner--swap > * {
  direction: ltr;
}
.side {
  position: sticky;
  top: calc(var(--header-height) + 24px);
  margin: 0;
  aspect-ratio: 4 / 5;
  max-width: 100%;
  border-radius: 28px;
  overflow: hidden;
  --p: 0;
}
.side :deep(:is(img, video)) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(calc(1.02 + var(--p) * 0.12));
  transform-origin: 50% 50%;
}
.stations {
  display: grid;
  gap: 7vh;
  min-width: 0;
}
.station {
  display: grid;
  grid-template-columns: minmax(96px, 0.3fr) minmax(0, 1fr);
  gap: 4vw;
  align-items: start;
}
/* Scoped tighter than ".station p", which would otherwise hand the year the paragraph line height */
.station .station-year {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2rem, 4.6vw, 4.2rem);
  line-height: 0.95;
  letter-spacing: -0.05em;
  color: var(--paper);
  font-variant-numeric: tabular-nums;
}
.station--harm .station-year {
  color: var(--blood);
}
.station--good .station-year {
  color: var(--hope);
}
.station h3 {
  margin: 0 0 10px;
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 2.4vw, 2rem);
  letter-spacing: -0.025em;
  line-height: 1.15;
  color: var(--paper);
  overflow-wrap: break-word;
}
.station p {
  margin: 0 0 10px;
  max-width: 60ch;
  line-height: 1.65;
  color: var(--muted-light);
}
.tag {
  display: inline-block;
  margin-bottom: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  background: rgba(246, 241, 231, 0.1);
  color: var(--paper);
}
.station--harm .tag {
  background: rgba(231, 76, 60, 0.18);
  color: #ff8b7e;
}
.station--good .tag {
  background: rgba(79, 208, 138, 0.14);
  color: var(--hope);
}
.station--promise .tag {
  background: rgba(255, 106, 61, 0.16);
  color: var(--ember);
}

/* Käfig */
.cage {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 6vw;
  align-items: center;
  width: min(1200px, 100%);
  margin: 0 auto;
}
/* Two A4 sheets side by side make an A3; the right sheet carries the cage */
.cage-art {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  aspect-ratio: 420 / 297;
  max-width: 100%;
  margin-top: 1.6rem;
  border: 1.5px dashed rgba(246, 241, 231, 0.45);
  border-radius: 4px;
}
.cage-a3-label {
  position: absolute;
  left: 0;
  bottom: 100%;
  margin-bottom: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.7);
  white-space: nowrap;
}
.cage-a4 {
  position: relative;
  overflow: hidden;
  padding: 12px 14px;
  background: var(--paper);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--brand-green);
}
.cage-a4--blank {
  border-radius: 3px 0 0 3px;
  border-right: 1px dashed rgba(20, 54, 31, 0.35);
}
.cage-a4:not(.cage-a4--blank) {
  border-radius: 0 3px 3px 0;
}
/* The cage grows from the bottom of the sheet to its real share early in the act, so a phone sees it full while the sheets are still on screen */
.cage-hen {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--share) * 100% * clamp(0, (var(--p) - 0.05) / 0.35, 1));
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  padding: 10px 14px;
  background: var(--blood);
  box-shadow: 0 -10px 40px rgba(231, 76, 60, 0.35);
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 0;
  text-transform: none;
  color: #2a0d08;
}
.cage-hen-size {
  font-weight: 400;
  font-size: 0.72rem;
}
.cage-copy {
  position: relative;
  z-index: 1;
  min-width: 0;
}

/* Kurve */
.curve {
  position: relative;
  z-index: 2;
  width: min(1180px, 100%);
  text-align: left;
}
.curve-head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px 24px;
  margin-bottom: 18px;
}
.curve-now {
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(2.6rem, 8vw, 7rem);
  line-height: 1;
  color: var(--blood);
  font-variant-numeric: tabular-nums;
}
.curve-year {
  color: var(--muted-light);
}
.curve-svg {
  width: 100%;
  height: auto;
  overflow: visible;
}
.curve-axis {
  stroke: rgba(246, 241, 231, 0.25);
}
.curve-grid {
  stroke: rgba(246, 241, 231, 0.08);
  stroke-dasharray: 4 6;
}
.curve-label {
  fill: rgba(246, 241, 231, 0.7);
  font-size: 15px;
}
.curve-area {
  fill: rgba(231, 76, 60, 0.16);
}
.curve-line {
  fill: none;
  stroke: var(--blood);
  stroke-width: 5;
  stroke-linejoin: round;
}
.curve-dot {
  fill: var(--ember);
}
.curve-note {
  margin: 14px 0 6px;
  font-size: 0.9rem;
  color: var(--muted-light);
}

/* Uhr */
.clock {
  position: relative;
  z-index: 2;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 6vw;
  width: min(1180px, 100%);
  margin: 0 auto;
}
.clock-ring {
  width: min(60vw, 360px);
  height: auto;
}
.clock-track {
  fill: none;
  stroke: rgba(246, 241, 231, 0.12);
  stroke-width: 20;
}
.clock-arc {
  fill: none;
  stroke: var(--blood);
  stroke-width: 20;
  stroke-linecap: round;
}
.clock-copy {
  max-width: 36ch;
}
.clock-hours {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3.4rem, 11vw, 9rem);
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}

/* Heute legal */
.legal {
  list-style: none;
  padding: 0;
  margin: 3vh 0 0;
  display: grid;
  gap: 14px;
}
.legal li {
  padding: 18px 0;
  border-top: 1px solid rgba(231, 76, 60, 0.35);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.2rem, 2.6vw, 2.1rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
}
.legal li span {
  display: block;
  margin-top: 6px;
  font-family: inherit;
  font-weight: 400;
  font-size: 0.92rem;
  letter-spacing: 0;
  color: var(--muted-light);
}

/* Countdown */
.countdown {
  position: relative;
  z-index: 2;
}
.countdown-number {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 900;
  font-size: clamp(3rem, 13vw, 12rem);
  line-height: 0.95;
  color: var(--blood);
  font-variant-numeric: tabular-nums;
  transition: color 0.4s;
}
.countdown-number.is-zero {
  color: var(--hope);
}
.countdown-label {
  margin: 10px 0 0;
  font-size: 0.78rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--faint-light);
}

/* Exporte */
.exports {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 4vw;
  align-items: center;
  --p: 0;
}
.exports-media {
  border-radius: 24px;
  overflow: hidden;
  aspect-ratio: 16 / 10;
}
.exports-media :deep(:is(img, video)) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.exports-rows {
  list-style: none;
  padding: 0;
  margin: 16px 0;
  display: grid;
  gap: 8px;
}
.exports-row {
  display: grid;
  grid-template-columns: 4em minmax(0, 1fr) 6.5em;
  gap: 12px;
  align-items: center;
  font-variant-numeric: tabular-nums;
  font-size: 0.95rem;
}
.exports-bar {
  height: 12px;
  border-radius: 6px;
  background: rgba(246, 241, 231, 0.1);
  overflow: hidden;
}
.exports-bar i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--blood);
  transform-origin: left;
  /* Rows grow in one after another as the figure scrolls through */
  transform: scaleX(calc(var(--w) * min(1, max(0.01, var(--p) * 2.2 - var(--i) * 0.12))));
}
.exports-value {
  text-align: right;
  color: var(--muted-light);
}
.exports-note {
  margin: 0 0 8px;
  font-size: 0.9rem;
  color: var(--muted-light);
}

/* Morgen */
.track--dawn {
  background: linear-gradient(180deg, var(--night), var(--forest) 40%, var(--brand-mint));
}
.dawn-copy {
  position: relative;
  z-index: 2;
  max-width: 820px;
}
/* On the light morning the hopeful green needs to be the dark one */
.dawn-copy .kicker {
  color: var(--brand-fall);
}
.finale {
  background: var(--brand-mint);
  color: var(--brand-green);
  padding-block: 10vh 6rem;
  padding-inline: max(16px, 5vw);
}
.finale-inner {
  max-width: 1120px;
  margin: 0 auto;
}
.finale-cta {
  display: grid;
  grid-template-columns: minmax(0, 0.7fr) minmax(0, 1.3fr);
  gap: 3vw;
  align-items: center;
  margin: 3rem 0;
}
.finale-figure {
  margin: 0;
  aspect-ratio: 3 / 4;
  border-radius: 24px;
  overflow: hidden;
}
.finale-figure :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.finale-btn {
  display: inline-block;
  margin-top: 0.5rem;
  padding: 14px 26px;
  border-radius: 999px;
  background: var(--brand-green);
  color: var(--brand-mint);
  font-weight: 900;
  font-size: 0.8rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  text-decoration: none;
}
.finale-btn:hover,
.finale-btn:focus-visible {
  background: var(--brand-accent);
  color: var(--brand-green);
  text-decoration: none;
}


/* Schiene: eine Linie mit Punkten neben den Stationen im Lesefluss */
.stations {
  position: relative;
}
.station {
  position: relative;
  /* Half the year's line box: the dot sits exactly on the year's vertical middle */
  --rail-y: calc(clamp(2rem, 4.6vw, 4.2rem) * 0.95 / 2);
}
.station::before {
  content: '';
  position: absolute;
  left: -32px;
  top: calc(var(--rail-y) - 5px);
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(246, 241, 231, 0.35);
  z-index: 1;
}
/* The line from this dot down to the next one, so the dots read as one rail and not as stray bullets */
.station::after {
  content: '';
  position: absolute;
  left: -27.5px;
  top: var(--rail-y);
  bottom: calc(-7vh - var(--rail-y));
  width: 1px;
  background: rgba(246, 241, 231, 0.14);
}
.station:last-of-type::after {
  display: none;
}
.station--harm::before {
  background: var(--blood);
}
.station--good::before {
  background: var(--hope);
}
.station--promise::before {
  background: var(--ember);
}

/* ── Klein und ruhig ───────────────────────────────────────── */
@media (max-width: 991px) {
  .journey-acts {
    display: none;
  }
}
/* Small screens: the scenes pin like on a desktop, the slides and the rail just take less room */
@media (max-width: 759px) {
  /* Room above for the fixed year badge, the picture a little lower so the slide and the rail fit one screen */
  .early--pinned {
    gap: 2vh;
    padding-block: 8vh 3vh;
  }
  .early-slide--pictured {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .early-picture {
    order: -1;
    aspect-ratio: 16 / 10;
    max-height: 26vh;
    border-radius: 20px;
  }
  /* The rail keeps its five years on one line, the titles go */
  .early-rail {
    grid-template-columns: repeat(5, auto);
    justify-content: space-between;
    gap: 8px;
  }
  .early-rail-year {
    font-size: 0.78rem;
    white-space: nowrap;
  }
  .early-rail-title {
    display: none;
  }
  .flow-inner--split,
  .cage,
  .exports,
  .finale-cta {
    grid-template-columns: 1fr;
  }
  .station::before,
  .station::after {
    display: none;
  }
  .cage-art {
    margin-top: 2rem;
  }
  .side {
    position: relative;
    top: auto;
    aspect-ratio: 16 / 10;
    border-radius: 20px;
  }
  .station {
    grid-template-columns: 1fr;
    gap: 6px;
  }
  .journey-badge {
    font-size: 0.78rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .stage {
    position: relative;
    top: auto;
    height: auto;
    min-height: 0;
    padding-block: 16vh;
  }
  .track {
    height: auto;
  }
  .early-slides {
    display: grid;
    gap: 3rem;
  }
  .quote-word {
    opacity: 1;
  }
  .prolog-hint {
    animation: none;
  }
  .backdrop {
    position: relative;
    aspect-ratio: 16 / 9;
    margin-bottom: 2rem;
  }
}
</style>
