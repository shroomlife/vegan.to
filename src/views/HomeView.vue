<script setup lang="ts">
import { ref, computed, useTemplateRef, watch } from 'vue'
import dayjs from 'dayjs'
import { useTransition, TransitionPresets, useElementVisibility } from '@vueuse/core'
import { Motion } from 'motion-v'
import { type ComputedAnimal } from '@/composables/useAnimalData'
import { useLiveState } from '@/composables/useLiveState'
import { animals } from '@/data/animals'
import { sources } from '@/data/sources'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'
import { formatNumber } from '@/utils/formatNumber'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import OdometerNumber from '@/components/OdometerNumber.vue'
import GrowthTimeline from '@/components/GrowthTimeline.vue'
import HeroSky from '@/components/HeroSky.vue'
import VictimCard from '@/components/VictimCard.vue'
import SpeciesFactsChapter from '@/components/SpeciesFactsChapter.vue'
import LifeFactsChapter from '@/components/LifeFactsChapter.vue'
import FaqChapter from '@/components/FaqChapter.vue'
import ImpactChapter from '@/components/ImpactChapter.vue'
import ActionChapter from '@/components/ActionChapter.vue'

const { timer, animalData, totalDeathCount, victims, latest, heroVisible } = useLiveState()
const { onNavClick } = useAnchorNavigation()

/** All species together, per second of the current year (rounded for the caption) */
const deathsPerSecond = computed(() => {
  const perYear = animals.reduce((sum, a) => sum + a.deaths.year, 0)
  return Math.round(perYear / timer.secondsInCurrentYear.value)
})

/** Species below this daily figure get no emoji strip, their first emoji would take hours */
const WALL_MIN_PER_DAY = 500
/** Species above this daily figure get a double-width card in the grid */
const WIDE_MIN_PER_DAY = 50_000

// The header pill and the mobile pill appear once the hero has scrolled away
const heroRef = useTemplateRef<HTMLElement>('hero')
const heroInView = useElementVisibility(heroRef)
watch(heroInView, (visible) => { heroVisible.value = visible }, { immediate: true })

const leftLane = computed(() => victims.value.filter((v) => v.lane === 'left'))
const rightLane = computed(() => victims.value.filter((v) => v.lane === 'right'))
/** The three most recent cards, newest first, for the "Wer sie waren" chapter */
const recentVictims = computed(() => [...victims.value].slice(-3).reverse())

const POPULATION_DE = 83_500_000 // Destatis, Bevölkerungsstand Ende 2025

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

const shareText = () =>
  `In nur ${timer.elapsedFormatted.value} in denen ich auf https://vegan.to war, sind in #Deutschland schon ${totalDeathCount.value} Tiere ermordet worden...\n\n#GoVegan\n#StopEatingAnimals\n#PostmeatGeneration\n\n🐷🐮🐔`
</script>

