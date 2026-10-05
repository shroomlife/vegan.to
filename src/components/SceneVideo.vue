<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * A silent background clip of the Zeitreise. Nothing loads before the clip
 * is near the viewport, it plays only while visible, and with reduced motion
 * the poster stays as a still picture.
 */
const props = defineProps<{
  /** Base name under public/video/zeitreise, served as <name>-1440.mp4, <name>-1080.mp4 and <name>-720.mp4 */
  name: string
  /** Base name of the poster picture under public/img/zeitreise */
  poster: string
  /** What the clip shows, for assistive technology */
  label: string
}>()

const video = useTemplateRef<HTMLVideoElement>('video')
const reducedMotion = usePreferredReducedMotion()
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = video.value
  if (!el || reducedMotion.value === 'reduce') return
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.play().catch(() => undefined)
        } else {
          el.pause()
        }
      }
    },
    { rootMargin: '200px 0px', threshold: 0.1 },
  )
  observer.observe(el)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <video
    ref="video"
    class="scene-video"
    muted
    playsinline
    loop
    preload="none"
    disablepictureinpicture
    :poster="`/img/zeitreise/${props.poster}-1280.webp`"
    :aria-label="label"
  >
    <source :src="`/video/zeitreise/${name}-1440.mp4`" type="video/mp4" media="(min-width: 1800px)">
    <source :src="`/video/zeitreise/${name}-1080.mp4`" type="video/mp4" media="(min-width: 900px)">
    <source :src="`/video/zeitreise/${name}-720.mp4`" type="video/mp4">
  </video>
</template>
