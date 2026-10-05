<script setup lang="ts">
import { lifeFacts, schweitzerQuote } from '@/data/facts'
import SourceLinks from '@/components/SourceLinks.vue'
import SceneImage from '@/components/SceneImage.vue'
</script>

<template>
  <section id="wie-sie-lebten" class="life-facts chapter-section">
    <div class="container">
      <span class="chapter">Wie sie lebten</span>
      <h2 class="chapter-title">Das steht so im Gesetz.</h2>
      <p class="chapter-lead">
        Nichts davon ist ein Skandalfall. Es ist der erlaubte Normalfall,
        nachzulesen in Verordnungen, Fachpresse und Behördenseiten.
      </p>
      <figure v-reveal="{ y: 24, duration: 0.6, amount: 0.3 }" class="life-facts-band">
        <SceneImage name="hen-cage" alt="Hennen hinter dem Drahtgitter eines Käfigs" sizes="(min-width: 1320px) 1200px, 100vw" />
        <figcaption>Legehennen im Käfig. In Deutschland bis Ende 2025 erlaubt, in Härtefällen bis 2028.</figcaption>
      </figure>
      <div class="life-facts-grid">
        <div
          v-for="(fact, index) in lifeFacts"
          :key="fact.figure"
          v-reveal="{ y: 24, duration: 0.45, delay: (index % 3) * 0.08, amount: 0.3 }"
          class="life-fact"
        >
          <span class="life-fact-figure">{{ fact.figure }}</span>
          <span class="life-fact-unit">{{ fact.unit }}</span>
          <p class="life-fact-text">{{ fact.text }}</p>
          <SourceLinks :ids="fact.sources" />
        </div>
      </div>

      <blockquote class="life-quote">
        <p class="life-quote-text">„{{ schweitzerQuote.text }}“</p>
        <footer class="life-quote-author">{{ schweitzerQuote.author }}</footer>
        <SourceLinks :ids="schweitzerQuote.sources" />
      </blockquote>
    </div>
  </section>
</template>

<style scoped>
.life-facts {
  position: relative;
  z-index: 2;
  background: var(--brand-cream);
  color: var(--brand-green);
}
.life-facts-band {
  position: relative;
  margin: 0 0 1.5rem;
  border-radius: 24px;
  overflow: hidden;
  background: var(--brand-night);
}
.life-facts-band :deep(img) {
  width: 100%;
  aspect-ratio: 21 / 9;
  object-fit: cover;
  display: block;
}
.life-facts-band figcaption {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 2.5rem 1.25rem 1rem;
  background: linear-gradient(0deg, rgba(14, 33, 20, 0.85), rgba(14, 33, 20, 0));
  font-size: 0.9rem;
  line-height: 1.45;
  color: var(--brand-cream);
}
.life-facts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}
.life-fact {
  display: flex;
  flex-direction: column;
  padding: 1.35rem 1.35rem 1.1rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.life-fact-figure {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--brand-accent-text);
  font-variant-numeric: tabular-nums;
}
.life-fact-unit {
  margin-top: 0.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
.life-fact-text {
  flex: 1;
  margin: 0.8rem 0 0.7rem;
  font-size: 0.96rem;
  line-height: 1.6;
  color: var(--brand-ink);
}
.life-quote {
  max-width: 720px;
  margin: 3rem auto 0;
  padding: 0 1rem;
  text-align: center;
  border: none;
}
.life-quote-text {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.015em;
  color: var(--brand-green);
}
.life-quote-author {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-accent-text);
}

@media (max-width: 991px) {
  .life-facts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .life-facts-band :deep(img) {
    aspect-ratio: 4 / 3;
  }
  .life-facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
