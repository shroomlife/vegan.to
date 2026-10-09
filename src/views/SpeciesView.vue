<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLiveState } from '@/composables/useLiveState'
import { useJsonLd } from '@/composables/useJsonLd'
import { animals } from '@/data/animals'
import { speciesProfiles, profileBySlug } from '@/data/species'
import { speciesFacts, lifeFacts } from '@/data/facts'
import { lifespanYearsBySpecies, slaughterAgeBySpecies, DAYS_PER_UNIT, DATIVE_UNIT } from '@/data/lifespans'
import { formatNumber } from '@/utils/formatNumber'
import { LAND_ANIMALS_PER_PERSON_YEAR, FISH_PER_PERSON_YEAR } from '@/utils/perCapita'
import { applyDocumentMeta, SITE_URL } from '@/utils/documentMeta'
import { slaughterTrendBySpecies } from '@/data/trends'
import { trendSummary, formatPercent } from '@/utils/trend'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import GapChart from '@/components/GapChart.vue'
import SourceLinks from '@/components/SourceLinks.vue'
import SpeciesPortrait from '@/components/SpeciesPortrait.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import { topicPages, topicByName } from '@/data/topics'
import { cattleStock, census2023, pigStock, sheepStock } from '@/data/topics/livestock'

const route = useRoute()
const router = useRouter()
const { animalData } = useLiveState()

const slug = computed(() => String(route.params.slug ?? ''))
const profile = computed(() => profileBySlug(slug.value))
// Unknown slugs get the 404 page, and the URL stays as typed
watchEffect(() => {
  if (!profile.value) router.replace({ name: 'NotFound', params: { pathMatch: route.path.slice(1).split('/') } })
})

const raw = computed(() => animals.find((a) => a.names.single === profile.value?.single))
const live = computed(() => animalData.value.find((a) => a.names.single === profile.value?.single))
const fact = computed(() => speciesFacts.find((f) => f.species === raw.value?.names.plural))
const conditions = computed(() => lifeFacts.filter((f) => profile.value && f.species.includes(profile.value.single)))
const slaughterAge = computed(() => (profile.value ? slaughterAgeBySpecies[profile.value.single] : undefined))
const lifespanYears = computed(() => (profile.value ? lifespanYearsBySpecies[profile.value.single] : undefined))

/** Share of the possible life that a farmed animal gets, for the bar */
const livedPercent = computed(() => {
  if (!slaughterAge.value || !lifespanYears.value) return 0
  const lived = slaughterAge.value.max * DAYS_PER_UNIT[slaughterAge.value.unit]
  return Math.min(100, Math.max(0.8, (lived / (lifespanYears.value * 365)) * 100))
})

/** "21 pro Sekunde" for frequent species, "eins alle 2,5 Stunden" for rare ones */
const rhythm = computed(() => {
  const perSec = live.value?.perSec ?? 0
  if (perSec >= 1) return `${formatNumber(perSec, perSec < 10 ? 1 : 0)} in jeder Sekunde`
  const seconds = 1 / perSec
  if (seconds < 90) return `eins alle ${formatNumber(seconds)} Sekunden`
  if (seconds < 5400) return `eins alle ${formatNumber(seconds / 60)} Minuten`
  return `eins alle ${formatNumber(seconds / 3600, 1)} Stunden`
})

/**
 * Characters of the widest figure a live card reaches, today's at midnight and
 * the year's on 31 December. The card sizes its type to fit them, so a figure
 * never wraps and does not jump in size while it counts up.
 */
const liveChars = computed(() => {
  const prefix = raw.value?.estimate ? '≈ ' : ''
  return {
    day: `${prefix}${formatNumber(live.value?.perDay ?? 0)}`.length,
    year: `${prefix}${formatNumber(raw.value?.deaths.year ?? 0)}`.length,
  }
})

