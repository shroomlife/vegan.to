<script setup lang="ts">
import { topicByName } from '@/data/topics'
import { slaughterTrendBySpecies } from '@/data/trends'
import { MONTHS, byOrigin2025, byState2025, monthly, otherUnlisted, poultry2025, press } from '@/data/topics/slaughterStats'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import { numberWord } from '@/utils/numberWords'
import { formatPercent } from '@/utils/trend'
import ContentPage from '@/components/ContentPage.vue'
import BarList from '@/components/BarList.vue'
import DataTable from '@/components/DataTable.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'

const topic = topicByName('SlaughterStats')
const DAYS_2025 = 365

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)

const mammalsAll = sum(byOrigin2025.map((row) => row.domestic + row.foreign + row.home))
const mammalsDomestic = sum(byOrigin2025.map((row) => row.domestic))
const allAnimals = mammalsAll + poultry2025.total

const originRows = [
  ...byOrigin2025.map((row) => [
    row.name,
    formatNumber(row.domestic),
    formatNumber(row.foreign),
    formatNumber(row.home),
    formatNumber(row.domestic + row.foreign + row.home),
  ]),
  ['Zusammen', formatNumber(mammalsDomestic), formatNumber(sum(byOrigin2025.map((row) => row.foreign))), formatNumber(sum(byOrigin2025.map((row) => row.home))), formatNumber(mammalsAll)],
]

const pigs = byOrigin2025.find((row) => row.name === 'Schweine')
const cattle = byOrigin2025.find((row) => row.name === 'Rinder')
const weightFigures = [
  { value: `${formatNumber(((pigs?.domesticTonnes ?? 0) * 1000) / (pigs?.domestic ?? 1))}\u00A0kg`, label: 'Schlachtgewicht je Schwein', sources: ['destatisSlaughter'] as const },
  { value: `${formatNumber(((cattle?.domesticTonnes ?? 0) * 1000) / (cattle?.domestic ?? 1))}\u00A0kg`, label: 'Schlachtgewicht je Rind, Kälber eingerechnet', sources: ['destatisSlaughter'] as const },
  { value: `${formatNumber(poultry2025.turkeysKg / poultry2025.turkeys, 1)}\u00A0kg`, label: 'Schlachtgewicht je Pute', sources: ['destatisPoultry'] as const },
  { value: `${formatNumber(poultry2025.broilersKg / poultry2025.broilers, 2)}\u00A0kg`, label: 'Schlachtgewicht je Masthuhn', sources: ['destatisPoultry'] as const },
]

const monthBars = (values: readonly number[]) => values.map((value, index) => ({ label: MONTHS[index] ?? '', value }))
const pigMin = Math.min(...monthly.pigs2025)
const pigMax = Math.max(...monthly.pigs2025)
const pigMinMonth = MONTHS[monthly.pigs2025.indexOf(pigMin)]
const pigMaxMonth = MONTHS[monthly.pigs2025.indexOf(pigMax)]

const knownGeese = monthly.geese2025.filter((value): value is number => value !== undefined)
const geeseAutumn = sum(monthly.geese2025.slice(8).filter((value): value is number => value !== undefined))
const geeseBars = monthly.geese2025
  .map((value, index) => ({ label: MONTHS[index] ?? '', value: value ?? 0, display: value === undefined ? 'kein Wert' : undefined }))

const monthsSoFar2026 = monthly.pigs2026.length
const pigs2026 = sum(monthly.pigs2026)
const pigsSamePeriod2025 = sum(monthly.pigs2025.slice(0, monthsSoFar2026))
const cattle2026 = sum(monthly.cattle2026)
const cattleSamePeriod2025 = sum(monthly.cattle2025.slice(0, monthsSoFar2026))
const lastMonth2026 = MONTHS[monthsSoFar2026 - 1]

