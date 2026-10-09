<script setup lang="ts">
import { speciesFacts } from '@/data/facts'
import { animals } from '@/data/animals'
import { slugBySpecies } from '@/data/species'
import SourceLinks from '@/components/SourceLinks.vue'
import SpeciesPortrait from '@/components/SpeciesPortrait.vue'
import ClipVideo from '@/components/ClipVideo.vue'

/** The species page slug behind a fact, found by the plural name the fact carries */
function speciesSlug(plural: string): string | undefined {
  const animal = animals.find((entry) => entry.names.plural === plural)
  return animal ? slugBySpecies(animal.names.single) : undefined
}

function speciesPath(plural: string): string | undefined {
  const slug = speciesSlug(plural)
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
        <!-- The eye: the clip opens like a lid while it scrolls into view, then blinks now and then -->
        <figure class="species-facts-eye">
          <div class="species-facts-lid">
            <ClipVideo folder="start" name="calf-eyes" :widths="[1920, 1280]" label="Ein braunes Kalb, ganz nah, es sieht in die Kamera und blinzelt" class="species-facts-clip" />
          </div>
          <figcaption>Ein Kalb sieht dich an. Es blinzelt. Du auch.</figcaption>
        </figure>
      </div>
      <div class="species-facts-grid">
        <article
          v-for="fact in speciesFacts"
          :key="fact.species"
          v-reveal="{ y: 24, duration: 0.45 }"
          class="species-fact"
        >
          <SpeciesPortrait v-if="speciesSlug(fact.species)" :slug="speciesSlug(fact.species) ?? ''" sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 400px" class="species-fact-portrait" />
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
  grid-template-columns: minmax(0, 1fr) minmax(0, 520px);
  gap: 3rem;
  align-items: center;
  margin-bottom: 2.5rem;
}
.species-facts-head .chapter-lead {
  margin-bottom: 0;
}
.species-facts-eye {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
/* The lid: an ellipse that is almost shut when the chapter enters and open when it has arrived */
.species-facts-lid {
  aspect-ratio: 4 / 3;
  clip-path: ellipse(56% 50% at 54% 50%);
  background: var(--brand-night);
}
.species-facts-clip {
  height: 100%;
  animation: eye-blink 7s ease-in-out infinite;
  clip-path: ellipse(60% 54% at 54% 50%);
}
.species-facts-clip :deep(video),
.species-facts-clip :deep(img) {
  transform: scale(1.12);
  transform-origin: 50% 50%;
}
@keyframes eye-blink {
  0%, 92%, 100% { clip-path: ellipse(60% 54% at 54% 50%); }
  95% { clip-path: ellipse(60% 3% at 54% 50%); }
}
@supports (animation-timeline: view()) {
  .species-facts-lid {
    animation: eye-open linear both;
    animation-timeline: view();
    animation-range: entry 0% entry 90%;
  }
  @keyframes eye-open {
    from { clip-path: ellipse(56% 6% at 54% 50%); }
    to { clip-path: ellipse(56% 50% at 54% 50%); }
  }
}
.species-facts-eye figcaption {
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--brand-muted);
}
@media (prefers-reduced-motion: reduce) {
  .species-facts-lid,
  .species-facts-clip {
    animation: none;
  }
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
/* The portrait bleeds to the card's edges, the text keeps its padding */
.species-fact-portrait {
  margin: -1.25rem -1.35rem 0.4rem;
  border-radius: 18px 18px 0 0;
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
  position: relative;
  align-self: flex-start;
  margin-top: 0.2rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--brand-green);
  text-decoration: none;
  border-bottom: 1.5px solid rgba(20, 54, 31, 0.25);
  transition: border-color 0.15s, color 0.15s;
}
/* A thumb-sized hit area around the short link, without moving its underline */
.species-fact-link::after {
  content: '';
  position: absolute;
  inset: -12px -8px;
}
.species-fact-link:focus-visible {
  color: var(--brand-accent-text);
  border-color: var(--brand-accent);
  text-decoration: none;
}
@media (hover: hover) {
  .species-fact-link:hover {
    color: var(--brand-accent-text);
    border-color: var(--brand-accent);
    text-decoration: none;
  }
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
