<script setup lang="ts">
import { topicByName } from '@/data/topics'
import { poultryExports2025, thirdCountryExports } from '@/data/topics/transport'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import ContentPage from '@/components/ContentPage.vue'
import BarList from '@/components/BarList.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import DataTable from '@/components/DataTable.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Transport')

const first = thirdCountryExports[0]
const latest = thirdCountryExports[thirdCountryExports.length - 1]
const cattleChange = first && latest ? ((latest.cattle - first.cattle) / first.cattle) * 100 : 0
const pigPeak = thirdCountryExports.reduce((max, entry) => (entry.pigs > max.pigs ? entry : max))

const cattleBars = thirdCountryExports.map((entry) => ({ label: String(entry.year), value: entry.cattle }))
const pigBars = thirdCountryExports.map((entry) => ({ label: String(entry.year), value: entry.pigs }))

const rules = [
  ['Grundregel für Rinder, Schweine, Schafe, Ziegen und Pferde', '8\u00A0Stunden'],
  ['Kälber, Lämmer, Zicklein, Fohlen und Ferkel, die noch Milch bekommen', '9\u00A0Stunden, 1\u00A0Stunde Pause, weitere 9\u00A0Stunden'],
  ['Schweine', '24\u00A0Stunden, mit ständigem Zugang zu Wasser'],
  ['Pferde', '24\u00A0Stunden, alle 8\u00A0Stunden tränken'],
  ['Rinder, Schafe und Ziegen', '14\u00A0Stunden, 1\u00A0Stunde Pause, weitere 14\u00A0Stunden'],
  ['Verlängerung', 'im Interesse der Tiere um 2\u00A0Stunden'],
  ['Danach','abladen, füttern, tränken und mindestens 24\u00A0Stunden Ruhe'],
]

const brightSpots = [
  {
    title: 'Fast keine Rinder mehr in Länder außerhalb der EU',
    text: `${first?.year} wurden ${formatNumber(first?.cattle ?? 0)} lebende Rinder aus Deutschland in Länder außerhalb der EU gebracht, ${latest?.year} noch ${formatNumber(latest?.cattle ?? 0)}. Das ist ein Rückgang um ${formatNumber(Math.abs(cattleChange), 1)} Prozent.`,
    sources: ['btDrs21_7484'] as const,
  },
  {
    title: 'Keine neuen Bescheinigungen',
    text: 'Seit 2010 handelt die Bundesregierung keine neuen Veterinärbescheinigungen für den Export von Tieren zur Mast und Schlachtung aus, seit 2023 auch keine für Zuchtwiederkäuer.',
    sources: ['btDrs21_7484'] as const,
  },
  {
    title: 'Kürzere Fahrten geplant',
    text: 'Die EU-Kommission will Fahrten zur Schlachtung auf neun Stunden begrenzen und Kälber erst ab fünf Wochen transportieren lassen. Beschlossen ist das noch nicht.',
    sources: ['epTransportReform', 'btDrs21_7484'] as const,
  },
]

const answers = [
  {
    question: 'Wie lange dürfen Tiere transportiert werden?',
    answer: 'Nach EU-Recht grundsätzlich acht Stunden. Mit besonders ausgestatteten Fahrzeugen dürfen Schweine 24 Stunden transportiert werden, Rinder, Schafe und Ziegen zweimal 14 Stunden mit einer Stunde Pause dazwischen. Danach müssen die Tiere abgeladen werden und mindestens 24 Stunden ruhen. Fahrten zum Schlachthof dürfen innerhalb Deutschlands grundsätzlich höchstens acht Stunden dauern, mit Ausnahmen für besonders zugelassene Fahrzeuge, und nur viereinhalb Stunden, wenn Temperaturen über 30 Grad nicht ausgeschlossen sind.',
  },
  {
    question: 'Wie viele Tiere exportiert Deutschland in Länder außerhalb der EU?',
    answer: `${latest?.year} waren es ${formatNumber(latest?.cattle ?? 0)} Rinder, ${formatNumber(latest?.pigs ?? 0)} Schweine und ${formatNumber(poultryExports2025)} Stück Geflügel, laut Bundesregierung. ${first?.year} waren es noch ${formatNumber(first?.cattle ?? 0)} Rinder.`,
  },
  {
    question: 'Ab welchem Alter dürfen Kälber transportiert werden?',
    answer: 'Nach EU-Recht dürfen Kälber, die jünger als zehn Tage sind, nur über Strecken unter 100 Kilometern transportiert werden. Kälber unter 28 Tagen dürfen innerhalb Deutschlands seit 2023 grundsätzlich nicht transportiert werden. Ausgenommen sind Landwirtinnen und Landwirte, die eigene Tiere im eigenen Fahrzeug weniger als 50 Kilometer weit bringen.',
  },
]
</script>

