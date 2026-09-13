<script setup lang="ts">
import { ref, computed, useTemplateRef } from 'vue'
import dayjs from 'dayjs'
import { Motion } from 'motion-v'
import { animals } from '@/data/animals'
import { useLiveState } from '@/composables/useLiveState'
import { usePersonalTracker } from '@/composables/usePersonalTracker'
import { formatNumber } from '@/utils/formatNumber'
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
 * of Germany, per day. Estimated fish included, imports excluded.
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

const POPULATION_DE = 83_500_000 // Destatis, Bevölkerungsstand Ende 2025
const YEARLY_DEATHS_DE = animals.reduce((sum, a) => sum + a.deaths.year, 0)
const DAILY_LIVES = YEARLY_DEATHS_DE / POPULATION_DE / 365.25
const DAILY_WATER_L = 370
const DAILY_CO2_KG = 4.57
const DAILY_LAND_M2 = 6.91
const DAYS_PER_LIFE = Math.ceil(1 / DAILY_LIVES)

const activeImpact = ref(4) // Default: 1 Jahr
const activeItem = computed(() => impactTimeline[activeImpact.value]!)
const activeImpactData = computed(() => impactFor(activeItem.value.days))

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

interface Metric {
  value: string
  comparisons: string[]
}

function impactFor(days: number): Record<'lives' | 'water' | 'co2' | 'land', Metric> {
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

/** Card order and labels, shared by the period cards and the personal result */
const metrics = [
  { key: 'lives', icon: '🐾', label: 'Tierleben gerettet', unit: '' },
  { key: 'water', icon: '💧', label: 'Wasser gespart', unit: ' L' },
  { key: 'co2', icon: '🌿', label: 'CO₂ vermieden', unit: ' kg' },
  { key: 'land', icon: '🌾', label: 'Land geschont', unit: ' m²' },
] as const
</script>

<template>
  <section id="impact" class="impact">
    <div class="container">
      <span class="chapter">Kapitel 6 &middot; Was du bewirkst</span>
      <div class="impact-head">
        <div>
          <h2 class="impact-title">Ein Mensch. {{ activeItem.label }}.</h2>
          <p class="impact-lead">
            So viel spart eine einzige Person, die vegan statt mit mittlerem Fleischkonsum isst.
            Wähle den Zeitraum, die Karten rechnen mit.
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
        <Motion
          v-for="(metric, index) in metrics"
          :key="metric.key"
          as="article"
          class="impact-card"
          :class="`impact-card--${metric.key}`"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, delay: index * 0.07 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
        >
          <span class="impact-card-icon" aria-hidden="true">{{ metric.icon }}</span>
          <span class="impact-card-value">{{ activeImpactData[metric.key].value }}{{ metric.unit }}</span>
          <span class="impact-card-label">{{ metric.label }}</span>
          <ul class="impact-card-comparisons">
            <li v-for="c in activeImpactData[metric.key].comparisons" :key="c">{{ c }}</li>
          </ul>
        </Motion>
      </div>

      <SourceLinks :ids="['scarborough', 'destatisPopulation', 'uba', 'myclimate']" class="impact-source" />

      <!-- Personal tracker -->
      <Motion
        class="personal"
        :initial="{ opacity: 0, y: 24 }"
        :whileInView="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5 }"
        :inViewOptions="{ once: true, amount: 0.3 }"
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
            <p class="personal-duration">
              Du lebst seit <strong>{{ formattedDuration }}</strong> vegan.
            </p>
            <button type="button" class="personal-reset" @click="openTrackerModal">ändern</button>
          </div>

          <div class="personal-stats">
            <div v-for="metric in metrics" :key="metric.key" class="personal-stat">
              <span class="personal-stat-icon" aria-hidden="true">{{ metric.icon }}</span>
              <span class="personal-impact-value" :class="`personal-impact-value--${metric.key}`">{{ personalImpact[metric.key].value }}{{ metric.unit }}</span>
              <span class="personal-stat-label">{{ metric.label }}</span>
            </div>
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
      </Motion>

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
  padding: 3.5rem 0 3rem;
  background: var(--brand-cream);
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
  margin: 0 0 0.6rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
  color: var(--brand-green);
  font-variant-numeric: tabular-nums;
}
.impact-lead {
  max-width: 560px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.65;
  color: #4a5a4f;
}
.impact-tabs {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(20, 54, 31, 0.07);
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
.impact-cards {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}
.impact-card {
  display: flex;
  flex-direction: column;
  padding: 1.35rem 1.35rem 1.2rem;
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  border-radius: 20px;
}
.impact-card-icon {
  font-size: 1.5rem;
  line-height: 1;
  margin-bottom: 0.9rem;
}
.impact-card-value {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.2vw, 1.8rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.impact-card--lives .impact-card-value { color: #e74c3c; }
.impact-card--water .impact-card-value { color: #2b7fb8; }
.impact-card--co2 .impact-card-value { color: var(--brand-green); }
.impact-card--land .impact-card-value { color: #b8781e; }
.impact-card-label {
  margin-top: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8d8474;
}
.impact-card-comparisons {
  list-style: none;
  margin: 0.9rem 0 0;
  padding: 0.8rem 0 0;
  border-top: 1px solid #f1f3f5;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.impact-card-comparisons li {
  position: relative;
  padding-left: 1.1rem;
  font-size: 0.85rem;
  line-height: 1.45;
  color: #4a5a4f;
}
.impact-card-comparisons li::before {
  content: '≈';
  position: absolute;
  left: 0;
  font-weight: 700;
  color: #b8b0a0;
}
.impact-source {
  margin-top: 0.9rem;
}

/* Personal tracker: a dark card that turns the period numbers into the visitor's own */
.personal {
  margin-top: 1.5rem;
  padding: 1.75rem 2rem;
  border-radius: 24px;
  background: var(--brand-night);
  color: var(--brand-cream);
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
  display: flex;
  align-items: center;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
}
.personal-duration {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
}
.personal-duration strong {
  color: var(--brand-accent);
}
.personal-reset {
  padding: 4px 10px;
  border: 1px solid rgba(246, 241, 231, 0.25);
  border-radius: 999px;
  background: transparent;
  color: rgba(246, 241, 231, 0.7);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.personal-reset:hover {
  background: rgba(246, 241, 231, 0.1);
  color: var(--brand-cream);
}
.personal-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.75rem;
}
.personal-stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0.9rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(246, 241, 231, 0.12);
  background: rgba(246, 241, 231, 0.045);
}
.personal-stat-icon {
  font-size: 1.1rem;
  margin-bottom: 0.4rem;
}
.personal-impact-value {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  overflow-wrap: anywhere;
}
.personal-impact-value--lives { color: var(--brand-accent); }
.personal-impact-value--water { color: #8fd0ff; }
.personal-impact-value--co2 { color: #7fe0a5; }
.personal-impact-value--land { color: #f2c27b; }
.personal-stat-label {
  margin-top: 0.25rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.55);
}
.personal-share {
  margin-top: 1.1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(246, 241, 231, 0.12);
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
  .impact {
    padding: 2.5rem 0 2rem;
  }
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
  .personal-stats {
    gap: 0.5rem;
  }
  .personal-stat {
    padding: 0.75rem 0.8rem;
  }
  .vt-modal {
    border-radius: 18px;
  }
  .vt-modal-body {
    padding: 2rem 1.5rem 1.5rem;
  }
}
</style>
