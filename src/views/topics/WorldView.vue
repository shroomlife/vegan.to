<script setup lang="ts">
import { computed } from 'vue'
import { useLiveState } from '@/composables/useLiveState'
import { WORLD_YEAR, worldFish, worldSpecies, worldTotal } from '@/data/topics/world'
import { topicByName } from '@/data/topics'
import { meatConsumption } from '@/data/topics/perCapita'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import { formatPercent } from '@/utils/trend'
import ContentPage from '@/components/ContentPage.vue'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import BarList from '@/components/BarList.vue'
import DataTable from '@/components/DataTable.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('World')
const { timer } = useLiveState()

const total = worldTotal(WORLD_YEAR)
const total2004 = worldTotal(2004)

/** Same method as the German counters: the yearly figure spread evenly over the current year */
const perSecond = computed(() => total / timer.secondsInCurrentYear.value)
const perDay = computed(() => total / timer.daysInCurrentYear.value)
const sinceStart = computed(() => Math.round(perSecond.value * timer.secondsSinceStart.value))
const thisYear = computed(() => Math.round(perSecond.value * timer.secondsSinceYearStart.value))

const bySize = [...worldSpecies].sort((a, b) => b.counts[2024] - a.counts[2024])
const bars = bySize.map((species) => ({
  label: `${species.emoji} ${species.name}`,
  value: species.counts[2024],
  display: formatCompact(species.counts[2024], species.counts[2024] >= 1e9 ? 2 : 1),
}))

const chickens = worldSpecies.find((species) => species.name === 'Hühner')
const pigs = worldSpecies.find((species) => species.name === 'Schweine')
const cattle = worldSpecies.find((species) => species.name === 'Rinder')
const chickenShare = chickens ? (chickens.counts[2024] / total) * 100 : 0
/** Share of the twenty-year increase that is chickens alone */
const chickenShareOfGrowth = chickens ? ((chickens.counts[2024] - chickens.counts[2004]) / (total - total2004)) * 100 : 0

function change(from: number, to: number): string {
  return formatPercent(((to - from) / from) * 100)
}

/** Unsigned change for running text, where "stieg um" already carries the direction */
function changeAmount(from: number, to: number): string {
  return `${formatNumber(Math.abs(((to - from) / from) * 100), 1)} Prozent`
}

const trendRows = bySize.slice(0, 9).map((species) => [
  species.name,
  formatCompact(species.counts[2004]),
  formatCompact(species.counts[2014]),
  formatCompact(species.counts[2024]),
  change(species.counts[2004], species.counts[2024]),
])

const SECONDS_PER_YEAR = 365 * 86_400
const wildPerSecond = {
  min: worldFish.wild.min / SECONDS_PER_YEAR,
  max: worldFish.wild.max / SECONDS_PER_YEAR,
}

const answers = computed(() => [
  {
    question: 'Wie viele Tiere werden weltweit pro Sekunde geschlachtet?',
    answer: `Rund ${formatNumber(perSecond.value)} Landtiere pro Sekunde, gerechnet aus den ${formatCompact(total)} Landtieren, die laut FAO im Jahr ${WORLD_YEAR} weltweit für Fleisch geschlachtet wurden. Fische sind darin nicht enthalten: Allein aus Wildfang sind es geschätzt ${formatNumber(wildPerSecond.min)} bis ${formatNumber(wildPerSecond.max)} pro Sekunde.`,
  },
  {
    question: 'Wie viele Tiere werden weltweit pro Tag geschlachtet?',
    answer: `Rund ${formatCompact(perDay.value)} Landtiere am Tag. Davon sind ${formatNumber(chickenShare)} Prozent Hühner.`,
  },
  {
    question: 'Wie viele Tiere werden weltweit pro Jahr geschlachtet?',
    answer: `${formatCompact(total)} Landtiere im Jahr ${WORLD_YEAR} laut FAO, darunter ${formatCompact(chickens?.counts[2024] ?? 0, 2)} Hühner und ${formatCompact(pigs?.counts[2024] ?? 0, 2)} Schweine. Dazu kommen geschätzt 1,1 bis 2,2 Billionen wild gefangene Fische pro Jahr (Mittel ${worldFish.wild.period}) und rund ${formatNumber(worldFish.farmed.mid / 1e9)} Milliarden Fische aus Aquakultur (${worldFish.farmed.year}).`,
  },
  {
    question: 'Werden heute mehr Tiere geschlachtet als früher?',
    answer: `Ja. ${WORLD_YEAR} waren es ${formatCompact(total)} Landtiere, 2004 noch ${formatCompact(total2004)}, ein Anstieg um ${formatNumber(((total - total2004) / total2004) * 100)} Prozent in zwanzig Jahren. ${formatNumber(chickenShareOfGrowth)} Prozent des Zuwachses entfallen auf Hühner.`,
  },
])