function stateBars(pick: (row: (typeof byState2025)[number]) => number | undefined) {
  return byState2025
    .map((row) => ({ label: row.state, value: pick(row) }))
    .filter((row): row is { label: string; value: number } => row.value !== undefined)
    .sort((a, b) => b.value - a.value)
}
const pigStates = stateBars((row) => row.pigs)
const cattleStates = stateBars((row) => row.cattle)
const poultryStates = stateBars((row) => row.poultry)
const lambStates = stateBars((row) => row.lambsAndSheep)
const topTwoPigs = ((pigStates[0]?.value ?? 0) + (pigStates[1]?.value ?? 0)) / (pigs?.domestic ?? 1) * 100
const lowerSaxonyPoultry = (poultryStates[0]?.value ?? 0) / poultry2025.total * 100
/** States whose poultry figure Destatis keeps secret, and what that hides in total */
const poultrySecretStates = byState2025.filter((row) => row.poultryStatus === 'secret')
const poultrySecretTotal = poultry2025.total - sum(poultryStates.map((row) => row.value))
const poultryNoneStates = byState2025.filter((row) => row.poultryStatus === 'none').map((row) => row.state)
/** "Berlin, Bremen und Hamburg" */
const poultryNoneList = `${poultryNoneStates.slice(0, -1).join(', ')} und ${poultryNoneStates[poultryNoneStates.length - 1] ?? ''}`
const poultryStatesNote = `Für ${numberWord(poultrySecretStates.length)} Länder weist Destatis keinen Wert aus: Dort gibt es nur wenige Betriebe, die Zahl würde Rückschlüsse auf einzelne Unternehmen erlauben (Geheimhaltung). Zusammen sind das rund ${formatNumber(poultrySecretTotal / 1e6)} Millionen Tiere oder ${formatNumber((poultrySecretTotal / poultry2025.total) * 100)} Prozent. In ${poultryNoneList} gibt es keine Geflügelschlachtungen.`

const answers = [
  {
    question: 'Wie viele Tiere werden in Deutschland pro Tag geschlachtet?',
    answer: `Rund ${formatCompact(allAnimals / DAYS_2025, 2)} am Tag. 2025 wurden in Deutschland ${formatCompact(mammalsAll, 1)} Schweine, Rinder, Schafe, Ziegen und Pferde sowie ${formatCompact(poultry2025.total, 1)} Stück Geflügel geschlachtet, laut Statistischem Bundesamt. Fische sind darin nicht enthalten.`,
  },
  {
    question: 'Wie viele Schweine werden in Deutschland pro Tag geschlachtet?',
    answer: `Rund ${formatNumber(Math.round((pigs?.domestic ?? 0) / DAYS_2025 / 100) * 100)} Schweine aus deutscher Haltung am Tag, ${formatNumber(pigs?.domestic ?? 0)} im Jahr 2025. Mit Schweinen aus dem Ausland und Hausschlachtungen waren es ${formatNumber((pigs?.domestic ?? 0) + (pigs?.foreign ?? 0) + (pigs?.home ?? 0))}.`,
  },
  {
    question: 'Wo werden in Deutschland die meisten Schweine geschlachtet?',
    answer: `In Nordrhein-Westfalen und Niedersachsen. Dort wurden 2025 zusammen ${formatNumber(topTwoPigs)} Prozent aller Schweine aus deutscher Haltung geschlachtet.`,
  },
  {
    question: 'Wird in Deutschland weniger Fleisch produziert als früher?',
    answer: `Ja. 2025 waren es ${formatCompact(press.meatTonnes2025)} Tonnen, ${formatNumber(press.belowPeakPercent, 1)} Prozent weniger als im Höchstjahr ${press.peakYear} mit ${formatCompact(press.peakTonnes)} Tonnen.`,
  },
]

