<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import dayjs from 'dayjs'
import { useTransition, TransitionPresets, useMediaQuery } from '@vueuse/core'
import { Motion } from 'motion-v'
import { useTimer } from '@/composables/useTimer'
import { useAnimalData, type ComputedAnimal } from '@/composables/useAnimalData'
import { animals } from '@/data/animals'
import { sources, sourceList } from '@/data/sources'
import { useVictimTicker } from '@/composables/useVictimTicker'
import { usePersonalTracker } from '@/composables/usePersonalTracker'
import { formatNumber } from '@/utils/formatNumber'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import OdometerNumber from '@/components/OdometerNumber.vue'
import GrowthTimeline from '@/components/GrowthTimeline.vue'

declare const __APP_VERSION__: string
const appVersion = __APP_VERSION__

const timer = useTimer()
const isMobile = useMediaQuery('(max-width: 767px)')
// Smaller screens get a shorter emoji wall and fewer bubbles over the hero text
const { animalData, totalDeathCount } = useAnimalData(timer, {
  emojiRenderCap: () => (isMobile.value ? 240 : 2000),
})
const { victims } = useVictimTicker(isMobile.value ? 600 : 250, isMobile.value ? 6 : 12)

// Seeded random for deterministic but natural-looking emoji positions
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

const floatingEmojis = (() => {
  const emojis = ['🐷', '🐄', '🐔', '🐑', '🐐', '🦆', '🦃', '🐴', '🪿']
  const rand = seededRandom(42)
  return Array.from({ length: 25 }, () => ({
    emoji: emojis[Math.floor(rand() * emojis.length)]!,
    left: `${(rand() * 90 + 5).toFixed(1)}%`,
    delay: `${(rand() * 15).toFixed(1)}s`,
    duration: `${(14 + rand() * 16).toFixed(1)}s`,
    size: `${(1 + rand() * 1.5).toFixed(2)}rem`,
  }))
})()

/**
 * Impact-Daten: Was eine Person pro Tag spart, wenn sie vegan statt mit
 * mittlerem Fleischkonsum isst.
 *
 * CO2, Land, Wasser: Scarborough et al. 2023, Nature Food 4, 565-574,
 * Tabellen 3 und 4, Differenz "vegan" zu "medium meat-eater":
 * 2,47 vs. 7,04 kg CO2e, 4,37 vs. 11,28 m², 0,41 vs. 0,78 m³ Wasser pro Tag.
 * https://doi.org/10.1038/s43016-023-00795-w
 *
 * Tierleben: Destatis-Schlachtzahlen (animals.ts) geteilt durch die
 * Bevölkerung Deutschlands, pro Tag. Inklusive geschätzter Fische, ohne Importe.
 */
const impactTimeline = [
  { label: '1 Tag',      days: 1,       emoji: '🌅' },
  { label: '1 Woche',    days: 7,       emoji: '📅' },
  { label: '1 Monat',    days: 30,      emoji: '🌙' },
  { label: '6 Monate',   days: 182,     emoji: '🌿' },
  { label: '1 Jahr',     days: 365,     emoji: '🌍' },
  { label: '10 Jahre',   days: 3650,    emoji: '🌳' },
  { label: '50 Jahre',   days: 18250,   emoji: '💚' },
]

const POPULATION_DE = 83_500_000 // Destatis, Bevölkerungsstand Ende 2025
const YEARLY_DEATHS_DE = animals.reduce((sum, a) => sum + a.deaths.year, 0)
const DAILY_LIVES = YEARLY_DEATHS_DE / POPULATION_DE / 365.25
const DAILY_WATER_L = 370
const DAILY_CO2_KG = 4.57
const DAILY_LAND_M2 = 6.91
const DAYS_PER_LIFE = Math.ceil(1 / DAILY_LIVES)

const activeImpact = ref(4) // Default: 1 Jahr
const activeImpactData = computed(() => impactFor(impactTimeline[activeImpact.value]!.days))
const { veganSince, isSet: hasPersonalDate, daysSinceVegan, formattedDuration, clear: clearPersonalDate } = usePersonalTracker()
const personalImpact = computed(() => impactFor(daysSinceVegan.value))
const copyLabel = ref('Kopieren')

// Native <dialog>: top layer, focus trap, Escape to close, backdrop for free
const trackerDialog = useTemplateRef<HTMLDialogElement>('trackerDialog')
function openTrackerModal() {
  trackerDialog.value?.showModal()
}
function closeTrackerModal() {
  trackerDialog.value?.close()
}
// Local date (not UTC), so "today" is selectable right after midnight in Germany
const todayLocalIso = computed(() => dayjs(timer.now.value).format('YYYY-MM-DD'))

const personalShareText = computed(() => {
  const impact = personalImpact.value
  return `Seit ${formattedDuration.value} lebe ich vegan und habe damit schon ${impact.lives.value} Tierleben gerettet, ${impact.water.value} L Wasser gespart und ${impact.co2.value} kg CO₂ vermieden. 🌱\n\nWas ist dein Impact? 👉 https://vegan.to\n\n#GoVegan #VeganFürDieTiere`
})

function copyPersonalShare() {
  navigator.clipboard.writeText(personalShareText.value).then(() => {
    copyLabel.value = 'Kopiert! ✓'
    setTimeout(() => { copyLabel.value = 'Kopieren' }, 2000)
  })
}

function impactFor(days: number) {
  const lives = days * DAILY_LIVES
  const water = days * DAILY_WATER_L
  const co2 = days * DAILY_CO2_KG
  const land = days * DAILY_LAND_M2

  return {
    lives: { value: formatNumber(lives, lives < 10 ? 1 : 0), comparisons: lifeComparisons(lives) },
    water: { value: formatNumber(water), comparisons: waterComparisons(water) },
    co2: { value: formatNumber(co2), comparisons: co2Comparisons(co2) },
    land: { value: formatNumber(land), comparisons: landComparisons(land) },
  }
}

function lifeComparisons(lives: number): string[] {
  const r: string[] = []
  if (lives >= 10) r.push(`Eine Schulklasse mit 25 Kindern rettet so ${formatNumber(lives * 25)} Tiere`)
  if (lives >= 1) r.push(`${formatNumber(lives)} fühlende Wesen mit eigenem Charakter`)
  if (lives < 1) r.push(`Nach ${DAYS_PER_LIFE} Tagen ist es ein ganzes Tierleben`)
  r.push('Jedes einzelne wollte leben')
  return r.slice(0, 2)
}

function waterComparisons(liters: number): string[] {
  const r: string[] = []
  const bathtubs = liters / 150
  const pools = liters / 50_000 // Gartenpool 8 x 4 m
  if (pools >= 1) r.push(`${formatNumber(pools)} Gartenpools voll Wasser`)
  if (bathtubs >= 1) r.push(`${formatNumber(bathtubs)} volle Badewannen`)
  if (liters >= 1000) r.push(`${formatNumber(liters / 1000)} Tonnen Wasser, genug für ein kleines Dorf`)
  return r.slice(0, 2)
}

function co2Comparisons(kg: number): string[] {
  const r: string[] = []
  const flights = kg / 494 // myclimate: Frankfurt nach Mallorca und zurück, Economy, ca. 494 kg CO2
  const carKm = kg / 0.23 // UBA TREMOD 2024: Pkw inkl. Vorkette, ca. 230 g CO2e pro Fahrzeug-km
  if (flights >= 1) r.push(`${formatNumber(flights)}× nach Mallorca und zurück fliegen`)
  if (carKm >= 1) r.push(`${formatNumber(carKm)} km Autofahren`)
  return r.slice(0, 2)
}

function landComparisons(m2: number): string[] {
  const r: string[] = []
  const soccer = m2 / 7140 // FIFA Fußballfeld
  const tennis = m2 / 261 // Tennisplatz
  if (soccer >= 1) r.push(`${formatNumber(soccer)} Fußballfelder`)
  if (tennis >= 1) r.push(`${formatNumber(tennis)} Tennisplätze`)
  if (m2 >= 10) r.push(`${formatNumber(m2 / 10)} Parkplätze weniger versiegelt`)
  if (r.length === 0) r.push(`Etwa so viel wie ein kleines Badezimmer`)
  return r.slice(0, 2)
}

