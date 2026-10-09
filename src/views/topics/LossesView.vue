<script setup lang="ts">
import { slaughterTrendBySpecies } from '@/data/trends'
import { topicByName } from '@/data/topics'
import { deadCattleHit, deadPigsEstimate2016, modelLosses, tihoStudy } from '@/data/topics/losses'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import ContentPage from '@/components/ContentPage.vue'
import BarList from '@/components/BarList.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Losses')

const lastHit = deadCattleHit[deadCattleHit.length - 1]
const cattleSlaughteredSameYear = slaughterTrendBySpecies.Rind?.find((point) => point.year === lastHit?.year)?.count ?? 0
const slaughteredPerDead = lastHit ? cattleSlaughteredSameYear / lastHit.count : 0

const tihoPerYearMillions = formatNumber(tihoStudy.killingUnavoidablePerYear / 1e6, 2)

const hitBars =deadCattleHit.map((entry) => ({ label: String(entry.year), value: entry.count }))

const brightSpots = [
  {
    title: 'Kontrolle toter Tiere angekündigt',
    text: 'Laut Koalitionsvertrag, aus dem Abgeordnete im Bundestag zitieren, soll es eine Rechtsgrundlage für die Kontrolle und Kennzeichnung toter Tiere in Verarbeitungsbetrieben geben. Einen Zeitplan nannte die Bundesregierung im Februar 2026 nicht.',
    sources: ['btDrs21_4071'] as const,
  },
  {
    title: 'Ein Konzept für die Kontrolle liegt vor',
    text: 'Ein Forschungsprojekt mit Geld des Bundes hat von 2019 bis 2023 ein Konzept für ein Nationales Tierwohl-Monitoring erarbeitet. Es schlägt vor, tote Schweine in Verarbeitungsbetrieben stichprobenartig zu untersuchen: So ließe sich prüfen, ob kranke Tiere richtig notgetötet wurden. Das ist ein Konzept, noch keine Vorschrift.',
    sources: ['natimonPigs'] as const,
  },
]

const answers = [
  {
    question: 'Wie viele Tiere sterben in den Ställen vor der Schlachtung?',
    answer: `Das weiß niemand genau. Für Schweine gibt es keine zentrale Erfassung, nur eine Schätzung: Etwa ${formatCompact(deadPigsEstimate2016)} Schweine sind 2016 im Stall verendet, eingeschläfert oder notgetötet worden. Tote Rinder werden in HI-Tier erfasst, dem zentralen Herkunftsregister für Rinder. Veröffentlicht hat die Bundesregierung diese Zahlen nur einmal, 2017: ${lastHit?.year} verendeten ${formatNumber(lastHit?.count ?? 0)} Rinder.`,
  },
  {
    question: 'Wie viele Ferkel sterben vor dem Absetzen?',
    answer: `In den Kennzahlen, die das Thünen-Institut für 2023 nennt, sterben ${modelLosses.pigletsBeforeWeaningPercent} Prozent der Ferkel, solange sie noch bei der Sau saugen.`,
  },
  {
    question: 'Werden kranke Tiere im Stall rechtzeitig getötet?',
    answer: `Nicht immer. In einer Studie der Tierärztlichen Hochschule Hannover hatten ${formatNumber(tihoStudy.fatteningPigsSufferingPercent, 1)} Prozent der untersuchten toten Mastschweine über längere Zeit erhebliche Schmerzen oder Leiden. Hochgerechnet wäre bei etwa ${tihoPerYearMillions} Millionen Schweinen im Jahr eine Tötung unumgänglich gewesen, um ihnen Leiden zu ersparen.`,
  },
]
</script>