<template>
  <!-- Hero: a sky of lights, one per animal, and cards with names in two lanes -->
  <section ref="hero" class="hero">
    <div class="hero-grid" aria-hidden="true"></div>
    <HeroSky :count="totalDeathCount" />
    <div class="hero-vignette" aria-hidden="true"></div>

    <div class="victim-lane victim-lane--left" aria-hidden="true">
      <VictimCard
        v-for="victim in leftLane"
        :key="victim.id"
        :victim="victim"
        :hot="victim.id === latest.id"
        class="victim-rise"
        :style="{
          left: victim.left,
          animationDuration: victim.duration + 's',
          animationDelay: victim.startOffset ? victim.startOffset + 's' : '0s',
        }"
      />
    </div>
    <div class="victim-lane victim-lane--right" aria-hidden="true">
      <VictimCard
        v-for="victim in rightLane"
        :key="victim.id"
        :victim="victim"
        :hot="victim.id === latest.id"
        class="victim-rise"
        :style="{
          left: victim.left,
          animationDuration: victim.duration + 's',
          animationDelay: victim.startOffset ? victim.startOffset + 's' : '0s',
        }"
      />
    </div>

    <div class="hero-inner">
      <!-- One heading: the kicker names the topic for search, the line below carries the feeling -->
      <Motion
        as="h1"
        class="hero-title"
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.1 }"
      >
        <span class="hero-label">Live-Zähler: Tiere, die in Deutschland für unser Essen sterben</span>
        <span class="hero-title-line">Sie hatten Namen.</span>
      </Motion>

      <Motion
        as="p"
        class="hero-subtitle"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.3 }"
      >
        Jedes Licht ist ein Tier, das gestorben ist, seit du hier bist. Der Himmel füllt sich, solange du bleibst.
      </Motion>

      <!-- Live Counter -->
      <Motion
        class="hero-counter"
        :initial="{ opacity: 0, scale: 0.8 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }"
      >
        <span class="hero-counter-ring" aria-hidden="true"></span>
        <span class="hero-counter-number">{{ formatNumber(animatedTotalDeaths) }}</span>
        <span class="hero-counter-label">Tiere getötet, seit du hier bist</span>
        <RouterLink to="/quellen#methodik" class="hero-counter-note">{{ deathsPerSecond }} in jeder Sekunde &middot; Fische geschätzt</RouterLink>
        <span class="hero-counter-time">🕰 {{ timer.elapsedFormatted.value }}</span>
      </Motion>
    </div>

    <a href="#wer" class="hero-scroll" @click.prevent="onNavClick('/#wer')">
      <span>Wer sie waren</span>
      <span class="hero-scroll-line" aria-hidden="true"></span>
    </a>
  </section>

  <!-- Sheet: light surface sliding over the hero -->
  <section id="wer" class="sheet">
    <div class="container">
      <span class="chapter">Kapitel 1 &middot; Wer sie waren</span>
      <p class="live-sentence">
        Während du diesen Satz liest, sind
        <span class="live-number"><AnimatedNumber :value="totalDeathCount" /></span>
        Tiere gestorben. Eins davon hieß
        <span class="live-name">{{ latest.name }}</span>.
      </p>
      <p class="chapter-lead">
        Die Zahlen im Text laufen live, sie sind keine Beispiele. Die Namen stehen stellvertretend,
        das Alter entspricht der üblichen Schlachtreife, die Lebenserwartung dem, was diese Tiere ohne uns hätten.
      </p>
      <div class="recent-grid">
        <VictimCard
          v-for="(victim, index) in recentVictims"
          :key="victim.id"
          :victim="victim"
          variant="light"
          :hot="index === 0"
        />
      </div>
    </div>
  </section>

  <!-- Animal Data -->
  <section id="zahlen" class="animals-section">
    <div class="container">
      <span class="chapter">Kapitel 2 &middot; Wie viele</span>
      <div class="section-head">
        <h2 class="section-title section-title--left">Heute in Deutschland</h2>
        <span class="section-note">Jedes Emoji ein Tier, seit du hier bist. Destatis 2025.</span>
      </div>

      <div class="animal-grid">
        <Motion
          v-for="(animal, index) in animalData"
          :key="animal.names.single"
          class="animal-card"
          :class="{
            'animal-card--wide': animal.perDay >= WIDE_MIN_PER_DAY,
            'animal-card--estimate': animal.estimate,
            'animal-card--small': animal.perDay < WALL_MIN_PER_DAY,
          }"
          :initial="{ opacity: 0, y: 40 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: index * 0.05 }"
          :inViewOptions="{ once: true, amount: 0.2 }"
        >
          <div class="animal-card-main">
            <div class="animal-card-name">
              <span class="animal-emoji">{{ animal.names.emoji }}</span>
              <span class="animal-label">{{ animal.names.plural }}</span>
              <RouterLink
                v-if="animal.estimate"
                to="/quellen#methodik"
                class="animal-estimate"
                :title="animal.estimate.note"
              >Schätzung</RouterLink>
            </div>
            <div class="animal-card-stats">
              <div class="animal-stat">
                <span class="animal-stat-label">heute</span>
                <span class="animal-stat-value animal-stat-value--danger"><template v-if="animal.estimate">≈ </template><AnimatedNumber :value="animal.currentDay" /></span>
              </div>
              <div class="animal-stat">
                <span class="animal-stat-label">pro Tag</span>
                <span class="animal-stat-value">{{ animal.estimate ? '≈ ' : '' }}{{ formatNumber(animal.perDay) }}</span>
              </div>
              <div class="animal-stat">
                <span class="animal-stat-label">dieses Jahr</span>
                <span class="animal-stat-value animal-stat-value--danger"><template v-if="animal.estimate">≈ </template><AnimatedNumber :value="animal.currentYear" /></span>
              </div>
            </div>
          </div>

          <div class="animal-card-footer">
            <div class="animal-card-since">
              <small v-if="animal.killedSinceStart > 0">
                Seit du da bist {{ animal.killedSinceStart > 1 ? 'wurden' : 'wurde' }}
                <span class="text-killed">{{ animal.killedSinceStart }} {{ animal.getNameByCount(animal.killedSinceStart) }}</span>
                getötet...
              </small>
              <small v-else>Seit du da bist: noch keins.</small>
            </div>
            <button
              v-if="animal.children.length > 0"
              class="btn-children"
              :aria-expanded="isChildViewOpen(animal)"
              @click="toggleChildView(animal)"
            >
              {{ isChildViewOpen(animal) ? 'ausblenden' : 'Untergruppen' }}
            </button>
          </div>

          <div v-if="animal.perDay >= WALL_MIN_PER_DAY" class="animal-card-emojis">
            <div class="animal-card-emojis-wall" aria-hidden="true">{{ animal.killedSinceStartEmojis }}</div>
            <span class="animal-card-emojis-more">
              <template v-if="animal.killedSinceStartHidden > 0">+ {{ formatNumber(animal.killedSinceStartHidden) }} weitere</template>
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
    </div>
  </section>

  <SpeciesFactsChapter />
  <LifeFactsChapter />

  <!-- Live Death Counter Summary -->
  <Motion
    as="section"
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
      <span class="chapter chapter--center chapter--on-dark">Kapitel 5 &middot; Die anderen</span>
      <Motion
        as="h2"
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
        as="p"
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

  <ImpactChapter />

  <FaqChapter />

  <ActionChapter />

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

