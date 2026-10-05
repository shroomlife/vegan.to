<script setup lang="ts">
/**
 * One licensed photo of the Zeitreise in three widths and three formats.
 * scripts/zeitreise-images.py writes <name>-{640,1280,1920,2560}.{avif,webp,jpg}
 * into public/img/zeitreise; the browser picks the smallest fit.
 */
const props = withDefaults(
  defineProps<{
    name: string
    alt: string
    /** The slot the picture fills, as a CSS sizes expression */
    sizes?: string
    loading?: 'lazy' | 'eager'
    fetchpriority?: 'high' | 'low' | 'auto'
  }>(),
  { sizes: '100vw', loading: 'lazy', fetchpriority: 'auto' },
)

const WIDTHS = [640, 1280, 1920, 2560] as const
const srcset = (format: 'avif' | 'webp' | 'jpg') => WIDTHS.map((width) => `/img/zeitreise/${props.name}-${width}.${format} ${width}w`).join(', ')
</script>

<template>
  <picture>
    <source type="image/avif" :srcset="srcset('avif')" :sizes="sizes">
    <source type="image/webp" :srcset="srcset('webp')" :sizes="sizes">
    <img :src="`/img/zeitreise/${name}-1280.jpg`" :srcset="srcset('jpg')" :sizes="sizes" :alt="alt" :loading="loading" :fetchpriority="fetchpriority" decoding="async">
  </picture>
</template>
