<script setup lang="ts">
import { POPULATION_DE } from '@/data/population'
import { ref, computed, useTemplateRef, watch } from 'vue'
import { useTransition, TransitionPresets, useElementVisibility } from '@vueuse/core'
import { type ComputedAnimal } from '@/composables/useAnimalData'
import { useLiveState } from '@/composables/useLiveState'
import type { Victim } from '@/composables/useVictimTicker'
import { provideCitations } from '@/composables/useCitations'
import { animals } from '@/data/animals'
import { slugBySpecies } from '@/data/species'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'
import { replacesSnapshot } from '@/utils/prerendered'
import { formatNumber } from '@/utils/formatNumber'
import { WORLD_YEAR, worldTotal } from '@/data/topics/world'
import { meatConsumption } from '@/data/topics/perCapita'
import { usageAges } from '@/data/topics/slaughterAge'
import { topicByName } from '@/data/topics'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import EmojiWall from '@/components/EmojiWall.vue'
import GrowthTimeline from '@/components/GrowthTimeline.vue'
import HeroSky from '@/components/HeroSky.vue'
import HeroBackdrop from '@/components/HeroBackdrop.vue'
import VictimCard from '@/components/VictimCard.vue'
import SpeciesFactsChapter from '@/components/SpeciesFactsChapter.vue'
import LifeFactsChapter from '@/components/LifeFactsChapter.vue'
import BackgroundsChapter from '@/components/BackgroundsChapter.vue'
import ChapterExit from '@/components/ChapterExit.vue'
import FaqChapter from '@/components/FaqChapter.vue'
import ImpactChapter from '@/components/ImpactChapter.vue'
import ActionChapter from '@/components/ActionChapter.vue'
import SourceLinks from '@/components/SourceLinks.vue'
import SourceList from '@/components/SourceList.vue'

const { timer, animalData, totalDeathCount, victims, latest, heroVisible } = useLiveState()
// Every chapter cites by number; the list at the end of the page resolves them
provideCitations()
const { onNavClick } = useAnchorNavigation()

/** The hero rises into view on a client-side visit; when it was already on screen as a snapshot it just stays */
const heroEnters = !replacesSnapshot()

/** The doors from the German numbers into the world, the lives and the plate */
const worldBillions = formatNumber(worldTotal(WORLD_YEAR) / 1e9, 1)
const meatLatest = meatConsumption[meatConsumption.length - 1]
const broilerAge = usageAges.find((entry) => entry.use === 'Masthuhn')
if (!meatLatest || !broilerAge) throw new Error('The per capita series and the usage ages must not be empty')
const worldTopic = topicByName('World')
const slaughterAgeTopic = topicByName('SlaughterAge')
const perCapitaTopic = topicByName('PerCapita')
const timelineTopic = topicByName('Timeline')

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

/**
 * Each card's animation delay, fixed the first time this view renders it. A card
 * that was already rising when the view mounted (seed cards, or cards spawned
 * while another page was open) continues mid-flight instead of starting again
 * from the bottom; a card spawned while the view is open starts at the bottom.
 */
const riseDelays = new WeakMap<Victim, string>()
function riseDelay(victim: Victim): string {
  let delay = riseDelays.get(victim)
  if (delay === undefined) {
    delay = `${Math.min(0, (victim.bornAt - Date.now()) / 1000).toFixed(2)}s`
    riseDelays.set(victim, delay)
  }
  return delay
}

const leftLane = computed(() => victims.value.filter((v) => v.lane === 'left'))
const rightLane = computed(() => victims.value.filter((v) => v.lane === 'right'))
/** The five most recent cards, newest first: the lifelines of the "Wer sie waren" chapter */
const recentVictims = computed(() => [...victims.value].slice(-5).reverse())

/**
 * The torch: a warm cone in the hero backdrop follows the pointer. One write
 * per frame at most, as two custom properties on the hero element.
 */
