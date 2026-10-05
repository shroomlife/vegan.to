<script setup lang="ts">
import { animals } from '@/data/animals'
import { topicByName } from '@/data/topics'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import ContentPage from '@/components/ContentPage.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Stunning')

const cattle = animals.find((animal) => animal.names.single === 'Rind')?.deaths.year ?? 0
/** Literature range quoted by the federal government in 2012: 4 to over 9 percent need a second shot */
const cattleFailures = { min: cattle * 0.04, max: cattle * 0.09 }

const brightSpots = [
  {
    title: 'Kameras in Schlachthöfen',
    text: 'Seit Juli 2026 liegt dem Bundestag ein Gesetzentwurf der Bundesregierung vor: Größere Schlachthöfe sollen Entladen, Betäuben und Töten auf Video aufzeichnen und die Aufnahmen den Behörden bereitstellen. Beschlossen ist das Gesetz noch nicht (Stand Oktober 2026).',
    sources: ['btDrs21_6809'] as const,
  },
  {
    title: 'Bessere Technik wirkt',
    text: 'Mit guter Kopffixierung und passenden Bolzenschussgeräten lässt sich die Fehlbetäubungsrate bei Rindern laut ersten Forschungsergebnissen auf etwa 1 Prozent senken.',
    sources: ['btDrs17_10021'] as const,
  },
  {
    title: 'Weg vom CO2',
    text: 'Die EFSA empfiehlt, die Betäubung von Schweinen mit hoch konzentriertem CO2 durch weniger belastende Gasgemische zu ersetzen. Bundesforschungsinstitute sind laut Bundesregierung an der Suche nach Alternativen beteiligt.',
    sources: ['efsaPigs2020', 'btDrs18_12519'] as const,
  },
]

const answers = [
  {
    question: 'Wie werden Schweine vor der Schlachtung betäubt?',
    answer: 'Meist mit Kohlendioxid. Die Schweine kommen in eine Kammer mit hoher CO2-Konzentration und müssen dort mindestens 100 Sekunden bleiben. Die EFSA stuft CO2 in hoher Konzentration als stark belastend ein: Es verursacht Schmerzen, Angst und Atemnot. Daneben gibt es die elektrische Betäubung.',
  },
  {
    question: 'Wie oft gelingt die Betäubung bei Rindern nicht?',
    answer: `In der Literatur, die die Bundesregierung 2012 zitiert, bei 4 bis über 9 Prozent der Rinder. Sie brauchen dann einen zweiten Schuss. Bei ${formatCompact(cattle, 2)} geschlachteten Rindern im Jahr wären das rechnerisch rund ${formatNumber(Math.round(cattleFailures.min / 1000) * 1000)} bis ${formatNumber(Math.round(cattleFailures.max / 1000) * 1000)} Tiere.`,
  },
  {
    question: 'Wie wird Geflügel betäubt?',
    answer: 'Zum Beispiel elektrisch: Die Hühner werden lebend kopfüber an den Beinen in Schlachtbügel gehängt und durch ein Wasserbad unter Strom gezogen. Danach wird ihnen automatisch der Hals aufgeschnitten. Weil der Strom gleichzeitig durch viele Tiere fließt, kann es passieren, dass einzelne Tiere nicht ausreichend betäubt werden. Ein anderes Verfahren ist die Betäubung mit Gas.',
  },
]
</script>