const turkeys = worldSpecies.find((species) => species.name === 'Truthühner')
/** German meat consumption per head: the series peak, its low and the latest year */
const meatPeak = meatConsumption.reduce((max, entry) => (entry.total > max.total ? entry : max))
const meatLow = meatConsumption.reduce((min, entry) => (entry.total < min.total ? entry : min))
const meatLatest = meatConsumption[meatConsumption.length - 1]
const rabbits = worldSpecies.find((species) => species.name === 'Kaninchen und Hasen')
const brightSpots = [
  {
    title: 'Weniger Puten weltweit',
    text: `Weltweit wurden ${WORLD_YEAR} rund ${formatCompact(turkeys?.counts[2024] ?? 0)} Puten geschlachtet, 2004 waren es noch ${formatCompact(turkeys?.counts[2004] ?? 0)}.`,
    sources: ['faoQcl'] as const,
  },
  {
    title: 'Weniger Kaninchen als vor zehn Jahren',
    text: `2014 wurden weltweit ${formatCompact(rabbits?.counts[2014] ?? 0)} Kaninchen und Hasen geschlachtet, ${WORLD_YEAR} waren es ${formatCompact(rabbits?.counts[2024] ?? 0)}.`,
    sources: ['faoQcl'] as const,
  },
  {
    title: `Weniger Fleisch als ${meatPeak.year}`,
    text: `Pro Kopf wird in Deutschland heute weniger Fleisch gegessen als ${meatPeak.year}, ${formatNumber(meatLatest?.total ?? 0, 1)} statt ${formatNumber(meatPeak.total, 1)} Kilogramm, auch wenn der Verzehr seit ${meatLow.year} wieder leicht steigt. Die Zahlen stehen auf der Seite „Pro Kopf“.`,
    sources: ['bleMeatBalance'] as const,
  },
]
</script>