/**
 * Veganer*innen in Deutschland. Gemischte Quellen, weil es keine
 * durchgehende Zeitreihe gibt:
 * 2008 Nationale Verzehrsstudie II (unter 80.000), 2015 VEBU-Schätzung,
 * 2016 SKOPOS, 2018 bis 2025 IfD Allensbach (AWA).
 */
const veganTimeline = [
  { year: 2008, count: 80_000 },
  { year: 2015, count: 900_000 },
  { year: 2016, count: 1_300_000 },
  { year: 2018, count: 950_000 },
  { year: 2020, count: 1_130_000 },
  { year: 2022, count: 1_580_000 },
  { year: 2025, count: 1_680_000 },
]

const veganTimelineAxisYears = [2008, 2012, 2016, 2020, 2025]

/**
 * Veganer*innen heute: der letzte AWA-Wert (2025), sekundengenau fortgeschrieben
 * mit dem mittleren Zuwachs der letzten beiden AWA-Erhebungen (2022 bis 2025).
 * Bezugspunkt ist die Jahresmitte 2025, weil die AWA über das Jahr verteilt erhebt.
 * Eine Hochrechnung aus dem Trend, kein Messwert.
 */
const latestVeganCount = veganTimeline[veganTimeline.length - 1]!
const previousVeganCount = veganTimeline[veganTimeline.length - 2]!
const VEGAN_TREND_PER_SECOND =
  (latestVeganCount.count - previousVeganCount.count) /
  ((latestVeganCount.year - previousVeganCount.year) * 365.25 * 86_400)
const VEGAN_REFERENCE_DATE = dayjs(`${latestVeganCount.year}-07-01`)

const animatedVeganCount = computed(() =>
  Math.round(latestVeganCount.count + timer.now.value.diff(VEGAN_REFERENCE_DATE, 'second') * VEGAN_TREND_PER_SECOND),
)

const childViewState = ref<Record<string, boolean>>({})

function toggleChildView(animal: ComputedAnimal) {
  childViewState.value[animal.names.single] = !childViewState.value[animal.names.single]
}

function isChildViewOpen(animal: ComputedAnimal): boolean {
  return childViewState.value[animal.names.single] ?? false
}

const animatedTotalDeaths = useTransition(totalDeathCount, {
  duration: 369,
  transition: TransitionPresets.easeOutCubic,
})

const currentYear = new Date().getFullYear()

const shareText = () =>
  `In nur ${timer.elapsedFormatted.value} in denen ich auf https://vegan.to war, sind in #Deutschland schon ${totalDeathCount.value} Tiere ermordet worden...\n\n#GoVegan\n#StopEatingAnimals\n#PostmeatGeneration\n\n🐷🐮🐔`
</script>