const trend = computed(() => (profile.value ? slaughterTrendBySpecies[profile.value.single] : undefined))
/** Undefined for fish and for any series too short to draw */
const trendFacts = computed(() => (trend.value ? trendSummary(trend.value) : undefined))
/**
 * How the section leads, per species.
 *
 * "X weniger als 2014" would read as progress for chickens, where the gap is
 * 0,9 percent and the figure is still seven percent above 2010. So a gap that
 * small leads with the absolute number instead.
 */
const NEARLY_UNCHANGED = 0.05
/**
 * 41331-0001 splits by Schlachtungsart and we take only domestic origin;
 * 41322-0001 has no such dimension, so that wording must not appear on the
 * four poultry pages.
 */
const isPoultry = computed(() => profile.value?.countSources.includes('destatisPoultry') ?? false)
const trendScope = computed(() =>
  isPoultry.value
    ? 'In Geflügelschlachtereien geschlachtete Tiere'
    : 'Gewerbliche Schlachtungen von Tieren inländischer Herkunft',
)
/** What the counted figure covers; the quick answer below says the same in one sentence */
const countedScope = computed(() =>
  isPoultry.value
    ? 'Gezählt vom Statistischen Bundesamt: alle Tiere, die in deutschen Geflügelschlachtereien geschlachtet wurden, auch solche aus dem Ausland.'
    : 'Gezählt vom Statistischen Bundesamt: Tiere aus deutscher Haltung, ohne Hausschlachtungen und ohne Importe.',
)
const perCapitaTopic = topicByName('PerCapita')
const trendLead = computed(() => {
  const facts = trendFacts.value
  if (!facts) return undefined
  const gap = facts.peak.count - facts.last.count
  if (gap > facts.peak.count * NEARLY_UNCHANGED) {
    return {
      figure: gap,
      unit: `${raw.value?.names.plural} weniger als ${facts.peak.year}`,
      but: `und immer noch ${formatNumber(facts.last.count)} im Jahr.`,
    }
  }
  return {
    figure: facts.last.count,
    unit: `${raw.value?.names.plural} im Jahr`,
    but: gap > 0
      ? `fast genauso viele wie im Höchstjahr ${facts.peak.year}.`
      : 'so viele wie noch nie in dieser Reihe.',
  }
})
const others = computed(() =>
  speciesProfiles
    .filter((p) => p.slug !== slug.value)
    .map((p) => ({ ...p, animal: animals.find((a) => a.names.single === p.single) })),
)

const title = computed(() => `Wie viele ${raw.value?.names.plural ?? 'Tiere'} werden in Deutschland geschlachtet? | vegan.to`)
const description = computed(() => {
  if (!raw.value || !live.value) return ''
  const approx = raw.value.estimate ? 'geschätzt ' : ''
  return `${formatNumber(raw.value.deaths.year)} ${raw.value.names.plural} sterben ${approx}pro Jahr in Deutschland, ${formatNumber(live.value.perDay)} am Tag, ${rhythm.value}. Live-Zähler, Alter bei der Schlachtung, mögliche Lebenserwartung und alle Quellen.`
})

watchEffect(() => {
  if (!profile.value) return
  applyDocumentMeta({ title: title.value, description: description.value, path: `/tiere/${slug.value}` })
})

/**
 * Stock per species for the quick answers, with the date it refers to.
 * Geese and fish have no published stock figure.
 */
