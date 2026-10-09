<script setup lang="ts">
/**
 * One AI-generated species portrait in three widths and three formats, with
 * the visible "KI-generiert" note the EU AI Act asks for. The files come from
 * scripts/species-portraits.py: /img/tiere/<slug>-{512,768,1024}.{avif,webp,jpg}.
 */
import { PORTRAIT_NOTE, PORTRAIT_NOTE_LONG, PORTRAIT_WIDTHS, portraitAlt } from '@/data/portraits'

const props = withDefaults(
  defineProps<{
    /** Species page slug, e.g. "huehner" */
    slug: string
    /** The slot the picture fills, as a CSS sizes expression */
    sizes?: string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
  }>(),
  { sizes: '(max-width: 767px) 100vw, 400px', loading: 'lazy', fetchpriority: 'auto' },
)

const srcset = (format: 'avif' | 'webp' | 'jpg') =>
  PORTRAIT_WIDTHS.map((width) => `/img/tiere/${props.slug}-${width}.${format} ${width}w`).join(', ')
</script>

<template>
  <figure class="portrait">
    <picture>
      <source type="image/avif" :srcset="srcset('avif')" :sizes="sizes">
      <source type="image/webp" :srcset="srcset('webp')" :sizes="sizes">
      <img
        :src="`/img/tiere/${slug}-768.jpg`"
        :srcset="srcset('jpg')"
        :sizes="sizes"
        :alt="portraitAlt(slug)"
        :loading="loading"
        :fetchpriority="fetchpriority"
        decoding="async"
        width="1024"
        height="1024"
      >
    </picture>
    <figcaption class="portrait-note" :title="PORTRAIT_NOTE_LONG">{{ PORTRAIT_NOTE }}</figcaption>
  </figure>
</template>

<style scoped>
.portrait {
  position: relative;
  margin: 0;
  border-radius: 20px;
  overflow: hidden;
  background: var(--brand-night);
  aspect-ratio: 1;
}
.portrait img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* The note stays small and quiet, but it is always there and always readable. Top corner, like the note on the clips: the floating controls of a phone sit at the bottom. */
.portrait-note {
  position: absolute;
  right: 10px;
  top: 10px;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(14, 33, 20, 0.72);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.85);
  cursor: help;
}
/* On phones a full square fills more than a screen; a landscape cut keeps the head, which sits high in every portrait */
@media (max-width: 767px) {
  .portrait {
    aspect-ratio: 4 / 3;
  }
  .portrait img {
    object-position: 50% 10%;
  }
}
</style>
