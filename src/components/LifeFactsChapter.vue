<script setup lang="ts">
import { Motion } from 'motion-v'
import { lifeFacts, schweitzerQuote } from '@/data/facts'
import SourceLinks from '@/components/SourceLinks.vue'
</script>

<template>
  <section id="wie-sie-lebten" class="life-facts chapter-section">
    <div class="container">
      <span class="chapter">Kapitel 4 &middot; Wie sie lebten</span>
      <h2 class="chapter-title">Das steht so im Gesetz.</h2>
      <p class="chapter-lead">
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
          <SourceLinks :ids="fact.sources" />
        </Motion>
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
  color: var(--brand-accent);
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
  color: var(--brand-accent);
}

@media (max-width: 991px) {
  .life-facts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .life-facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