const STOCK: Readonly<Partial<Record<string, { count: number; asOf: string }>>> = {
  Schwein: { count: pigStock.may2026, asOf: 'im Mai 2026' },
  Rind: { count: cattleStock.may2026, asOf: 'im Mai 2026' },
  Schaf: { count: sheepStock.nov2025, asOf: 'im November 2025' },
  Huhn: { count: census2023.chickens, asOf: 'am 1. März 2023' },
  Truthuhn: { count: census2023.turkeys, asOf: 'am 1. März 2023' },
  Ente: { count: census2023.ducks, asOf: 'am 1. März 2023' },
  Ziege: { count: census2023.goats, asOf: 'am 1. März 2023' },
}
/** The use form the slaughter ages refer to, so the answer names it */
const USE_FORM: Readonly<Partial<Record<string, string>>> = {
  Huhn: 'Masthühner',
  Schwein: 'Mastschweine',
  Rind: 'Mastbullen',
  Schaf: 'Mastlämmer',
  Ziege: 'Ziegenlämmer',
  Ente: 'Enten',
  Gans: 'Mastgänse',
  Truthuhn: 'Puten',
}

function buildAnswers() {
  if (!raw.value || !live.value || !profile.value) return []
  const plural = raw.value.names.plural
  const approx = raw.value.estimate ? 'geschätzt ' : ''
  const killed = profile.value.single === 'Fisch' ? 'gefangen und getötet' : 'geschlachtet'
  const counted = isPoultry.value
    ? 'Gezählt sind alle Tiere, die in deutschen Geflügelschlachtereien geschlachtet wurden, auch solche aus dem Ausland.'
    : 'Gezählt sind Tiere aus deutscher Haltung, ohne Hausschlachtungen und ohne Importe.'
  const items = [
    {
      question: `Wie viele ${plural} werden in Deutschland pro Tag ${killed}?`,
      answer: `${raw.value.estimate ? 'Geschätzt rund' : 'Rund'} ${formatNumber(live.value.perDay)} am Tag. Grundlage sind ${approx}${formatNumber(raw.value.deaths.year)} ${plural} im Jahr, gleichmäßig auf die Tage verteilt.`,
    },
    {
      question: `Wie viele ${plural} werden in Deutschland pro Jahr ${killed}?`,
      answer: raw.value.estimate
        ? `Geschätzt ${formatNumber(raw.value.deaths.year)}. ${raw.value.estimate.note}`
        : `${formatNumber(raw.value.deaths.year)} im Jahr 2025, laut Statistischem Bundesamt. ${counted}`,
    },
  ]
  const stock = STOCK[profile.value.single]
  if (stock) {
    items.push({
      question: `Wie viele ${plural} gibt es in Deutschland?`,
      answer: `${formatNumber(stock.count)} ${stock.asOf}, laut Statistischem Bundesamt.`,
    })
  }
  const age = slaughterAge.value
  if (age) {
    const possible = lifespanYears.value ? ` Ohne Schlachtung könnten sie bis zu ${lifespanYears.value} Jahre alt werden.` : ''
    const dairy = profile.value.single === 'Rind' ? ' Milchkühe werden im Schnitt 5,5 Jahre alt.' : ''
    items.push({
      question: `Wie alt werden ${plural} bis zur Schlachtung?`,
      answer: `${USE_FORM[profile.value.single] ?? plural} werden mit ${age.min} bis ${age.max} ${DATIVE_UNIT[age.unit]} geschlachtet, laut Bundesinformationszentrum Landwirtschaft.${possible}${dairy}`,
    })
  }
  return items
}
const answers = buildAnswers()

useJsonLd('species-breadcrumb', {
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'vegan.to', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Tiere', item: `${SITE_URL}/tiere` },
    { '@type': 'ListItem', position: 3, name: raw.value?.names.plural ?? '', item: `${SITE_URL}/tiere/${slug.value}` },
  ],
})
</script>