let spotFrame = 0
function onHeroPointer(event: PointerEvent) {
  const hero = heroRef.value
  if (!hero || spotFrame !== 0) return
  spotFrame = requestAnimationFrame(() => {
    spotFrame = 0
    const rect = hero.getBoundingClientRect()
    hero.style.setProperty('--spot-x', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`)
    hero.style.setProperty('--spot-y', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`)
  })
}


/**
 * Vegans in Germany. Mixed sources, because there is no continuous series:
 * 2008 Nationale Verzehrsstudie II (below 80,000), 2015 VEBU estimate,
 * 2016 SKOPOS, 2018 to 2025 IfD Allensbach (AWA). The first and the latest
 * Allensbach points are named so the text below can quote them as measured
 * values, no projection in between.
 */
const nvs2008 = { year: 2008, count: 80_000 }
const awaFirst = { year: 2018, count: 950_000 }
const awaLatest = { year: 2025, count: 1_680_000 }
const veganTimeline = [
  nvs2008,
  { year: 2015, count: 900_000 },
  { year: 2016, count: 1_300_000 },
  awaFirst,
  { year: 2020, count: 1_130_000 },
  { year: 2022, count: 1_580_000 },
  awaLatest,
]

const veganTimelineAxisYears = [2008, 2012, 2016, 2020, 2025]

/** "1,68 Millionen", the figure the stat and the text share */
const awaLatestMillions = formatNumber(awaLatest.count / 1e6, 2)
const veganSharePercent = (awaLatest.count / POPULATION_DE) * 100

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
  // Off screen the figure follows the count directly, nobody sees the easing
  disabled: computed(() => !heroInView.value),
})

const shareText = () =>
  `In nur ${timer.elapsedFormatted.value}, in denen ich auf https://vegan.to war, sind in Deutschland schon ${formatNumber(totalDeathCount.value)} Tiere getötet worden…\n\n#vegan\n\n🐷🐮🐔`
</script>

