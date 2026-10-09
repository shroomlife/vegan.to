<script setup lang="ts">
import { topicByName } from '@/data/topics'
import { comparisons, type Verdict } from '@/data/topics/comparison'
import ContentPage from '@/components/ContentPage.vue'
import BrightSpots from '@/components/BrightSpots.vue'
import QuickAnswers from '@/components/QuickAnswers.vue'
import RelatedTopics from '@/components/RelatedTopics.vue'
import SourceLinks from '@/components/SourceLinks.vue'

const topic = topicByName('Comparison')

const groups: readonly { verdict: Verdict; title: string; intro: string }[] = [
  {
    verdict: 'germany',
    title: 'Hier ist Deutschland weiter',
    intro: 'In diesen Punkten regelt Deutschland mehr als viele Nachbarn oder das EU-Recht.',
  },
  {
    verdict: 'mixed',
    title: 'Hier liegt Deutschland in der Mitte',
    intro: 'In diesen Punkten ist Deutschland strenger als einige der verglichenen Regeln und lockerer als andere.',
  },
  {
    verdict: 'others',
    title: 'Hier sind andere Länder weiter',
    intro: 'In diesen Punkten erlaubt Deutschland, was andere Länder schon verboten oder enger begrenzt haben.',
  },
  {
    verdict: 'unclear',
    title: 'Hier ist niemand weiter',
    intro: 'Manche Probleme hat bisher kein Land gelöst.',
  },
]

const byVerdict = (verdict: Verdict) => comparisons.filter((entry) => entry.verdict === verdict)
const aheadCount = byVerdict('germany').length
const behindCount = byVerdict('others').length
const mixedCount = byVerdict('mixed').length

const pointsPhrase = (count: number) => (count === 1 ? 'einem Punkt' : `${count} Punkten`)
const lead = [
  'Wir haben die Gesetze von Deutschland mit denen der Schweiz, Österreichs, Schwedens, Norwegens, Dänemarks, Tschechiens, Frankreichs, Italiens, Englands, Spaniens und der Niederlande und mit dem EU-Recht verglichen.',
  `In ${pointsPhrase(aheadCount)} ist Deutschland weiter, in ${pointsPhrase(behindCount)} andere Länder${mixedCount > 0 ? `, in ${pointsPhrase(mixedCount)} beides` : ''}.`,
].join(' ')

const brightSpots = [
  {
    title: 'Deutschland als Vorreiter beim Verbot des Kükentötens',
    text: 'Das deutsche Verbot des Kükentötens geht weiter als die Regeln in Frankreich, Österreich und der Schweiz.',
    sources: ['tierSchG4c', 'frChicksAN', 'atTSchG'] as const,
  },
  {
    title: 'Andere zeigen, was möglich ist',
    text: 'Vieles, was in Deutschland noch erlaubt ist, haben Länder wie die Schweiz, Schweden oder Österreich bereits verboten oder eng begrenzt.',
    sources: ['chTSchV', 'seDjurskyddsforordning', 'atTSchG'] as const,
  },
]

const answers = [
  {
    question: 'Hat Deutschland ein strenges Tierschutzgesetz?',
    answer: 'In einigen Punkten ja: Das Töten männlicher Küken ist seit 2022 verboten, Ferkel dürfen seit 2021 nur mit Betäubung kastriert werden. In vielen anderen Punkten sind Länder wie die Schweiz, Schweden, Norwegen oder Österreich strenger, zum Beispiel beim Kastenstand für Sauen, beim Kürzen der Schwänze, beim Vollspaltenboden und beim Schlachten ohne Betäubung.',
  },
  {
    question: 'Welches Land hat den besten Tierschutz für Nutztiere?',
    answer: 'Das lässt sich nicht an einem Land festmachen. In den hier verglichenen Gesetzen geht die Schweiz bei Kastenstand, Schwanzkupieren, Transportdauer und Betäubung beim Schlachten weiter als Deutschland. Schweden schreibt Weidegang für Rinder in der Milchproduktion gesetzlich vor.',
  },
  {
    question: 'Ist Schächten in Deutschland erlaubt?',
    answer: 'Mit einer behördlichen Ausnahmegenehmigung aus religiösen Gründen ja. In Schweden, Norwegen und Dänemark ist eine Betäubung vor dem Schlachten immer Pflicht, in der Schweiz für Säugetiere.',
  },
]
</script>

<template>
  <ContentPage
    kicker="Tierschutz im Vergleich · Gesetzestexte"
    title="Was Deutschland Tieren erlaubt, und was andere verbieten."
    :lead="lead"
    :crumbs="[{ label: 'vegan.to', to: '/' }, { label: topic.label }]"
  >
    <template v-for="group in groups" :key="group.verdict">
      <h2>{{ group.title }}</h2>
      <p>{{ group.intro }}</p>
      <div class="compare-list">
        <article v-for="entry in byVerdict(group.verdict)" :key="entry.topic" class="compare" :class="`compare--${entry.verdict}`">
          <h3>{{ entry.topic }}</h3>
          <p class="compare-summary">{{ entry.summary }}</p>
          <dl class="compare-rules">
            <div class="compare-rule compare-rule--de">
              <dt>Deutschland</dt>
              <dd>{{ entry.germany }}</dd>
            </div>
            <div v-for="other in entry.others" :key="other.country" class="compare-rule">
              <dt>{{ other.country }}</dt>
              <dd>{{ other.rule }}</dd>
            </div>
          </dl>
          <SourceLinks :ids="entry.sources" />
        </article>
      </div>
    </template>

    <h2>So haben wir verglichen</h2>
    <ul>
      <li>Verglichen sind Gesetze und Verordnungen, nicht die Kontrolle in der Praxis. Ein strenges Gesetz sagt nichts darüber, wie gut es durchgesetzt wird.</li>
      <li>Jede Regel ist mit dem Gesetzestext oder einer amtlichen Seite belegt, Stand Oktober 2026.</li>
      <li>Was wir nicht sicher belegen konnten, steht hier nicht, zum Beispiel das Jahr des Schweizer Batteriekäfig-Verbots oder die Regeln in Luxemburg und Finnland.</li>
    </ul>

    <BrightSpots :items="brightSpots" />
    <QuickAnswers :items="answers" />
    <RelatedTopics current="Comparison" />
  </ContentPage>
</template>

<style scoped>
.compare-list {
  display: grid;
  gap: 1rem;
  margin-bottom: 2.5rem;
}
.compare {
  padding: 1.35rem 1.4rem 1.15rem;
  border-radius: 20px;
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
}
.compare--germany {
  border-color: rgba(31, 122, 69, 0.35);
}
.compare--mixed {
  border-color: rgba(214, 158, 46, 0.4);
}
.compare--others {
  border-color: rgba(231, 76, 60, 0.3);
}
.compare h3 {
  margin: 0 0 0.35rem;
}
.compare-summary {
  margin: 0 0 1rem;
}
.compare-rules {
  display: grid;
  gap: 0.6rem;
  margin: 0 0 0.9rem;
}
.compare-rule {
  display: grid;
  grid-template-columns: minmax(9rem, 13rem) minmax(0, 1fr);
  gap: 0.25rem 1rem;
  padding-top: 0.6rem;
  border-top: 1px solid rgba(20, 54, 31, 0.08);
}
.compare-rule dt {
  font-weight: 700;
  color: var(--brand-green);
}
.compare-rule dd {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
}
.compare-rule--de dt {
  color: var(--brand-accent-text);
}
@media (max-width: 767px) {
  .compare-rule {
    grid-template-columns: 1fr;
  }
}
</style>
