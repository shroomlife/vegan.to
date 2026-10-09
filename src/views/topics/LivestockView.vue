<script setup lang="ts">
import { animals } from '@/data/animals'
import { topicByName } from '@/data/topics'
import { cattleStock, census2023, pigStock, sheepStock, stockByState } from '@/data/topics/livestock'
import { formatNumber } from '@/utils/formatNumber'
import { formatPercent } from '@/utils/trend'
import ContentPage from '@/components/ContentPage.vue'
import BarList from '@/components/BarList.vue'
import DataTable from '@/components/DataTable.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Livestock')

function slaughtered(single: string, child?: string): number {
  const animal = animals.find((entry) => entry.names.single === single)
  if (!animal) return 0
  if (!child) return animal.deaths.year
  return animal.children?.find((entry) => entry.name === child)?.deaths.year ?? 0
}

const pigsSlaughtered = slaughtered('Schwein')
const cattleSlaughtered = slaughtered('Rind')
const sheepSlaughtered = slaughtered('Schaf')
const broilersSlaughtered = slaughtered('Huhn', 'Jungmasthühner')

function change(from: number, to: number): string {
  return formatPercent(((to - from) / from) * 100)
}
function ratio(slaughter: number, stock: number): string {
  return formatNumber(slaughter / stock, 2)
}

const stockFigures = [
  { value: formatNumber(pigStock.may2026), label: 'Schweine, Mai 2026', note: `Darunter ${formatNumber(pigStock.fatteningMay2026)} Mastschweine, ${formatNumber(pigStock.pigletsMay2026)} Ferkel und ${formatNumber(pigStock.sowsMay2026)} Zuchtsauen.`, sources: ['destatisPigStock'] as const },
  { value: formatNumber(cattleStock.may2026), label: 'Rinder, Mai 2026', note: `Darunter ${formatNumber(cattleStock.dairyCowsMay2026)} Milchkühe und ${formatNumber(cattleStock.calvesUpTo8MonthsMay2026)} Kälber bis acht Monate.`, sources: ['destatisCattleStock'] as const },
  { value: formatNumber(census2023.chickens), label: 'Hühner, 1. März 2023', note: `Davon ${formatNumber(census2023.broilers)} Masthühner, ${formatNumber(census2023.layingHens)} Legehennen und ${formatNumber(census2023.pullets)} Junghennen.`, sources: ['destatisFarmCensus'] as const },
  { value: formatNumber(sheepStock.nov2025), label: 'Schafe, November 2025', sources: ['destatisSheepStock'] as const },
  { value: formatNumber(census2023.turkeys), label: 'Puten (Truthühner), 1. März 2023', sources: ['destatisFarmCensus'] as const },
  { value: formatNumber(census2023.ducks), label: 'Enten, 1. März 2023', sources: ['destatisFarmCensus'] as const },
  { value: formatNumber(census2023.equines), label: 'Pferde und andere Einhufer, 1. März 2023', note: 'In landwirtschaftlichen Betrieben oberhalb der Erfassungsgrenzen, also ohne viele privat gehaltene Pferde.', sources: ['destatisFarmCensus'] as const },
  { value: formatNumber(census2023.goats), label: 'Ziegen, 1. März 2023', sources: ['destatisFarmCensus'] as const },
]

const turnoverRows = [
  ['Schweine', formatNumber(pigStock.nov2025), formatNumber(pigsSlaughtered), ratio(pigsSlaughtered, pigStock.nov2025)],
  ['Masthühner', formatNumber(census2023.broilers), formatNumber(broilersSlaughtered), ratio(broilersSlaughtered, census2023.broilers)],
  ['Schafe', formatNumber(sheepStock.nov2025), formatNumber(sheepSlaughtered), ratio(sheepSlaughtered, sheepStock.nov2025)],
  ['Rinder', formatNumber(cattleStock.nov2025), formatNumber(cattleSlaughtered), ratio(cattleSlaughtered, cattleStock.nov2025)],
]

const pigsPerFarm2010 = pigStock.may2010 / pigStock.farmsMay2010
const pigsPerFarm2026 = pigStock.may2026 / pigStock.farmsMay2026
const changeRows = [
  ['Schweine', formatNumber(pigStock.may2010), formatNumber(pigStock.may2026), change(pigStock.may2010, pigStock.may2026)],
  ['Betriebe mit Schweinen', formatNumber(pigStock.farmsMay2010), formatNumber(pigStock.farmsMay2026), change(pigStock.farmsMay2010, pigStock.farmsMay2026)],
  ['Rinder', formatNumber(cattleStock.may2010), formatNumber(cattleStock.may2026), change(cattleStock.may2010, cattleStock.may2026)],
  ['davon Milchkühe', formatNumber(cattleStock.dairyCowsMay2010), formatNumber(cattleStock.dairyCowsMay2026), change(cattleStock.dairyCowsMay2010, cattleStock.dairyCowsMay2026)],
  ['Haltungen mit Rindern', formatNumber(cattleStock.holdingsMay2010), formatNumber(cattleStock.holdingsMay2026), change(cattleStock.holdingsMay2010, cattleStock.holdingsMay2026)],
]

