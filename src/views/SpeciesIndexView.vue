<script setup lang="ts">
import { computed } from 'vue'
import { useLiveState } from '@/composables/useLiveState'
import { slugBySpecies } from '@/data/species'
import { formatNumber } from '@/utils/formatNumber'
import AnimatedNumber from '@/components/AnimatedNumber.vue'

const { animalData, totalDeathCount } = useLiveState()

const rows = computed(() =>
  animalData.value.map((animal) => ({
    ...animal,
    slug: slugBySpecies(animal.names.single),
  })),
)
</script>

<template>
  <main class="species-index">
    <section class="species-index-hero">
      <div class="species-index-inner">
        <span class="chapter">Tierarten &middot; Deutschland</span>
        <h1 class="species-index-title">Zehn Arten. Eine Zahl, die nicht stehen bleibt.</h1>
        <p class="chapter-lead">
          Für jede Tierart eine eigene Seite: wie viele pro Jahr, pro Tag und in dieser Sekunde sterben,
          wie alt sie werden dürfen, wie alt sie werden könnten, und woher jede Zahl stammt.
          Seit du hier bist: <strong class="species-index-live"><AnimatedNumber :value="totalDeathCount" /></strong> Tiere.
        </p>
      </div>
    </section>

    <div class="species-index-list">
      <div class="species-index-inner">
        <div class="species-index-grid">
          <RouterLink
            v-for="animal in rows"
            :key="animal.names.single"
            :to="`/tiere/${animal.slug}`"
            class="species-index-card"
            :class="{ 'species-index-card--estimate': animal.estimate }"
          >
            <span class="species-index-card-emoji" aria-hidden="true">{{ animal.names.emoji }}</span>
            <span class="species-index-card-name">{{ animal.names.plural }}</span>
            <span class="species-index-card-value">
              <template v-if="animal.estimate">≈ </template>{{ formatNumber(animal.perDay) }}
              <small>pro Tag</small>
            </span>
            <span class="species-index-card-today">
              <template v-if="animal.estimate">≈ </template><AnimatedNumber :value="animal.currentDay" /> heute
            </span>
            <span v-if="animal.estimate" class="species-index-card-badge">Schätzung</span>
          </RouterLink>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.species-index {
  background: var(--brand-cream);
  color: var(--brand-green);
}
.species-index-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 24px;
}
.species-index-hero {
  padding: 3.5rem 0 2.5rem;
}
.species-index-title {
  margin: 0 0 0.8rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.8rem, 4.6vw, 3rem);
  letter-spacing: -0.035em;
  line-height: 1.05;
}
.species-index-live {
  color: #e74c3c;
  font-variant-numeric: tabular-nums;
}
.species-index-list {
  padding: 0 0 5rem;
}
.species-index-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}
.species-index-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 1.35rem 1.35rem 1.2rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
  color: var(--brand-green);
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.species-index-card:hover,
.species-index-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--brand-accent);
  box-shadow: 0 16px 40px rgba(20, 54, 31, 0.1);
  color: var(--brand-green);
  text-decoration: none;
}
.species-index-card--estimate {
  grid-column: 1 / -1;
  border-style: dashed;
  border-color: rgba(133, 100, 4, 0.35);
}
.species-index-card-emoji {
  font-size: 1.6rem;
  line-height: 1;
  margin-bottom: 0.5rem;
}
.species-index-card-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  letter-spacing: -0.02em;
}
.species-index-card-value {
  margin-top: 0.4rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.03em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.species-index-card-value small {
  font-family: 'Lato', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--brand-faint);
  margin-left: 0.2rem;
}
.species-index-card-today {
  font-size: 0.85rem;
  color: #e74c3c;
  font-variant-numeric: tabular-nums;
}
.species-index-card-badge {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  padding: 0.15rem 0.55rem;
  border-radius: 999px;
  background: #fff3cd;
  color: #856404;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (max-width: 991px) {
  .species-index-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .species-index-hero {
    padding: 2.25rem 0 1.75rem;
  }
  .species-index-list {
    padding-bottom: 3rem;
  }
  .species-index-grid {
    grid-template-columns: 1fr;
  }
}
</style>