<template>
  <main v-if="raw && live && profile" class="species">
    <section class="species-hero">
      <div class="species-inner species-hero-grid">
        <div class="species-hero-copy">
        <nav class="species-crumbs" aria-label="Pfad">
          <RouterLink to="/">vegan.to</RouterLink>
          <span aria-hidden="true">/</span>
          <RouterLink to="/tiere">Tiere</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{{ raw.names.plural }}</span>
        </nav>
        <span class="chapter">{{ raw.names.emoji }} Tierart &middot; Deutschland {{ raw.estimate ? '· Schätzung' : '· Destatis 2025' }}</span>
        <h1 class="species-title">
          {{ formatNumber(raw.deaths.year) }} {{ raw.names.plural }} im Jahr.
        </h1>
        <p class="chapter-lead species-lead">
          Das sind {{ raw.estimate ? 'rund' : '' }} {{ formatNumber(live.perDay) }} am Tag, {{ rhythm }}.
          <template v-if="raw.estimate">{{ raw.estimate.note }}</template>
          <template v-else>{{ countedScope }}</template>
        </p>

        <div class="species-live">
          <div class="species-live-card" :style="{ '--figure-chars': liveChars.day }">
            <span class="species-live-value"><template v-if="raw.estimate">≈ </template><AnimatedNumber :value="live.currentDay" /></span>
            <span class="species-live-label">heute, seit Mitternacht</span>
          </div>
          <div class="species-live-card species-live-card--year" :style="{ '--figure-chars': liveChars.year }">
            <span class="species-live-value"><template v-if="raw.estimate">≈ </template><AnimatedNumber :value="live.currentYear" /></span>
            <span class="species-live-label">dieses Jahr</span>
          </div>
          <div class="species-live-card species-live-card--accent">
            <span class="species-live-value">{{ formatNumber(live.killedSinceStart) }}</span>
            <span class="species-live-label">seit du hier bist</span>
          </div>
        </div>
        <div v-if="live.perDay >= 500" class="species-emojis" aria-hidden="true">
          {{ live.killedSinceStartEmojis }}
          <span v-if="live.killedSinceStartHidden > 0" class="species-emojis-more">+ {{ formatNumber(live.killedSinceStartHidden) }} weitere</span>
        </div>
        <SourceLinks :ids="profile.countSources" />
        </div>
        <SpeciesPortrait :slug="profile.slug" sizes="(max-width: 991px) 100vw, 420px" loading="eager" fetchpriority="high" class="species-hero-portrait" />
      </div>
    </section>

    <div v-if="trendFacts" class="species-section species-section--mint species-trend">
      <div class="species-inner">
        <span class="chapter">Wie es sich entwickelt</span>
        <h2 class="chapter-title species-trend-title">Der Abstand zum schlimmsten Jahr</h2>

        <GapChart
          class="species-trend-chart"
          :points="trend ?? []"
          :label="`Von ${formatNumber(trendFacts.peak.count)} im Jahr ${trendFacts.peak.year} auf ${formatNumber(trendFacts.last.count)} im Jahr ${trendFacts.last.year}.`"
        />

        <!-- The sentence is built from the gap, so it reads true whether the
             species fell by three quarters or never fell at all -->
        <p v-if="trendLead" class="species-trend-lead">
          <span class="species-trend-figure">{{ formatNumber(trendLead.figure) }}</span>
          <span class="species-trend-unit">{{ trendLead.unit }}</span>
          <span class="species-trend-but">{{ trendLead.but }}</span>
        </p>

        <dl class="species-trend-stats">
          <div class="species-trend-stat">
            <dt>Höchststand {{ trendFacts.peak.year }}</dt>
            <dd>{{ formatNumber(trendFacts.peak.count) }}</dd>
          </div>
          <div class="species-trend-stat">
            <dt>Jahreswert {{ trendFacts.last.year }}</dt>
            <dd>{{ formatNumber(trendFacts.last.count) }}</dd>
          </div>
          <!-- Only when the first year is not the peak, or both cards say the same -->
          <div v-if="trendFacts.peak.year !== trendFacts.first.year" class="species-trend-stat">
            <dt>seit {{ trendFacts.first.year }}</dt>
            <dd :class="{ 'species-trend-down': trendFacts.changeFromFirstPercent <= -1 }">
              {{ formatPercent(trendFacts.changeFromFirstPercent) }}
            </dd>
          </div>
          <div class="species-trend-stat">
            <dt>seit dem Höchststand</dt>
            <dd :class="{ 'species-trend-down': trendFacts.changeFromPeakPercent <= -1 }">
              {{ formatPercent(trendFacts.changeFromPeakPercent) }}
            </dd>
          </div>
        </dl>

        <p class="species-trend-note">
          {{ trendScope }}, {{ trendFacts.first.year }} bis {{ trendFacts.last.year }}.
          Weniger Schlachtungen heißt nicht weniger Leid: Die Tiere werden schwerer, und lebend exportierte Tiere
          tauchen in dieser Reihe nicht auf.
        </p>
        <SourceLinks :ids="profile.countSources" />
      </div>
    </div>

    <section v-if="live.children.length" class="species-section species-section--cream">
      <div class="species-inner">
        <h2 class="chapter-title">Wer dahintersteckt</h2>
        <table class="species-table">
          <thead>
            <tr>
              <th scope="col">Untergruppe</th>
              <th scope="col">heute</th>
              <th scope="col">pro Tag</th>
              <th scope="col">dieses Jahr</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="child in live.children" :key="child.name">
              <th scope="row">{{ child.name }}</th>
              <td data-label="heute">{{ child.currentDayFormatted }}</td>
              <td data-label="pro Tag">{{ child.perDayFormatted }}</td>
              <td data-label="dieses Jahr">{{ child.currentYearFormatted }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <div class="species-section species-section--mint">
      <div class="species-inner species-two">
        <div v-if="fact" class="species-card">
          <span class="chapter">Wer sie sind</span>
          <p class="species-card-text">{{ fact.text }}</p>
          <SourceLinks :ids="fact.sources" />
        </div>
        <div v-if="slaughterAge" class="species-card">
          <span class="chapter">Ein Leben</span>
          <p class="species-card-text">
            Geschlachtet mit {{ slaughterAge.min }} bis {{ slaughterAge.max }} {{ DATIVE_UNIT[slaughterAge.unit] }}.
            <template v-if="lifespanYears">Möglich wären bis zu {{ lifespanYears }} Jahre.</template>
          </p>
          <div v-if="lifespanYears" class="species-bar" aria-hidden="true">
            <span :style="{ width: `${livedPercent}%` }"></span>
          </div>
          <p v-if="lifespanYears" class="species-bar-note">
            <span class="species-bar-lived">gelebt</span>
            <span>möglich: {{ lifespanYears }}&nbsp;Jahre</span>
          </p>
          <SourceLinks :ids="profile.lifeSources" />
        </div>
        <!-- Horse and fish: no current, reliable slaughter age, so no bar either -->
        <div v-else-if="lifespanYears" class="species-card">
          <span class="chapter">Ein Leben</span>
          <p class="species-card-text">Möglich wären bis zu {{ lifespanYears }} Jahre.</p>
          <p class="species-card-note">Für das Schlachtalter gibt es keine aktuelle, belastbare Quelle.</p>
          <SourceLinks :ids="profile.lifeSources" />
        </div>
      </div>
    </div>

    <section v-if="conditions.length" class="species-section species-section--cream">
      <div class="species-inner">
        <span class="chapter">Wie sie lebten</span>
        <h2 class="chapter-title">Erlaubt und üblich.</h2>
        <p class="chapter-lead">
          Nichts davon ist ein Skandalfall. Es ist der erlaubte Normalfall,
          nachzulesen in Verordnungen, Fachpresse und Behördenseiten.
        </p>
        <div class="species-conditions">
          <div v-for="condition in conditions" :key="condition.figure" class="species-condition">
            <span class="species-condition-figure">{{ condition.figure }}</span>
            <span class="species-condition-unit">{{ condition.unit }}</span>
            <p class="species-condition-text">{{ condition.text }}</p>
            <SourceLinks :ids="condition.sources" />
          </div>
        </div>
      </div>
    </section>

    <section class="species-section species-section--mint">
      <div class="species-inner">
        <h2 class="chapter-title">Was du tun kannst</h2>
        <p class="chapter-lead">
          Auf eine Person in Deutschland entfallen rechnerisch rund {{ formatNumber(LAND_ANIMALS_PER_PERSON_YEAR) }} Landtiere im Jahr,
          dazu rund {{ formatNumber(FISH_PER_PERSON_YEAR) }} Fische aus deutschem Fang (geschätzt). Das sind die Schlachtzahlen geteilt
          durch die Bevölkerung; nach dem Fleischverbrauch gerechnet sind es etwas mehr, siehe
          <RouterLink :to="perCapitaTopic.path">{{ perCapitaTopic.label }}</RouterLink>. Wie sich das auf Wasser, Klima und Land auswirkt,
          steht auf der Startseite. Und wie man anfängt, auch.
        </p>
        <div class="species-actions">
          <RouterLink to="/#impact" class="species-btn species-btn--primary">Dein Impact</RouterLink>
          <RouterLink to="/#mitmachen" class="species-btn">Mach mit</RouterLink>
        </div>
        <div v-if="answers.length" class="prose species-answers">
          <QuickAnswers :items="answers" />
        </div>
        <h2 class="chapter-title species-others-title">Hintergründe</h2>
        <div class="species-others species-topics">
          <RouterLink v-for="entry in topicPages" :key="entry.path" :to="entry.path" class="species-chip">{{ entry.label }}</RouterLink>
        </div>
        <h2 class="chapter-title species-others-title">Andere Tierarten</h2>
        <div class="species-others">
          <RouterLink v-for="other in others" :key="other.slug" :to="`/tiere/${other.slug}`" class="species-chip">
            <span aria-hidden="true">{{ other.animal?.names.emoji }}</span> {{ other.animal?.names.plural }}
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.species {
  background: var(--brand-cream);
  color: var(--brand-green);
}
.species-inner {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
}
.species-hero {
  padding: 3rem 0 3.5rem;
  background: var(--brand-cream);
}
/* Text left, the portrait right; on a phone the portrait comes first */
.species-hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 420px);
  gap: 3rem;
  align-items: center;
}
.species-hero-portrait {
  width: 100%;
  max-width: 420px;
  justify-self: end;
  box-shadow: 0 30px 60px rgba(20, 54, 31, 0.18);
}
.species-crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
  color: var(--brand-faint);
}
/* Inline-block with some padding so each crumb is a tap target of about 32px */
.species-crumbs a {
  display: inline-block;
  padding-block: 0.35rem;
  color: inherit;
}
.species-title {
  margin: 0 0 0.8rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.8rem, 4.6vw, 3rem);
  letter-spacing: -0.035em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
}
.species-lead {
  margin-bottom: 1.75rem;
}
.chapter-lead a {
  color: var(--brand-green);
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-thickness: 1.5px;
}
.chapter-lead a:hover,
.chapter-lead a:focus-visible {
  color: var(--brand-accent-text);
}
.species-live {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
}
.species-live-card {
  container-type: inline-size;
  padding: 1.1rem 1.25rem;
  border-radius: 18px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.species-live-card--accent {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: var(--brand-cream);
}
/* The type size is the smaller of the design size and what lets the widest
   figure of the card fit its width; a display digit is about 0.68em wide */
.species-live-value {
  --live-size: clamp(1.2rem, 2.4vw, 1.7rem);
  display: block;
  font-family: var(--font-display);
  font-size: min(var(--live-size), 100cqi / (var(--figure-chars, 8) * 0.68));
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--brand-death-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.species-live-card--accent .species-live-value {
  color: var(--brand-accent);
}
.species-live-label {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
.species-live-card--accent .species-live-label {
  color: rgba(246, 241, 231, 0.7);
}
.species-emojis {
  margin: 0 0 0.9rem;
  min-height: 2.4rem;
  font-size: 1rem;
  letter-spacing: 0.1em;
  line-height: 1.5;
  overflow: hidden;
  max-height: 3rem;
}
.species-emojis-more {
  margin-left: 0.5rem;
  font-size: 0.8rem;
  letter-spacing: normal;
  color: var(--brand-faint);
}
.species-section {
  padding: 3.5rem 0;
}
.species-section--cream {
  background: var(--brand-cream);
}
.species-section--mint {
  background: var(--brand-mint);
}
.species-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  font-variant-numeric: tabular-nums;
}
.species-table th,
.species-table td {
  padding: 0.85rem 1rem;
  text-align: right;
  border-top: 1px solid #f1f3f5;
  font-size: 0.95rem;
}
.species-table th:first-child,
.species-table td:first-child {
  text-align: left;
}
.species-table td {
  white-space: nowrap;
}
.species-table thead th {
  border-top: none;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
.species-two {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}
.species-card {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.5rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.species-card .chapter {
  margin-bottom: 0;
}
.species-card-text {
  flex: 1;
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.05rem;
  letter-spacing: -0.02em;
  line-height: 1.45;
  color: var(--brand-green);
}
.species-card-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--brand-faint);
}
.species-bar {
  height: 6px;
  border-radius: 3px;
  background: rgba(20, 54, 31, 0.08);
  overflow: hidden;
}
.species-bar span {
  display: block;
  height: 100%;
  min-width: 4px;
  border-radius: inherit;
  background: var(--brand-death);
}
.species-bar-note {
  display: flex;
  justify-content: space-between;
  margin: 0;
  font-size: 0.78rem;
  color: var(--brand-faint);
}
.species-bar-lived {
  font-weight: 700;
  color: var(--brand-death-text);
}
.species-conditions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
}
/* ── Zeitverlauf ───────────────────────────────────
   Class prefix species-trend-* on purpose: species-card, species-condition
   and species-table are counted by e2e/species.spec.ts. */
.species-trend-title {
  max-width: 18ch;
}
.species-trend-chart {
  --gap-chart-height: 300px;
  --gap-chart-height-mobile: 130px;
  margin-bottom: 1.6rem;
}
/* The gap is the point of the section, so it gets the largest type on the page
   after the hero, and the qualifier sits right under it rather than in a note */
.species-trend-lead {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  margin: 0 0 1.75rem;
}
.species-trend-figure {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 6vw, 3.6rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--brand-accent-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.species-trend-unit,
.species-trend-but {
  max-width: 34ch;
}
.species-trend-unit {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--brand-green);
}
.species-trend-but {
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--brand-muted);
}
.species-trend-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.9rem;
  margin: 0 0 1.25rem;
}
.species-trend-stat {
  padding: 1.1rem 1.25rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.species-trend-stat dt {
  font-size: 0.78rem;
  font-weight: 400;
  color: var(--brand-faint);
  margin-bottom: 0.3rem;
}
.species-trend-stat dd {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.6rem;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--brand-green);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.species-trend-down {
  color: var(--brand-fall);
}
.species-trend-note {
  max-width: 640px;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--brand-muted);
  margin: 0 0 0.6rem;
}
/* Two per row on a phone; the type shrinks with the viewport so the longest
   peak, eleven digits for chickens, still fits a half-width card at 360px */
