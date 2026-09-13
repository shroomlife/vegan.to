<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLiveState } from '@/composables/useLiveState'
import { useJsonLd } from '@/composables/useJsonLd'
import { animals } from '@/data/animals'
import { speciesProfiles, profileBySlug } from '@/data/species'
import { speciesFacts, lifeFacts } from '@/data/facts'
import { lifespanYearsBySpecies, slaughterAgeBySpecies, DAYS_PER_UNIT } from '@/data/lifespans'
import { formatNumber } from '@/utils/formatNumber'
import { applyDocumentMeta, SITE_URL } from '@/utils/documentMeta'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import SourceLinks from '@/components/SourceLinks.vue'

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
      <div class="species-inner">
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
          <template v-else>Gezählt vom Statistischen Bundesamt, Tiere inländischer Herkunft, ohne Hausschlachtungen und ohne Importe.</template>
        </p>

        <div class="species-live">
          <div class="species-live-card">
            <span class="species-live-value"><template v-if="raw.estimate">≈ </template><AnimatedNumber :value="live.currentDay" /></span>
            <span class="species-live-label">heute, seit Mitternacht</span>
          </div>
          <div class="species-live-card">
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
    </section>

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
              <td>{{ child.currentDayFormatted }}</td>
              <td>{{ child.perDayFormatted }}</td>
              <td>{{ child.currentYearFormatted }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="species-section species-section--mint">
      <div class="species-inner species-two">
        <article v-if="fact" class="species-card">
          <span class="chapter">Wer sie sind</span>
          <p class="species-card-text">{{ fact.text }}</p>
          <SourceLinks :ids="fact.sources" />
        </article>
        <article v-if="slaughterAge" class="species-card">
          <span class="chapter">Ein Leben</span>
          <p class="species-card-text">
            Geschlachtet mit {{ slaughterAge.min }} bis {{ slaughterAge.max }} {{ slaughterAge.unit }}.
            <template v-if="lifespanYears">Möglich wären bis zu {{ lifespanYears }} Jahre.</template>
          </p>
          <div v-if="lifespanYears" class="species-bar" aria-hidden="true">
            <span :style="{ width: `${livedPercent}%` }"></span>
          </div>
          <p v-if="lifespanYears" class="species-bar-note">
            <span class="species-bar-lived">gelebt</span>
            <span>möglich: {{ lifespanYears }} Jahre</span>
          </p>
          <SourceLinks :ids="profile.lifeSources" />
        </article>
      </div>
    </section>

    <section v-if="conditions.length" class="species-section species-section--cream">
      <div class="species-inner">
        <span class="chapter">Wie sie lebten</span>
        <h2 class="chapter-title">Das steht so im Gesetz.</h2>
        <div class="species-conditions">
          <article v-for="condition in conditions" :key="condition.figure" class="species-condition">
            <span class="species-condition-figure">{{ condition.figure }}</span>
            <span class="species-condition-unit">{{ condition.unit }}</span>
            <p class="species-condition-text">{{ condition.text }}</p>
            <SourceLinks :ids="condition.sources" />
          </article>
        </div>
      </div>
    </section>

    <section class="species-section species-section--mint">
      <div class="species-inner">
        <h2 class="chapter-title">Was du tun kannst</h2>
        <p class="chapter-lead">
          Eine Person, die vegan isst, erspart im Jahr rund 62 Tieren dieses Ende. Wie sich das auf Wasser, Klima und Land auswirkt,
          steht auf der Startseite. Und wie man anfängt, auch.
        </p>
        <div class="species-actions">
          <RouterLink to="/#impact" class="species-btn species-btn--primary">Dein Impact</RouterLink>
          <RouterLink to="/#mitmachen" class="species-btn">Mach mit</RouterLink>
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
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
}
.species-hero {
  padding: 3rem 0 3.5rem;
  background: var(--brand-cream);
}
.species-crumbs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
  font-size: 0.8rem;
  color: var(--brand-faint);
}
.species-crumbs a {
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
.species-live {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  margin-bottom: 1rem;
}
.species-live-card {
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
.species-live-value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.4vw, 1.7rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #e74c3c;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
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
  background: #e74c3c;
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
  color: #e74c3c;
}
.species-conditions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
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
  color: var(--brand-accent);
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

@media (max-width: 767px) {
  .species-hero {
    padding: 2rem 0 2.5rem;
  }
  .species-section {
    padding: 2.5rem 0;
  }
  .species-live,
  .species-two,
  .species-conditions {
    grid-template-columns: 1fr;
  }
  .species-table th,
  .species-table td {
    padding: 0.7rem 0.6rem;
    font-size: 0.85rem;
  }
}
</style>
