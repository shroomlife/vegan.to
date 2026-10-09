<script setup lang="ts">
import { animals } from '@/data/animals'
import { topicByName } from '@/data/topics'
import { hatcheryYears, hens, hensBySystem } from '@/data/topics/chicks'
import { census2023 } from '@/data/topics/livestock'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import { formatPercent } from '@/utils/trend'
import ContentPage from '@/components/ContentPage.vue'
import DataTable from '@/components/DataTable.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Chicks')

const boilingHens = animals.find((animal) => animal.names.single === 'Huhn')?.children?.find((child) => child.name === 'Suppenhühner')?.deaths.year ?? 0

const first = hatcheryYears.find((entry) => entry.year === 2021)
const latest = hatcheryYears[hatcheryYears.length - 1]
const firstBan = hatcheryYears.find((entry) => entry.year === 2022)

const hatcheryRows = hatcheryYears.map((entry) => [
  String(entry.year),
  formatNumber(entry.hatcheries),
  formatNumber(entry.eggsSet),
  formatNumber(entry.hatched),
  entry.cockerels === undefined ? 'kein Wert' : formatNumber(entry.cockerels),
])

const henRows = [
  ...hensBySystem.map((entry) => [
    entry.system,
    formatNumber(entry.hens2015),
    formatNumber(entry.hens2025),
    formatPercent(((entry.hens2025 - entry.hens2015) / entry.hens2015) * 100),
  ]),
  ['Zusammen', formatNumber(hens.total2015), formatNumber(hens.total2025), formatPercent(((hens.total2025 - hens.total2015) / hens.total2015) * 100)],
]

const answers = [
  {
    question: 'Ist das Kükentöten in Deutschland verboten?',
    answer: 'Ja, seit dem 1. Januar 2022. § 4c des Tierschutzgesetzes verbietet es, Küken von Haushühnern zu töten. Seit 2024 ist es außerdem verboten, Hühnerembryonen ab dem 13. Bebrütungstag nach einer Geschlechtsbestimmung im Ei zu töten. Ausnahmen gibt es etwa bei Tierseuchen oder für Tierversuche.',
  },
  {
    question: 'Was passiert heute mit den männlichen Küken?',
    answer: 'Sie werden entweder schon im Ei erkannt und nicht ausgebrütet, oder sie schlüpfen und werden als Bruderhähne gemästet und geschlachtet. Ein Teil der männlichen Küken wird laut BZL zur Aufzucht ins Ausland gebracht, und ein Teil der Junghennen kommt aus Ländern, in denen das Töten von Küken erlaubt ist.',
  },
  {
    question: 'Wie viele Küken wurden vor dem Verbot getötet?',
    answer: 'Etwa 40 bis 45 Millionen männliche Küken pro Jahr in Deutschland. Das Bundeslandwirtschaftsministerium nennt rund 40 Millionen, das Bundesinformationszentrum Landwirtschaft etwa 45 Millionen.',
  },
  {
    question: 'Wie alt werden Legehennen?',
    answer: `Rund 16 Monate. Dann werden sie als Suppenhühner geschlachtet, ${formatNumber(boilingHens)} im Jahr 2025. Ein Huhn könnte im Schnitt drei bis fünf Jahre alt werden, manche werden sieben.`,
  },
]

const free2015 = (hensBySystem.find((e) => e.system === 'Freilandhaltung')?.hens2015 ?? 0) + (hensBySystem.find((e) => e.system === 'Ökologische Erzeugung')?.hens2015 ?? 0)
const free2025 = (hensBySystem.find((e) => e.system === 'Freilandhaltung')?.hens2025 ?? 0) + (hensBySystem.find((e) => e.system === 'Ökologische Erzeugung')?.hens2025 ?? 0)
const brightSpots = [
  {
    title: 'Das Kükentöten ist verboten',
    text: 'Seit dem 1. Januar 2022 dürfen in Deutschland keine Küken mehr getötet werden, nur weil sie männlich sind.',
    sources: ['tierSchG4c', 'bmlehInOvo'] as const,
  },
  {
    title: 'Schluss mit Käfigen',
    text: 'Kleingruppenhaltung und ausgestaltete Käfige durften regulär nur noch bis Ende 2025 genutzt werden, mit Härtefall-Ausnahmen bis Ende 2028. 2015 lebten noch über vier Millionen Hennen so.',
    sources: ['destatisEggPress', 'destatisLayingHens', 'tierSchNutztV45'] as const,
  },
  {
    title: 'Mehr Hennen mit Auslauf',
    text: `In Freiland- und Biohaltung lebten 2025 im Schnitt ${formatNumber(free2025)} Hennen, 2015 waren es ${formatNumber(free2015)}.`,
    sources: ['destatisLayingHens'] as const,
  },
]
</script>