@media (max-width: 767px) {
  .species-trend-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
  }
  .species-trend-stat {
    padding: 0.9rem 1rem;
    border-radius: 16px;
  }
  .species-trend-stat dd {
    font-size: clamp(1rem, 4.4vw, 1.2rem);
  }
}
.species-condition {
  display: flex;
  flex-direction: column;
  padding: 1.35rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.species-condition-figure {
  font-family: var(--font-display);
  font-size: 1.8rem;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--brand-accent-text);
}
.species-condition-unit {
  margin-top: 0.25rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
.species-condition-text {
  flex: 1;
  margin: 0.75rem 0 0.6rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--brand-ink);
}
.species-actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}
.species-btn {
  padding: 12px 22px;
  border-radius: 999px;
  border: 1.5px solid rgba(20, 54, 31, 0.2);
  color: var(--brand-green);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: background 0.15s, transform 0.15s;
}
.species-btn:hover,
.species-btn:focus-visible {
  background: rgba(20, 54, 31, 0.06);
  color: var(--brand-green);
  text-decoration: none;
}
.species-btn--primary {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
}
.species-btn--primary:hover,
.species-btn--primary:focus-visible {
  background: var(--brand-accent);
  transform: translateY(-1px);
}
.species-answers {
  margin-bottom: 2.5rem;
}
.species-topics {
  margin-bottom: 2rem;
}
.species-others-title {
  font-size: 1.2rem;
}
.species-others {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.species-chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1.5px solid rgba(20, 54, 31, 0.1);
  background: #fff;
  color: var(--brand-green);
  font-size: 0.85rem;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 0.15s;
}
.species-chip:hover,
.species-chip:focus-visible {
  border-color: var(--brand-accent);
  color: var(--brand-green);
  text-decoration: none;
}

