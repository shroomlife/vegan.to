<script setup lang="ts">
import { Motion } from 'motion-v'
import { lifeFacts, schweitzerQuote } from '@/data/facts'
import SourceLinks from '@/components/SourceLinks.vue'
</script>

<template>
  <section id="wie-sie-lebten" class="life-facts">
    <div class="container">
      <span class="chapter chapter--on-dark">Kapitel 4 &middot; Wie sie lebten</span>
      <h2 class="life-facts-title">Das steht so im Gesetz.</h2>
      <p class="life-facts-lead">
        Nichts davon ist ein Skandalfall. Es ist der erlaubte Normalfall,
        nachzulesen in Verordnungen, Fachpresse und Behördenseiten.
      </p>
      <div class="life-facts-grid">
        <Motion
          v-for="(fact, index) in lifeFacts"
          :key="fact.figure"
          as="article"
          class="life-fact"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, delay: (index % 3) * 0.08 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
        >
          <span class="life-fact-figure">{{ fact.figure }}</span>
          <span class="life-fact-unit">{{ fact.unit }}</span>
          <p class="life-fact-text">{{ fact.text }}</p>
          <SourceLinks :ids="fact.sources" class="life-fact-sources" />
        </Motion>
      </div>

      <blockquote class="life-quote">
        <p class="life-quote-text">„{{ schweitzerQuote.text }}“</p>
        <footer class="life-quote-author">{{ schweitzerQuote.author }}</footer>
        <SourceLinks :ids="schweitzerQuote.sources" class="life-quote-sources" />
      </blockquote>
    </div>
  </section>
</template>

<style scoped>
.life-facts {
  position: relative;
  z-index: 2;
  padding: 3.5rem 0 3rem;
  background: var(--brand-night);
  color: var(--brand-cream);
}
.life-facts-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
  color: var(--brand-cream);
}
.life-facts-lead {
  max-width: 640px;
  margin: 0 0 1.75rem;
  font-size: 1rem;
  line-height: 1.65;
  color: rgba(246, 241, 231, 0.7);
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
  border: 1px solid rgba(246, 241, 231, 0.12);
  background: rgba(246, 241, 231, 0.045);
}
.life-fact-figure {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.6vw, 2.1rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--brand-accent);
  font-variant-numeric: tabular-nums;
}
.life-fact-unit {
  margin-top: 0.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.6);
}
.life-fact-text {
  flex: 1;
  margin: 0.8rem 0 0.7rem;
  font-size: 0.96rem;
  line-height: 1.6;
  color: rgba(246, 241, 231, 0.88);
}
.life-fact-sources,
.life-quote-sources {
  color: rgba(246, 241, 231, 0.5);
}
.life-fact-sources :deep(a:hover),
.life-fact-sources :deep(a:focus-visible),
.life-quote-sources :deep(a:hover),
.life-quote-sources :deep(a:focus-visible) {
  color: var(--brand-cream);
}
.life-quote {
  max-width: 720px;
  margin: 2.5rem auto 0;
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
  color: var(--brand-cream);
}
.life-quote-author {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #7fe0a5;
}

@media (max-width: 991px) {
  .life-facts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .life-facts {
    padding: 2.5rem 0 2rem;
  }
  .life-facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
