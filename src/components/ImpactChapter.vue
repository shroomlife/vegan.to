<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import { useLiveState } from '@/composables/useLiveState'
import { usePersonalTracker, formatDurationDative } from '@/composables/usePersonalTracker'
import { formatNumber } from '@/utils/formatNumber'
import { localIsoDate } from '@/utils/isoDate'
import { LAND_ANIMALS_PER_PERSON_YEAR, FISH_PER_PERSON_YEAR } from '@/utils/perCapita'
import SourceLinks from '@/components/SourceLinks.vue'

const { timer } = useLiveState()

/**
 * What one person saves per day eating vegan instead of a medium meat diet.
 *
 * CO2, land, water: Scarborough et al. 2023, Nature Food 4, 565-574,
 * tables 3 and 4, difference "vegan" to "medium meat-eater":
 * 2.47 vs 7.04 kg CO2e, 4.37 vs 11.28 m², 0.41 vs 0.78 m³ water per day.
 * https://doi.org/10.1038/s43016-023-00795-w
 *
 * Lives: Destatis slaughter figures (animals.ts) divided by the population
 * of Germany, per day. Land animals carry the card; the estimated fish from
 * the German catch stand beside it as their own line. Imports excluded.
 */
const impactTimeline = [
  { label: '1 Tag', days: 1 },
  { label: '1 Woche', days: 7 },
  { label: '1 Monat', days: 30 },
  { label: '6 Monate', days: 182 },
  { label: '1 Jahr', days: 365 },
  { label: '10 Jahre', days: 3650 },
  { label: '50 Jahre', days: 18250 },
]

const DAILY_LIVES = LAND_ANIMALS_PER_PERSON_YEAR / 365.25
const DAILY_FISH = FISH_PER_PERSON_YEAR / 365.25
const DAILY_WATER_L = 370
const DAILY_CO2_KG = 4.57
const DAILY_LAND_M2 = 6.91
const DAYS_PER_LIFE = Math.ceil(1 / DAILY_LIVES)

const activeImpact = ref(4) // Default: 1 Jahr
const activeItem = computed(() => impactTimeline[activeImpact.value]!)
const activeImpactData = computed(() => impactFor(activeItem.value.days))

const { veganSince, isSet: hasPersonalDate, daysSinceVegan, formattedDuration, clear: clearPersonalDate } = usePersonalTracker()
const personalImpact = computed(() => impactFor(daysSinceVegan.value))

/** The start date written out, "5. August 2023" */
const personalSinceLabel = computed(() => {
  const start = new Date(veganSince.value)
  if (Number.isNaN(start.getTime())) return ''
  return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(start)
})

/** The ring counts to the next full year of the visitor's own time */
const DAYS_PER_YEAR = 365.25
const RING_LENGTH = 2 * Math.PI * 58
const personalRing = computed(() => {
  const days = daysSinceVegan.value
  const nextYear = Math.floor(days / DAYS_PER_YEAR) + 1
  const share = (days % DAYS_PER_YEAR) / DAYS_PER_YEAR
  return {
    percent: Math.round(share * 100),
    nextYear,
    dashOffset: RING_LENGTH * (1 - share),
  }
})

/**
 * Milestones the visitor's own impact passes: the first few in days, then the
 * figures the cards count. The ones reached show a check; the next one says
 * how long it still takes at the daily rates.
 */
interface Milestone {
  label: string
  /** Days needed to reach it */
  days: number
}
const milestones: readonly Milestone[] = [
  { label: '1 Monat', days: 30 },
  { label: '1 Jahr', days: 365 },
  { label: '10 Landtiere', days: 10 / DAILY_LIVES },
  { label: '100.000 Liter Wasser', days: 100_000 / DAILY_WATER_L },
  { label: '1 Tonne CO₂', days: 1000 / DAILY_CO2_KG },
  { label: '5 Jahre', days: 5 * 365 },
  { label: '50 Landtiere', days: 50 / DAILY_LIVES },
  { label: '10 Jahre', days: 10 * 365 },
  { label: '100 Landtiere', days: 100 / DAILY_LIVES },
  { label: '1 Million Liter Wasser', days: 1_000_000 / DAILY_WATER_L },
]
const personalMilestones = computed(() => {
  const days = daysSinceVegan.value
  const sorted = [...milestones].sort((a, b) => a.days - b.days)
  const reached = sorted.filter((m) => m.days <= days)
  const next = sorted.find((m) => m.days > days)
  return {
    reached,
    next: next ? { label: next.label, inText: formatDurationDative(Math.ceil(next.days - days)) } : null,
  }
})
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
const todayLocalIso = computed(() => localIsoDate(timer.now.value))

