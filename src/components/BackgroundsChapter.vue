<script setup lang="ts">
import { topicByName, topicGroups, topicPages } from '@/data/topics'
import { worldSeries } from '@/data/topics/timeline'
import { formatNumber } from '@/utils/formatNumber'
import SceneImage from '@/components/SceneImage.vue'
import TopicIcon from '@/components/TopicIcon.vue'

/**
 * The door from the start page to the background pages: the Zeitreise as
 * the big feature, every other topic page as a card in one of three rows.
 * The rows and the figures come from topics.ts, the two world figures of
 * the feature from the same series the Zeitreise opens with.
 */
const timeline = topicByName('Timeline')

const firstPoint = worldSeries[0]
const lastPoint = worldSeries[worldSeries.length - 1]
if (!firstPoint || !lastPoint) throw new Error('The world series needs at least one point')

const rows = topicGroups.map((group) => ({
  ...group,
  topics: topicPages.filter((topic) => topic.group === group.key && topic.name !== timeline.name),
}))
</script>

<template>
  <section id="hintergruende" class="backgrounds chapter-section">
    <div class="container">
      <span class="chapter">Wie es dazu kam</span>
      <h2 class="chapter-title">Das war nicht immer so.</h2>
      <p class="chapter-lead">
        {{ firstPoint.year }} wurden weltweit {{ formatNumber(firstPoint.billions, 2) }} Milliarden Landtiere geschlachtet,
        {{ lastPoint.year }} waren es {{ formatNumber(lastPoint.billions, 1) }} Milliarden. Dazwischen liegen Vereine, Gesetze,
        Verbote und Urteile, die den Tieren Schritt für Schritt Schutz gaben. Die Zeitreise erzählt, wie beides zusammenpasst.
        Elf weitere Seiten erklären die Zahlen dahinter.
      </p>

      <RouterLink
        v-reveal="{ y: 32, duration: 0.6 }"
        :to="timeline.path"
        class="timeline-feature"
      >
        <SceneImage
          name="cow-eye"
          alt="Das Auge einer Holstein-Kuh, ganz nah"
          sizes="(min-width: 1320px) 1280px, 100vw"
          class="timeline-feature-picture"
        />
        <span class="timeline-feature-shade" aria-hidden="true"></span>
        <span class="timeline-feature-body">
          <span class="timeline-feature-kicker">Zeitreise &middot; Neun Akte zum Scrollen</span>
          <span class="timeline-feature-title">Wie wir mit Tieren umgehen. Von 1867 bis heute.</span>
          <span class="timeline-feature-numbers" aria-label="Weltweit geschlachtete Landtiere pro Jahr">
            <span class="timeline-feature-number">
              <span class="timeline-feature-year">{{ firstPoint.year }}</span>
              <span class="timeline-feature-value">{{ formatNumber(firstPoint.billions, 2) }} Mrd.</span>
            </span>
            <span class="timeline-feature-arrow" aria-hidden="true"></span>
            <span class="timeline-feature-number">
              <span class="timeline-feature-year">{{ lastPoint.year }}</span>
              <span class="timeline-feature-value">{{ formatNumber(lastPoint.billions, 1) }} Mrd.</span>
            </span>
          </span>
          <span class="timeline-feature-note">Landtiere, die weltweit in einem Jahr geschlachtet werden. Mit Quellen zu jeder Station.</span>
          <span class="timeline-feature-cta">Zeitreise starten</span>
        </span>
      </RouterLink>

      <div v-for="row in rows" :key="row.key" class="topic-row" :class="`topic-row--${row.key}`">
        <div class="topic-row-head">
          <h3 class="topic-row-title">{{ row.label }}</h3>
          <p class="topic-row-lead">{{ row.lead }}</p>
        </div>
        <ul class="topic-grid" :style="{ '--columns': row.topics.length }">
          <li v-for="topic in row.topics" :key="topic.path">
            <RouterLink
              v-reveal="{ y: 24, duration: 0.45 }"
              :to="topic.path"
              class="topic-card"
            >
              <span class="topic-card-icon"><TopicIcon :name="topic.name" /></span>
              <span class="topic-card-figure">{{ topic.figure }}</span>
              <span class="topic-card-figure-label">{{ topic.figureLabel }}</span>
              <span class="topic-card-label">{{ topic.label }}</span>
              <span class="topic-card-teaser">{{ topic.teaser }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.backgrounds {
  background: var(--brand-cream);
  color: var(--brand-green);
}

/* The feature: a dark card with the eye, text on the left where the hide is calm */
.timeline-feature {
  position: relative;
  display: block;
  min-height: 460px;
  margin-bottom: 3.5rem;
  border-radius: 28px;
  overflow: hidden;
  background: var(--brand-night);
  color: var(--brand-cream);
  text-decoration: none;
  isolation: isolate;
  transition: transform 0.25s, box-shadow 0.25s;
}
.timeline-feature:hover,
.timeline-feature:focus-visible {
  color: var(--brand-cream);
  text-decoration: none;
  transform: translateY(-3px);
  box-shadow: 0 24px 60px rgba(14, 33, 20, 0.35);
}
.timeline-feature:focus-visible {
  outline: 3px solid var(--brand-accent);
  outline-offset: 3px;
}
.timeline-feature-picture,
.timeline-feature-picture :deep(img) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.timeline-feature-picture :deep(img) {
  object-fit: cover;
  object-position: 68% 50%;
  transform: scale(1.02);
  transition: transform 6s ease-out;
}
.timeline-feature:hover .timeline-feature-picture :deep(img) {
  transform: scale(1.08);
}
.timeline-feature-shade {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(14, 33, 20, 0.94) 0%, rgba(14, 33, 20, 0.82) 38%, rgba(14, 33, 20, 0.2) 70%, rgba(14, 33, 20, 0.05) 100%),
    linear-gradient(0deg, rgba(14, 33, 20, 0.7) 0%, rgba(14, 33, 20, 0) 45%);
}
.timeline-feature-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.9rem;
  max-width: 560px;
  min-height: 460px;
  padding: 3rem 3rem 2.75rem;
}
.timeline-feature-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7fe0a5;
}
.timeline-feature-title {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  letter-spacing: -0.03em;
  line-height: 1.08;
  text-wrap: balance;
}
.timeline-feature-numbers {
  display: flex;
  align-items: center;
  gap: 1.1rem;
  margin-top: 0.5rem;
}
.timeline-feature-number {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.timeline-feature-year {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.7);
}
.timeline-feature-value {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  letter-spacing: -0.03em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.timeline-feature-number:last-child .timeline-feature-value {
  color: var(--brand-accent);
}
/* A rail between the two figures, drawn from the small number to the big one */
.timeline-feature-arrow {
  align-self: flex-end;
  width: 72px;
  height: 2px;
  margin-bottom: 0.55rem;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(246, 241, 231, 0.3), var(--brand-accent));
}
.timeline-feature-note {
  max-width: 44ch;
  font-size: 0.92rem;
  line-height: 1.6;
  color: rgba(246, 241, 231, 0.78);
}
.timeline-feature-cta {
  margin-top: auto;
  padding: 0.8rem 1.4rem;
  border-radius: 999px;
  background: var(--brand-accent);
  color: var(--brand-green);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: transform 0.15s, box-shadow 0.15s;
}
.timeline-feature:hover .timeline-feature-cta {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(255, 106, 61, 0.4);
}