const pigStates = stockByState
  .filter((entry) => entry.pigs !== undefined)
  .map((entry) => ({ label: entry.state, value: entry.pigs ?? 0 }))
  .sort((a, b) => b.value - a.value)
const cattleStates = stockByState
  .map((entry) => ({ label: entry.state, value: entry.cattle }))
  .sort((a, b) => b.value - a.value)
const topTwoPigShare = ((pigStates[0]?.value ?? 0) + (pigStates[1]?.value ?? 0)) / pigStock.may2026 * 100

const answers = [
  {
    question: 'Wie viele Schweine gibt es in Deutschland?',
    answer: `Im Mai 2026 waren es ${formatNumber(pigStock.may2026)} Schweine, laut Statistischem Bundesamt, darunter ${formatNumber(pigStock.fatteningMay2026)} Mastschweine, ${formatNumber(pigStock.pigletsMay2026)} Ferkel und ${formatNumber(pigStock.sowsMay2026)} Zuchtsauen. Im Mai 2010 waren es noch ${formatNumber(pigStock.may2010)}.`,
  },
  {
    question: 'Wie viele Kühe gibt es in Deutschland?',
    answer: `Im Mai 2026 lebten ${formatNumber(cattleStock.may2026)} Rinder in Deutschland, darunter ${formatNumber(cattleStock.dairyCowsMay2026)} Milchkühe.`,
  },
  {
    question: 'Wie viele Hühner gibt es in Deutschland?',
    answer: `Bei der Agrarstrukturerhebung am 1. März 2023 waren es ${formatNumber(census2023.chickens)} Hühner, davon ${formatNumber(census2023.broilers)} Masthühner und ${formatNumber(census2023.layingHens)} Legehennen. Hühner werden nur bei den Agrarstrukturerhebungen alle paar Jahre gezählt, 2023 ist der jüngste Stand. Legehennen in Betrieben von Unternehmen mit mindestens 3.000 Hennenplätzen zählt Destatis zusätzlich jedes Jahr.`,
  },
  {
    question: 'Wie viele Ziegen gibt es in Deutschland?',
    answer: `${formatNumber(census2023.goats)} Ziegen in landwirtschaftlichen Betrieben, Stand 1. März 2023, laut Agrarstrukturerhebung.`,
  },
  {
    question: 'Warum werden mehr Schweine geschlachtet, als es in Deutschland gibt?',
    answer: `Weil ein Mastschwein nur kurz lebt. Die Mast dauert gut drei Monate, davor sind die Tiere schon rund drei Monate alt; geschlachtet werden sie mit etwa sechs bis sieben Monaten. Ein Mastplatz wird so fast dreimal im Jahr neu belegt. Der Bestand ist eine Momentaufnahme an einem Stichtag, die Schlachtzahl zählt das ganze Jahr. 2025 wurden ${formatNumber(pigsSlaughtered)} Schweine geschlachtet, im November 2025 standen ${formatNumber(pigStock.nov2025)} in den Ställen.`,
  },
]

const brightSpots = [
  {
    title: 'Ein Fünftel weniger Schweine',
    text: `Im Mai 2010 lebten ${formatNumber(pigStock.may2010)} Schweine in Deutschland, im Mai 2026 waren es ${formatNumber(pigStock.may2026)}. Das sind ${formatNumber(pigStock.may2010 - pigStock.may2026)} weniger.`,
    sources: ['destatisPigStock'] as const,
  },
  {
    title: 'Weniger Milchkühe',
    text: `Seit Mai 2010 ist die Zahl der Milchkühe um ${formatNumber(cattleStock.dairyCowsMay2010 - cattleStock.dairyCowsMay2026)} gesunken, auf ${formatNumber(cattleStock.dairyCowsMay2026)}.`,
    sources: ['destatisCattleStock'] as const,
  },
]
</script>