const personalShareText = computed(() => {
  const impact = personalImpact.value
  return `Seit ${formattedDuration.value} lebe ich vegan und habe damit schon ${impact.lives.value} Landtieren das Leben gerettet (dazu rund ${impact.fish.value} Fische, geschätzt), ${impact.water.value} L Wasser gespart und ${impact.co2.value} kg CO₂ vermieden. 🌱\n\nWas ist dein Impact? 👉 https://vegan.to\n\n#GoVegan #VeganFürDieTiere`
})

function copyPersonalShare() {
  navigator.clipboard.writeText(personalShareText.value).then(() => {
    copyLabel.value = 'Kopiert! ✓'
    setTimeout(() => { copyLabel.value = 'Kopieren' }, 2000)
  })
}

interface Metric {
  value: string
  comparisons: string[]
}

type MetricKey = 'lives' | 'water' | 'co2' | 'land'

/** The four cards plus the fish figure, which the lives card shows as its own line */
function impactFor(days: number): Record<MetricKey, Metric> & { fish: { value: string } } {
  const lives = days * DAILY_LIVES
  const fish = days * DAILY_FISH
  const water = days * DAILY_WATER_L
  const co2 = days * DAILY_CO2_KG
  const land = days * DAILY_LAND_M2

  return {
    lives: { value: formatNumber(lives, lives < 10 ? 1 : 0), comparisons: lifeComparisons(lives) },
    fish: { value: formatNumber(fish, fish < 10 ? 1 : 0) },
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

/** "1 Badewanne", "900 Badewannen": the rounded figure decides the form */
function counted(value: number, singular: string, plural: string): string {
  const text = formatNumber(value)
  return `${text} ${text === '1' ? singular : plural}`
}

function waterComparisons(liters: number): string[] {
  const r: string[] = []
  const bathtubs = liters / 150
  const pools = liters / 50_000 // Gartenpool 8 x 4 m
  if (pools >= 1) r.push(`${counted(pools, 'Gartenpool', 'Gartenpools')} voll Wasser`)
  if (bathtubs >= 1) r.push(`${counted(bathtubs, 'volle Badewanne', 'volle Badewannen')}`)
  if (liters >= 1000) r.push(`${formatNumber(liters / 1000)} Tonnen Wasser, genug für ein kleines Dorf`)
  return r.slice(0, 2)
}

function co2Comparisons(kg: number): string[] {
  const r: string[] = []
  // myclimate, re-run 17.09.2026: Frankfurt to Palma de Mallorca, return,
  // economy, one traveller, ca. 2.500 km -> 0,618 t. The old 494 predates their
  // methodology update and understated the flight by a fifth.
  const flights = kg / 618
  const carKm = kg / 0.23 // UBA TREMOD 2024: Pkw inkl. Vorkette, ca. 230 g CO2e pro Fahrzeug-km
  if (flights >= 1) r.push(`${formatNumber(flights)}× nach Mallorca und zurück fliegen`)
  if (carKm >= 1) r.push(`${formatNumber(carKm)} km Autofahren`)
  return r.slice(0, 2)
}

function landComparisons(m2: number): string[] {
  const r: string[] = []
  const soccer = m2 / 7140 // FIFA Fußballfeld
  const tennis = m2 / 261 // Tennisplatz
  if (soccer >= 1) r.push(counted(soccer, 'Fußballfeld', 'Fußballfelder'))
  if (tennis >= 1) r.push(counted(tennis, 'Tennisplatz', 'Tennisplätze'))
  if (m2 >= 10) r.push(`${counted(m2 / 10, 'Parkplatz', 'Parkplätze')} weniger versiegelt`)
  if (r.length === 0) r.push(`Etwa so viel wie ein kleines Badezimmer`)
  return r.slice(0, 2)
}

/** Card order, labels and the daily rate behind each, shared by the period cards and the board */
const metrics: readonly { key: MetricKey; icon: string; label: string; shortLabel: string; unit: string; perDay: string }[] = [
  { key: 'lives', icon: '🐾', label: 'Landtiere gerettet', shortLabel: 'Landtiere', unit: '', perDay: '' },
  { key: 'water', icon: '💧', label: 'Wasser gespart', shortLabel: 'Wasser', unit: ' L', perDay: `${formatNumber(DAILY_WATER_L)} Liter am Tag` },
  { key: 'co2', icon: '🌿', label: 'CO₂ vermieden', shortLabel: 'CO₂', unit: ' kg', perDay: `${formatNumber(DAILY_CO2_KG, 2)} Kilogramm am Tag` },
  { key: 'land', icon: '🌾', label: 'Land geschont', shortLabel: 'Land', unit: ' m²', perDay: `${formatNumber(DAILY_LAND_M2, 2)} Quadratmeter am Tag` },
]
</script>

<template>
  <section id="impact" class="impact chapter-section">
    <div class="container">
      <span class="chapter">Was du bewirkst</span>
      <div class="impact-head">
        <div>
          <h2 class="chapter-title impact-title">Ein Mensch. {{ activeItem.label }}.</h2>
          <p class="chapter-lead impact-lead">
            So viel spart eine einzige Person, die vegan statt mit mittlerem Fleischkonsum isst.
            Wähle den Zeitraum, die Karten rechnen mit.<SourceLinks :ids="['scarborough', 'destatisPopulation', 'uba', 'myclimate']" class="impact-source" />
          </p>
        </div>
        <div class="impact-tabs" role="group" aria-label="Zeitraum">
          <button
            v-for="(item, i) in impactTimeline"
            :key="item.label"
            type="button"
            class="impact-tab"
            :class="{ 'impact-tab--active': activeImpact === i }"
            :aria-pressed="activeImpact === i"
            @click="activeImpact = i"
          >
            {{ item.label }}
          </button>
        </div>
      </div>

      <div class="impact-cards">
        <div
          v-for="(metric, index) in metrics"
          :key="metric.key"
          v-reveal="{ y: 24, duration: 0.45, delay: index * 0.07, amount: 0.3 }"
          class="impact-card"
          :class="`impact-card--${metric.key}`"
        >
          <span class="impact-card-icon" aria-hidden="true">{{ metric.icon }}</span>
          <span class="impact-card-value">{{ activeImpactData[metric.key].value }}<span v-if="metric.unit" class="impact-card-unit">{{ metric.unit }}</span></span>
          <span class="impact-card-label">{{ metric.label }}</span>
          <span v-if="metric.key === 'lives'" class="impact-card-extra">dazu ≈ {{ activeImpactData.fish.value }} Fische (geschätzt)</span>
          <span v-else class="impact-card-extra">{{ metric.perDay }}</span>
          <ul class="impact-card-comparisons">
            <li v-for="c in activeImpactData[metric.key].comparisons" :key="c">{{ c }}</li>
          </ul>
        </div>
      </div>

      <!-- Personal tracker -->
      <div
        v-reveal="{ y: 24, duration: 0.5, amount: 0.3 }"
        class="personal"
      >
        <div v-if="!hasPersonalDate" class="personal-intro">
          <div>
            <h3 class="personal-title">Mein Impact</h3>
            <p class="personal-prompt">Du lebst schon vegan? Trag ein, seit wann, und sieh, was du bereits bewirkt hast.</p>
          </div>
          <button type="button" class="personal-open-btn" @click="openTrackerModal">Jetzt eintragen</button>
        </div>

        <div v-else class="personal-result">
          <div class="personal-header">
            <div class="personal-header-copy">
              <span class="personal-kicker">Mein Impact</span>
              <p class="personal-duration">
                Du lebst seit <strong>{{ formattedDuration }}</strong> vegan.
              </p>
              <p class="personal-since">
                <template v-if="personalSinceLabel">Seit dem {{ personalSinceLabel }} · </template>{{ formatNumber(daysSinceVegan) }} {{ daysSinceVegan === 1 ? 'Tag' : 'Tage' }} ·
                <button type="button" class="personal-reset" @click="openTrackerModal">ändern</button>
              </p>
            </div>
            <!-- The ring fills towards the next full year -->
            <div class="personal-ring" role="img" :aria-label="`${personalRing.percent} Prozent auf dem Weg zu ${personalRing.nextYear} ${personalRing.nextYear === 1 ? 'Jahr' : 'Jahren'}`">
              <svg viewBox="0 0 132 132" width="132" height="132" aria-hidden="true">
                <circle class="personal-ring-track" cx="66" cy="66" r="58" />
                <circle class="personal-ring-fill" cx="66" cy="66" r="58" :stroke-dasharray="RING_LENGTH" :stroke-dashoffset="personalRing.dashOffset" />
              </svg>
              <span class="personal-ring-text">
                <strong>{{ personalRing.percent }} %</strong>
                <span>bis {{ personalRing.nextYear }} {{ personalRing.nextYear === 1 ? 'Jahr' : 'Jahre' }}</span>
              </span>
            </div>
          </div>

          <div class="personal-stats">
            <div v-for="metric in metrics" :key="metric.key" class="personal-stat">
              <span class="personal-stat-icon" aria-hidden="true">{{ metric.icon }}</span>
              <span class="personal-impact-value" :class="`personal-impact-value--${metric.key}`">{{ personalImpact[metric.key].value }}<span v-if="metric.unit" class="personal-impact-unit">{{ metric.unit }}</span></span>
              <span class="personal-stat-label">{{ metric.shortLabel }}</span>
              <span v-if="metric.key === 'lives'" class="personal-stat-extra">dazu ≈ {{ personalImpact.fish.value }} Fische (geschätzt)</span>
              <span v-else class="personal-stat-extra">≈ {{ personalImpact[metric.key].comparisons[0] }}</span>
            </div>
          </div>

          <div class="personal-milestones">
            <span class="personal-kicker">Meilensteine</span>
            <ul class="personal-milestone-list">
              <li v-for="milestone in personalMilestones.reached" :key="milestone.label" class="personal-milestone personal-milestone--reached">
                <span aria-hidden="true">✓</span> {{ milestone.label }}
              </li>
              <li v-if="personalMilestones.next" class="personal-milestone personal-milestone--next">
                {{ personalMilestones.next.label }} · in {{ personalMilestones.next.inText }}
              </li>
            </ul>
          </div>

          <div class="personal-share">
            <p class="personal-share-label">Danke, dass du Teil der Veränderung bist. Teile deinen Impact:</p>
            <div class="personal-share-buttons">
              <a
                :href="`https://x.com/intent/tweet?text=${encodeURIComponent(personalShareText)}`"
                target="_blank"
                rel="noopener"
                class="personal-share-btn"
                aria-label="Auf X teilen"
              >𝕏</a>
              <a
                :href="`whatsapp://send?text=${encodeURIComponent(personalShareText)}`"
                target="_blank"
                rel="noopener"
                class="personal-share-btn"
                aria-label="Per WhatsApp teilen"
              >WhatsApp</a>
              <a
                :href="`https://t.me/share/url?url=https%3A%2F%2Fvegan.to&text=${encodeURIComponent(personalShareText)}`"
                target="_blank"
                rel="noopener"
                class="personal-share-btn"
                aria-label="Per Telegram teilen"
              >Telegram</a>
              <button type="button" class="personal-share-btn personal-share-btn--copy" @click="copyPersonalShare">
                {{ copyLabel }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tracker modal: native <dialog>, opened via showModal() -->
      <dialog ref="trackerDialog" class="vt-modal" aria-labelledby="vt-modal-title" @mousedown.self="closeTrackerModal">
        <div class="vt-modal-body">
          <button type="button" class="vt-modal-close" aria-label="Schließen" @click="closeTrackerModal">&times;</button>
          <div class="vt-modal-emoji" aria-hidden="true">🌱</div>
          <h3 id="vt-modal-title" class="vt-modal-title">Seit wann lebst du vegan?</h3>
          <p class="vt-modal-desc">Wähle das Datum, wir rechnen den Rest aus.</p>
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
              type="button"
              class="vt-modal-btn vt-modal-btn--reset"
              @click="clearPersonalDate(); closeTrackerModal()"
            >
              Zurücksetzen
            </button>
            <button
              type="button"
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
</template>

<style scoped>
.impact {
  background: var(--brand-mint);
}
.impact-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.impact-title {
  font-variant-numeric: tabular-nums;
}
.impact-lead {
  max-width: 560px;
  margin-bottom: 0;
}
.impact-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(20, 54, 31, 0.08);
}
.impact-tab {
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--brand-green);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.impact-tab:hover {
  background: rgba(20, 54, 31, 0.08);
}
.impact-tab--active,
.impact-tab--active:hover {
  background: var(--brand-green);
  color: var(--brand-cream);
}
.impact-tab:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 2px;
}
/* Four cards on one grid of rows: icon, figure, label, note, comparisons, so every line aligns across the row */
.impact-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.1rem;
  align-items: stretch;
}
.impact-card {
  display: grid;
  grid-template-rows: 2rem auto auto 1fr auto;
  gap: 0.55rem;
  padding: 1.75rem 1.75rem 1.5rem;
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  border-radius: 24px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.impact-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(20, 54, 31, 0.1);
}
.impact-card-icon {
  font-size: 1.6rem;
  line-height: 2rem;
}
.impact-card-value {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.4vw, 2.4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.impact-card-unit,
.personal-impact-unit {
  margin-left: 0.3em;
  font-size: 0.5em;
  font-weight: 700;
  letter-spacing: 0;
  color: var(--brand-muted);
}
.impact-card--lives .impact-card-value { color: #e74c3c; }
.impact-card--water .impact-card-value { color: #2b7fb8; }
.impact-card--co2 .impact-card-value { color: var(--brand-green); }
.impact-card--land .impact-card-value { color: #b8781e; }
.impact-card-label {
  font-size: 1rem;
  font-weight: 700;
  color: var(--brand-green);
}
/* The note under the label: the fish estimate on the lives card, the daily rate on the others */
.impact-card-extra {
  font-size: 0.8rem;
  line-height: 1.5;
  color: var(--brand-faint);
  font-variant-numeric: tabular-nums;
}
.impact-card-comparisons {
  list-style: none;
  margin: 0.4rem 0 0;
  padding: 0.85rem 0 0;
  border-top: 1px solid rgba(20, 54, 31, 0.08);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.impact-card-comparisons li {
  position: relative;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: var(--brand-muted);
}
.impact-card-comparisons li::before {
  content: '≈';
  position: absolute;
  left: 0;
  font-weight: 700;
  color: #b8b0a0;
}

/* Personal tracker: a dark board that turns the period numbers into the visitor's own */
.personal {
  margin-top: 2.5rem;
  padding: 1.75rem 2rem;
  border-radius: 28px;
  background: var(--brand-green);
  color: var(--brand-cream);
  box-shadow: 0 30px 70px rgba(20, 54, 31, 0.25);
}
.personal-result {
  margin: -1.75rem -2rem;
}
.personal-kicker {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7fe0a5;
}
.personal-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.personal-title {
  margin: 0 0 0.35rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: -0.02em;
  color: var(--brand-cream);
}
.personal-prompt {
  max-width: 520px;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(246, 241, 231, 0.7);
}
.personal-open-btn,
.vt-modal-btn--save {
  padding: 12px 22px;
  border: none;
  border-radius: 999px;
  background: var(--brand-accent);
  color: var(--brand-green);
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
}
.personal-open-btn:hover,
.vt-modal-btn--save:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 22px rgba(255, 106, 61, 0.35);
}
.personal-open-btn:focus-visible {
  outline: 2px solid var(--brand-cream);
  outline-offset: 3px;
}
.personal-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 3rem 2rem;
}
.personal-header-copy {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.personal-duration {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.6vw, 2.1rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.personal-duration strong {
  color: #ffb37a;
}
.personal-since {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(246, 241, 231, 0.7);
  font-variant-numeric: tabular-nums;
}
.personal-reset {
  padding: 0;
  border: none;
  background: transparent;
  color: var(--brand-cream);
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.personal-reset:hover {
  color: #ffb37a;
}
.personal-ring {
  position: relative;
  width: 132px;
  height: 132px;
  display: grid;
  place-items: center;
}
.personal-ring svg {
  position: absolute;
  inset: 0;
  transform: rotate(-90deg);
}
.personal-ring circle {
  fill: none;
  stroke-width: 8;
}
.personal-ring-track {
  stroke: rgba(246, 241, 231, 0.12);
}
.personal-ring-fill {
  stroke: var(--brand-accent);
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease-out;
}
.personal-ring-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-align: center;
}
.personal-ring-text strong {
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.03em;
}
.personal-ring-text span {
  font-size: 0.66rem;
  line-height: 1.3;
  color: rgba(246, 241, 231, 0.65);
}
/* The four own figures, one strip with hairlines between them */
.personal-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1px;
  background: rgba(246, 241, 231, 0.1);
  border-top: 1px solid rgba(246, 241, 231, 0.1);
  border-bottom: 1px solid rgba(246, 241, 231, 0.1);
}
.personal-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
  padding: 1.75rem 2rem;
  background: var(--brand-green);
}
.personal-stat-icon {
  font-size: 1.35rem;
}
.personal-impact-value {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.4vw, 2.1rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.personal-impact-unit {
  color: rgba(246, 241, 231, 0.7);
}
.personal-impact-value--lives { color: var(--brand-accent); }
.personal-impact-value--water { color: #8fd0ff; }
.personal-impact-value--co2 { color: #7fe0a5; }
.personal-impact-value--land { color: #f2c27b; }
.personal-stat-label {
  font-size: 0.9rem;
  font-weight: 700;
}
.personal-stat-extra {
  font-size: 0.78rem;
  line-height: 1.4;
  color: rgba(246, 241, 231, 0.6);
  font-variant-numeric: tabular-nums;
}
.personal-milestones {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.75rem 3rem 0;
}
.personal-milestone-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.personal-milestone {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 34px;
  padding: 0 0.8rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}
.personal-milestone--reached {
  background: rgba(127, 224, 165, 0.14);
  color: #7fe0a5;
}
.personal-milestone--next {
  border: 1px dashed rgba(246, 241, 231, 0.3);
  color: rgba(246, 241, 231, 0.65);
}
.personal-share {
  padding: 1.25rem 3rem 2.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.personal-share-label {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(246, 241, 231, 0.7);
}
.personal-share-buttons {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.personal-share-btn {
  display: inline-flex;
  align-items: center;
  padding: 7px 14px;
  border: 1px solid rgba(246, 241, 231, 0.2);
  border-radius: 999px;
  background: rgba(246, 241, 231, 0.08);
  color: var(--brand-cream);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s;
}
.personal-share-btn:hover,
.personal-share-btn:focus-visible {
  background: rgba(246, 241, 231, 0.16);
  color: var(--brand-cream);
  text-decoration: none;
}
.personal-share-btn--copy {
  border-color: var(--brand-accent);
}

/* Modal: native <dialog>, the UA centers it in the top layer */
.vt-modal {
  border: none;
  padding: 0;
  background: var(--brand-cream);
  color: var(--brand-green);
  border-radius: 24px;
  max-width: 400px;
  width: calc(100% - 2rem);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
  text-align: center;
}
.vt-modal[open] {
  animation: modalSlideIn 0.3s ease;
}
.vt-modal::backdrop {
  background: rgba(6, 15, 9, 0.6);
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
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: none;
  font-size: 2rem;
  line-height: 1;
  color: #b8b0a0;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.vt-modal-close:hover {
  background: rgba(20, 54, 31, 0.08);
  color: var(--brand-green);
}
.vt-modal-emoji {
  font-size: 3rem;
  margin-bottom: 0.75rem;
}
.vt-modal-title {
  margin: 0 0 0.5rem;
  font-family: var(--font-display);
  font-size: 1.2rem;
  letter-spacing: -0.02em;
}
.vt-modal-desc {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #4a5a4f;
}
.vt-modal-input {
  display: block;
  width: 100%;
  max-width: 240px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  border: 2px solid rgba(20, 54, 31, 0.12);
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 1.1rem;
  text-align: center;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.vt-modal-input:focus {
  border-color: var(--brand-accent);
  box-shadow: 0 0 0 3px rgba(255, 106, 61, 0.2);
}
.vt-modal-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.vt-modal-btn {
  font: inherit;
  cursor: pointer;
}
.vt-modal-btn--save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.vt-modal-btn--reset {
  padding: 12px 18px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: #e74c3c;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.vt-modal-btn--reset:hover {
  background: rgba(231, 76, 60, 0.08);
}

@media (max-width: 991px) {
  .impact-cards,
  .personal-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .impact-tabs {
    width: 100%;
    justify-content: center;
    border-radius: 18px;
  }
  .impact-tab {
    padding: 7px 11px;
    font-size: 0.74rem;
  }
  .impact-card {
    padding: 1.1rem 1.1rem 1rem;
    border-radius: 16px;
  }
  .personal {
    padding: 1.35rem 1.25rem;
    border-radius: 20px;
  }
  .personal-result {
    margin: -1.35rem -1.25rem;
  }
  .personal-header {
    grid-template-columns: 1fr;
    justify-items: start;
    gap: 1.25rem;
    padding: 1.75rem 1.5rem 1.5rem;
  }
  .personal-stat {
    padding: 1.1rem 1.25rem;
  }
  .personal-milestones {
    padding: 1.25rem 1.5rem 0;
  }
  .personal-share {
    padding: 1rem 1.5rem 1.75rem;
  }
  .vt-modal {
    border-radius: 18px;
  }
  .vt-modal-body {
    padding: 2rem 1.5rem 1.5rem;
  }
}
</style>
