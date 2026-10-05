<script setup lang="ts">
import type { SourceId } from '@/data/sources'
import SourceLinks from '@/components/SourceLinks.vue'
import SceneImage from '@/components/SceneImage.vue'

export interface BrightSpot {
  title: string
  text: string
  sources: readonly SourceId[]
  /** The span or the date the figure covers, e.g. "2011 bis 2025" or "seit 2022" */
  label?: string
  /** A licensed photo under public/img/zeitreise, see SceneImage */
  picture?: { name: string; alt: string }
}

defineProps<{
  items: readonly BrightSpot[]
}>()
</script>

<template>
  <section class="bright-spots" aria-labelledby="bright-spots-title">
    <p class="bright-spots-kicker">Was besser wird</p>
    <h2 id="bright-spots-title">Lichtblicke</h2>
    <div class="bright-spots-list">
      <article v-for="item in items" :key="item.title" class="bright-spots-item" :class="{ 'bright-spots-item--pictured': item.picture }">
        <figure v-if="item.picture" class="bright-spots-picture">
          <SceneImage :name="item.picture.name" :alt="item.picture.alt" sizes="(max-width: 767px) 100vw, 360px" />
        </figure>
        <div class="bright-spots-body">
          <span v-if="item.label" class="bright-spots-label">{{ item.label }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <SourceLinks :ids="item.sources" />
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.bright-spots {
  margin: 3rem 0;
  padding: 1.75rem 1.5rem 1.5rem;
  border-radius: 24px;
  background: var(--brand-mint);
  border: 1.5px solid rgba(31, 122, 69, 0.18);
}
.bright-spots-kicker {
  margin: 0 0 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-fall);
}
.bright-spots h2 {
  margin-top: 0;
}
.bright-spots-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 0.9rem;
}
.bright-spots-item {
  border-radius: 18px;
  background: #fff;
  border-left: 4px solid var(--brand-fall);
  overflow: hidden;
}
.bright-spots-body {
  padding: 1.1rem 1.2rem 1rem;
}
/* With a photo the card becomes a small story: picture on top, the figure's span as a chip */
.bright-spots-item--pictured {
  border-left: none;
  border: 1.5px solid rgba(31, 122, 69, 0.14);
}
.bright-spots-picture {
  margin: 0;
  aspect-ratio: 16 / 10;
  background: var(--brand-mint);
}
.bright-spots-picture :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.bright-spots-label {
  display: inline-block;
  margin-bottom: 0.5rem;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(31, 122, 69, 0.1);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-fall);
}
.bright-spots-item h3 {
  margin: 0 0 0.4rem;
  color: var(--brand-fall);
}
.bright-spots-item p {
  margin: 0 0 0.6rem;
  font-size: 0.95rem;
  line-height: 1.6;
}
@media (max-width: 767px) {
  .bright-spots {
    padding: 1.35rem 1.1rem 1.1rem;
    border-radius: 20px;
  }
}
</style>
