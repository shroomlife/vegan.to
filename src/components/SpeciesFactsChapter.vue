<script setup lang="ts">
import { speciesFacts } from '@/data/facts'
import { animals } from '@/data/animals'
import { slugBySpecies } from '@/data/species'
import SourceLinks from '@/components/SourceLinks.vue'
import SceneImage from '@/components/SceneImage.vue'

/** The species page behind a fact, found by the plural name the fact carries */
function speciesPath(plural: string): string | undefined {
  const animal = animals.find((entry) => entry.names.plural === plural)
  const slug = animal ? slugBySpecies(animal.names.single) : undefined
  return slug ? `/tiere/${slug}` : undefined
}
</script>

<template>
  <section id="wer-sie-sind" class="species-facts chapter-section">
    <div class="container">
      <div class="species-facts-head">
        <div>
          <span class="chapter">Wer sie sind</span>
          <h2 class="chapter-title">Keine Nummern. Jemand.</h2>
          <p class="chapter-lead">
            Was die Forschung über diese Tiere weiß, passt nicht zu dem, wie wir sie behandeln.
            Jeder Satz hier hat eine Quelle, du kannst sie nachlesen.
          </p>
        </div>
        <figure v-reveal="{ x: 24, duration: 0.6, amount: 0.3 }" class="species-facts-portrait">
          <SceneImage name="pig-eye" alt="Das Auge eines Schweins hinter einem Gatter" sizes="(max-width: 991px) 100vw, 480px" />
          <figcaption>Ein Schwein sieht dich an. Es erkennt Gesichter, auch deins.</figcaption>
        </figure>
      </div>
      <div class="species-facts-grid">
        <article
          v-for="(fact, index) in speciesFacts"
          :key="fact.species"
          v-reveal="{ y: 24, duration: 0.45, delay: (index % 3) * 0.08, amount: 0.3 }"
          class="species-fact"
        >
          <div class="species-fact-head">
            <span class="species-fact-emoji" aria-hidden="true">{{ fact.emoji }}</span>
            <h3 class="species-fact-name">{{ fact.species }}</h3>
          </div>
          <p class="species-fact-text">{{ fact.text }}<SourceLinks :ids="fact.sources" /></p>
          <RouterLink v-if="speciesPath(fact.species)" :to="speciesPath(fact.species) ?? '/tiere'" class="species-fact-link">
            Mehr über {{ fact.species }} <span aria-hidden="true">&rarr;</span>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.species-facts {
  position: relative;
  z-index: 2;
  background: var(--brand-mint);
}
.species-facts-head {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 480px);
  gap: 2.5rem;
  align-items: end;
  margin-bottom: 2rem;
}
.species-facts-head .chapter-lead {
  margin-bottom: 0;
}
.species-facts-portrait {
  margin: 0;
  border-radius: 24px;
  overflow: hidden;
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
}
.species-facts-portrait :deep(img) {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: 50% 40%;
  display: block;
}
.species-facts-portrait figcaption {
  padding: 0.75rem 1rem 0.85rem;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--brand-muted);
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
  color: var(--brand-ink);
}
.species-fact-link {
  align-self: flex-start;
  margin-top: 0.2rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--brand-green);
  text-decoration: none;
  border-bottom: 1.5px solid rgba(20, 54, 31, 0.25);
  transition: border-color 0.15s, color 0.15s;
}
.species-fact-link:hover,
.species-fact-link:focus-visible {
  color: var(--brand-accent-text);
  border-color: var(--brand-accent);
  text-decoration: none;
}

@media (max-width: 991px) {
  .species-facts-head {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .species-facts-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .species-facts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