<template>
  <!-- Hero: a sky of lights, one per animal, and cards with names in two lanes -->
  <section ref="hero" class="hero" @pointermove="onHeroPointer">
    <HeroBackdrop :active="heroInView" />
    <HeroSky :count="totalDeathCount" :active="heroInView" />
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
          animationDelay: riseDelay(victim),
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
          animationDelay: riseDelay(victim),
        }"
      />
    </div>

    <div class="hero-inner">
      <!-- One heading: the kicker names the topic for search, the line below carries the feeling -->
      <h1 class="hero-title" :class="{ 'hero-enter': heroEnters }">
        <span class="hero-label">Live-Zähler: Tiere, die in Deutschland für unser Essen sterben</span>
        <span class="hero-title-line hero-title-sweep">Sie hatten Namen.</span>
      </h1>

      <p class="hero-subtitle" :class="{ 'hero-enter': heroEnters }">
        Jedes Licht ist ein Tier, das gestorben ist, seit du hier bist. Der Himmel füllt sich, solange du bleibst.
      </p>

      <!-- Live Counter -->
      <div class="hero-counter" :class="{ 'hero-enter': heroEnters }">
        <span class="hero-counter-number">{{ formatNumber(animatedTotalDeaths) }}</span>
        <!-- The heart line: flat, then one beat, then flat again, on and on -->
        <svg class="hero-ecg" :class="{ 'hero-ecg--still': !heroInView }" viewBox="0 0 480 48" width="480" height="48" aria-hidden="true">
          <path class="hero-ecg-trace" d="M0 24 H120 L132 24 L140 6 L148 42 L156 24 H260 L270 24 L277 14 L284 34 L290 24 H400 L410 24 L418 2 L427 46 L436 24 H480" />
          <path class="hero-ecg-beam" d="M0 24 H120 L132 24 L140 6 L148 42 L156 24 H260 L270 24 L277 14 L284 34 L290 24 H400 L410 24 L418 2 L427 46 L436 24 H480" />
        </svg>
        <span class="hero-counter-label">Tiere getötet, seit du hier bist</span>
        <RouterLink to="/quellen#methodik" class="hero-counter-note">{{ deathsPerSecond }} in jeder Sekunde &middot; Fische geschätzt</RouterLink>
        <span class="hero-counter-time"><span class="hero-tick" aria-hidden="true"></span>{{ timer.elapsedFormatted.value }} hier</span>
      </div>
    </div>

    <RouterLink to="/#wer" custom v-slot="{ href, navigate }">
      <a :href="href" class="hero-scroll" @click="navigate($event); onNavClick('/#wer')">
        <span class="hero-scroll-label">Wer sie waren</span>
        <span class="hero-scroll-badge" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v14m7-7l-7 7l-7-7" />
          </svg>
        </span>
      </a>
    </RouterLink>
    <RouterLink :to="timelineTopic.path" class="hero-side-link">
      <span class="hero-side-link-kicker">Zeitreise</span>
      <span class="hero-side-link-label">Von 1867 bis heute <span aria-hidden="true">&rarr;</span></span>
    </RouterLink>
  </section>

  <!-- Sheet: light surface sliding over the hero -->
  <section id="wer" class="sheet">
    <div class="container">
      <h2 class="chapter">Wer sie waren</h2>
      <p class="live-sentence">
        Während du diesen Satz liest, sind
        <span class="live-number"><AnimatedNumber :value="totalDeathCount" /></span>
        Tiere gestorben. Eins davon hieß
        <span class="live-name">{{ latest.name }}</span>.
      </p>
      <p class="chapter-lead">
        Die Zahlen im Text laufen live, sie sind keine Beispiele. Jede Linie ist ein mögliches Leben, der rote Anteil das gelebte.
        Die Namen stehen stellvertretend, das Alter entspricht der üblichen Schlachtreife, die Lebenserwartung dem, was diese Tiere ohne uns hätten.
      </p>
      <div class="recent-list">
        <VictimCard
          v-for="(victim, index) in recentVictims"
          :key="victim.id"
          :victim="victim"
          variant="row"
          :hot="index === 0"
        />
      </div>
    </div>
  </section>

  <!-- Animal Data -->
  <section id="zahlen" class="animals-section">
    <div class="container">
      <span class="chapter chapter--on-dark">Wie viele</span>
      <div class="section-head">
        <h2 class="chapter-title chapter-title--on-dark">Heute in Deutschland</h2>
        <span class="section-note">Jedes Emoji ein Tier, seit du hier bist. Destatis 2025.<SourceLinks :ids="['destatisSlaughter', 'destatisPoultry']" on-dark /></span>
      </div>

      <div class="animal-grid">
        <div
          v-for="(animal, index) in animalData"
          :key="animal.names.single"
          v-reveal="{ y: 40, duration: 0.5, delay: index * 0.05, amount: 0.2 }"
          class="animal-card"
          :class="{
            'animal-card--wide': animal.perDay >= WIDE_MIN_PER_DAY,
            'animal-card--estimate': animal.estimate,
            'animal-card--small': animal.perDay < WALL_MIN_PER_DAY,
          }"
        >
          <div class="animal-card-main">
            <div class="animal-card-name">
              <span class="animal-emoji">{{ animal.names.emoji }}</span>
              <RouterLink :to="`/tiere/${slugBySpecies(animal.names.single)}`" class="animal-label">{{ animal.names.plural }}</RouterLink>
              <RouterLink
                v-if="animal.estimate"
                to="/quellen#methodik"
                class="animal-estimate"
                :title="animal.estimate.note"
              >Schätzung</RouterLink>
            </div>
            <div class="animal-stat animal-stat--today">
              <span class="animal-stat-value animal-stat-value--today"><template v-if="animal.estimate">≈ </template><AnimatedNumber :value="animal.currentDay" /></span>
              <span class="animal-stat-label">heute, bis jetzt</span>
            </div>
            <div class="animal-card-stats">
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

          <EmojiWall v-if="animal.perDay >= WALL_MIN_PER_DAY" :emojis="animal.killedSinceStartEmojis" :hidden="animal.killedSinceStartHidden" />

          <div v-if="isChildViewOpen(animal)" class="animal-children">
            <div v-for="child in animal.children" :key="child.name" class="animal-child">
              <span class="animal-child-name">davon {{ child.name }}</span>
              <span class="animal-child-stat" data-label="heute">{{ child.currentDayFormatted }}</span>
              <span class="animal-child-stat" data-label="pro Tag">{{ child.perDayFormatted }}</span>
              <span class="animal-child-stat animal-child-stat--wide" data-label="dieses Jahr">{{ child.currentYearFormatted }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <ChapterExit
    kicker="Und weltweit?"
    :title="`${worldBillions} Milliarden Landtiere im Jahr ${WORLD_YEAR}.`"
    text="Deutschland ist ein Ausschnitt. Der Zähler für die ganze Welt, nach Tierart und mit den Fischen als Schätzung."
    :to="worldTopic.path"
    label="Weltweit zählen"
    picture="cows-misty-video"
    picture-alt="Kühe auf einer Weide im Morgennebel, von oben gesehen"
  />

  <SpeciesFactsChapter />
  <ChapterExit
    kicker="Wie lange sie leben"
    :title="`Ein Masthuhn wird ${broilerAge.ageText} alt.`"
    text="Jede Art könnte Jahre leben. Wie alt sie bei der Schlachtung wirklich sind, für alle zehn Arten im Vergleich."
    :to="slaughterAgeTopic.path"
    label="Schlachtalter ansehen"
    picture="chicks-box-video"
    picture-alt="Eine Kiste voller gelber Küken auf einem Förderband"
  />
  <LifeFactsChapter />
  <BackgroundsChapter />

  <!-- Live Death Counter Summary -->
  <section
    v-reveal="{ duration: 0.8, amount: 0.3, y: 0 }"
    class="emoji-section chapter-section"
  >
    <div class="container">
      <h2 class="chapter-title">Während du hier bist, sterben sie weiter</h2>
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
  </section>

  <!-- Vegan Growth: Full-Width Progress Bar -->
  <section class="growth-section chapter-section">
    <div class="growth-inner">
      <span class="chapter chapter--center">Die anderen</span>
      <h2
        v-reveal="{ y: 20, duration: 0.5 }"
        class="chapter-title text-center"
      >
        Die Bewegung wächst
      </h2>

      <div class="growth-stats">
        <div class="growth-stat">
          <span class="growth-stat-number growth-stat-number--green">{{ awaLatestMillions }} Millionen</span>
          <span class="growth-stat-label">Veganer*innen in Deutschland (Allensbach, {{ awaLatest.year }})</span>
        </div>
        <div class="growth-stat">
          <span class="growth-stat-number">{{ formatNumber(POPULATION_DE) }}</span>
          <span class="growth-stat-label">Menschen in Deutschland (Destatis, Ende 2025)</span>
        </div>
      </div>

      <!-- Full-width progress bar -->
      <div class="growth-progress">
        <div
          class="growth-progress-fill"
          :style="{ width: veganSharePercent.toFixed(4) + '%' }"
        >
          <span class="growth-progress-label">
            {{ formatNumber(veganSharePercent, 2) }}%
          </span>
        </div>
      </div>

      <div
        v-reveal="{ y: 12, duration: 0.6, delay: 0.1 }"
      >
        <GrowthTimeline :points="veganTimeline" :label-years="veganTimelineAxisYears" />
      </div>
      <p class="growth-note">Verschiedene Erhebungen (NVS II, VEBU, SKOPOS, Allensbach), nicht direkt vergleichbar.</p>

      <p
        v-reveal="{ duration: 0.6, delay: 0.2, y: 0 }"
        class="growth-message"
      >
        {{ nvs2008.year }} waren es weniger als {{ formatNumber(nvs2008.count) }}. Bei Allensbach stieg die Zahl von
        {{ formatNumber(awaFirst.count) }} im Jahr {{ awaFirst.year }} auf {{ awaLatestMillions }} Millionen im Jahr {{ awaLatest.year }}.
      </p>

      <p class="growth-source">
        Erhebungen von NVS II (2008), SKOPOS (2016), VEBU (2015) und IfD Allensbach AWA (2018 bis 2025)<SourceLinks :ids="['skopos', 'vebu', 'awa']" />
      </p>
    </div>
  </section>

  <ImpactChapter />
  <ChapterExit
    kicker="Und auf dem Teller?"
    :title="`${formatNumber(meatLatest.total, 1)} Kilogramm Fleisch isst ein Mensch in Deutschland im Jahr ${meatLatest.year}.`"
    text="Wie viele Tiere das sind, warum die Antwort eine Spanne ist und wie sich der Verzehr seit 2010 verändert hat."
    :to="perCapitaTopic.path"
    label="Pro Kopf nachrechnen"
    picture="piglets"
    picture-alt="Junge Schweine in einem Maststall"
  />

  <FaqChapter />

  <ActionChapter />

  <SourceList />

  <!-- Share -->
  <section class="share-section chapter-section">
    <div class="container">
      <h2 class="chapter-title text-center">Teile diese Seite</h2>
      <div class="text-center shareLinks">
        <a class="resp-sharing-button__link" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="Auf Facebook teilen"><div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`https://x.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent('https://vegan.to')}`" target="_blank" rel="noopener" aria-label="Auf X teilen"><div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`mailto:?subject=${encodeURIComponent('vegan.to')}&body=${encodeURIComponent(shareText())}`" target="_self" rel="noopener" aria-label="Per E-Mail teilen"><div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z" /></svg></div></div></a>
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
/* A vignette over the backdrop keeps the edges dark and the middle readable */
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
/* Wide monitors hold more cards, so the lanes get wider too */
@media (min-width: 1600px) {
  .victim-lane { width: 30%; }
}
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
  bottom: calc(var(--sheet-overlap) + 48px);
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(246, 241, 231, 0.6);
  text-decoration: none;
  z-index: 1;
}
.hero-scroll-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  transition: color 0.25s ease;
}
/* Round badge with the arrow, nudging downwards to invite the scroll */
.hero-scroll-badge {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 1px solid rgba(246, 241, 231, 0.18);
  background: rgba(246, 241, 231, 0.05);
  backdrop-filter: blur(6px);
  animation: heroScrollNudge 2.6s ease-in-out infinite;
  transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
}
@keyframes heroScrollNudge {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}
.hero-scroll:hover,
.hero-scroll:focus-visible {
  color: var(--brand-cream);
  text-decoration: none;
}
.hero-scroll:hover .hero-scroll-badge,
.hero-scroll:focus-visible .hero-scroll-badge {
  border-color: var(--brand-accent);
  background: rgba(255, 106, 61, 0.16);
  color: var(--brand-accent);
  animation-play-state: paused;
  transform: translateY(4px);
}
/* The second door out of the hero: the Zeitreise, bottom right, opposite the scroll cue */
.hero-side-link {
  position: absolute;
  right: 40px;
  bottom: calc(var(--sheet-overlap) + 48px);
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid rgba(246, 241, 231, 0.18);
  background: rgba(246, 241, 231, 0.05);
  backdrop-filter: blur(6px);
  color: rgba(246, 241, 231, 0.75);
  text-decoration: none;
  transition: border-color 0.25s ease, background-color 0.25s ease, color 0.25s ease;
}
.hero-side-link-kicker {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #7fe0a5;
}
.hero-side-link-label {
  font-family: var(--font-display);
  font-size: 0.85rem;
  letter-spacing: -0.01em;
}
.hero-side-link:hover,
.hero-side-link:focus-visible {
  color: var(--brand-cream);
  border-color: var(--brand-accent);
  background: rgba(255, 106, 61, 0.16);
  text-decoration: none;
}
.hero-side-link:focus-visible {
  outline: 2px solid var(--brand-cream);
  outline-offset: 3px;
}

