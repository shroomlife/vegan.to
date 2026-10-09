<script setup lang="ts">
import { animals } from '@/data/animals'
import { POPULATION_DE } from '@/data/population'
import { topicByName } from '@/data/topics'
import {
  eggSelfSufficiency2025,
  eggsPerCapita2025,
  fishSelfSufficiency2025,
  fishUsePerCapita2025,
  lifeExpectancy2025,
  meatConsumption,
  meatUsePerCapita2025,
  selfSufficiency2025,
} from '@/data/topics/perCapita'
import { formatNumber } from '@/utils/formatNumber'
import ContentPage from '@/components/ContentPage.vue'
import BarList from '@/components/BarList.vue'
import DataTable from '@/components/DataTable.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('PerCapita')

/** Land animals only: fish are counted from the German catch, which says nothing about what people here eat */
const landAnimals = animals.filter((animal) => !animal.estimate)

const rows = landAnimals
  .map((animal) => {
    const share = selfSufficiency2025[animal.names.single]
    const produced = animal.deaths.year / POPULATION_DE
    const used = share ? animal.deaths.year / (share / 100) / POPULATION_DE : undefined
    return { animal, share, produced, used }
  })
  .sort((a, b) => b.animal.deaths.year - a.animal.deaths.year)

function perPerson(value: number | undefined): string {
  if (value === undefined) return 'keine Angabe'
  return formatNumber(value, value < 1 ? 3 : 2)
}

const producedTotal = rows.reduce((sum, row) => sum + row.produced, 0)
const usedTotal = rows.reduce((sum, row) => sum + (row.used ?? row.produced), 0)
/** How many people share one pig a year: by slaughter count, then by domestic use */
const pigRow = rows.find((row) => row.animal.names.single === 'Schwein')
const peoplePerPig = {
  produced: pigRow ? 1 / pigRow.produced : 0,
  used: pigRow?.used ? 1 / pigRow.used : 0,
}
const tableRows = [
  ...rows.map((row) => [
    row.animal.names.plural,
    formatNumber(row.animal.deaths.year),
    perPerson(row.produced),
    row.share ? `${formatNumber(row.share, 1)}\u00A0%` : 'keine Angabe',
    perPerson(row.used),
  ]),
  ['Zusammen', formatNumber(landAnimals.reduce((sum, animal) => sum + animal.deaths.year, 0)), perPerson(producedTotal), '', perPerson(usedTotal)],
]

const first = meatConsumption[0]
const latest = meatConsumption[meatConsumption.length - 1]
const peak = meatConsumption.reduce((max, entry) => (entry.total > max.total ? entry : max))
const lowest = meatConsumption.reduce((min, entry) => (entry.total < min.total ? entry : min))
const peakPoultry = meatConsumption.reduce((max, entry) => (entry.poultry > max.poultry ? entry : max))

const lifetime = {
  min: usedTotal * lifeExpectancy2025.men,
  max: usedTotal * lifeExpectancy2025.women,
}

const consumptionBars = meatConsumption.map((entry) => ({
  label: String(entry.year),
  value: entry.total,
  display: `${formatNumber(entry.total, 1)}\u00A0kg`,
}))

const pork = selfSufficiency2025.Schwein ?? 0
const duck = selfSufficiency2025.Ente ?? 0
const goose = selfSufficiency2025.Gans ?? 0

const answers = [
  {
    question: 'Wie viel Fleisch isst ein Mensch in Deutschland im Jahr?',
    answer: `${formatNumber(latest?.total ?? 0, 1)} Kilogramm im Jahr 2025, laut Bundesanstalt für Landwirtschaft und Ernährung. Davon ${formatNumber(latest?.pork ?? 0, 1)} kg Schweinefleisch, ${formatNumber(latest?.poultry ?? 0, 1)} kg Geflügel und ${formatNumber(latest?.beef ?? 0, 1)} kg Rind- und Kalbfleisch.`,
  },
  {
    question: 'Wie viele Tiere isst ein Mensch im Jahr?',
    answer: `Rund ${formatNumber(usedTotal, 1)} Landtiere, davon gut acht Hühner. Das ist eine Näherung: die in Deutschland geschlachteten Tiere, umgerechnet auf den Fleischverbrauch im Inland und geteilt durch ${formatNumber(POPULATION_DE / 1e6, 1)} Millionen Menschen. Fische sind nicht eingerechnet.`,
  },
  {
    question: 'Wie viele Tiere isst ein Mensch im Leben?',
    answer: `Bei den heutigen Zahlen und einer Lebenserwartung von ${formatNumber(lifeExpectancy2025.men, 1)} bis ${formatNumber(lifeExpectancy2025.women, 1)} Jahren kommen rund ${formatNumber(Math.round(lifetime.min / 10) * 10)} bis ${formatNumber(Math.round(lifetime.max / 10) * 10)} Landtiere zusammen. Ohne Fische.`,
  },
  {
    question: 'Isst Deutschland weniger Fleisch als früher?',
    answer: `Weniger als vor zehn Jahren, aber seit ${lowest.year} wieder mehr. Der höchste Wert seit ${first?.year ?? 2010} lag ${peak.year} bei ${formatNumber(peak.total, 1)} kg pro Kopf, der niedrigste ${lowest.year} bei ${formatNumber(lowest.total, 1)} kg. 2025 waren es ${formatNumber(latest?.total ?? 0, 1)} kg.`,
  },
]

