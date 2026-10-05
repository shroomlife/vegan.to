<script setup lang="ts">
import { useJsonLd } from '@/composables/useJsonLd'

export interface QuickAnswer {
  question: string
  /** Plain text: it is shown and also goes into the FAQPage markup */
  answer: string
}

const props = defineProps<{
  items: readonly QuickAnswer[]
}>()

// Same words on the page and in the structured data, as Google requires
useJsonLd('page-faq', {
  '@type': 'FAQPage',
  mainEntity: props.items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
})
</script>

<template>
  <section class="quick-answers" aria-labelledby="quick-answers-title">
    <h2 id="quick-answers-title">Kurz beantwortet</h2>
    <div v-for="item in items" :key="item.question" class="quick-answers-item">
      <h3>{{ item.question }}</h3>
      <p>{{ item.answer }}</p>
    </div>
  </section>
</template>

<style scoped>
.quick-answers-item {
  padding: 1.1rem 1.25rem 0.2rem;
  margin-bottom: 0.75rem;
  border-radius: 18px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.quick-answers-item h3 {
  margin: 0 0 0.45rem;
}
</style>