<template>
  <ContentPage
    kicker="Tiertransporte · EU-Recht und Bundestag"
    title="Bis zu 28&nbsp;Stunden Fahrt."
    lead="So lange dürfen Rinder nach EU-Recht fahren, mit nur einer Stunde Pause nach 14 Stunden und 24 Stunden Ruhe danach; Schweine dürfen bis zu 24 Stunden am Stück unterwegs sein. Die gute Nachricht: Lebende Tiere in Länder außerhalb der EU, sogenannte Drittstaaten, exportiert Deutschland immer weniger."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <h2>Was erlaubt ist</h2>
    <p>
      Die Regeln stehen in der Verordnung (EG) Nr. 1/2005. Grundsätzlich dürfen Rinder, Schweine, Schafe, Ziegen und Pferde
      höchstens acht Stunden transportiert werden. Mit Fahrzeugen, die zusätzliche Anforderungen erfüllen, etwa an Tränken und
      Lüftung, sind deutlich längere Fahrten erlaubt:
    </p>
    <DataTable caption="Höchste Fahrzeiten nach EU-Recht" :head="['Tiere', 'Fahrzeit']" :rows="rules" :sources="['euTransport']" />
    <p>
      Kälber, die jünger als zehn Tage sind, dürfen nach EU-Recht nur über Strecken unter 100 Kilometern transportiert werden.
      Deutschland ist strenger: Fahrten zum Schlachthof dürfen innerhalb Deutschlands grundsätzlich höchstens acht Stunden dauern,
      mit Ausnahmen für besonders zugelassene Fahrzeuge, und nur viereinhalb Stunden, wenn Temperaturen über 30 Grad nicht
      ausgeschlossen sind. Kälber unter 28 Tagen dürfen innerhalb Deutschlands seit 2023 grundsätzlich nicht transportiert
      werden. Ausgenommen sind Landwirtinnen und Landwirte, die eigene Tiere im eigenen Fahrzeug weniger als 50 Kilometer weit
      bringen.
    </p>
    <SourceLinks :ids="['euTransport', 'tierSchTrV10', 'tierSchTrV23']" />

    <h2>Exporte in Länder außerhalb der EU</h2>
    <p>
      {{ first?.year }} wurden {{ formatNumber(first?.cattle ?? 0) }} lebende Rinder aus Deutschland in Länder außerhalb der EU
      exportiert, unter anderem in die Türkei, nach Russland, Usbekistan und Marokko. {{ latest?.year }} waren es noch
      {{ formatNumber(latest?.cattle ?? 0) }}. Gesicherte Erkenntnisse zum Rückgang hat die Bundesregierung nach eigener Aussage
      nicht. Sie verweist darauf, dass sie seit 2010 keine neuen Veterinärbescheinigungen für Mast- und Schlachttiere und seit
      2023 keine für Zuchtwiederkäuer mehr aushandelt. Das könne den Rückgang erklären. 2025 kam der Ausbruch der Maul- und
      Klauenseuche hinzu.
    </p>
    <BarList caption="Lebende Rinder, exportiert in Länder außerhalb der EU" :items="cattleBars" :sources="['btDrs21_7484']" />
    <p>
      Bei Schweinen schwanken die Zahlen stark. Den Höchstwert gab es {{ pigPeak.year }} mit {{ formatCompact(pigPeak.pigs, 2) }}
      Tieren. Nach dem ersten Nachweis der Afrikanischen Schweinepest in Deutschland im September 2020 brachen die Exporte ein.
      {{ latest?.year }} kamen außerdem {{ formatNumber(poultryExports2025) }} Stück Geflügel dazu. Welche Art von Geflügel das war, geht aus
      der Antwort der Bundesregierung nicht hervor.
    </p>
    <BarList caption="Lebende Schweine, exportiert in Länder außerhalb der EU" :items="pigBars" :sources="['btDrs21_7484']" />

    <h2>Was die Bundesregierung nicht weiß</h2>
    <p>
      Wie viele Kälbertransporte kontrolliert werden, wie viele vor Fahrtantritt untersagt werden und wie viele Plätze es für die
      Kälbermast gibt, dazu liegen der Bundesregierung nach eigener Auskunft keine Daten vor.
    </p>
    <SourceLinks :ids="['btDrs21_7484']" />

    <h2>Die geplante EU-Reform</h2>
    <p>
      Die EU-Kommission hat im Dezember 2023 neue Regeln vorgeschlagen: Fahrten zur Schlachtung höchstens neun Stunden, andere
      Fahrten höchstens 21 Stunden mit einer Pause nach zehn Stunden. Kälber sollen erst ab einem Alter von fünf Wochen
      transportiert werden dürfen, wie es die Europäische Behörde für Lebensmittelsicherheit empfiehlt. Im September 2026 war
      der Vorschlag noch nicht beschlossen.
    </p>
    <SourceLinks :ids="['epTransportReform', 'btDrs21_7484']" />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Transport" />
  </ContentPage>
</template>