/* The three rows: title and lead on the left, cards on the right */
/* Each row has its own colour: the numbers in ember, the lives in blood red, the rules in forest green */
.topic-row {
  --row-colour: var(--brand-accent-text);
  --row-tint: rgba(255, 106, 61, 0.12);
  display: grid;
  grid-template-columns: minmax(0, 220px) minmax(0, 1fr);
  gap: 1.5rem 2.5rem;
  align-items: start;
  padding: 2rem 0;
  border-top: 1px solid rgba(20, 54, 31, 0.12);
}
.topic-row--lives {
  --row-colour: var(--brand-death-text);
  --row-tint: rgba(231, 76, 60, 0.1);
}
.topic-row--rules {
  --row-colour: var(--brand-fall);
  --row-tint: rgba(31, 122, 69, 0.12);
}
.topic-row-head {
  position: sticky;
  top: calc(var(--header-height) + 24px);
}
.topic-row-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: var(--brand-green);
}
.topic-row-lead {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--brand-muted);
}
.topic-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(var(--columns, 4), minmax(0, 1fr));
  gap: 0.9rem;
}
.topic-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.25rem 1.25rem 1.15rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
  color: var(--brand-green);
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.topic-row-title::before {
  content: '';
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--row-colour);
}
.topic-card-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  margin-bottom: 0.9rem;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  background: var(--row-tint);
  color: var(--row-colour);
}
.topic-card:hover,
.topic-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--row-colour);
  box-shadow: 0 16px 40px rgba(20, 54, 31, 0.1);
  color: var(--brand-green);
  text-decoration: none;
}
.topic-card-figure {
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--row-colour);
  font-variant-numeric: tabular-nums;
}
.topic-card-figure-label {
  margin-top: 0.35rem;
  font-size: 0.78rem;
  line-height: 1.45;
  color: var(--brand-faint);
}
.topic-card-label {
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(20, 54, 31, 0.08);
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: -0.02em;
  line-height: 1.25;
}
.topic-card-teaser {
  margin-top: 0.35rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--brand-muted);
}

@media (prefers-reduced-motion: reduce) {
  .timeline-feature,
  .timeline-feature-picture :deep(img),
  .timeline-feature-cta,
  .topic-card {
    transition: none;
  }
  .timeline-feature:hover,
  .timeline-feature:hover .timeline-feature-picture :deep(img),
  .timeline-feature:hover .timeline-feature-cta,
  .topic-card:hover,
  .topic-card:focus-visible {
    transform: none;
  }
}
@media (max-width: 991px) {
  .topic-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .topic-row-head {
    position: static;
  }
  .topic-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .timeline-feature {
    min-height: 0;
    margin-bottom: 2.5rem;
  }
  .timeline-feature-picture,
  .timeline-feature-picture :deep(img) {
    position: relative;
    inset: auto;
    height: auto;
  }
  .timeline-feature-picture :deep(img) {
    aspect-ratio: 4 / 3;
    transform: none;
  }
  .timeline-feature-shade {
    background: linear-gradient(0deg, var(--brand-night) 0%, var(--brand-night) 52%, rgba(14, 33, 20, 0) 75%);
  }
  .timeline-feature-body {
    min-height: 0;
    max-width: none;
    margin-top: -5rem;
    padding: 0 1.5rem 1.75rem;
  }
  .timeline-feature-cta {
    margin-top: 0.5rem;
  }
  .topic-grid {
    grid-template-columns: 1fr;
  }
}
</style>
