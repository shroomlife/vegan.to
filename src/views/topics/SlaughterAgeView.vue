<script setup lang="ts">
import { lifespanYearsBySpecies } from '@/data/lifespans'
import { speciesProfiles } from '@/data/species'
import { topicByName } from '@/data/topics'
import { usageAges } from '@/data/topics/slaughterAge'
import type { SourceId } from '@/data/sources'
import { formatNumber } from '@/utils/formatNumber'
import ContentPage from '@/components/ContentPage.vue'
import DataTable from '@/components/DataTable.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('SlaughterAge')

function lifespan(species: string): number | undefined {
  return lifespanYearsBySpecies[species]
}
/** Share of the possible life, from the upper end of the slaughter age */
function lived(maxDays: number, species: string): number | undefined {
  const years = lifespan(species)
  return years ? (maxDays / (years * 365)) * 100 : undefined
}
function percent(value: number | undefined): string {
  if (value === undefined) return 'keine Angabe'
  return `${formatNumber(value, value < 10 ? 1 : 0)}\u00A0%`
}

const rows = usageAges.map((entry) => [
  entry.use,
  entry.ageText,
  lifespan(entry.species) ? `bis ${lifespan(entry.species)}\u00A0Jahre` : 'keine Angabe',
  percent(lived(entry.maxDays, entry.species)),
])

/** Every lifespan source of the species in the table, once */
const lifespanSources: SourceId[] = [...new Set(
  usageAges.flatMap((entry) => speciesProfiles.find((profile) => profile.single === entry.species)?.lifeSources ?? []),
)]

const broiler = usageAges.find((entry) => entry.use === 'Masthuhn')
const cow = usageAges.find((entry) => entry.use === 'Milchkuh')

const answers = [
  {
    question: 'Wie alt werden Schweine bis zur Schlachtung?',
    answer: 'Mastschweine werden mit etwa sechs bis sieben Monaten geschlachtet, Zuchtsauen mit drei bis vier Jahren, laut Bundesinformationszentrum Landwirtschaft. Ohne Schlachtung könnten Schweine etwa acht bis zehn Jahre alt werden.',
  },
  {
    question: 'Wann werden Hühner geschlachtet?',
    answer: 'Masthühner mit fünf bis sieben Wochen. Legehennen werden mit rund 16 Monaten als Suppenhühner geschlachtet. Hühner können im Schnitt drei bis fünf Jahre alt werden, manche sieben.',
  },
  {
    question: 'Wie alt werden Kühe in der Milchwirtschaft?',
    answer: 'Im Durchschnitt 5,5 Jahre, laut Bundesinformationszentrum Landwirtschaft. Rinder könnten bis zu 25 Jahre alt werden.',
  },
  {
    question: 'Wie alt sind Lämmer bei der Schlachtung?',
    answer: 'Mastlämmer werden je nach Mastverfahren mit vier bis zwölf Monaten geschlachtet. Schafe könnten bis zu zwölf Jahre alt werden.',
  },
]

const brightSpots = [
  {
    title: 'Mehr Legehennen mit Auslauf',
    text: 'Die Zahl der Hennen in Freiland- und Biohaltung ist von 10,8 Millionen im Jahr 2015 auf 17,9 Millionen im Jahr 2025 gestiegen. Die Kleingruppenhaltung, ein größerer Käfig mit Nest, Sitzstangen und Einstreu, und ausgestaltete Käfige durften regulär nur noch bis Ende 2025 genutzt werden, mit Härtefall-Ausnahmen bis Ende 2028.',
    sources: ['destatisLayingHens', 'destatisEggPress', 'tierSchNutztV45', 'bverfg2010'] as const,
  },
  {
    title: 'Kükentöten seit 2022 verboten',
    text: 'Seit 2022 dürfen männliche Küken nicht mehr direkt nach dem Schlupf getötet werden. Vorher waren es 40 bis 45 Millionen im Jahr.',
    sources: ['tierSchG4c', 'bzlChicks', 'bmlehInOvo'] as const,
  },
]
</script>

<template>
  <ContentPage
    kicker="Schlachtalter · BZL"
    title="Fünf bis sieben Wochen statt bis zu sieben Jahre."
    lead="So kurz lebt ein Masthuhn, verglichen mit dem, was ein Huhn erleben könnte. Fast alle Tiere, die für Fleisch, Milch oder Eier gehalten werden, sterben nach einem Bruchteil ihrer möglichen Lebenszeit."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <h2>Alle Nutzungsformen im Vergleich</h2>
    <p>
      Das Bundesinformationszentrum Landwirtschaft unterscheidet zwischen der natürlichen Lebenserwartung, also dem Alter, das
      ein Tier ohne landwirtschaftliche Nutzung erreichen könnte, und der Nutzungsdauer. Die Tabelle stellt beides nebeneinander.
      Die letzte Spalte zeigt, welchen Anteil seines möglichen Lebens ein Tier lebt, gerechnet mit dem oberen Ende des
      Schlachtalters.
    </p>
    <DataTable
      caption="Alter bei der Schlachtung und mögliche Lebenserwartung"
      :head="['Tier', 'Alter bei der Schlachtung', 'mögliches Alter', 'Anteil am möglichen Leben']"
      :rows="rows"
      layout="stack"
      note="Für Pferde und Fische gibt es keine aktuelle, belastbare Quelle zum typischen Schlachtalter in Deutschland, deshalb fehlen sie hier. Milchziege: Nutzungsdauer laut BZL, nicht Lebensalter."
      :sources="['bzlAges']"
    />
    <p>Woher die möglichen Lebenserwartungen stammen:</p>
    <SourceLinks :ids="lifespanSources" />

    <h2>Am kürzesten: Geflügel</h2>
    <p>
      Ein Masthuhn wird {{ broiler?.ageText }} alt. Das sind höchstens
      {{ percent(broiler ? lived(broiler.maxDays, broiler.species) : undefined) }} der bis zu sieben Jahre, die manche Hühner erreichen.
      Enten, Gänse und Puten leben einige Wochen bis wenige Monate länger. Wie Hühner in so kurzer Zeit so schwer werden und
      wie sie gehalten werden, steht auf der Seite <RouterLink to="/tiere/huehner">Hühner</RouterLink>.
    </p>

    <h2>Schweine: ein halbes Jahr</h2>
    <p>
      Mastschweine werden laut BZL mit etwa sechs bis sieben Monaten geschlachtet. Die Sauen, die die
      Ferkel zur Welt bringen, leben länger, aber auch sie werden nur drei bis vier Jahre alt.
    </p>

    <h2>Milch und Eier: länger, aber nicht lang</h2>
    <p>
      Tiere, die Milch oder Eier geben, leben länger als Masttiere, aber auch sie werden geschlachtet. Eine Milchkuh wird im Schnitt {{ cow?.ageText.replace('im Schnitt ', '') }} alt, eine Legehenne rund 16 Monate.
      Was das für die Tiere bedeutet, steht auf den Seiten
      <RouterLink to="/milchkuehe-und-kaelber">Milchkühe und Kälber</RouterLink> und
      <RouterLink to="/kueken-und-legehennen">Küken und Legehennen</RouterLink>.
    </p>

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="SlaughterAge" />
  </ContentPage>
</template>