<template>
  <!-- Hero Section -->
  <section class="hero">
    <!-- Floating Emoji Background -->
    <div class="hero-emojis" aria-hidden="true">
      <span
        v-for="(fe, i) in floatingEmojis"
        :key="'emoji-' + i"
        class="floating-emoji"
        :style="{
          left: fe.left,
          animationDelay: fe.delay,
          animationDuration: fe.duration,
          fontSize: fe.size,
        }"
      >{{ fe.emoji }}</span>
    </div>

    <!-- Floating Victim Bubbles -->
    <div class="victim-layer" aria-hidden="true">
      <div
        v-for="victim in victims"
        :key="victim.id"
        class="victim-bubble"
        :style="{
          left: victim.left,
          animationDuration: victim.duration + 's',
          animationDelay: victim.startOffset ? victim.startOffset + 's' : '0s',
        }"
      >
        <span class="victim-emoji">{{ victim.emoji }}</span>
        <span class="victim-name">{{ victim.name }}</span>
        <span class="victim-divider">·</span>
        <span class="victim-meta">{{ victim.age }}</span>
        <span class="victim-divider">·</span>
        <span class="victim-location">{{ victim.location }}</span>
      </div>
    </div>

    <div class="hero-inner">
      <Motion
        tag="p"
        class="hero-label"
        :initial="{ opacity: 0, y: -20 }"
        :animate="{ opacity: 0.6, y: 0 }"
        :transition="{ duration: 0.6 }"
      >
        Echtzeit-Zähler
      </Motion>

      <Motion
        tag="h1"
        class="hero-title"
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.1 }"
      >
        Tiermorde in Deutschland
      </Motion>

      <Motion
        tag="p"
        class="hero-subtitle"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 0.8, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.3 }"
      >
        Jeden Tag sterben in Deutschland Tiere, damit sie auf Tellern landen.
        Jedes von ihnen hatte einen Namen und ein Alter. Keins hatte eine Wahl.
      </Motion>

      <!-- Live Counter -->
      <Motion
        v-if="totalDeathCount > 0"
        class="hero-counter"
        :initial="{ opacity: 0, scale: 0.8 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }"
      >
        <span class="hero-counter-number">{{ formatNumber(animatedTotalDeaths) }}</span>
        <span class="hero-counter-label">Tiere getötet seit du hier bist</span>
        <span class="hero-counter-note">Fische als Schätzung mitgezählt</span>
        <span class="hero-counter-time">🕰 {{ timer.elapsedFormatted.value }}</span>
      </Motion>
    </div>
  </section>

  <!-- Animal Data -->
  <section class="animals-section">
    <div class="container">
      <!-- Desktop Header -->
      <Motion
        class="animal-header d-none d-md-flex"
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ duration: 0.4 }"
      >
        <div class="animal-header-name">Tier</div>
        <div class="animal-header-stat">heute</div>
        <div class="animal-header-stat">pro Tag</div>
        <div class="animal-header-stat animal-header-stat--wide">dieses Jahr</div>
      </Motion>

      <!-- Animal Cards with stagger -->
      <Motion
        v-for="(animal, index) in animalData"
        :key="animal.names.single"
        class="animal-card"
        :initial="{ opacity: 0, y: 40 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: index * 0.06 }"
        :inViewOptions="{ once: true, amount: 0.2 }"
      >
        <div class="animal-card-main">
          <div class="animal-card-name">
            <span class="animal-emoji">{{ animal.names.emoji }}</span>
            <span class="animal-label">{{ animal.names.plural }}</span>
            <span
              v-if="animal.estimate"
              class="animal-estimate"
              :title="animal.estimate.note"
              tabindex="0"
            >Schätzung</span>
          </div>
          <div class="animal-card-stats">
            <div class="animal-stat">
              <span class="animal-stat-label d-md-none">heute</span>
              <span class="animal-stat-value animal-stat-value--danger"><template v-if="animal.estimate">≈ </template><AnimatedNumber :value="animal.currentDay" /></span>
            </div>
            <div class="animal-stat">
              <span class="animal-stat-label d-md-none">pro Tag</span>
              <span class="animal-stat-value">{{ animal.estimate ? '≈ ' : '' }}{{ formatNumber(animal.perDay) }}</span>
            </div>
            <div class="animal-stat animal-stat--wide">
              <span class="animal-stat-label d-md-none">dieses Jahr</span>
              <span class="animal-stat-value animal-stat-value--danger"><template v-if="animal.estimate">≈ </template><AnimatedNumber :value="animal.currentYear" /></span>
            </div>
          </div>
        </div>

        <div
          v-if="animal.killedSinceStart > 0 || animal.children.length > 0"
          class="animal-card-footer"
        >
          <div class="animal-card-since">
            <small v-if="animal.killedSinceStart > 0">
              Seit du da bist {{ animal.killedSinceStart > 1 ? 'wurden' : 'wurde' }}
              <span class="text-killed">{{ animal.killedSinceStart }} {{ animal.getNameByCount(animal.killedSinceStart) }}</span>
              getötet...
            </small>
          </div>
          <button
            v-if="animal.children.length > 0"
            class="btn-children"
            @click="toggleChildView(animal)"
          >
            {{ isChildViewOpen(animal) ? 'ausblenden' : 'Untergruppen' }}
          </button>
        </div>

        <div v-if="animal.killedSinceStart > 0" class="animal-card-emojis">
          {{ animal.killedSinceStartEmojis }}
          <span v-if="animal.killedSinceStartHidden > 0" class="animal-card-emojis-more">
            + {{ formatNumber(animal.killedSinceStartHidden) }} weitere
          </span>
        </div>

        <div v-if="isChildViewOpen(animal)" class="animal-children">
          <div v-for="child in animal.children" :key="child.name" class="animal-child">
            <span class="animal-child-name">davon {{ child.name }}</span>
            <span class="animal-child-stat" data-label="heute">{{ child.currentDayFormatted }}</span>
            <span class="animal-child-stat" data-label="pro Tag">{{ child.perDayFormatted }}</span>
            <span class="animal-child-stat animal-child-stat--wide" data-label="dieses Jahr">{{ child.currentYearFormatted }}</span>
          </div>
        </div>
      </Motion>
    </div>
  </section>

  <!-- Live Death Counter Summary -->
  <Motion
    v-if="totalDeathCount > 0"
    tag="section"
    class="emoji-section"
    :initial="{ opacity: 0 }"
    :whileInView="{ opacity: 1 }"
    :transition="{ duration: 0.8 }"
    :inViewOptions="{ once: true, amount: 0.3 }"
  >
    <div class="container">
      <h2 class="section-title">Während du hier bist, sterben sie weiter</h2>
      <p class="emoji-section-sub">
        In nur {{ timer.elapsedFormatted.value }} seit du da bist:
      </p>
      <div class="emoji-badges">
        <span v-for="animal in animalData" :key="'badge-' + animal.names.single">
          <span v-if="animal.killedSinceStart > 0" class="emoji-badge">
            {{ animal.names.emoji }}
            <strong>{{ formatNumber(animal.killedSinceStart) }}</strong>
            {{ animal.getNameByCount(animal.killedSinceStart) }}
          </span>
        </span>
      </div>
      <div class="emoji-total">
        <AnimatedNumber :value="totalDeathCount" /> Tiere, seit du diese Seite geöffnet hast.
      </div>
    </div>
  </Motion>

  <!-- Vegan Growth: Full-Width Progress Bar -->
  <section class="growth-section">
    <div class="growth-inner">
      <Motion
        tag="h2"
        class="growth-title"
        :initial="{ opacity: 0, y: 20 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :inViewOptions="{ once: true }"
      >
        Die Bewegung wächst
      </Motion>

      <div class="growth-stats">
        <div class="growth-stat">
          <span class="growth-stat-number growth-stat-number--green">
            <OdometerNumber :value="animatedVeganCount" :digits="7" />
          </span>
          <span class="growth-stat-label">Veganer*innen in Deutschland, AWA-Trend fortgeschrieben</span>
        </div>
        <div class="growth-stat">
          <span class="growth-stat-number">{{ formatNumber(POPULATION_DE) }}</span>
          <span class="growth-stat-label">Gesamtbevölkerung. Da wollen wir hin.</span>
        </div>
      </div>

      <!-- Full-width progress bar -->
      <div class="growth-progress">
        <div
          class="growth-progress-fill"
          :style="{ width: (animatedVeganCount / POPULATION_DE * 100).toFixed(4) + '%' }"
        >
          <span class="growth-progress-label">
            {{ (animatedVeganCount / POPULATION_DE * 100).toFixed(2) }}%
          </span>
        </div>
      </div>

      <Motion
        :initial="{ opacity: 0, y: 12 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        :inViewOptions="{ once: true }"
      >
        <GrowthTimeline :points="veganTimeline" :label-years="veganTimelineAxisYears" />
      </Motion>

      <Motion
        tag="p"
        class="growth-message"
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.2 }"
        :inViewOptions="{ once: true }"
      >
        2008 waren es 80.000. Heute sind es über 1,6 Millionen. Und es werden jeden Tag mehr.
      </Motion>

      <p class="growth-source">
        Quellen:
        <a :href="sources.skopos.url" target="_blank" rel="noopener">NVS II (2008) und SKOPOS (2016)</a>,
        <a :href="sources.vebu.url" target="_blank" rel="noopener">VEBU (2015)</a>,
        <a :href="sources.awa.url" target="_blank" rel="noopener">IfD Allensbach AWA (2018 bis 2025)</a>
      </p>
    </div>
  </section>

  <!-- Impact Timeline -->
  <section class="impact-section">
    <div class="container">
      <Motion
        tag="h2"
        class="section-title"
        :initial="{ opacity: 0, y: 30 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, type: 'spring' }"
        :inViewOptions="{ once: true }"
      >
        Dein Impact, wenn du heute anfängst
      </Motion>
      <Motion
        tag="p"
        class="impact-subtitle"
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        :inViewOptions="{ once: true }"
      >
        Eine einzige Person spart durch vegane Ernährung:
      </Motion>

      <!-- Timeline Selector -->
      <div class="impact-tabs">
        <button
          v-for="(item, i) in impactTimeline"
          :key="item.label"
          class="impact-tab"
          :class="{ 'impact-tab--active': activeImpact === i }"
          @click="activeImpact = i"
        >
          <span class="impact-tab-emoji">{{ item.emoji }}</span>
          <span class="impact-tab-label">{{ item.label }}</span>
        </button>
      </div>

      <!-- Impact Cards: vertical, with comparisons -->
      <div class="impact-cards">
        <div class="impact-card impact-card--lives">
          <div class="impact-card-head">
            <span class="impact-card-icon">🐾</span>
            <div>
              <span class="impact-card-value">{{ activeImpactData.lives.value }}</span>
              <span class="impact-card-label">Tierleben gerettet</span>
            </div>
          </div>
          <ul class="impact-card-comparisons">
            <li v-for="c in activeImpactData.lives.comparisons" :key="c">{{ c }}</li>
          </ul>
        </div>

        <div class="impact-card impact-card--water">
          <div class="impact-card-head">
            <span class="impact-card-icon">💧</span>
            <div>
              <span class="impact-card-value">{{ activeImpactData.water.value }} L</span>
              <span class="impact-card-label">Wasser gespart</span>
            </div>
          </div>
          <ul class="impact-card-comparisons">
            <li v-for="c in activeImpactData.water.comparisons" :key="c">{{ c }}</li>
          </ul>
        </div>

        <div class="impact-card impact-card--co2">
          <div class="impact-card-head">
            <span class="impact-card-icon">🌿</span>
            <div>
              <span class="impact-card-value">{{ activeImpactData.co2.value }} kg</span>
              <span class="impact-card-label">CO₂ vermieden</span>
            </div>
          </div>
          <ul class="impact-card-comparisons">
            <li v-for="c in activeImpactData.co2.comparisons" :key="c">{{ c }}</li>
          </ul>
        </div>

        <div class="impact-card impact-card--land">
          <div class="impact-card-head">
            <span class="impact-card-icon">🌾</span>
            <div>
              <span class="impact-card-value">{{ activeImpactData.land.value }} m²</span>
              <span class="impact-card-label">Land geschont</span>
            </div>
          </div>
          <ul class="impact-card-comparisons">
            <li v-for="c in activeImpactData.land.comparisons" :key="c">{{ c }}</li>
          </ul>
        </div>
      </div>

      <p class="impact-source">
        Quellen:
        <a :href="sources.scarborough.url" target="_blank" rel="noopener">Scarborough et al. (2023, <em>Nature Food</em>)</a>,
        <a :href="sources.destatisPopulation.url" target="_blank" rel="noopener">Destatis</a>,
        <a :href="sources.uba.url" target="_blank" rel="noopener">Umweltbundesamt</a>,
        <a :href="sources.myclimate.url" target="_blank" rel="noopener">myclimate</a>
      </p>

      <!-- Personal Tracker -->
      <Motion
        class="personal-tracker"
        :initial="{ opacity: 0, y: 30 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6 }"
        :inViewOptions="{ once: true }"
      >
        <h3 class="personal-tracker-title">🌟 Mein persönlicher Impact</h3>

        <div v-if="!hasPersonalDate" class="personal-tracker-form">
          <p class="personal-tracker-prompt">
            Du lebst schon vegan? Finde heraus, was du bereits bewirkt hast.
          </p>
          <button class="personal-open-btn" @click="openTrackerModal">
            Jetzt eintragen
          </button>
        </div>

        <div v-else class="personal-tracker-result">
          <div class="personal-tracker-header">
            <p class="personal-duration">
              🎉 Du lebst seit <strong>{{ formattedDuration }}</strong> vegan!
            </p>
            <button class="personal-reset" @click="openTrackerModal">
              ändern
            </button>
          </div>

          <div class="personal-impact-cards">
            <div class="personal-impact-card">
              <span class="personal-impact-icon">🐾</span>
              <span class="personal-impact-value personal-impact-value--lives">{{ personalImpact.lives.value }}</span>
              <span class="personal-impact-label">Tierleben gerettet</span>
            </div>
            <div class="personal-impact-card">
              <span class="personal-impact-icon">💧</span>
              <span class="personal-impact-value personal-impact-value--water">{{ personalImpact.water.value }} L</span>
              <span class="personal-impact-label">Wasser gespart</span>
            </div>
            <div class="personal-impact-card">
              <span class="personal-impact-icon">🌿</span>
              <span class="personal-impact-value personal-impact-value--co2">{{ personalImpact.co2.value }} kg</span>
              <span class="personal-impact-label">CO₂ vermieden</span>
            </div>
            <div class="personal-impact-card">
              <span class="personal-impact-icon">🌾</span>
              <span class="personal-impact-value personal-impact-value--land">{{ personalImpact.land.value }} m²</span>
              <span class="personal-impact-label">Land geschont</span>
            </div>
          </div>

          <p class="personal-share-hint">
            Danke, dass du Teil der Veränderung bist. 💚
          </p>

          <div class="personal-share">
            <p class="personal-share-label">Teile deinen Impact:</p>
            <div class="personal-share-buttons">
              <a
                :href="`https://x.com/intent/tweet?text=${encodeURIComponent(personalShareText)}`"
                target="_blank"
                rel="noopener"
                class="personal-share-btn personal-share-btn--x"
                aria-label="Auf X teilen"
              >𝕏</a>
              <a
                :href="`whatsapp://send?text=${encodeURIComponent(personalShareText)}`"
                target="_blank"
                rel="noopener"
                class="personal-share-btn personal-share-btn--wa"
                aria-label="Per WhatsApp teilen"
              >WhatsApp</a>
              <a
                :href="`https://t.me/share/url?url=https%3A%2F%2Fvegan.to&text=${encodeURIComponent(personalShareText)}`"
                target="_blank"
                rel="noopener"
                class="personal-share-btn personal-share-btn--tg"
                aria-label="Per Telegram teilen"
              >Telegram</a>
              <button
                class="personal-share-btn personal-share-btn--copy"
                @click="copyPersonalShare"
              >
                {{ copyLabel }}
              </button>
            </div>
          </div>
        </div>
      </Motion>

      <!-- Tracker modal: native <dialog>, opened via showModal() -->
      <dialog ref="trackerDialog" class="vt-modal" aria-labelledby="vt-modal-title" @mousedown.self="closeTrackerModal">
        <div class="vt-modal-body">
          <button class="vt-modal-close" aria-label="Schließen" @click="closeTrackerModal">&times;</button>
          <div class="vt-modal-emoji" aria-hidden="true">🌱</div>
          <h3 id="vt-modal-title" class="vt-modal-title">Seit wann lebst du vegan?</h3>
          <p class="vt-modal-desc">
            Wähle das Datum, wir rechnen den Rest aus.
          </p>
          <input
            v-model="veganSince"
            type="date"
            class="vt-modal-input"
            autofocus
            :max="todayLocalIso"
          />
          <div class="vt-modal-actions">
            <button
              v-if="hasPersonalDate"
              class="vt-modal-btn vt-modal-btn--reset"
              @click="clearPersonalDate(); closeTrackerModal()"
            >
              Zurücksetzen
            </button>
            <button
              class="vt-modal-btn vt-modal-btn--save"
              :disabled="!hasPersonalDate"
              @click="closeTrackerModal"
            >
              Speichern
            </button>
          </div>
        </div>
      </dialog>
    </div>
  </section>

  <!-- CTA -->
  <section class="cta-section">
    <div class="container">
      <Motion
        tag="h2"
        class="section-title"
        :initial="{ opacity: 0, y: 30 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, type: 'spring' }"
        :inViewOptions="{ once: true }"
      >
        Du kannst etwas verändern.
      </Motion>

      <Motion
        tag="div"
        class="cta-intro"
        :initial="{ opacity: 0, y: 20 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.1 }"
        :inViewOptions="{ once: true }"
      >
        <p class="cta-intro-text">
          Die Zahlen sind erschreckend. Aber du bist nicht machtlos.
          Mit jeder Mahlzeit entscheidest du mit, und jede dieser Entscheidungen kann ein Leben retten.
          Und ehrlich: So einfach wie heute war das noch nie.
        </p>
        <p class="cta-intro-text">
          Pflanzliche Alternativen gibt es inzwischen für <em>alles</em>, im Supermarkt genauso
          wie im Restaurant oder in der Bäckerei um die Ecke. Du verzichtest auf nichts.
          Du entscheidest dich nur anders.
        </p>
      </Motion>

      <!-- Die drei Kernfragen: Warum? Wie? Mit wem? -->
      <Motion
        class="why-how"
        :initial="{ opacity: 0, y: 20 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.1 }"
        :inViewOptions="{ once: true }"
      >
        <a href="https://warum-vegan.com/" target="_blank" rel="noopener" class="why-how-card why-how-card--why">
          <span class="why-how-kicker">Die Frage nach dem Grund</span>
          <span class="why-how-title">Warum vegan?</span>
          <span class="why-how-desc">
            Warum Tiere Rechte haben und was Speziesismus damit zu tun hat.
            Mit Dokus und Texten, die hängen bleiben.
          </span>
          <span class="why-how-domain">warum-vegan.com</span>
        </a>
        <a href="https://wie-vegan.com/" target="_blank" rel="noopener" class="why-how-card why-how-card--how">
          <span class="why-how-kicker">Die Frage nach dem Weg</span>
          <span class="why-how-title">Wie vegan?</span>
          <span class="why-how-desc">
            Der praktische Teil: Was essen, was anziehen, worauf beim Einkauf achten.
            Mit kostenlosen Guides zum Runterladen.
          </span>
          <span class="why-how-domain">wie-vegan.com</span>
        </a>
        <a href="https://vegan-community.de/" target="_blank" rel="noopener" class="why-how-card why-how-card--who">
          <span class="why-how-kicker">Die Frage nach den anderen</span>
          <span class="why-how-title">Mit wem?</span>
          <span class="why-how-desc">
            Eine kostenlose Community mit Chat, Calls und Guides.
            Menschen, die den Weg schon gehen und dich mitnehmen.
          </span>
          <span class="why-how-domain">vegan-community.de</span>
        </a>
      </Motion>

      <!-- Main CTA -->
      <Motion
        tag="a"
        href="https://veganuary.com/de/"
        class="cta-button"
        target="_blank"
        rel="noopener"
        :initial="{ opacity: 0, scale: 0.9 }"
        :whileInView="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }"
        :inViewOptions="{ once: true }"
      >
        <span class="cta-emoji">🐷🐮🐔</span>
        <span class="cta-text">#GoVegan</span>
        <span class="cta-emoji">🐔🐮🐷</span>
      </Motion>

      <!-- Motivation Facts -->
      <Motion
        class="motivation-strip"
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.2 }"
        :inViewOptions="{ once: true }"
      >
        <div class="motivation-fact">
          <span class="motivation-number">365</span>
          <span class="motivation-label">Tage im Jahr, an denen du etwas bewirken kannst</span>
        </div>
        <div class="motivation-fact">
          <span class="motivation-number">3x</span>
          <span class="motivation-label">am Tag entscheidest du, was auf den Teller kommt</span>
        </div>
        <div class="motivation-fact">
          <span class="motivation-number">1</span>
          <span class="motivation-label">Mensch reicht für den Anfang. Du.</span>
        </div>
      </Motion>

      <!-- Resource Grid -->
      <div class="action-grid">
        <!-- Vegan starten -->
        <Motion
          class="action-category"
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :inViewOptions="{ once: true }"
        >
          <h3 class="action-category-title">🌱 Einfach anfangen</h3>
          <p class="action-category-desc">
            Du brauchst keinen perfekten Plan. Fang mit einer Challenge an, da bist du nicht allein.
          </p>
          <div class="action-links">
            <a href="https://veganuary.com/de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Veganuary</span>
              <span class="action-link-desc">31 Tage vegan, mit Rezepten und Leuten, die gerade dasselbe ausprobieren</span>
            </a>
            <a href="https://www.challenge22.com/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Challenge 22</span>
              <span class="action-link-desc">22 Tage mit persönlicher Begleitung, kostenlos</span>
            </a>
            <a href="https://proveg.org/de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">ProVeg</span>
              <span class="action-link-desc">Deutschlands größte Organisation für pflanzliche Ernährung</span>
            </a>
          </div>
        </Motion>

        <!-- Informieren -->
        <Motion
          class="action-category"
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.08 }"
          :inViewOptions="{ once: true }"
        >
          <h3 class="action-category-title">🎬 Augen öffnen</h3>
          <p class="action-category-desc">
            Diese Dokus haben bei vielen Menschen den Blick verändert. Vielleicht auch bei dir.
          </p>
          <div class="action-links">
            <a href="https://www.watchdominion.org/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Dominion</span>
              <span class="action-link-desc">Die Doku über industrielle Tierhaltung. Schwer auszuhalten, aber wichtig.</span>
            </a>
            <a href="https://www.cowspiracy.com/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Cowspiracy</span>
              <span class="action-link-desc">Was Tierhaltung mit Klima, Wasser und Wald macht</span>
            </a>
            <a href="https://www.seaspiracy.org/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Seaspiracy</span>
              <span class="action-link-desc">Was Fischerei mit den Meeren macht</span>
            </a>
            <a href="https://www.vegan.eu/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">vegan.eu</span>
              <span class="action-link-desc">Infoportal mit Fakten und Studien, auf Deutsch</span>
            </a>
            <a href="https://www.vegpool.de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Vegpool</span>
              <span class="action-link-desc">Magazin mit Forum, auf Deutsch</span>
            </a>
          </div>
        </Motion>

        <!-- Aktivismus -->
        <Motion
          class="action-category"
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.16 }"
          :inViewOptions="{ once: true }"
        >
          <h3 class="action-category-title">✊ Stimme erheben</h3>
          <p class="action-category-desc">
            Diese Organisationen arbeiten jeden Tag für die Tiere. Sie freuen sich über jede helfende Hand.
          </p>
          <div class="action-links">
            <a href="https://www.ariwa.org/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">ARIWA</span>
              <span class="action-link-desc">Undercover-Recherchen und vegane Aufklärungsarbeit</span>
            </a>
            <a href="https://albert-schweitzer-stiftung.de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Albert Schweitzer Stiftung</span>
              <span class="action-link-desc">Setzt sich gegen Massentierhaltung ein</span>
            </a>
            <a href="https://animalequality.de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Animal Equality</span>
              <span class="action-link-desc">Internationale Tierrechtsorganisation mit deutschem Team</span>
            </a>
            <a href="https://soko-tierschutz.org/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">SOKO Tierschutz</span>
              <span class="action-link-desc">Verdeckte Ermittlungen in Ställen und Schlachthöfen</span>
            </a>
            <a href="https://www.anonymousforthevoiceless.org/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Anonymous for the Voiceless</span>
              <span class="action-link-desc">Cube of Truth, Straßenaktivismus in deiner Stadt</span>
            </a>
            <a href="https://www.land-der-tiere.de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Land der Tiere</span>
              <span class="action-link-desc">Lebenshof, auf dem du geretteten Tieren begegnen kannst</span>
            </a>
          </div>
        </Motion>

        <!-- Im Alltag -->
        <Motion
          class="action-category"
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.24 }"
          :inViewOptions="{ once: true }"
        >
          <h3 class="action-category-title">🥗 Jeden Tag leben</h3>
          <p class="action-category-desc">
            Vegan im Alltag. Diese Seiten helfen dir dabei.
          </p>
          <div class="action-links">
            <a href="https://www.happycow.net/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">HappyCow</span>
              <span class="action-link-desc">Vegane Restaurants und Cafés in deiner Nähe finden</span>
            </a>
            <a href="https://nutritionfacts.org/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">NutritionFacts</span>
              <span class="action-link-desc">Ernährungsforschung, verständlich aufbereitet und kostenlos</span>
            </a>
            <a href="https://v-partei.de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">V-Partei³</span>
              <span class="action-link-desc">Politisch aktiv werden und vegan wählen</span>
            </a>
            <a href="https://www.tierschutzpartei.de/" target="_blank" rel="noopener" class="action-link">
              <span class="action-link-name">Tierschutzpartei</span>
              <span class="action-link-desc">Partei Mensch Umwelt Tierschutz, die politische Stimme für Tiere</span>
            </a>
          </div>
        </Motion>
      </div>

      <!-- Closing message -->
      <Motion
        tag="p"
        class="cta-closing"
        :initial="{ opacity: 0 }"
        :whileInView="{ opacity: 1 }"
        :transition="{ duration: 0.8, delay: 0.1 }"
        :inViewOptions="{ once: true }"
      >
        Jede Mahlzeit ist eine Chance. Nimm sie.
      </Motion>
    </div>
  </section>

  <!-- Share -->
  <section class="share-section">
    <div class="container">
      <h3 class="section-title section-title--sm">Teile diese Seite</h3>
      <div class="text-center shareLinks">
        <a class="resp-sharing-button__link" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="Auf Facebook teilen"><div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`https://x.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent('https://vegan.to')}`" target="_blank" rel="noopener" aria-label="Auf X teilen"><div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`mailto:?subject=%23GoVegan&body=${encodeURIComponent(shareText())}`" target="_self" rel="noopener" aria-label="Per E-Mail teilen"><div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="Auf LinkedIn teilen"><div class="resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`whatsapp://send?text=${encodeURIComponent(shareText())}`" target="_blank" rel="noopener" aria-label="Per WhatsApp teilen"><div class="resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`https://t.me/share/url?url=https%3A%2F%2Fvegan.to&text=${encodeURIComponent(shareText())}`" target="_blank" rel="noopener" aria-label="Per Telegram teilen"><div class="resp-sharing-button resp-sharing-button--telegram resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z" /></svg></div></div></a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-sources">
        <p class="footer-sources-title">Quellen</p>
        <p class="footer-note">
          Alle Zahlen sind eine Hochrechnung aus den folgenden Quellen. Fische werden amtlich nur in Tonnen erfasst,
          ihre Stückzahl ist deshalb eine gekennzeichnete Schätzung.
        </p>
        <ul class="sources-list">
          <li v-for="source in sourceList" :key="source.url">
            <a :href="source.url" target="_blank" rel="noopener">{{ source.label }}</a>
            <span class="sources-use">{{ source.usedFor }}</span>
          </li>
        </ul>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2020–{{ currentYear }} vegan.to</span>
        <a class="footer-github" href="https://github.com/shroomlife/vegan.to" target="_blank" rel="noopener">
          <img src="/img/GitHub-Mark-32px.png" width="24" height="24" alt="GitHub" />
        </a>
        <span class="footer-version">v{{ appVersion }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── Hero ─────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, #2d1b69, #1a1a4e, #0d3b66, #1b4332);
  background-size: 400% 400%;
  animation: heroGradient 20s ease infinite;
  color: #fff;
  padding: 3rem 1.5rem 2rem;
  text-align: center;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
@keyframes heroGradient {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* ── Floating Emoji Background ────────────────────── */
.hero-emojis {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
/* Soft bleed into the light stats section; bubbles rise out of the haze */
.hero::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: clamp(80px, 14vh, 160px);
  background: linear-gradient(to bottom, rgba(248, 249, 250, 0) 0%, rgba(248, 249, 250, 0.55) 55%, #f8f9fa 100%);
  pointer-events: none;
  z-index: 0;
}
.floating-emoji {
  position: absolute;
  bottom: -3rem;
  opacity: 0;
  animation: floatUp linear infinite;
  filter: grayscale(1);
}
@keyframes floatUp {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  5% {
    opacity: 0.12;
  }
  80% {
    opacity: 0.08;
  }
  100% {
    transform: translateY(-110svh) rotate(20deg);
    opacity: 0;
  }
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}
.hero-label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}
.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto 2rem;
}
.hero-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.hero-counter-number {
  font-size: clamp(2.5rem, 10vw, 5rem);
  font-weight: 700;
  color: #e74c3c;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 60px rgba(231, 76, 60, 0.5), 0 0 120px rgba(231, 76, 60, 0.2);
  animation: pulse-glow 2s ease-in-out infinite alternate;
}
@keyframes pulse-glow {
  from { text-shadow: 0 0 40px rgba(231, 76, 60, 0.4), 0 0 80px rgba(231, 76, 60, 0.1); }
  to   { text-shadow: 0 0 60px rgba(231, 76, 60, 0.6), 0 0 120px rgba(231, 76, 60, 0.25); }
}
.hero-counter-label {
  font-size: 1rem;
  opacity: 0.7;
}
.hero-counter-time {
  font-size: 0.85rem;
  opacity: 0.5;
}
.hero-counter-note {
  display: block;
  font-size: 0.75rem;
  opacity: 0.45;
  margin-top: 0.15rem;
}

/* ── Floating Victim Bubbles ───────────────────────── */
.victim-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.victim-bubble {
  position: absolute;
  bottom: -4rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 50px;
  font-size: clamp(0.8rem, 1.8vw, 0.95rem);
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  animation: bubbleRise linear forwards;
}
.victim-bubble .victim-emoji { font-size: 1.15em; }
.victim-bubble .victim-name { font-weight: 600; color: rgba(255, 255, 255, 0.92); }
.victim-bubble .victim-divider { opacity: 0.25; }
.victim-bubble .victim-meta { opacity: 0.5; font-size: 0.9em; }
.victim-bubble .victim-location { opacity: 0.45; font-size: 0.9em; }

@keyframes bubbleRise {
  0% {
    transform: translateY(0) scale(0.8);
    opacity: 0;
  }
  8% {
    opacity: 0.85;
    transform: translateY(-8svh) scale(1);
  }
  60% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(-115svh) scale(0.9);
    opacity: 0;
  }
}