<template>
  <ContentPage
    :kicker="`Weltweit · FAO ${WORLD_YEAR}`"
    :title="`Rund ${formatNumber(total / 1e9, 1)}\u00A0Milliarden Landtiere im Jahr.`"
    :lead="`So viele Landtiere wurden ${WORLD_YEAR} weltweit für Fleisch geschlachtet, laut der Welternährungsorganisation FAO. Das sind rund ${formatNumber(perSecond)} in jeder Sekunde. Fische sind darin nicht enthalten. Zu ihnen steht mehr weiter unten.`"
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <template #hero>
      <div class="world-live">
        <div class="world-live-card">
          <span class="world-live-value"><AnimatedNumber :value="thisYear" /></span>
          <span class="world-live-label">dieses Jahr, hochgerechnet</span>
        </div>
        <div class="world-live-card world-live-card--accent">
          <span class="world-live-value">{{ formatNumber(sinceStart) }}</span>
          <span class="world-live-label">seit du hier bist</span>
        </div>
      </div>
      <p class="world-live-note">
        Hochrechnung: der FAO-Jahreswert {{ WORLD_YEAR }} gleichmäßig auf das laufende Jahr verteilt, so wie bei den Zählern für Deutschland.
      </p>
      <SourceLinks :ids="['faoQcl']" />
    </template>

    <h2>Fast neun von zehn sind Hühner</h2>
    <p>
      Von den {{ formatCompact(total) }} Landtieren waren {{ formatCompact(chickens?.counts[2024] ?? 0, 2) }} Hühner, also
      {{ formatNumber(chickenShare, 1) }} Prozent. Bei Schweinen waren es {{ formatCompact(pigs?.counts[2024] ?? 0, 2) }},
      bei Rindern {{ formatCompact(cattle?.counts[2024] ?? 0) }}.
    </p>
    <BarList
      :caption="`Weltweit geschlachtete Landtiere ${WORLD_YEAR}, nach Art`"
      :items="bars"
      :note="`Siebzehn Arten, für die die FAO für ${WORLD_YEAR} Schlachtzahlen ausweist. Viele Werte sind Schätzungen der FAO.`"
      :sources="['faoQcl']"
    />

    <h2>Zwanzig Jahre: plus {{ formatNumber(((total - total2004) / total2004) * 100) }}&nbsp;Prozent</h2>
    <p>
      2004 wurden weltweit {{ formatCompact(total2004) }} Landtiere geschlachtet, {{ WORLD_YEAR }} waren es
      {{ formatCompact(total) }}. {{ formatNumber(chickenShareOfGrowth) }} Prozent dieses Zuwachses entfallen auf Hühner: Bei ihnen stieg die Zahl um
      {{ chickens ? changeAmount(chickens.counts[2004], chickens.counts[2024]) : '' }}, bei Schweinen um
      {{ pigs ? changeAmount(pigs.counts[2004], pigs.counts[2024]) : '' }}.
    </p>
    <DataTable
      caption="Weltweit geschlachtete Tiere, die neun häufigsten Arten"
      :head="['Art', '2004', '2014', String(WORLD_YEAR), 'seit 2004']"
      :rows="trendRows"
      layout="stack"
      :sources="['faoQcl']"
    />

    <h2>Fische: um ein Vielfaches mehr</h2>
    <p>
      Fische werden weltweit nur in Tonnen erfasst, nicht als einzelne Tiere. Forschende der Organisation fishcount haben die
      Fangmengen mit Durchschnittsgewichten je Art in Tiere umgerechnet. Das Ergebnis ist eine Spanne, keine Zählung, aber
      selbst ihr unteres Ende liegt weit über allen Landtieren zusammen.
    </p>
    <FigureGrid
      :items="[
        {
          value: '1,1 bis 2,2\u00A0Billionen',
          label: 'wild gefangene Fische pro Jahr',
          note: `Mittel der Jahre ${worldFish.wild.period}. Das sind ${formatNumber(wildPerSecond.min)} bis ${formatNumber(wildPerSecond.max)} pro Sekunde. Ohne illegalen Fang, Rückwürfe und Geisternetze.`,
          sources: ['moodBrookeWild'],
        },
        {
          value: `${formatCompact(worldFish.farmed.mid, 0)}`,
          label: `Fische aus Aquakultur, ${worldFish.farmed.year}`,
          note: `Spanne ${formatCompact(worldFish.farmed.min, 0)} bis ${formatCompact(worldFish.farmed.max, 0)}. Ohne Fische, die schon während der Aufzucht sterben.`,
          sources: ['moodFarmed'],
        },
      ]"
    />
    <p>
      Deshalb laufen Fische hier nicht im Zähler mit. Eine Spanne von über einer Billion Tieren lässt sich nicht als Zahl
      pro Sekunde darstellen, ohne eine Genauigkeit vorzutäuschen, die es nicht gibt.
    </p>

    <h2>Und Deutschland?</h2>
    <p>
      Für Deutschland gibt es eine eigene, amtliche Zählung des Statistischen Bundesamts. Die laufenden Zähler für jede
      Tierart stehen auf der <RouterLink to="/">Startseite</RouterLink> und unter <RouterLink to="/tiere">Alle Tierarten</RouterLink>.
      Wie viele Tiere dort in den Ställen stehen, zeigt die Seite <RouterLink to="/tierbestand">Tierbestand</RouterLink>.
    </p>

    <h2>So wird gerechnet</h2>
    <ul>
      <li>
        Grundlage ist die FAO-Datenbank FAOSTAT, Datenstand Dezember 2025, mit dem Jahr {{ WORLD_YEAR }} als jüngstem Wert.
        Gezählt sind siebzehn Arten, für die die FAO für {{ WORLD_YEAR }} Schlachtzahlen ausweist, von Hühnern bis Maultieren.
      </li>
      <li>
        Viele Länder melden keine vollständigen Zahlen. Die FAO ergänzt sie durch eigene Schätzungen und kennzeichnet diese.
        Die Summe ist deshalb die beste verfügbare Größenordnung, keine Zählung bis aufs letzte Tier.
      </li>
      <li>
        Für den Zähler wird der Jahreswert gleichmäßig auf die Sekunden des laufenden Jahres verteilt. Das ist eine
        Hochrechnung aus {{ WORLD_YEAR }}, kein Messwert für heute.
      </li>
    </ul>

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="World" />
  </ContentPage>
</template>

<style scoped>
.world-live {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.9rem;
  max-width: 640px;
  margin: 1.75rem 0 0.75rem;
}
.world-live-card {
  padding: 1.1rem 1.25rem;
  border-radius: 18px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.world-live-card--accent {
  background: var(--brand-green);
  border-color: var(--brand-green);
}
.world-live-value {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.4vw, 1.7rem);
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--brand-death-text);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.world-live-card--accent .world-live-value {
  color: var(--brand-accent);
}
.world-live-label {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
.world-live-card--accent .world-live-label {
  color: rgba(246, 241, 231, 0.7);
}
.world-live-note {
  margin: 0 0 0.5rem;
  max-width: 640px;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--brand-muted);
}
@media (max-width: 767px) {
  .world-live {
    grid-template-columns: 1fr;
  }
}
</style>