</template>

<style scoped>
/* ── Hero ─────────────────────────────────────────── */
.hero {
  background: var(--brand-night);
  color: var(--brand-cream);
  padding: 3rem 1.5rem 6rem;
  text-align: center;
  min-height: calc(100svh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}
/* One tone of dark green: a fine dot grid for depth, a vignette at the edges */
.hero-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgba(246, 241, 231, 0.06) 1px, transparent 1.2px);
  background-size: 26px 26px;
  background-position: 13px 13px;
  pointer-events: none;
}
.hero-vignette {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(720px 420px at 50% 40%, rgba(63, 120, 82, 0.26) 0%, rgba(63, 120, 82, 0) 70%),
    radial-gradient(1100px 760px at 50% 50%, rgba(14, 33, 20, 0) 55%, rgba(6, 15, 9, 0.75) 100%);
  pointer-events: none;
}
/* Two lanes for the cards, the middle stays free for text and counter */
.victim-lane {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 26%;
  pointer-events: none;
}
.victim-lane--left { left: 2%; }
.victim-lane--right { right: 2%; }
.victim-rise {
  position: absolute;
  bottom: -160px;
  animation: cardRise linear forwards;
}
@keyframes cardRise {
  0%   { transform: translateY(0); opacity: 0; }
  8%   { opacity: 1; }
  85%  { opacity: 1; }
  100% { transform: translateY(calc(-100vh - 200px)); opacity: 0; }
}
.hero-scroll {
  position: absolute;
  left: 50%;
  bottom: 28px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.45);
  text-decoration: none;
  z-index: 1;
}
.hero-scroll:hover,
.hero-scroll:focus-visible {
  color: var(--brand-cream);
  text-decoration: none;
}
.hero-scroll-line {
  width: 1px;
  height: 26px;
  background: rgba(246, 241, 231, 0.3);
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}
.hero-label {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.7rem;
  font-weight: 700;
  font-family: 'Lato', sans-serif;
  color: var(--brand-accent);
  margin-bottom: 0.75rem;
}
.hero-title-line {
  display: block;
}
.hero-title {
  font-family: var(--font-display);
  letter-spacing: -0.03em;
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
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.hero-counter > * { position: relative; }
.hero-counter-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -56%);
  border-radius: 50%;
  border: 1px solid rgba(255, 106, 61, 0.18);
  box-shadow: 0 0 0 28px rgba(255, 106, 61, 0.04), 0 0 0 56px rgba(255, 106, 61, 0.02);
  animation: heartbeat 1s ease-in-out infinite;
  pointer-events: none;
}
@keyframes heartbeat {
  0%, 100% { transform: translate(-50%, -56%) scale(1); }
  50% { transform: translate(-50%, -56%) scale(1.03); }
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
  opacity: 0.55;
  margin-top: 0.15rem;
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(246, 241, 231, 0.4);
  text-underline-offset: 3px;
}
.hero-counter-note:hover,
.hero-counter-note:focus-visible {
  color: inherit;
  opacity: 0.9;
}

