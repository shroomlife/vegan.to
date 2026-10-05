<script setup lang="ts">
import { animals } from '@/data/animals'
import { topicByName } from '@/data/topics'
import { calvesMay2026, dairyHoldingsMay2026, dairyModel, pregnantSlaughter } from '@/data/topics/dairy'
import { cattleStock } from '@/data/topics/livestock'
import { formatCompact, formatNumber } from '@/utils/formatNumber'
import { numberWord } from '@/utils/numberWords'
import ContentPage from '@/components/ContentPage.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import FigureGrid from '@/components/FigureGrid.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Dairy')

const cattle = animals.find((animal) => animal.names.single === 'Rind')
const slaughtered = (name: string) => cattle?.children?.find((child) => child.name === name)?.deaths.year ?? 0
const cows = slaughtered('Kühe')
const calves = slaughtered('Kälber')
const heifers = slaughtered('Färsen')

const intervalMonths = dairyModel.calvingIntervalDays / 30.4

const brightSpots = [
  {
    title: 'Hochträchtige Tiere geschützt',
    text: 'Seit dem 1. September 2017 ist es verboten, Kühe und andere Säugetiere im letzten Drittel der Trächtigkeit zur Schlachtung abzugeben. Ausgenommen sind Schafe und Ziegen sowie Fälle, in denen die Tötung tierseuchenrechtlich vorgeschrieben ist oder ein Tierarzt sie im Einzelfall für geboten hält.',
    sources: ['tierErzHaVerbG4'] as const,
  },
  {
    title: 'Weniger Milchkühe',
    text: `Im Mai 2010 standen ${formatNumber(cattleStock.dairyCowsMay2010)} Milchkühe in deutschen Ställen, im Mai 2026 waren es ${formatNumber(cattleStock.dairyCowsMay2026)}.`,
    sources: ['destatisCattleStock'] as const,
  },
  {
    title: 'Kälber sollen später transportiert werden',
    text: 'Die EFSA empfiehlt, Kälber erst ab einem Alter von fünf Wochen zu transportieren. Die EU-Kommission hat das in ihren Vorschlag für neue Transportregeln übernommen, die Bundesregierung unterstützt es.',
    sources: ['btDrs21_7484'] as const,
  },
  {
    title: 'Längere Nutzung als Förderziel',
    text: 'Der Bund bezahlt Projekte, die Wissen in die Betriebe bringen sollen: Milchkühe sollen länger leben und weniger Kälber sterben. Die kuhgebundene Kälberaufzucht, bei der die Kälber bei einer Kuh bleiben, nennt die Bundesregierung eine besonders tiergerechte Haltungsform.',
    sources: ['btDrs21_7484'] as const,
  },
]

const answers = [
  {
    question: 'Warum muss eine Kuh ein Kalb bekommen, um Milch zu geben?',
    answer: 'Eine Kuh gibt erst Milch, wenn sie ein Kalb geboren hat. Etwa zwei Monate nach jeder Geburt kann sie wieder besamt werden. Im Schnitt bekommt sie alle 417 Tage ein Kalb, laut den Kennzahlen des Thünen-Instituts.',
  },
  {
    question: 'Was passiert mit den Kälbern von Milchkühen?',
    answer: 'Sie werden in der Regel wenige Stunden nach der Geburt von der Mutter getrennt. Männliche Kälber und ein Teil der weiblichen werden meist nach wenigen Wochen an Mastbetriebe verkauft, oft auch ins Ausland. Die meisten werden mit ein bis zwei Jahren geschlachtet, Kälber für Kalbfleisch mit sieben bis acht Monaten.',
  },
  {
    question: 'Wie alt wird eine Milchkuh?',
    answer: 'Im Durchschnitt 5,5 Jahre, laut Bundesinformationszentrum Landwirtschaft. Sie bekommt im Schnitt drei Kälber und gibt nach jeder Geburt Milch. Jedes Jahr wird etwa ein Drittel der Herde ersetzt. Ein Rind könnte bis zu 25 Jahre alt werden.',
  },
  {
    question: 'Wie viele Kühe werden in Deutschland geschlachtet?',
    answer: `${formatNumber(cows)} Kühe im Jahr 2025, dazu ${formatNumber(calves)} Kälber und ${formatNumber(heifers)} Färsen, also junge weibliche Rinder, die noch nicht gekalbt haben. Gezählt sind Tiere aus deutscher Haltung.`,
  },
]
</script>