const brightSpots = [
  {
    title: `Weniger Fleisch als ${peak.year}`,
    text: `${peak.year} lag der Fleischverzehr bei ${formatNumber(peak.total, 1)} Kilogramm pro Kopf, 2025 bei ${formatNumber(latest?.total ?? 0, 1)} Kilogramm.`,
    sources: ['bleMeatBalance'] as const,
  },
  {
    title: 'Gut ein Viertel weniger Schweinefleisch',
    text: `2010 aß ein Mensch in Deutschland im Schnitt ${formatNumber(first?.pork ?? 0, 1)} Kilogramm Schweinefleisch, 2025 nur noch ${formatNumber(latest?.pork ?? 0, 1)} Kilogramm.`,
    sources: ['bleMeatBalance'] as const,
  },
]
</script>

<template>
  <ContentPage
    kicker="Pro Kopf · BLE und Destatis 2025"
    :title="`Rund ${formatNumber(usedTotal, 1)} Landtiere pro Kopf und Jahr.`"
    :lead="`So viele Tiere stecken rechnerisch im Fleisch, das jeder Mensch in Deutschland im Jahr verbraucht. Davon gegessen werden im Schnitt ${formatNumber(latest?.total ?? 0, 1)} Kilogramm Fleisch pro Kopf. Der Rest sind Knochen und andere nicht verzehrte Teile, Verluste, industrielle Verwendung und Heimtiernahrung.`"
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <h2>Wie viel Fleisch pro Kopf</h2>
    <p>
      Die Bundesanstalt für Landwirtschaft und Ernährung (BLE) unterscheidet zwei Werte. Der <strong>Verzehr</strong> ist der
      Teil, der rechnerisch auf das Essen entfällt. Der <strong>Verbrauch</strong> ist größer: Er enthält auch Knochen und andere nicht verzehrte Teile des Schlachtkörpers,
      Verluste, die industrielle Verwendung und die Herstellung von Heimtiernahrung.
    </p>
    <FigureGrid
      :items="[
        { value: `${formatNumber(latest?.total ?? 0, 1)}\u00A0kg`, label: 'Fleischverzehr pro Kopf, 2025', note: `Davon ${formatNumber(latest?.pork ?? 0, 1)} kg Schwein, ${formatNumber(latest?.poultry ?? 0, 1)} kg Geflügel, ${formatNumber(latest?.beef ?? 0, 1)} kg Rind und Kalb.`, sources: ['bleMeatBalance'] },
        { value: `${formatNumber(meatUsePerCapita2025, 1)}\u00A0kg`, label: 'Fleischverbrauch pro Kopf, 2025', note: 'Mit Knochen, Verlusten, industrieller Verwendung und Heimtiernahrung.', sources: ['bleMeatBalance', 'bleMeatPress'] },
      ]"
    />

    <h2>Wie viele Tiere das sind</h2>
    <p>
      Wie viele Tiere ein Mensch isst, zählt niemand direkt. Man kann es aber auf zwei Wegen ableiten. Der erste ist
      einfach: alle Tiere, die 2025 in Deutschland gewerblich geschlachtet wurden (bei Rindern, Schweinen, Schafen, Ziegen und
      Pferden nur Tiere inländischer Herkunft), geteilt durch die Zahl der Einwohnerinnen und Einwohner.
    </p>
    <p>
      Der zweite berücksichtigt, dass Deutschland nicht nur für sich selbst produziert. Der Selbstversorgungsgrad zeigt, wie viel
      im Inland erzeugt wird, gemessen am Verbrauch im Inland. Bei Schweinefleisch liegt er bei {{ formatNumber(pork, 1) }} Prozent:
      Es wird deutlich mehr erzeugt als verbraucht, der Rest geht in den Export. Bei Enten sind es nur
      {{ formatNumber(duck, 1) }} Prozent, bei Gänsen {{ formatNumber(goose, 1) }} Prozent, der Großteil kommt also aus dem Ausland.
      Teilt man die Schlachtzahl durch den Selbstversorgungsgrad, erhält man eine Näherung dafür, wie viele Tiere für den
      Verbrauch in Deutschland sterben, egal wo.
    </p>
    <DataTable
      caption="Geschlachtete Tiere pro Kopf, 2025"
      :head="['Art', 'geschlachtet in Deutschland', 'pro Kopf', 'Selbstversorgungsgrad', 'pro Kopf, nach Verbrauch']"
      :rows="tableRows"
      layout="stack"
      note="Pro Kopf: geteilt durch 83,5 Millionen Menschen. Verbrauch: Schlachtzahl geteilt durch den Selbstversorgungsgrad der jeweiligen Fleischart, eine Näherung. Schafe und Ziegen teilen sich einen Selbstversorgungsgrad. Rinder, Schweine, Schafe, Ziegen, Pferde: gewerbliche Schlachtungen inländischer Herkunft; Geflügel: alle Schlachtungen in deutschen Geflügelschlachtereien."
      :sources="['destatisSlaughter', 'destatisPoultry', 'bleMeatBalance', 'destatisPopulation']"
    />
    <p>
      Die beiden Wege kommen auf {{ formatNumber(producedTotal, 1) }} und {{ formatNumber(usedTotal, 1) }} Tiere pro Kopf und
      Jahr. Knapp neun von zehn davon sind Hühner. Bei Schweinen kommt rechnerisch ein Tier auf
      {{ formatNumber(peoplePerPig.produced, 1) }} bis {{ formatNumber(peoplePerPig.used, 1) }} Menschen im Jahr.
    </p>

    <h2>Ein Leben lang</h2>
    <p>
      Die Lebenserwartung bei Geburt lag 2025 laut Statistischem Bundesamt bei {{ formatNumber(lifeExpectancy2025.women, 1) }} Jahren für Frauen und
      {{ formatNumber(lifeExpectancy2025.men, 1) }} Jahren für Männer. Bleiben die Zahlen so wie heute, kommen über ein Leben
      rund {{ formatNumber(Math.round(lifetime.min / 10) * 10) }} bis {{ formatNumber(Math.round(lifetime.max / 10) * 10) }}
      Landtiere zusammen. Das ist eine einfache Hochrechnung, keine Prognose: Wie viel jemand isst, ändert sich im Laufe des Lebens.
    </p>
    <SourceLinks :ids="['destatisLifeExpectancy']" />

    <h2>Der Fleischverzehr seit 2010</h2>
    <p>
      Den höchsten Wert der Reihe gab es {{ peak.year }} mit {{ formatNumber(peak.total, 1) }} Kilogramm pro Kopf. Bis
      {{ lowest.year }} fiel der Verzehr auf {{ formatNumber(lowest.total, 1) }} Kilogramm. Seitdem steigt er wieder. Geflügel
      wird heute deutlich mehr gegessen als 2010: {{ formatNumber(peakPoultry.poultry, 1) }} Kilogramm im Jahr {{ peakPoultry.year }}, so viel
      wie nie zuvor in dieser Reihe. Weil ein Huhn viel weniger Fleisch gibt als ein Schwein, bedeutet jedes zusätzliche Kilogramm
      Geflügel viele zusätzliche Tiere.
    </p>
    <BarList caption="Fleischverzehr pro Kopf in Deutschland, in Kilogramm" :items="consumptionBars" :sources="['bleMeatBalance']" />

    <h2>Eier und Fisch</h2>
    <p>
      2025 wurden in Deutschland {{ formatNumber(eggsPerCapita2025) }} Eier pro Kopf verbraucht. Nur
      {{ formatNumber(eggSelfSufficiency2025) }} Prozent davon kamen rechnerisch aus Deutschland. Wie Legehennen leben und was
      mit ihren Brüdern passiert, steht auf der Seite <RouterLink to="/kueken-und-legehennen">Küken und Legehennen</RouterLink>.
    </p>
    <p>
      Beim Fisch liegt der Verbrauch nach vorläufigen Zahlen bei {{ formatNumber(fishUsePerCapita2025) }} Kilogramm
      (Fanggewicht) pro Kopf. Der Selbstversorgungsgrad beträgt nur {{ formatNumber(fishSelfSufficiency2025) }} Prozent, der
      Großteil wird also eingeführt. Weil Fisch nur in Tonnen erfasst wird und die Importe aus vielen Arten bestehen, lässt er
      sich nicht sinnvoll in Tiere pro Kopf umrechnen. Der Fisch-Zähler auf vegan.to zählt etwas anderes: die Fische, die die
      deutsche Fischerei selbst fängt, plus die deutsche Aquakultur.
    </p>
    <FigureGrid
      :items="[
        { value: formatNumber(eggsPerCapita2025), label: 'Eier pro Kopf, 2025', note: `Selbstversorgungsgrad ${formatNumber(eggSelfSufficiency2025)} Prozent.`, sources: ['bleEggBalance'] },
        { value: `${formatNumber(fishUsePerCapita2025)}\u00A0kg`, label: 'Fisch pro Kopf (Fanggewicht), 2025, vorläufig', note: `Selbstversorgungsgrad ${formatNumber(fishSelfSufficiency2025)} Prozent.`, sources: ['bleFishBalance'] },
      ]"
    />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="PerCapita" />
  </ContentPage>
</template>
