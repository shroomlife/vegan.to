<script setup lang="ts">
import { computed } from 'vue'
import { topicPages, type TopicName } from '@/data/topics'

const props = defineProps<{
  /** The page this list sits on, left out of the list */
  current?: TopicName
}>()

const others = computed(() => topicPages.filter((topic) => topic.name !== props.current))
</script>

<template>
  <nav class="related-topics" aria-labelledby="related-topics-title">
    <h2 id="related-topics-title">Weiterlesen</h2>
    <ul class="related-topics-list">
      <li v-for="topic in others" :key="topic.path">
        <RouterLink :to="topic.path" class="related-topics-card">
          <span class="related-topics-label">{{ topic.label }}</span>
          <span class="related-topics-teaser">{{ topic.teaser }}</span>
        </RouterLink>
      </li>
      <li>
        <RouterLink to="/tiere" class="related-topics-card">
          <span class="related-topics-label">Alle Tierarten</span>
          <span class="related-topics-teaser">Live-Zähler und Lebensdaten für jede Art einzeln</span>
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.related-topics {
  margin-top: 3.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(20, 54, 31, 0.12);
}
.related-topics-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}
.related-topics-list li + li {
  margin-top: 0;
}
.related-topics-card {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  height: 100%;
  padding: 1rem 1.15rem;
  border-radius: 16px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
  text-decoration: none;
  transition: border-color 0.15s, transform 0.15s;
}
.related-topics-card:hover,
.related-topics-card:focus-visible {
  border-color: var(--brand-accent);
  transform: translateY(-2px);
  text-decoration: none;
}
.related-topics-label {
  font-weight: 700;
  color: var(--brand-green);
}
.related-topics-teaser {
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--brand-muted);
}
/* On a phone eleven cards would fill several screens: one card, one row per
   page, the teaser cut to a single line */
@media (max-width: 767px) {
  .related-topics-list {
    display: block;
    border-radius: 16px;
    border: 1.5px solid rgba(20, 54, 31, 0.08);
    background: #fff;
    overflow: hidden;
  }
  .related-topics-list li + li {
    border-top: 1px solid rgba(20, 54, 31, 0.08);
  }
  .related-topics-card {
    gap: 0.1rem;
    padding: 0.8rem 1rem;
    border: none;
    border-radius: 0;
  }
  .related-topics-card:hover,
  .related-topics-card:focus-visible {
    background: var(--brand-mint);
    transform: none;
  }
  .related-topics-card:focus-visible {
    outline-offset: -3px;
  }
  .related-topics-teaser {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    overflow: hidden;
  }
}
@media (prefers-reduced-motion: reduce) {
  .related-topics-card {
    transition: none;
  }
  .related-topics-card:hover,
  .related-topics-card:focus-visible {
    transform: none;
  }
}
</style>