<template>
  <ContentPage
    kicker="Tod vor der Schlachtung"
    title="Die Tiere, die keine Statistik zählt."
    lead="Die Schlachtzahlen erfassen nur Tiere, die im Schlachthof sterben. Wie viele Tiere schon vorher im Stall sterben oder dort getötet werden, ist kaum bekannt: Für Rinder wird es in HI-Tier erfasst, dem zentralen Herkunftsregister für Rinder, aber nicht veröffentlicht. Für Schweine gibt es keine zentrale Erfassung. Auf die Fragen nach toten Tieren in den Ställen antwortete die Bundesregierung im Februar 2026 immer wieder mit demselben Satz."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <blockquote class="losses-quote">
      <p>„Die erbetenen Informationen liegen der Bundesregierung nicht vor.“</p>
      <SourceLinks :ids="['btDrs21_4071']" />
    </blockquote>

    <h2>Was trotzdem bekannt ist</h2>
    <p>
      Es gibt keine amtliche Gesamtzahl, aber einzelne Werte aus Studien, Fachberichten und einer älteren Antwort der
      Bundesregierung. Sie zeigen, dass es um viele Millionen Tiere im Jahr geht.
    </p>
    <FigureGrid
      :items="[
        { value: `etwa ${formatCompact(deadPigsEstimate2016)}`, label: 'Schweine, die 2016 im Stall verendet sind oder getötet wurden', note: 'Eine Schätzung, zitiert im Nationalen Tierwohl-Monitoring. Eine Zählung gibt es nicht.', sources: ['natimonPigs'] },
        { value: `${modelLosses.pigletsBeforeWeaningPercent}\u00A0%`, label: 'der Ferkel sterben, bevor sie abgesetzt, also von der Sau getrennt werden', note: `Dazu sterben ${modelLosses.sowMortalityPercent} Prozent der Sauen im Jahr. Kennzahlen 2023.`, sources: ['thuenenPigs'] },
        { value: formatNumber(lastHit?.count ?? 0), label: `verendete Rinder im Jahr ${lastHit?.year}`, note: `Auf ${formatNumber(slaughteredPerDead)} geschlachtete Rinder kam ${lastHit?.year} ein verendetes.`, sources: ['btDrs18_12519', 'destatisSlaughter'] },
        { value: `${modelLosses.calfLossPercent}\u00A0%`, label: 'der Kälber in der Milchviehhaltung sterben', note: `Dazu sterben ${modelLosses.cowLossPercent} Prozent der Kühe im Betrieb. Kennzahlen des Thünen-Instituts.`, sources: ['thuenenDairy'] },
      ]"
    />

    <h2>Rinder: die einzigen veröffentlichten Zahlen</h2>
    <p>
      Zahlen hat die Bundesregierung nur einmal genannt, und nur für Rinder: 2017 veröffentlichte sie aus HI-Tier
      die verendeten Rinder der Jahre 2010 bis 2016, jedes Jahr zwischen
      {{ formatNumber(Math.min(...deadCattleHit.map((entry) => entry.count))) }} und
      {{ formatNumber(Math.max(...deadCattleHit.map((entry) => entry.count))) }}. Nach Zahlen zu verendeten oder getöteten
      Rindern der letzten fünf Jahre gefragt, antwortete sie im Februar 2026, diese lägen ihr nicht vor.
    </p>
    <SourceLinks :ids="['btDrs21_4071']" />
    <BarList caption="Verendete Rinder laut HI-Tier" :items="hitBars" :sources="['btDrs18_12519']" />

    <h2>Was in den toten Tieren zu finden war</h2>
    <p>
      Tote Tiere kommen in Verarbeitungsbetriebe für tierische Nebenprodukte. Die Tierärztliche Hochschule Hannover hat dort von
      {{ tihoStudy.period }} in {{ tihoStudy.plants }} Betrieben {{ tihoStudy.deliveries }} komplette Lieferungen toter Schweine
      untersucht, darunter {{ tihoStudy.fatteningPigsChecked }} Mastschweine und {{ tihoStudy.breedingPigsChecked }} Zuchtschweine.
    </p>
    <ul>
      <li>
        {{ formatNumber(tihoStudy.fatteningPigsSufferingPercent, 1) }} Prozent der Mastschweine und
        {{ formatNumber(tihoStudy.breedingPigsSufferingPercent, 1) }} Prozent der Zuchtschweine hatten über längere Zeit erhebliche Schmerzen oder
        Leiden.
      </li>
      <li>
        Bei etwa {{ tihoStudy.killingUnavoidablePercent }} Prozent der Schweine wäre eine Tötung unumgänglich gewesen, um ihnen Leiden zu ersparen.
        Auf alle Schweine hochgerechnet sind das etwa {{ tihoPerYearMillions }} Millionen im Jahr.
      </li>
      <li>
        Von {{ tihoStudy.pigsWithKillingSigns }} Schweinen mit Spuren einer Tötung waren
        {{ formatNumber(tihoStudy.incorrectKillingPercent, 1) }} Prozent nicht richtig betäubt oder getötet worden.
      </li>
    </ul>
    <SourceLinks :ids="['tihoPigs']" />
    <p>
      Eine Statistik darüber, wie viele Kadaver Hinweise auf Tierschutzverstöße zeigen, wird nicht geführt. Das schrieb die
      Bundesregierung schon 2017.
    </p>
    <SourceLinks :ids="['btDrs18_12519']" />

    <h2>Warum das wichtig ist</h2>
    <p>
      Wer nur die Schlachtzahlen kennt, unterschätzt, wie viele Tiere für Fleisch, Milch und Eier sterben. Auch die Zähler auf
      vegan.to zeigen nur die Untergrenze, denn sie beruhen auf den Schlachtzahlen. Die Tiere, die vorher im Stall sterben, kommen dazu, und für die meisten Arten weiß
      niemand, wie viele es sind.
    </p>

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Losses" />
  </ContentPage>
</template>

<style scoped>
.losses-quote {
  margin: 0 0 2.5rem;
  padding: 1.5rem 1.6rem 1.2rem;
  border-radius: 20px;
  background: var(--brand-green);
  color: var(--brand-cream);
}
.losses-quote p {
  margin: 0 0 0.75rem;
  max-width: none;
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.4vw, 1.5rem);
  letter-spacing: -0.02em;
  line-height: 1.35;
  color: var(--brand-cream);
}
.losses-quote :deep(.source-links),
.losses-quote :deep(.source-links a) {
  color: rgba(246, 241, 231, 0.7);
}
</style>
