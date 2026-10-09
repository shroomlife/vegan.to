<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useJsonLd } from '@/composables/useJsonLd'
import { topicPaths } from '@/data/topics'
import { SITE_URL } from '@/utils/documentMeta'
import NextStep from '@/components/NextStep.vue'

export interface Crumb {
  label: string
  /** Omitted for the current page */
  to?: string
}

const props = defineProps<{
  kicker: string
  title: string
  lead?: string
  crumbs?: readonly Crumb[]
}>()

const route = useRoute()

// Topic pages end with the hand-off; the legal pages (Impressum, Datenschutz) do not
const isTopicPage = topicPaths.includes(route.path)

// The visible trail and the structured one come from the same list
if (props.crumbs?.length) {
  useJsonLd('page-breadcrumb', {
    '@type': 'BreadcrumbList',
    itemListElement: props.crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.to ?? route.path}`,
    })),
  })
}
</script>

<template>
  <main class="content-page">
    <section class="content-page-hero">
      <div class="content-page-inner">
        <nav v-if="crumbs?.length" class="content-page-crumbs" aria-label="Pfad">
          <template v-for="(crumb, index) in crumbs" :key="crumb.label">
            <RouterLink v-if="crumb.to" :to="crumb.to">{{ crumb.label }}</RouterLink>
            <span v-else aria-current="page">{{ crumb.label }}</span>
            <span v-if="index < crumbs.length - 1" aria-hidden="true">/</span>
          </template>
        </nav>
        <p class="content-page-kicker">{{ kicker }}</p>
        <h1 class="content-page-title">{{ title }}</h1>
        <p v-if="lead" class="content-page-lead">{{ lead }}</p>
        <slot name="hero" />
      </div>
    </section>

    <div class="content-page-body">
      <div class="content-page-inner prose">
        <slot />
        <NextStep v-if="isTopicPage" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.content-page {
  background: var(--brand-cream);
  color: var(--brand-green);
}
.content-page-inner {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
}
.content-page-hero {
  padding: 3rem 0 3rem;
  background: var(--brand-mint);
}
.content-page-crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
  color: var(--brand-faint);
}
/* Inline-block with some padding so each crumb is a tap target of about 32px */
.content-page-crumbs a {
  display: inline-block;
  padding-block: 0.35rem;
  color: inherit;
}
.content-page-kicker {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-accent-text);
}
.content-page-title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.75rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.content-page-lead {
  margin: 0;
  font-size: 1.08rem;
  line-height: 1.65;
  color: var(--brand-muted);
}
.content-page-body {
  padding: 3rem 0 4.5rem;
}
@media (max-width: 767px) {
  .content-page-hero {
    padding: 2rem 0 2.25rem;
  }
  .content-page-body {
    padding: 2rem 0 3rem;
  }
}
</style>