/* ── Animals Section ──────────────────────────────── */
.animals-section {
  padding: 2rem 0 3rem;
  background: #f8f9fa;
}
.animal-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6c757d;
  border-bottom: 2px solid #dee2e6;
  margin-bottom: 0.5rem;
}
.animal-header-name { flex: 2; }
.animal-header-stat { flex: 1; text-align: right; }
.animal-header-stat--wide { flex: 1.3; }

.animal-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.animal-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.animal-card-main {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  gap: 1rem;
}
.animal-card-name {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.animal-emoji { font-size: 2rem; line-height: 1; }
.animal-label { font-size: 1.15rem; font-weight: 600; }
.animal-estimate {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: #fff3cd;
  color: #856404;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  vertical-align: middle;
  cursor: help;
}
.animal-card-stats {
  flex: 3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.animal-stat {
  flex: 1;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.animal-stat--wide { flex: 1.3; }
.animal-stat-label {
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.animal-stat-value {
  font-weight: 700;
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
}
.animal-stat-value--danger { color: #e74c3c; }

@media (min-width: 768px) {
  .animal-stat { justify-content: flex-end; }
}

.animal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem 0.75rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.animal-card-since { color: #6c757d; font-size: 0.85rem; }
.text-killed { color: #e74c3c; font-weight: 700; }
.btn-children {
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #6c757d;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.btn-children:hover { background: #f1f3f5; border-color: #adb5bd; color: #333; }
.animal-card-emojis {
  padding: 0 1.25rem 0.75rem;
  font-size: 0.85rem;
  line-height: 1.8;
  word-break: break-all;
}
.animal-card-emojis-more {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
}
.animal-children { border-top: 1px solid #f1f3f5; background: #fafbfc; }
.animal-child {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem 0.5rem 2.5rem;
  font-size: 0.9rem;
  color: #495057;
}
.animal-child-name { flex: 2; }
.animal-child-stat { flex: 1; text-align: right; font-variant-numeric: tabular-nums; }
.animal-child-stat--wide { flex: 1.3; }

/* ── Live Death Summary ────────────────────────────── */
.emoji-section {
  padding: 3rem 1rem;
  text-align: center;
  background: #fff;
}
.section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; }
.section-title--sm { font-size: 1.25rem; }
.emoji-section-sub {
  font-size: 1rem;
  color: #6c757d;
  margin-bottom: 1.25rem;
}
.emoji-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  max-width: 700px;
  margin: 0 auto;
}
.emoji-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: #1b1b3a;
  color: #fff;
  padding: 0.45rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
}
.emoji-badge strong {
  font-variant-numeric: tabular-nums;
}
.emoji-total {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #e74c3c;
}

/* ── CTA ──────────────────────────────────────────── */
.cta-section {
  padding: 3rem 1rem;
  background: linear-gradient(180deg, #f0f9ff 0%, #f8f9fa 30%, #f0fdf4 100%);
}
.why-how {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  max-width: 960px;
  margin: 0 auto 2.5rem;
}
.why-how-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1.5rem;
  border-radius: 14px;
  background: #fff;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: inherit;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.why-how-card:hover,
.why-how-card:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  color: inherit;
  text-decoration: none;
}
.why-how-card--why:hover,
.why-how-card--why:focus-visible { border-color: #e74c3c; }
.why-how-card--how:hover,
.why-how-card--how:focus-visible { border-color: #2ecc71; }
.why-how-card--who:hover,
.why-how-card--who:focus-visible { border-color: #2980b9; }
.why-how-kicker {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6c757d;
}
.why-how-title {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.2;
}
.why-how-card--why .why-how-title { color: #e74c3c; }
.why-how-card--how .why-how-title { color: #2d6a4f; }
.why-how-card--who .why-how-title { color: #1f5f8b; }
.why-how-desc {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #495057;
}
.why-how-domain {
  margin-top: auto;
  padding-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
}
.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
  border-radius: 16px;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 30px rgba(46, 204, 113, 0.3);
  transition: all 0.3s;
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(46, 204, 113, 0.4);
  color: #fff;
  text-decoration: none;
}
.cta-emoji { font-size: 0.7em; opacity: 0; transition: opacity 0.3s; }
.cta-button:hover .cta-emoji { opacity: 1; }
@media (max-width: 767px) {
  .cta-button { padding: 1.5rem; }
  .cta-emoji { display: none; }
}

/* ── Vegan Growth — Full Width ─────────────────────── */
.growth-section {
  padding: 3rem 0;
  background: #1b2a1b;
  color: #fff;
}
.growth-inner {
  max-width: 100%;
  padding: 0 1.5rem;
}
.growth-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
}
.growth-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.growth-stat {
  text-align: center;
}
.growth-stat-number {
  display: block;
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  opacity: 0.5;
}
.growth-stat-number--green {
  color: #2ecc71;
  opacity: 1;
}
.growth-stat-label {
  display: block;
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 0.25rem;
}

/* Progress bar — full viewport width */
.growth-progress {
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
}
.growth-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #27ae60, #1abc9c);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.75rem;
  min-width: 60px;
  transition: width 0.5s ease-out;
  box-shadow: 0 0 20px rgba(46, 204, 113, 0.4);
  position: relative;
}
.growth-progress-fill::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2));
  border-radius: 0 24px 24px 0;
  animation: progressShimmer 2s infinite;
}
@keyframes progressShimmer {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
.growth-progress-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  z-index: 1;
}
.growth-message {
  text-align: center;
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.8;
  max-width: 520px;
  margin: 0 auto 1rem;
  line-height: 1.6;
}
.growth-source {
  text-align: center;
  font-size: 0.7rem;
  opacity: 0.3;
}

/* ── Impact Timeline ──────────────────────────────── */
.impact-section {
  padding: 3.5rem 1rem;
  background: linear-gradient(180deg, #f0fdf4 0%, #ecfdf5 40%, #f0f9ff 100%);
}
.impact-subtitle {
  text-align: center;
  font-size: 1.05rem;
  color: #6c757d;
  margin-bottom: 2rem;
}
.impact-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 2rem;
}
.impact-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.6rem 0.9rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 72px;
}
.impact-tab:hover {
  border-color: #2ecc71;
  background: #f0fdf4;
}
.impact-tab--active {
  border-color: #2ecc71;
  background: #2ecc71;
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
  transform: translateY(-2px);
}
.impact-tab-emoji {
  font-size: 1.2rem;
  line-height: 1;
}
.impact-tab-label {
  font-size: 0.7rem;
  font-weight: 600;
  white-space: nowrap;
}

.impact-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 640px;
  margin: 0 auto;
}
.impact-card {
  display: flex;
  flex-direction: column;
  padding: 1.75rem 2rem;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 5px solid transparent;
}
.impact-card:hover {
  transform: translateX(4px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}
.impact-card--lives { border-left-color: #e74c3c; }
.impact-card--water { border-left-color: #3498db; }
.impact-card--co2   { border-left-color: #2ecc71; }
.impact-card--land  { border-left-color: #f39c12; }

.impact-card-head {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.impact-card-icon {
  font-size: 2.5rem;
  line-height: 1;
  flex-shrink: 0;
}
.impact-card-value {
  display: block;
  font-size: clamp(1.75rem, 5vw, 2.25rem);
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.impact-card--lives .impact-card-value { color: #e74c3c; }
.impact-card--water .impact-card-value { color: #3498db; }
.impact-card--co2 .impact-card-value   { color: #2ecc71; }
.impact-card--land .impact-card-value  { color: #f39c12; }

.impact-card-label {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  font-weight: 500;
  margin-top: 0.1rem;
}
.impact-card-comparisons {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f3f5;
}
.impact-card-comparisons li {
  font-size: 0.82rem;
  color: #495057;
  line-height: 1.4;
  padding-left: 1.2rem;
  position: relative;
}
.impact-card-comparisons li::before {
  content: '≈';
  position: absolute;
  left: 0;
  color: #adb5bd;
  font-weight: 700;
}
.impact-source {
  text-align: center;
  font-size: 0.75rem;
  color: #adb5bd;
  margin-top: 1.5rem;
}

/* ── Personal Tracker ─────────────────────────────── */
.personal-tracker {
  margin-top: 2.5rem;
  padding: 2rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  border: 2px solid #e9ecef;
}
.personal-tracker-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}
.personal-tracker-prompt {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 1.25rem;
}
.personal-open-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
}
.personal-open-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4);
}

.personal-tracker-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}
.personal-duration {
  font-size: 1.1rem;
  margin: 0;
}
.personal-duration strong {
  color: #2ecc71;
}
.personal-reset {
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.2rem 0.6rem;
  font-size: 0.75rem;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.15s;
}
.personal-reset:hover {
  background: #f1f3f5;
  color: #333;
}

.personal-impact-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}
@media (min-width: 480px) {
  .personal-impact-cards {
    grid-template-columns: repeat(4, 1fr);
  }
}
.personal-impact-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 0.5rem;
  border-radius: 12px;
  background: #f8f9fa;
}
.personal-impact-icon {
  font-size: 1.5rem;
  margin-bottom: 0.3rem;
}
.personal-impact-value {
  font-size: 1.15rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  line-height: 1.2;
}
.personal-impact-value--lives { color: #e74c3c; }
.personal-impact-value--water { color: #3498db; }
.personal-impact-value--co2   { color: #2ecc71; }
.personal-impact-value--land  { color: #f39c12; }
.personal-impact-label {
  font-size: 0.7rem;
  color: #6c757d;
  margin-top: 0.15rem;
}
.personal-share-hint {
  font-size: 0.9rem;
  color: #2d6a4f;
  margin-top: 0.5rem;
  font-weight: 500;
}
.personal-share {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f3f5;
}
.personal-share-label {
  font-size: 0.8rem;
  color: #6c757d;
  margin-bottom: 0.6rem;
}
.personal-share-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.personal-share-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  text-decoration: none;
  border: none;
  cursor: pointer;
  color: #fff;
  transition: all 0.15s;
}
.personal-share-btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
  color: #fff;
  text-decoration: none;
}
.personal-share-btn--x { background: #000; }
.personal-share-btn--wa { background: #25d366; }
.personal-share-btn--tg { background: #54a9eb; }
.personal-share-btn--copy { background: #6c757d; }

/* ── CTA Intro & Closing ──────────────────────────── */
.cta-intro {
  max-width: 680px;
  margin: 0 auto 2rem;
  text-align: center;
}
.cta-intro-text {
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  line-height: 1.7;
  color: #495057;
  margin-bottom: 0.75rem;
}
.cta-intro-text strong {
  color: #2d6a4f;
}
.cta-intro-text em {
  font-style: normal;
  text-decoration: underline;
  text-decoration-color: #2ecc71;
  text-underline-offset: 3px;
}
.cta-closing {
  text-align: center;
  font-size: 1.15rem;
  font-weight: 600;
  color: #2d6a4f;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #e9ecef;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* ── Motivation Strip ─────────────────────────────── */
.motivation-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem auto 2.5rem;
  max-width: 720px;
}
.motivation-fact {
  text-align: center;
  padding: 1.25rem 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.motivation-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2ecc71;
  line-height: 1;
  margin-bottom: 0.5rem;
}
.motivation-label {
  display: block;
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.4;
}

/* ── Action Grid ──────────────────────────────────── */
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.25rem;
  margin-top: 2.5rem;
}
.action-category {
  background: #fff;
  border-radius: 14px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
.action-category-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.action-category-desc {
  font-size: 0.85rem;
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f3f5;
}
.action-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.action-link {
  display: block;
  padding: 0.65rem 0.85rem;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: background 0.15s, transform 0.15s;
}
.action-link:hover {
  background: #f0fdf4;
  transform: translateX(4px);
  text-decoration: none;
  color: inherit;
}
.action-link-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: #2d6a4f;
}
.action-link-desc {
  display: block;
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 0.15rem;
  line-height: 1.3;
}

/* ── Share ─────────────────────────────────────────── */
.share-section {
  padding: 2.5rem 1rem;
  text-align: center;
  background: linear-gradient(180deg, #f0fdf4 0%, #f8f9fa 100%);
}

/* ── Footer ───────────────────────────────────────── */
.site-footer {
  background: #1b1b3a;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem 1rem;
  font-size: 0.85rem;
}
.site-footer a { color: rgba(255, 255, 255, 0.5); text-decoration: underline; text-decoration-color: rgba(255, 255, 255, 0.2); }
.site-footer a:hover { color: #fff; }
.footer-sources { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.footer-sources-title { font-weight: 700; color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem; }
.footer-note { font-size: 0.8rem; opacity: 0.5; margin-top: 0.5rem; max-width: 640px; margin-left: auto; margin-right: auto; }
.footer-note a { color: inherit; text-decoration: underline; }
.sources-list {
  list-style: none;
  padding: 0;
  margin: 1rem auto 0;
  max-width: 900px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 0.5rem 1.5rem;
  text-align: left;
  font-size: 0.78rem;
  line-height: 1.4;
}
.sources-list li {
  padding-left: 0.75rem;
  border-left: 2px solid rgba(255, 255, 255, 0.12);
}
.sources-list a {
  color: rgba(255, 255, 255, 0.75);
  text-decoration-color: rgba(255, 255, 255, 0.25);
  overflow-wrap: anywhere;
}
.sources-use {
  display: block;
  opacity: 0.45;
  font-size: 0.72rem;
}
.growth-source a,
.impact-source a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.footer-bottom { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
.footer-github { opacity: 0.4; transition: opacity 0.2s; }
.footer-github:hover { opacity: 0.8; }
.footer-github img { filter: invert(1); }
.footer-version { opacity: 0.4; font-size: 0.75rem; }

/* ── Modal (inline, scoped) ───────────────────────── */
.vt-modal {
  /* Native <dialog>: the UA centers it in the top layer, we only style the card */
  border: none;
  padding: 0;
  background: #fff;
  border-radius: 24px;
  max-width: 400px;
  width: calc(100% - 2rem);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.vt-modal[open] {
  animation: modalSlideIn 0.3s ease;
}
.vt-modal::backdrop {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.2s ease;
}
.vt-modal-body {
  position: relative;
  padding: 2.5rem 2rem 2rem;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.vt-modal-close {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #ccc;
  cursor: pointer;
  line-height: 1;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.15s;
}
.vt-modal-close:hover {
  background: #f1f3f5;
  color: #333;
}
.vt-modal-emoji {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}
.vt-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.vt-modal-desc {
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}
.vt-modal-input {
  display: block;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  font-size: 1.1rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: #f8f9fa;
  width: 100%;
  max-width: 240px;
  text-align: center;
}
.vt-modal-input:focus {
  border-color: #2ecc71;
  box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.15);
}
.vt-modal-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.vt-modal-btn {
  padding: 0.65rem 1.75rem;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}
.vt-modal-btn--save {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
  box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3);
}
.vt-modal-btn--save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(46, 204, 113, 0.4);
}
.vt-modal-btn--save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.vt-modal-btn--reset {
  background: #f8f9fa;
  color: #e74c3c;
}
.vt-modal-btn--reset:hover {
  background: #fff5f5;
}

/* ══════════════════════════════════════════════════════
   MOBILE POLISH: max-width: 767px
   ══════════════════════════════════════════════════════ */
@media (max-width: 767px) {
  /* Hero */
  .hero {
    padding: 2rem 1rem 1.5rem;
  }
  .hero-counter-number {
    font-size: clamp(2rem, 12vw, 3rem);
  }
  .hero-title,
  .hero-subtitle,
  .hero-counter {
    text-shadow: 0 2px 14px rgba(0, 0, 0, 0.45);
  }
  .victim-ticker {
    height: 100px;
  }
  .victim-bubble {
    font-size: 0.7rem;
    padding: 0.3rem 0.65rem;
  }

  /* Animal cards: name on top, then a key/value list instead of three columns */
  .animals-section {
    padding: 1.25rem 0 2rem;
  }
  .animal-card {
    border-radius: 10px;
    margin-bottom: 0.5rem;
  }
  .animal-card-main {
    flex-direction: column;
    align-items: stretch;
    padding: 0.85rem 1rem 0.25rem;
    gap: 0.5rem;
  }
  .animal-emoji {
    font-size: 1.6rem;
  }
  .animal-label {
    font-size: 1.05rem;
  }
  .animal-card-stats {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .animal-stat,
  .animal-stat--wide {
    flex: none;
    justify-content: space-between;
    padding: 0.45rem 0;
    border-top: 1px solid #f1f3f5;
  }
  .animal-stat-label {
    font-size: 0.68rem;
  }
  .animal-stat-value {
    font-size: 1rem;
    white-space: nowrap;
  }
  .animal-card-footer {
    padding: 0.5rem 1rem 0.6rem;
  }
  .animal-card-emojis {
    padding: 0 1rem 0.6rem;
    font-size: 0.75rem;
  }
  /* Sub groups: name on its own line, the three values with tiny labels below */
  .animal-children {
    font-size: 0.85rem;
  }
  .animal-child {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.15rem 0.75rem;
    padding: 0.6rem 1rem;
    border-top: 1px solid #f1f3f5;
  }
  .animal-child-name {
    grid-column: 1 / -1;
    font-weight: 600;
    color: #343a40;
  }
  .animal-child-stat,
  .animal-child-stat--wide {
    flex: none;
    text-align: left;
  }
  .animal-child-stat::before {
    content: attr(data-label);
    display: block;
    font-size: 0.6rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #6c757d;
  }
  .animal-child-stat--wide {
    text-align: right;
  }

  /* Emoji summary */
  .emoji-section {
    padding: 2rem 0.75rem;
  }
  .emoji-badge {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }

  /* Growth section */
  .growth-section {
    padding: 2rem 0;
  }
  .growth-inner {
    padding: 0 1rem;
  }
  .growth-stats {
    gap: 1.5rem;
  }
  .growth-stat-number {
    font-size: clamp(1.2rem, 6vw, 2rem);
  }
  .growth-progress {
    height: 36px;
    border-radius: 18px;
  }
  .growth-progress-fill {
    border-radius: 18px;
    min-width: 50px;
  }
  .growth-progress-label {
    font-size: 0.7rem;
  }

  /* Impact timeline */
  .impact-section {
    padding: 2rem 0.75rem;
  }
  .impact-tabs {
    gap: 0.3rem;
  }
  .impact-tab {
    flex: 1 1 22%;
    padding: 0.4rem 0.4rem;
    min-width: 0;
    border-radius: 10px;
  }
  .impact-tab-emoji {
    font-size: 1rem;
  }
  .impact-tab-label {
    font-size: 0.6rem;
  }
  .impact-card {
    padding: 1.25rem 1.25rem;
    border-radius: 14px;
  }
  .impact-card-icon {
    font-size: 2rem;
  }
  .impact-card-value {
    font-size: 1.5rem;
  }
  .impact-card-comparisons li {
    font-size: 0.78rem;
  }

  /* Personal tracker */
  .personal-tracker {
    padding: 1.5rem 1.25rem;
    border-radius: 14px;
  }
  .personal-impact-cards {
    gap: 0.5rem;
  }
  .personal-share-buttons {
    gap: 0.35rem;
  }
  .personal-share-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.75rem;
  }

  /* CTA section */
  .cta-section {
    padding: 2rem 0.75rem;
  }
  .cta-intro-text {
    font-size: 0.95rem;
  }
  .motivation-strip {
    gap: 0.6rem;
    margin: 1.5rem auto 2rem;
  }
  .motivation-fact {
    padding: 1rem 0.75rem;
  }
  .motivation-number {
    font-size: 2rem;
  }
  .motivation-label {
    font-size: 0.78rem;
  }
  .action-grid {
    gap: 1rem;
    margin-top: 2rem;
  }
  .action-category {
    padding: 1.25rem;
    border-radius: 12px;
  }
  .cta-closing {
    font-size: 1rem;
    margin-top: 2rem;
    padding-top: 1.5rem;
  }

  /* Share */
  .share-section {
    padding: 2rem 0.75rem;
  }

  /* Footer */
  .site-footer {
    padding: 1.5rem 0.75rem;
  }
  .footer-bottom {
    gap: 1rem;
    font-size: 0.8rem;
  }

  /* Modal */
  .vt-modal {
    border-radius: 18px;
  }
  .vt-modal-body {
    padding: 2rem 1.5rem 1.5rem;
  }
  .vt-modal-emoji {
    font-size: 2.5rem;
  }
  .vt-modal-title {
    font-size: 1.1rem;
  }

  /* Section titles */
  .section-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  .section-title--sm {
    font-size: 1.1rem;
  }
}
</style>