/* Every looping animation on this page rests when the visitor asked for less motion */
@media (prefers-reduced-motion: reduce) {
  .hero-enter,
  .hero-scroll-badge,
  .hero-title-sweep,
  .hero-ecg-beam,
  .hero-tick,
  .hero-counter-number,
  .growth-progress-fill::after {
    animation: none;
  }
  .hero-title-sweep {
    background: none;
    -webkit-text-fill-color: inherit;
    color: inherit;
  }
  .hero-scroll:hover .hero-scroll-badge,
  .hero-scroll:focus-visible .hero-scroll-badge {
    transform: none;
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
/* A warm glint runs through the title once every eight seconds */
.hero-title-sweep {
  background: linear-gradient(100deg, var(--brand-cream) 0%, var(--brand-cream) 38%, #fff 46%, #ffc79a 50%, var(--brand-cream) 56%, var(--brand-cream) 100%);
  background-size: 260% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  animation: hero-sweep 8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
@keyframes hero-sweep {
  0% { background-position: 120% 0; }
  60%, 100% { background-position: -60% 0; }
}
/* Entrance on a client-side visit: title and line rise, the counter springs up. CSS only, no library */
.hero-title.hero-enter {
  animation: hero-rise 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 0.1s both;
}
.hero-subtitle.hero-enter {
  animation: hero-rise 0.8s cubic-bezier(0.22, 0.61, 0.36, 1) 0.3s both;
}
.hero-counter.hero-enter {
  animation: hero-spring 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s both;
}
@keyframes hero-rise {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: none; }
}
@keyframes hero-spring {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: none; }
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
.hero-counter-number {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 11vw, 6rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--brand-accent);
  /* Room for five digits and a separator: the snapshot shows 0, the live figure reaches thousands within a minute, nothing around it may move */
  min-width: 6ch;
  text-align: center;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  animation: pulse-glow 1.6s ease-in-out infinite;
}
@keyframes pulse-glow {
  0%, 100% { text-shadow: 0 0 28px rgba(255, 106, 61, 0.35), 0 0 90px rgba(255, 106, 61, 0.18); }
  50% { text-shadow: 0 0 44px rgba(255, 106, 61, 0.6), 0 0 140px rgba(255, 106, 61, 0.3); }
}
/* The heart line under the figure: a faint trace, and a bright beam that draws it over and over */
.hero-ecg {
  display: block;
  max-width: 100%;
  height: auto;
  overflow: visible;
}
.hero-ecg path {
  fill: none;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.hero-ecg-trace {
  stroke: rgba(255, 106, 61, 0.25);
  stroke-width: 2;
}
.hero-ecg-beam {
  stroke: var(--brand-accent);
  stroke-width: 2.5;
  stroke-dasharray: 720;
  stroke-dashoffset: 720;
  filter: drop-shadow(0 0 6px rgba(255, 106, 61, 0.9));
  animation: hero-ecg 3.2s linear infinite;
}
.hero-ecg--still .hero-ecg-beam {
  animation-play-state: paused;
}
@keyframes hero-ecg {
  to { stroke-dashoffset: 0; }
}
.hero-tick {
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: 8px;
  border-radius: 50%;
  background: var(--brand-accent);
  vertical-align: 1px;
  animation: hero-tick 1.2s steps(1) infinite;
}
@keyframes hero-tick {
  0%, 55% { opacity: 1; }
  56%, 100% { opacity: 0.25; }
}
.hero-counter-label {
  font-size: 1rem;
  opacity: 0.7;
}
.hero-counter-time {
  font-size: 0.85rem;
  opacity: 0.6;
  font-variant-numeric: tabular-nums;
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
  margin-top: calc(-1 * var(--sheet-overlap));
  background: var(--brand-cream);
  border-radius: 36px 36px 0 0;
  box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.35);
  padding: 3.5rem 0 3.5rem;
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
/* The lifelines share one axis, so the rows read as one chart */
.recent-list {
  display: flex;
  flex-direction: column;
  margin-top: 1rem;
  border-top: 1px solid rgba(20, 54, 31, 0.1);
}
.section-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.section-head .chapter-title {
  margin-bottom: 0;
}
.section-note {
  font-size: 0.85rem;
  color: var(--brand-faint);
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
  border: 1px dashed rgba(246, 241, 231, 0.22);
}
/* The wall: the night of the hero comes back, every card a pane of glass on it */
.animals-section {
  position: relative;
  z-index: 2;
  padding: 5.5rem 0 6rem;
  content-visibility: auto;
  contain-intrinsic-size: auto 1600px;
  background:
    radial-gradient(1.4px 1.4px at 6% 12%, rgba(255, 179, 122, 0.55), transparent 60%),
    radial-gradient(1.2px 1.2px at 21% 6%, rgba(255, 179, 122, 0.7), transparent 60%),
    radial-gradient(1px 1px at 43% 14%, rgba(255, 179, 122, 0.45), transparent 60%),
    radial-gradient(1.6px 1.6px at 62% 4%, rgba(255, 179, 122, 0.7), transparent 60%),
    radial-gradient(1px 1px at 82% 11%, rgba(255, 179, 122, 0.5), transparent 60%),
    radial-gradient(1.2px 1.2px at 96% 7%, rgba(255, 179, 122, 0.6), transparent 60%),
    radial-gradient(1px 1px at 10% 90%, rgba(255, 179, 122, 0.4), transparent 60%),
    radial-gradient(1.3px 1.3px at 53% 96%, rgba(255, 179, 122, 0.5), transparent 60%),
    radial-gradient(1px 1px at 92% 93%, rgba(255, 179, 122, 0.5), transparent 60%),
    var(--brand-green-deep);
  color: var(--brand-cream);
}
.chapter-title--on-dark {
  color: var(--brand-cream);
}
.animals-section .section-note {
  color: rgba(246, 241, 231, 0.6);
}

.animal-card {
  position: relative;
  background: rgba(246, 241, 231, 0.05);
  border-radius: 22px;
  border: 1px solid rgba(246, 241, 231, 0.1);
  overflow: hidden;
  transition: border-color 0.3s, transform 0.3s;
}
.animal-card:hover {
  border-color: rgba(246, 241, 231, 0.22);
  transform: translateY(-2px);
}
/* The largest group carries a warm glow in its corner */
.animal-card--wide::before {
  content: '';
  position: absolute;
  right: -40px;
  top: -60px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 106, 61, 0.22), rgba(255, 106, 61, 0) 70%);
  pointer-events: none;
}
.animal-card-main {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 1.6rem 1.75rem 0.5rem;
  gap: 0.9rem;
}
/* The figure of the day leads the card, its label sits beside it in plain words */
.animal-stat--today {
  flex-direction: row;
  align-items: baseline;
  gap: 0.9rem;
  flex-wrap: wrap;
}
.animal-stat-value--today {
  font-weight: 800;
  font-size: clamp(2rem, 3.6vw, 3.4rem);
  letter-spacing: -0.04em;
  color: #ff8c64;
}
.animal-card--wide .animal-stat-value--today {
  font-size: clamp(2.2rem, 4.4vw, 4rem);
}
.animal-stat--today .animal-stat-label {
  font-size: 0.85rem;
  letter-spacing: 0;
  text-transform: none;
  color: rgba(246, 241, 231, 0.6);
}
.animal-card-name {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.animal-emoji { font-size: 1.6rem; line-height: 1; }
.animal-label {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--brand-cream);
}
.animal-label:hover,
.animal-label:focus-visible {
  color: #ffb37a;
}
.animal-estimate {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  border: 1px solid rgba(246, 241, 231, 0.25);
  color: rgba(246, 241, 231, 0.75);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  vertical-align: middle;
  text-decoration: none;
}
.animal-estimate:hover,
.animal-estimate:focus-visible {
  border-color: #ffb37a;
  color: #ffb37a;
  text-decoration: none;
}
/* The smaller figures sit side by side under the big one */
.animal-card-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  padding-top: 0.9rem;
  border-top: 1px solid rgba(246, 241, 231, 0.1);
}
.animal-stat {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.animal-stat-label {
  font-size: 0.68rem;
  color: rgba(246, 241, 231, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.14em;
}
.animal-stat-value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.animal-stat-value--danger { color: #ffb37a; }



.animal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 2.5rem;
  padding: 0.35rem 1.75rem 0.75rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.animal-card-since { color: rgba(246, 241, 231, 0.6); font-size: 0.85rem; }
.text-killed { color: #ffb37a; font-weight: 700; }
.btn-children {
  background: none;
  border: 1px solid rgba(246, 241, 231, 0.25);
  border-radius: 999px;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  color: rgba(246, 241, 231, 0.75);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.btn-children:hover { border-color: #ffb37a; color: #ffb37a; }
.animal-card-emojis {
  padding: 0 1.75rem 1rem;
  font-size: 0.85rem;
}
.animal-children { border-top: 1px solid rgba(246, 241, 231, 0.1); background: rgba(14, 33, 20, 0.35); }
.animal-child {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.75rem 0.5rem 2.5rem;
  font-size: 0.9rem;
  color: rgba(246, 241, 231, 0.8);
}
.animal-child-name { flex: 2; }
.animal-child-stat { flex: 1; text-align: right; font-variant-numeric: tabular-nums; }
.animal-child-stat--wide { flex: 1.3; }

/* ── Live Death Summary ────────────────────────────── */
.emoji-section {
  text-align: center;
  background: var(--brand-mint);
}
.section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; }
.section-title--sm { font-size: 1.25rem; }
.emoji-section-sub {
  font-size: 1.05rem;
  color: var(--brand-muted);
  margin-bottom: 1.5rem;
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
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.1);
  color: var(--brand-green);
  padding: 0.45rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
}
.emoji-badge strong {
  font-variant-numeric: tabular-nums;
}
.emoji-total {
  margin-top: 1.75rem;
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: #e74c3c;
}

/* ── Vegan Growth — Full Width ─────────────────────── */
.growth-section {
  background: var(--brand-cream);
  color: var(--brand-green);
}
.growth-inner {
  max-width: 100%;
  padding: 0 1.5rem;
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
  font-family: var(--font-display);
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1.1;
  color: var(--brand-faint);
}
.growth-stat-number--green {
  color: var(--brand-green);
}
.growth-stat-label {
  display: block;
  font-size: 0.82rem;
  color: var(--brand-muted);
  margin-top: 0.35rem;
}

/* Progress bar — full viewport width */
.growth-progress {
  width: 100%;
  height: 48px;
  background: rgba(20, 54, 31, 0.08);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  margin-bottom: 1.5rem;
}
.growth-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--brand-green-soft), #2f8f57);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 0.75rem;
  min-width: 60px;
  transition: width 0.5s ease-out;
  box-shadow: 0 8px 24px rgba(20, 54, 31, 0.25);
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
.growth-note {
  text-align: center;
  font-size: 0.78rem;
  color: var(--brand-faint);
  margin: 0.5rem auto 1.25rem;
}
.growth-message {
  text-align: center;
  font-size: 1.05rem;
  color: var(--brand-muted);
  max-width: 520px;
  margin: 0 auto 1rem;
  line-height: 1.65;
}
.growth-source {
  text-align: center;
  font-size: 0.75rem;
  color: var(--brand-faint);
  text-wrap: balance;
}
.growth-source a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* ── Share ─────────────────────────────────────────── */
.share-section {
  text-align: center;
  background: var(--brand-mint);
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
    padding: 3.5rem 0;
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
    padding: 1.1rem 1.1rem 0.4rem;
  }
  .animal-card-footer,
  .animal-card-emojis {
    padding-left: 1.1rem;
    padding-right: 1.1rem;
  }
  .animal-card-stats {
    gap: 1.25rem;
  }
  .sheet {
    border-radius: 28px 28px 0 0;
    padding-top: 2.25rem;
  }
  .victim-lane {
    width: 48%;
  }
  .victim-lane .victim-card {
    width: 176px;
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
  .emoji-badge {
    font-size: 0.8rem;
    padding: 0.35rem 0.75rem;
  }

  /* Growth section */
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


  /* Section titles */
  .section-title {
    font-size: 1.4rem;
    margin-bottom: 1rem;
  }
  .section-title--sm {
    font-size: 1.1rem;
  }
}
/* On short phone screens the centred hero content reaches the bottom edge, and the
   scroll hint would sit on top of the counter. Taller phones have the room. */
@media (max-width: 767px) and (max-height: 739px) {
  .hero-scroll {
    display: none;
  }
}
</style>