<template>
  <ContentPage
    kicker="Betäubung · Gesetz, Studien, EFSA"
    title="Nicht jedes Tier ist bewusstlos."
    lead="Warmblütige Tiere müssen in Deutschland vor dem Schlachten betäubt werden, von Ausnahmen wie dem genehmigten Schächten abgesehen, und bis zu ihrem Tod empfindungs- und wahrnehmungslos bleiben. So steht es im Tierschutzgesetz und in der Tierschutz-Schlachtverordnung. Studien, die die Bundesregierung selbst zitiert, zeigen: Das gelingt nicht immer."
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <FigureGrid
      :items="[
        { value: '4 bis über 9 %', label: 'der Rinder brauchen einen zweiten Bolzenschuss', note: 'Spanne aus der Literatur, zitiert von der Bundesregierung 2012.', sources: ['btDrs17_10021'] },
        { value: '10,9 bis 12,5 %', label: 'Fehlbetäubungen bei Schweinen mit der Elektrozange', note: 'Bei automatischen Anlagen 3,3 Prozent. Nach einer Studie der EFSA.', sources: ['btDrs17_10021'] },
        { value: 'mindestens 100 Sekunden', label: 'müssen Schweine im CO2 bleiben', note: 'Die EFSA nennt hoch konzentriertes CO2 stark belastend.', sources: ['tierSchlVAnlage1', 'efsaPigs2020'] },
      ]"
    />

    <h2>Schweine: Kohlendioxid</h2>
    <p>
      Die meisten Schweine in Deutschland werden mit Kohlendioxid betäubt. Laut einem Bericht von agrarheute nutzen rund
      90 Prozent der großen Schlachtbetriebe dieses Verfahren, für geschätzt 34 Millionen Schweine. Die Tiere kommen in eine Kammer mit
      hoher CO2-Konzentration. Sie müssen den ersten Halt spätestens nach 30 Sekunden erreichen
      und mindestens 100 Sekunden im Gas bleiben.
    </p>
    <p>
      Die Europäische Behörde für Lebensmittelsicherheit (EFSA) hat 2020 die Schlachtung von Schweinen bewertet. Ihr Ergebnis:
      CO2 in Konzentrationen über 80 Prozent ist für die Tiere stark belastend. Es reizt die Nasenschleimhaut, verursacht Schmerzen, Angst und
      Atemnot. Die EFSA empfiehlt, es durch weniger belastende Gasgemische zu ersetzen. Auch die Bundesregierung schrieb 2017, CO2
      habe „aus Sicht des Tierschutzes unerwünschte Wirkungen“.
    </p>
    <SourceLinks :ids="['agrarheuteCo2', 'tierSchlVAnlage1', 'efsaPigs2020', 'btDrs18_12519']" />
    <p>
      Bei der elektrischen Betäubung waren laut einer EFSA-Studie mit handgeführten Zangen 10,9 bis 12,5 Prozent der Schweine
      nicht richtig betäubt, in automatischen Anlagen 3,3 Prozent. Je nach Verfahren und Personal zeigten 0,1 bis 1 Prozent der
      Schweine kurz vor dem Brühbad noch Reaktionen, die auf Empfindung und Wahrnehmung hindeuten. 0,4 bis 2,5 Prozent der Tiere
      wachten nach einem fehlerhaften Entblutestich wieder auf, also nach dem Stich, durch den sie ausbluten sollen.
    </p>
    <SourceLinks :ids="['btDrs17_10021']" />

    <h2>Rinder: Bolzenschuss</h2>
    <p>
      Rinder werden in der Regel mit einem Bolzenschuss in den Kopf betäubt. Der Bolzen muss sicher ins Gehirn eindringen, ein Schuss in den
      Hinterkopf ist verboten. Trotzdem braucht ein Teil der Tiere einen zweiten Schuss:
    </p>
    <ul>
      <li>In der Literatur werden für die industrielle Rinderschlachtung in Deutschland 4 bis über 9 Prozent genannt.</li>
      <li>
        Eine Untersuchung in 25 Schlachthöfen in Deutschland und Österreich von 2000 bis 2011 fand: Bei 9,2 Prozent der Rinder
        reichte der erste Schuss nicht aus.
      </li>
      <li>
        In einer Studie von 2015 waren es bei schweren Bullen und schwächeren Geräten 8,1 Prozent, mit stärkeren Geräten 1,6
        bis 1,9 Prozent. Bullen sind etwa doppelt so oft betroffen wie weibliche Tiere.
      </li>
    </ul>
    <p>
      2025 wurden in Deutschland {{ formatNumber(cattle) }} Rinder geschlachtet. Bei 4 bis 9 Prozent wären das rechnerisch
      {{ formatNumber(Math.round(cattleFailures.min / 1000) * 1000) }} bis {{ formatNumber(Math.round(cattleFailures.max / 1000) * 1000) }}
      Tiere, die nach dem ersten Schuss nicht ausreichend betäubt waren, nach Studien, die die Bundesregierung 2012 und 2017
      zitiert. Das ist eine Hochrechnung, keine Zählung.
    </p>
    <SourceLinks :ids="['tierSchlVAnlage1', 'btDrs17_10021', 'btDrs18_12519', 'destatisSlaughter']" />

    <h2>Geflügel: Wasserbad</h2>
    <p>
      Neben der Betäubung mit Gas gibt es bei Geflügel die elektrische Betäubung im Wasserbad. Dafür werden Hühner lebend kopfüber an den Beinen in Schlachtbügel gehängt. Laut Bundesregierung
      entsteht dabei vor allem bei schweren Tieren hoher Druck auf die Beine. Dann werden die Tiere mit dem Kopf durch ein
      Wasserbad unter Strom gezogen, für Hühner mit mindestens 120 Milliampere je Tier. Weil der Strom gleichzeitig durch viele Tiere mit
      unterschiedlichem Widerstand fließt, kann es passieren, dass einzelne Tiere nicht ausreichend betäubt werden. Der Hals
      wird maschinell aufgeschnitten. Tiere, die die Maschine verfehlt, müssen von Hand entblutet werden.
    </p>
    <SourceLinks :ids="['btDrs17_10021', 'tierSchlVAnlage1', 'dgsWaterbath']" />

    <h2>Kontrolle</h2>
    <p>
      Behörden können bei Kontrollen meist nur einzelne Bereiche und Zeiträume eines Schlachthofs prüfen, so begründet es die
      Bundesregierung. Seit Juli 2026 liegt dem Bundestag ein Gesetzentwurf der Bundesregierung vor: Schlachthöfe, die einen
      Tierschutzbeauftragten haben müssen, sollen das Entladen, Betäuben und Töten auf Video aufzeichnen, die Aufnahmen 30
      Schlachttage lang speichern und den Behörden zur Verfügung stellen. Beschlossen ist das Gesetz noch nicht (Stand Oktober
      2026).
    </p>
    <SourceLinks :ids="['btDrs21_6809']" />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Stunning" />
  </ContentPage>
</template>