<template>
  <ContentPage
    kicker="Tierbestand · Destatis"
    :title="`Rund ${formatNumber(pigStock.may2026 / 1e6)}\u00A0Millionen Schweine stehen in deutschen Ställen.`"
    lead="Dazu kommen über zehn Millionen Rinder (Mai 2026), anderthalb Millionen Schafe (November 2025) und rund 156 Millionen Hühner (zuletzt gezählt am 1. März 2023). Insgesamt werden im Jahr aber viel mehr Tiere geschlachtet, als an einem Tag in den Ställen stehen. Die meisten leben nur Wochen oder Monate."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <h2>Wie viele Tiere es gibt</h2>
    <p>
      Das Statistische Bundesamt zählt Rinder und Schweine zweimal im Jahr, Schafe einmal. Hühner insgesamt, Masthühner,
      Puten, Enten, Ziegen und Pferde werden nur bei den Agrarstrukturerhebungen erfasst, die alle paar Jahre stattfinden,
      zuletzt am 1. März 2023. Legehennen in Betrieben von Unternehmen mit mindestens 3.000 Hennenplätzen zählt Destatis
      zusätzlich jedes Jahr.
    </p>
    <FigureGrid :items="stockFigures" />

    <h2>Mehr geschlachtet als im Stall</h2>
    <p>
      Ein Bestand ist eine Momentaufnahme: wie viele Tiere an einem Stichtag leben. Die Schlachtzahl zählt dagegen jedes Tier,
      das im Laufe eines Jahres stirbt. Bei Tieren, die nur kurz leben, ist sie deshalb ein Vielfaches des Bestands.
      Ein Mastschwein wird laut Thünen-Institut im Schnitt 106 Tage gemästet (Kennzahl 2023), ein Mastplatz wird so 2,94-mal im Jahr belegt. Bei Masthühnern sind
      es laut Thünen-Institut sieben bis acht Durchgänge im Jahr.
    </p>
    <DataTable
      caption="Bestand und Schlachtungen im Vergleich"
      :head="['Art', 'Bestand', 'geschlachtet 2025', 'geschlachtet je Tier im Bestand']"
      :rows="turnoverRows"
      layout="stack"
      note="Bestand von Schweinen, Schafen und Rindern im November 2025, von Masthühnern am 1. März 2023, weil Masthühner nur bei den Agrarstrukturerhebungen gezählt werden. Geschlachtet: Rinder, Schweine und Schafe inländischer Herkunft, Masthühner aus deutschen Geflügelschlachtereien, die auch Tiere aus dem Ausland schlachten."
      :sources="['destatisPigStock', 'destatisCattleStock', 'destatisSheepStock', 'destatisFarmCensus', 'destatisSlaughter', 'destatisPoultry', 'thuenenPigs', 'thuenenPoultry']"
    />
    <p>
      Bei Rindern ist es umgekehrt: Im Jahr wird gut ein Viertel des Bestands geschlachtet, weil viele Rinder, vor allem
      Milchkühe, mehrere Jahre leben: eine Milchkuh im Schnitt 5,5 Jahre. Mehr dazu auf der Seite
      <RouterLink to="/milchkuehe-und-kaelber">Milchkühe und Kälber</RouterLink>.
    </p>
    <SourceLinks :ids="['bzlAges']" />

    <h2>Weniger Tiere, größere Betriebe</h2>
    <p>
      Seit 2010 ist der Schweinebestand um ein Fünftel gesunken. Die Zahl der Betriebe mit Schweinen hat sich in derselben Zeit
      mehr als halbiert. Im Schnitt hält ein Betrieb heute {{ formatNumber(pigsPerFarm2026) }} Schweine, im Mai 2010 waren es
      {{ formatNumber(pigsPerFarm2010) }}.
    </p>
    <DataTable
      caption="Bestand im Mai 2010 und im Mai 2026"
      :head="['', 'Mai 2010', 'Mai 2026', 'Veränderung']"
      :rows="changeRows"
      layout="stack"
      :sources="['destatisPigStock', 'destatisCattleStock']"
    />

    <h2>Wo die Tiere stehen</h2>
    <p>
      {{ formatNumber(topTwoPigShare) }} Prozent aller Schweine leben in nur zwei Bundesländern, in Niedersachsen und
      Nordrhein-Westfalen. Bei Rindern liegen Bayern und Niedersachsen vorn.
    </p>
    <BarList
      caption="Schweine nach Bundesland, Mai 2026"
      :items="pigStates"
      note="Für Berlin, Bremen und Hamburg weist Destatis keinen Wert aus. Die Länderwerte für Schweine sind auf Hundert gerundet."
      :sources="['destatisPigStockStates']"
    />
    <BarList caption="Rinder nach Bundesland, Mai 2026" :items="cattleStates" :sources="['destatisCattleStockStates']" />

    <h2>So wird gezählt</h2>
    <ul>
      <li>Rinder: Stichmonate Mai und November. Schweine: ebenfalls Mai und November. Schafe: November.</li>
      <li>
        Hühner insgesamt, Masthühner, Puten, Enten, Ziegen und Pferde: nur in den Agrarstrukturerhebungen, zuletzt am
        1. März 2023. Für Gänse hat Destatis dort keinen Wert veröffentlicht. Legehennen in Betrieben von Unternehmen mit
        mindestens 3.000 Hennenplätzen zählt Destatis zusätzlich jedes Jahr.
      </li>
      <li>
        Rinder werden vollständig aus HI-Tier ausgewertet, dem zentralen Herkunftsregister für Rinder. Schweine und Schafe werden in Betrieben ab
        50 Schweinen oder 10 Zuchtsauen beziehungsweise ab 20 Schafen per Stichprobe erhoben und hochgerechnet. Die
        Agrarstrukturerhebung erfasst nur Betriebe oberhalb bestimmter Mindestgrößen. Kleine private Haltungen, etwa ein
        paar Hühner im Garten, fallen nicht darunter.
      </li>
    </ul>
    <SourceLinks :ids="['destatisQualityCattle', 'destatisQualityPigs', 'destatisQualitySheep', 'destatisFarmCensus', 'destatisLayingHens']" />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Livestock" />
  </ContentPage>
</template>