/* ── Sheet & chapters ─────────────────────────────── */
.sheet {
  position: relative;
  z-index: 1;
  margin-top: -56px;
  background: var(--brand-cream);
  border-radius: 36px 36px 0 0;
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.35);
  padding: 2.75rem 0 2.5rem;
}
.sheet::before {
  content: '';
  display: block;
  width: 44px;
  height: 4px;
  border-radius: 2px;
  background: rgba(20, 54, 31, 0.15);
  margin: -1.25rem auto 1.5rem;
}
.live-sentence {
  margin: 0 0 0.9rem;
  max-width: 820px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.25rem, 2.6vw, 1.9rem);
  letter-spacing: -0.025em;
  line-height: 1.3;
  color: var(--brand-green);
}
.live-number,
.live-name {
  display: inline-block;
  padding: 0 0.15em;
  border-bottom: 2px solid rgba(231, 76, 60, 0.35);
  color: #e74c3c;
  font-variant-numeric: tabular-nums;
}
.live-name {
  color: var(--brand-green);
  border-color: rgba(20, 54, 31, 0.3);
}
.chapter-lead {
  margin: 0 0 1.5rem;
  max-width: 640px;
  font-size: 1rem;
  line-height: 1.65;
  color: #4a5a4f;
}
.recent-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
}
.section-title--left {
  text-align: left;
  margin-bottom: 0;
  font-family: var(--font-display);
  font-size: 1.5rem;
  letter-spacing: -0.025em;
}
.section-note {
  font-size: 0.8rem;
  color: #8d8474;
}

/* ── Animals Section ──────────────────────────────── */
.animal-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}
.animal-card--wide { grid-column: span 2; }
.animal-card--estimate {
  grid-column: 1 / -1;
  border: 1.5px dashed rgba(133, 100, 4, 0.35);
}
/* Sits above the sheet's shadow so the two cream surfaces read as one */
.animals-section {
  position: relative;
  z-index: 2;
  padding: 1rem 0 3rem;
  background: var(--brand-cream);
}

.animal-card {
  background: #fff;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.animal-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.animal-card-main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1.1rem 1.25rem 0.25rem;
  gap: 0.5rem;
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
  text-decoration: none;
}
.animal-estimate:hover,
.animal-estimate:focus-visible {
  background: #ffe8a3;
  color: #6b4a00;
  text-decoration: none;
}
.animal-card-stats {
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.animal-stat {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.45rem 0;
  border-top: 1px solid #f1f3f5;
}
.animal-stat-label {
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.animal-stat-value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.animal-stat-value--danger { color: #e74c3c; }



.animal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2.5rem;
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
}
/* Exactly two rows, always the same height: no layout shift while it fills */
.animal-card-emojis-wall {
  height: 3.6em;
  overflow: hidden;
  line-height: 1.8;
  word-break: break-all;
}
.animal-card-emojis-more {
  display: block;
  min-height: 1.2rem;
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
  min-height: 5.5rem;
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

/* ── Vegan Growth — Full Width ─────────────────────── */
.growth-section {
  padding: 3rem 0;
  background: var(--brand-night);
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
  text-wrap: balance;
}

/* ── Share ─────────────────────────────────────────── */
.share-section {
  padding: 2.5rem 1rem;
  text-align: center;
  background: var(--brand-cream);
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
  /* Animal cards: one column on phones */
  .animals-section {
    padding: 0.5rem 0 2rem;
  }
  .animal-grid {
    grid-template-columns: 1fr;
  }
  .animal-card--wide,
  .animal-card--estimate {
    grid-column: auto;
  }
  .animal-card {
    border-radius: 16px;
  }
  .animal-card-main {
    padding: 0.85rem 1rem 0.25rem;
  }
  .recent-grid {
    grid-template-columns: 1fr;
  }
  .sheet {
    margin-top: -40px;
    border-radius: 28px 28px 0 0;
    padding-top: 2.25rem;
  }
  .victim-lane {
    width: 48%;
  }
  .victim-lane .victim-card {
    width: 176px;
  }
  .hero-scroll {
    display: none;
  }
  .animal-emoji {
    font-size: 1.6rem;
  }
  .animal-label {
    font-size: 1.05rem;
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

  /* Share */
  .share-section {
    padding: 2rem 0.75rem;
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

