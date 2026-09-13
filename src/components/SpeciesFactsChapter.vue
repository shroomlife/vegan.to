<script setup lang="ts">
import { Motion } from 'motion-v'
import { speciesFacts } from '@/data/facts'
import SourceLinks from '@/components/SourceLinks.vue'
</script>

<template>
  <section id="wer-sie-sind" class="species-facts">
    <div class="container">
      <span class="chapter">Kapitel 3 &middot; Wer sie sind</span>
      <h2 class="species-facts-title">Keine Nummern. Jemand.</h2>
      <p class="species-facts-lead">
        Was die Forschung über diese Tiere weiß, passt nicht zu dem, wie wir sie behandeln.
        Jeder Satz hier hat eine Quelle, du kannst sie nachlesen.
      </p>
      <div class="species-facts-grid">
        <Motion
          v-for="(fact, index) in speciesFacts"
          :key="fact.species"
          as="article"
          class="species-fact"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, delay: (index % 3) * 0.08 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
        >
          <div class="species-fact-head">
            <span class="species-fact-emoji" aria-hidden="true">{{ fact.emoji }}</span>
            <h3 class="species-fact-name">{{ fact.species }}</h3>
          </div>
          <p class="species-fact-text">{{ fact.text }}</p>
          <SourceLinks :ids="fact.sources" />
        </Motion>
      </div>
    </div>
  </section>
</template>

<style scoped>
.species-facts {
  position: relative;
  z-index: 2;
  padding: 3.5rem 0 3rem;
  background: var(--brand-cream);
}
.species-facts-title {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.03em;
  color: var(--brand-green);
}
.species-facts-lead {
  max-width: 640px;
  margin: 0 0 1.75rem;
  font-size: 1rem;
  line-height: 1.65;
  color: #4a5a4f;
}
.species-facts-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}
.species-fact {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.25rem 1.35rem 1.1rem;
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  border-radius: 20px;
}
.species-fact-head {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.species-fact-emoji {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(20, 54, 31, 0.06);
  font-size: 22px;
  line-height: 1;
}
.species-fact-name {
  margin: 0;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: var(--brand-green);
}
.species-fact-text {
  margin: 0;
  flex: 1;
  font-size: 0.98rem;
  line-height: 1.6;
  color: #2f3b33;
}

@media (max-width: 991px) {
  .species-facts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .species-facts {
    padding: 2.5rem 0 2rem;
  }
  .species-facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