/* Beside a 420px portrait a tablet leaves the copy about 250px, too narrow
   for a ten-digit title and three live cards: the portrait goes on top */
@media (max-width: 991px) {
  .species-hero-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 2rem;
  }
  .species-hero-portrait {
    order: -1;
    justify-self: start;
  }
}
@media (max-width: 767px) {
  .species-hero {
    padding: 2rem 0 2.5rem;
  }
  .species-hero-grid {
    gap: 1.5rem;
  }
  .species-hero-portrait {
    max-width: 100%;
    justify-self: stretch;
  }
  .species-section {
    padding: 2.5rem 0;
  }
  .species-two,
  .species-conditions {
    grid-template-columns: 1fr;
  }
  /* Today and since-you-are-here side by side, the year below at full width:
     it is the longest figure, ten digits for fish */
  .species-live {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.6rem;
  }
  .species-live-card {
    padding: 0.9rem 1rem;
    border-radius: 16px;
  }
  .species-live-card--year {
    grid-column: 1 / -1;
    grid-row: 2;
  }
  .species-live-value {
    --live-size: clamp(1rem, 4.4vw, 1.25rem);
  }
  .species-live-card--year .species-live-value {
    --live-size: clamp(1.25rem, 6vw, 1.6rem);
  }
  .species-table th,
  .species-table td {
    padding: 0.7rem 0.6rem;
    font-size: 0.85rem;
  }
}
/* Four columns do not fit a phone. Each subgroup becomes a block: its name on
   top, the three figures in a row below, each with its column name. The header
   row stays in the accessibility tree, only hidden from sight. */
@media (max-width: 599px) {
  .species-table,
  .species-table tbody {
    display: block;
  }
  .species-table thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .species-table tbody {
    display: grid;
    grid-template-columns: repeat(3, auto);
    justify-content: space-between;
  }
  .species-table tbody tr {
    display: grid;
    grid-column: 1 / -1;
    grid-template-columns: repeat(3, auto);
    grid-template-columns: subgrid;
    gap: 0.35rem 1rem;
    padding: 0.85rem 1rem;
    border-top: 1px solid #f1f3f5;
  }
  .species-table tbody tr:first-child {
    border-top: none;
  }
  .species-table tbody th,
  .species-table tbody td {
    padding: 0;
    border-top: none;
    text-align: left;
  }
  .species-table tbody th {
    grid-column: 1 / -1;
    font-weight: 700;
  }
  .species-table td {
    font-size: 0.9rem;
  }
  .species-table td::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 0.1rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--brand-faint);
  }
}
</style>