<template>
  <ContentPage
    kicker="Milchkühe und Kälber · Thünen, BZL, Destatis"
    title="Keine Milch ohne Kalb."
    :lead="`Eine Kuh gibt nur Milch, wenn sie ein Kalb geboren hat. Deshalb wird sie immer wieder besamt. Im Schnitt bekommt sie alle knapp ${formatNumber(intervalMonths)} Monate ein Kalb. Das Kalb wird meist wenige Stunden nach der Geburt von ihr getrennt.`"
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <FigureGrid
      :items="[
        { value: formatNumber(cattleStock.dairyCowsMay2026), label: 'Milchkühe, Mai 2026', note: `In ${formatNumber(dairyHoldingsMay2026)} Haltungen.`, sources: ['destatisCattleStock'] },
        { value: formatNumber(cows), label: 'geschlachtete Kühe, 2025', sources: ['destatisSlaughter'] },
        { value: formatNumber(calves), label: 'geschlachtete Kälber, 2025', sources: ['destatisSlaughter'] },
        { value: '5,5 Jahre', label: 'Durchschnittsalter einer Milchkuh bei der Schlachtung', note: 'Möglich wären bis zu 25 Jahre.', sources: ['bzlAges', 'vierPfotenRinder'] },
      ]"
    />

    <h2>Ein Kreislauf aus Besamung und Geburt</h2>
    <p>
      Das Thünen-Institut beschreibt den typischen Ablauf in der konventionellen Milchviehhaltung so: Junge weibliche Rinder werden ab
      einem Alter von {{ dairyModel.firstInseminationMonths }} Monaten besamt, häufig künstlich. Eine Trächtigkeit dauert
      {{ dairyModel.gestationDays }} Tage. Beim ersten Kalb ist eine Kuh im Schnitt {{ formatNumber(dairyModel.firstCalvingMonths, 1) }}
      Monate alt. Von da an wird sie zwei- bis dreimal am Tag gemolken.
    </p>
    <p>
      Etwa {{ dairyModel.inseminationAfterCalvingDays }} Tage nach der Geburt kann sie wieder besamt werden. Sechs bis acht Wochen vor
      der nächsten Geburt wird sie nicht mehr gemolken. Zwischen zwei Geburten liegen im Schnitt {{ dairyModel.calvingIntervalDays }}
      Tage. Die Milchleistung liegt im Modell des Thünen-Instituts bei {{ formatNumber(dairyModel.milkKgPerYear) }} Kilogramm im Jahr.
    </p>
    <SourceLinks :ids="['thuenenDairy']" />

    <h2>Was mit den Kälbern passiert</h2>
    <p>
      Ein Kalb bleibt meist nur wenige Stunden bei seiner Mutter. Danach kommt es in einen eigenen Bereich, überwiegend in eine
      Kälberbox oder ein Kälberiglu. Die erste Milch der Mutter bekommt es aus der Flasche oder dem Eimer, danach Milch des Hofes oder
      Milchaustauscher, also in Wasser angerührtes Milchpulver.
    </p>
    <p>
      Weibliche Kälber bleiben oft als Nachwuchs auf dem Hof. Die männlichen und ein Teil der weiblichen werden nach wenigen Wochen
      an Mastbetriebe verkauft, männliche Kälber laut Thünen-Institut meistens nach vier Wochen. Wichtigstes Abnehmerland sind die
      Niederlande. Für Kalbfleisch werden die Tiere mit sieben bis acht Monaten geschlachtet, die meisten aber erst mit ein bis zwei
      Jahren als Bullen oder Färsen. Im Mai 2026 lebten in Deutschland {{ formatNumber(calvesMay2026.male) }} männliche und
      {{ formatNumber(calvesMay2026.female) }} weibliche Kälber im Alter bis acht Monate.
    </p>
    <p>
      Innerhalb Deutschlands dürfen Kälber seit 2023 grundsätzlich erst ab einem Alter von 28 Tagen transportiert werden. Wie
      viele der in Länder außerhalb der EU exportierten Rinder Kälber waren, lässt sich nach Auskunft der Bundesregierung nicht
      zuverlässig sagen. Wie oft Kälbertransporte kontrolliert werden, dazu liegen ihr keine Daten vor.
    </p>
    <SourceLinks :ids="['bzlCalves', 'thuenenDairy', 'destatisCattleStock', 'tierSchTrV10', 'tierSchTrV23', 'btDrs21_7484']" />

    <h2>Wie lange eine Milchkuh lebt</h2>
    <p>
      Im Modell des Thünen-Instituts gibt eine Kuh in {{ numberWord(dairyModel.lactations) }} Laktationen, also nach
      {{ numberWord(dairyModel.lactations) }} Geburten, Milch. Jedes Jahr werden
      {{ dairyModel.replacementPercent }} Prozent der Herde durch junge Kühe ersetzt. {{ numberWord(dairyModel.calfLossPercent, { capitalize: true }) }} Prozent der
      Kälber und {{ numberWord(dairyModel.cowLossPercent) }} Prozent der Kühe sterben im Betrieb. Im Durchschnitt wird eine Milchkuh 5,5 Jahre alt.
      2025 wurden in Deutschland {{ formatNumber(cows) }} Kühe geschlachtet. Diese Zahl umfasst alle Kühe, nicht nur Milchkühe.
    </p>
    <SourceLinks :ids="['thuenenDairy', 'bzlAges', 'destatisSlaughter']" />

    <h2>Trächtig geschlachtet</h2>
    <p>
      Manche Kühe sind trächtig, wenn sie geschlachtet werden. Ein von der Bundesregierung gefördertes Projekt fand nach Zwischenergebnissen von 2017 in amtlichen
      Untersuchungen bei {{ formatNumber(pregnantSlaughter.signCattleSharePercent, 1) }} Prozent von
      {{ formatNumber(pregnantSlaughter.signCattleBase) }} geschlachteten Rindern eine Trächtigkeit, bei weiblichen Rindern waren es
      {{ formatNumber(pregnantSlaughter.signFemaleSharePercent, 1) }} Prozent. Mehr als drei Viertel davon waren im mittleren oder
      letzten Drittel der Trächtigkeit. In eigenen Untersuchungen auf vier Schlachthöfen fand das Projektteam bei
      {{ formatNumber(pregnantSlaughter.ownStudyMinPercent, 1) }} bis {{ pregnantSlaughter.ownStudyMaxPercent }} Prozent der weiblichen
      Rinder eine Trächtigkeit.
    </p>
    <p>
      Untersuchungen auf Schlachthöfen aus den Jahren 2013 und 2014 ergaben, dass 0,8 bis 2,5 Prozent der Rinder hochträchtig
      geschlachtet wurden. In diesem Zusammenhang wurde laut Bundesregierung auf
      {{ formatNumber(pregnantSlaughter.bagViableCalves) }} getötete lebensfähige Kälber verwiesen. Die Zahlen stammen aus einer Antwort der Bundesregierung von 2017. Die Untersuchungen
      von 2013 und 2014 nennt sie selbst nicht repräsentativ.
      Seit dem 1. September 2017 ist es verboten, Säugetiere im letzten Drittel der Trächtigkeit zur Schlachtung abzugeben,
      Schafe und Ziegen ausgenommen.
    </p>
    <SourceLinks :ids="['btDrs18_12519', 'tierErzHaVerbG4']" />

    <h2>Wie Milchkühe gehalten werden</h2>
    <p>
      2020 standen {{ dairyModel.looseHousingSharePercent }} Prozent der Milchkühe in Laufställen, in denen sie sich bewegen können.
      {{ dairyModel.tieStallFarmsPercent }} Prozent der Betriebe hielten ihre Kühe in Anbindeställen, die meisten davon das ganze Jahr.
      Auf die Weide kamen {{ dairyModel.pastureSharePercent }} Prozent der Milchkühe. 2024 wurden in Deutschland
      {{ formatCompact(dairyModel.milkTonnes2024) }} Tonnen Milch erzeugt.
    </p>
    <SourceLinks :ids="['thuenenDairy']" />

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Dairy" />
  </ContentPage>
</template>