<template>
  <ContentPage
    kicker="Küken und Legehennen · Destatis und BZL"
    title="Kein Küken darf mehr getötet werden. Und dann?"
    lead="Bis Ende 2021 wurden in Deutschland jedes Jahr 40 bis 45 Millionen männliche Küken direkt nach dem Schlupf getötet, weil sie keine Eier legen und für die Mast kaum geeignet sind. Seit 2022 ist das verboten. Die amtlichen Zahlen zeigen, was sich seitdem geändert hat und was nicht."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <h2>Was das Gesetz sagt</h2>
    <p>
      § 4c des Tierschutzgesetzes ist kurz: „Es ist verboten, Küken von Haushühnern der Art Gallus gallus zu töten.“ Ausnahmen
      gelten zum Beispiel, wenn tierseuchenrechtliche Vorschriften das Töten vorschreiben oder es angeordnet wird, für nicht
      schlupffähige Küken, für Stubenküken und für Küken, die für Tierversuche bestimmt sind.
    </p>
    <p>
      Absatz 3 regelt die Geschlechtsbestimmung im Ei: Ab dem 13. Bebrütungstag darf ein Hühnerembryo nach einer solchen
      Bestimmung nicht mehr getötet werden, vor dem 13. Tag verbietet das Gesetz es nicht. Diese Regel gilt seit dem 1. Januar 2024. Zuvor
      war der 7. Tag als Grenze vorgesehen. Die Bundesregierung begründete die Änderung damit, dass das Schmerzempfinden von
      Hühnerembryonen nach neuen Forschungsergebnissen nicht vor dem 13. Bebrütungstag einsetzt.
    </p>
    <SourceLinks :ids="['tierSchG4c', 'bregChicks', 'bmlehInOvo', 'bzlChicks']" />

    <h2>Drei Wege statt Töten</h2>
    <ul>
      <li>
        <strong>Geschlechtsbestimmung im Ei:</strong> Männliche Embryonen werden erkannt und nicht weiter ausgebrütet. Laut
        KAT, dem Verein für kontrollierte alternative Tierhaltungsformen, zitiert vom Bundesinformationszentrum
        Landwirtschaft, wird inzwischen bei etwa 70 Prozent der männlichen Küken das Geschlecht im Ei bestimmt.
      </li>
      <li>
        <strong>Bruderhähne:</strong> Die männlichen Küken schlüpfen, werden gemästet und dann geschlachtet.
      </li>
      <li>
        <strong>Zweinutzungshühner:</strong> Rassen, bei denen die Hennen Eier legen und die Hähne für Fleisch gemästet werden.
      </li>
    </ul>
    <p>
      Die Zahl der Bruderhähne sinkt. Die Brütereien meldeten für 2022 {{ formatNumber(firstBan?.cockerels ?? 0) }} Hahnenküken
      zur Mast, für {{ latest?.year }} nur noch {{ formatNumber(latest?.cockerels ?? 0) }}.
    </p>
    <SourceLinks :ids="['bzlChicks', 'destatisHatcheries']" />

    <h2>Was die Brütereistatistik zeigt</h2>
    <p>
      Das Statistische Bundesamt erfasst jedes Jahr, wie viele Bruteier in Deutschland eingelegt werden und wie viele Küken
      schlüpfen. Die Zahl der Brütereien für Legerassen ist von {{ first?.hatcheries }} im Jahr 2021 auf
      {{ latest?.hatcheries }} im Jahr {{ latest?.year }} gesunken. 2022 wurden nur noch {{ formatCompact(firstBan?.eggsSet ?? 0) }}
      Bruteier eingelegt, nicht einmal halb so viele wie 2020. Seitdem steigt die Zahl wieder, auf {{ formatCompact(latest?.eggsSet ?? 0) }}
      im Jahr {{ latest?.year }}.
    </p>
    <DataTable
      caption="Brütereien für Legerassen in Deutschland"
      :head="['Jahr', 'Brütereien', 'eingelegte Bruteier', 'geschlüpfte Küken', 'Hahnenküken zur Mast']"
      :rows="hatcheryRows"
      note="Bruteier und geschlüpfte Küken: Legerassen zum Gebrauch, also für die Eierproduktion. Brütereien: alle Brütereien mit geschlüpften Küken von Legerassen, einschließlich Zucht und Vermehrung. Hahnenküken zur Mast: zur Mast vorgesehene männliche Küken der Legerassen; nach dem Schlupf getötete Küken sind darin laut Destatis nicht enthalten. Für 2021 und die Jahre vor 2020 gibt es keinen veröffentlichten Wert für Hahnenküken."
      :sources="['destatisHatcheries']"
    />
    <p>
      Ein Teil der Legehennen kam schon vor dem Verbot aus dem Ausland, laut BZL nach Schätzungen etwa 10 bis 15 Prozent der
      Junghennen, aus Ländern wie Polen, den Niederlanden und Tschechien. Fachleute gehen davon aus, dass dieser Anteil nach dem Verbot zunächst gestiegen
      ist. Ein EU-weites Verbot gibt es nicht. Die Brüder dieser Hennen werden dort also womöglich weiterhin direkt nach dem Schlupf getötet.
    </p>
    <SourceLinks :ids="['bzlChicks']" />

    <h2>Wie Legehennen gehalten werden</h2>
    <p>
      2025 lebten in Betrieben von Unternehmen mit mindestens 3.000 Hennenplätzen im Schnitt {{ formatNumber(hens.total2025) }} Legehennen. Jede legte
      {{ hens.eggsPerHen2025 }} Eier im Jahr, zusammen {{ formatCompact(hens.eggs2025) }} Eier. Alle Betriebe zusammen hatten
      bei der Zählung am 1. März 2023 rund {{ formatNumber(census2023.layingHens / 1e6, 1) }} Millionen Legehennen, mehr dazu auf
      der Seite <RouterLink to="/tierbestand">Tierbestand</RouterLink>. Die meisten Hennen leben in Bodenhaltung. Die
      Kleingruppenhaltung, ein größerer Käfig mit Nest, Sitzstangen und Einstreu, läuft aus: Bestehende Anlagen durften laut
      § 45 Abs. 4 Tierschutz-Nutztierhaltungsverordnung bis Ende 2025 weiter genutzt werden, in Härtefällen kann die Behörde das
      bis Ende 2028 genehmigen.
    </p>
    <DataTable
      caption="Legehennen nach Haltungsform, Jahresdurchschnitt"
      :head="['Haltungsform', '2015', '2025', 'Veränderung']"
      :rows="henRows"
      layout="stack"
      note="Betriebe von Unternehmen mit mindestens 3.000 Hennenplätzen."
      :sources="['destatisLayingHens', 'destatisFarmCensus', 'destatisEggPress', 'tierSchNutztV45', 'bverfg2010']"
    />

    <h2>Nach rund 16 Monaten: Suppenhuhn</h2>
    <p>
      Legehennen werden nach Angaben des BZL ungefähr 16 Monate alt und dann als Suppenhühner geschlachtet. 2025 waren es
      {{ formatNumber(boilingHens) }} Suppenhühner. Ein Huhn könnte im Schnitt drei bis fünf Jahre alt werden, manche sieben.
    </p>
    <FigureGrid
      :items="[
        { value: 'rund 16\u00A0Monate', label: 'Alter von Legehennen bei der Schlachtung', sources: ['bzlAges'] },
        { value: formatNumber(boilingHens), label: 'geschlachtete Suppenhühner 2025', sources: ['destatisPoultry'] },
      ]"
    />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Chicks" />
  </ContentPage>
</template>