const pigTrend = slaughterTrendBySpecies.Schwein ?? []
const pigPeak = pigTrend.reduce((max, point) => (point.count > max.count ? point : max), pigTrend[0] ?? { year: 0, count: 0 })
const brightSpots = [
  {
    title: 'Ein Fünftel weniger Schweine geschlachtet',
    text: `${pigPeak.year} wurden ${formatNumber(pigPeak.count)} Schweine aus deutscher Haltung geschlachtet, 2025 waren es ${formatNumber(pigs?.domestic ?? 0)}.`,
    sources: ['destatisSlaughter'] as const,
  },
  {
    title: 'Weniger Fleisch als im Höchstjahr',
    text: `Die Fleischproduktion liegt ${formatNumber(press.belowPeakPercent, 1)} Prozent unter dem Höchststand von ${press.peakYear}.`,
    sources: ['destatisMeatPress2025'] as const,
  },
]
</script>

<template>
  <ContentPage
    kicker="Schlachtzahlen · Destatis"
    :title="`${formatNumber(mammalsAll / 1e6, 1)}\u00A0Millionen Säugetiere und ${formatNumber(poultry2025.total / 1e6, 1)}\u00A0Millionen Stück Geflügel im Jahr 2025.`"
    lead="So viele Tiere wurden 2025 in Deutschland geschlachtet, laut Statistischem Bundesamt. Hier stehen alle Zahlen im Detail: nach Herkunft, Monat für Monat und nach Bundesland."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <h2>Alle Schlachtungen 2025</h2>
    <p>
      Das Statistische Bundesamt unterscheidet bei Schweinen, Rindern, Schafen, Ziegen und Pferden drei Arten der Schlachtung:
      Tiere aus Deutschland, die in einem Schlachtbetrieb geschlachtet werden, Tiere aus dem Ausland, die in Deutschland
      geschlachtet werden, und Hausschlachtungen. Die Zähler auf vegan.to zeigen nur die erste Gruppe, also Tiere aus deutscher
      Haltung. Diese Tabelle zeigt alle drei.
    </p>
    <DataTable
      caption="Geschlachtete Tiere 2025 nach Herkunft"
      :head="['Art', 'aus Deutschland', 'aus dem Ausland', 'Hausschlachtung', 'zusammen']"
      :rows="originRows"
      layout="stack"
      note="Rinder einschließlich Kälbern und Jungrindern."
      :sources="['destatisSlaughter']"
    />
    <p>
      Beim Geflügel gibt es diese Aufteilung nicht. Die {{ poultry2025.slaughterhouses }} Geflügelschlachtereien meldeten 2025
      {{ formatNumber(poultry2025.total) }} geschlachtete Tiere, darunter {{ formatNumber(poultry2025.broilers) }} Masthühner,
      {{ formatNumber(poultry2025.boilingHens) }} Suppenhühner, {{ formatNumber(poultry2025.turkeys) }} Puten,
      {{ formatNumber(poultry2025.ducks) }} Enten und {{ formatNumber(poultry2025.geese) }} Gänse, außerdem
      {{ formatNumber(poultry2025.ostriches) }} Strauße, {{ formatNumber(poultry2025.pigeons) }} Tauben und
      {{ formatNumber(otherUnlisted) }} Tiere weiterer Arten, die Destatis nicht einzeln ausweist.
    </p>

    <h2>Weniger Fleisch als 2016</h2>
    <p>
      2025 erzeugten die Schlachtbetriebe in Deutschland {{ formatCompact(press.meatTonnes2025) }} Tonnen Fleisch. Das sind
      {{ formatNumber(press.belowPeakPercent, 1) }} Prozent weniger als im Höchstjahr {{ press.peakYear }} mit
      {{ formatCompact(press.peakTonnes) }} Tonnen. Bei Hühnern ist die Zahl der geschlachteten Tiere dagegen heute höher als
      2010, wie die Seite <RouterLink to="/tiere/huehner">Hühner</RouterLink> zeigt. Wie viel Fleisch ein einzelnes Tier
      ergibt, ist sehr unterschiedlich:
    </p>
    <FigureGrid :items="weightFigures" />

    <h2>Monat für Monat</h2>
    <p>
      Schweine werden das ganze Jahr über in fast gleicher Zahl geschlachtet: 2025 zwischen {{ formatNumber(pigMin) }} im
      {{ pigMinMonth }} und {{ formatNumber(pigMax) }} im {{ pigMaxMonth }}. Bei anderen Tieren gibt es deutliche Spitzen.
    </p>
    <BarList caption="Schweine aus deutscher Haltung, 2025" :items="monthBars(monthly.pigs2025)" :sources="['destatisSlaughterMonthly']" />
    <p>
      Gänse werden vor allem im Herbst und vor Weihnachten geschlachtet. Von September bis Dezember 2025 waren es
      {{ formatNumber(geeseAutumn) }}, das sind {{ formatNumber((geeseAutumn / poultry2025.geese) * 100) }} Prozent aller
      {{ formatNumber(poultry2025.geese) }} Gänse des Jahres.
    </p>
    <BarList
      caption="Gänse, 2025"
      :items="geeseBars"
      :note="`Für ${12 - knownGeese.length} Monate weist Destatis keinen Wert aus: Er ist unbekannt, wird geheim gehalten, oder es wurde nichts geschlachtet.`"
      :sources="['destatisPoultryMonthly']"
    />
    <BarList caption="Lämmer aus deutscher Haltung, 2025" :items="monthBars(monthly.lambs2025)" :sources="['destatisSlaughterMonthly']" />
    <BarList caption="Geflügel insgesamt, 2025" :items="monthBars(monthly.poultry2025)" :sources="['destatisPoultryMonthly']" />

    <h2>2026 bisher</h2>
    <p>
      Für 2026 gibt es vorläufige Zahlen bis {{ lastMonth2026 }}. Von Januar bis {{ lastMonth2026 }} wurden
      {{ formatNumber(pigs2026) }} Schweine aus deutscher Haltung geschlachtet. Das ist eine Veränderung von
      {{ formatPercent(((pigs2026 - pigsSamePeriod2025) / pigsSamePeriod2025) * 100) }} gegenüber dem Vorjahreszeitraum. Bei
      Rindern waren es {{ formatNumber(cattle2026) }}, eine Veränderung von
      {{ formatPercent(((cattle2026 - cattleSamePeriod2025) / cattleSamePeriod2025) * 100) }}. Im ersten Halbjahr 2026 erzeugten die
      Schlachtbetriebe knapp {{ formatCompact(press.firstHalf2026.tonnes) }} Tonnen Fleisch.
    </p>
    <DataTable
      caption="Schweine und Rinder aus deutscher Haltung, 2026 und 2025"
      :head="['Monat', 'Schweine 2026', 'Schweine 2025', 'Rinder 2026', 'Rinder 2025']"
      :rows="monthly.pigs2026.map((value, index) => [
        MONTHS[index] ?? '',
        formatNumber(value),
        formatNumber(monthly.pigs2025[index] ?? 0),
        formatNumber(monthly.cattle2026[index] ?? 0),
        formatNumber(monthly.cattle2025[index] ?? 0),
      ])"
      note="Werte für 2026 vorläufig."
      :sources="['destatisSlaughterMonthly', 'destatisMeatPressH1']"
    />

    <h2>Nach Bundesland</h2>
    <p>
      {{ formatNumber(topTwoPigs) }} Prozent aller Schweine aus deutscher Haltung werden in Nordrhein-Westfalen und Niedersachsen
      geschlachtet. Beim Geflügel liegt Niedersachsen allein bei {{ formatNumber(lowerSaxonyPoultry) }} Prozent.
      {{ poultryStatesNote }}
    </p>
    <BarList caption="Schweine nach Bundesland, 2025" :items="pigStates" :sources="['destatisSlaughterStates']" />
    <BarList caption="Rinder nach Bundesland, 2025" :items="cattleStates" :sources="['destatisSlaughterStates']" />
    <BarList
      caption="Geflügel nach Bundesland, 2025"
      :items="poultryStates"
      :note="poultryStatesNote"
      :sources="['destatisPoultryStates']"
    />
    <BarList caption="Schafe und Lämmer nach Bundesland, 2025" :items="lambStates" :sources="['destatisSlaughterStates']" />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="SlaughterStats" />
  </ContentPage>
</template>
