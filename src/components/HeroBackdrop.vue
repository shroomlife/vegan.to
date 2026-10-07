<script setup lang="ts">
import { onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import { useMediaQuery, usePreferredReducedMotion } from '@vueuse/core'

/**
 * The living ground of the hero: a real clip of fireflies in a tree at night,
 * tinted into the brand green, under the sky of lights that HeroSky draws.
 *
 * The poster is the first paint and the largest contentful paint, so it loads
 * eagerly. The clip itself is a treat for wide screens: it is attached only on
 * desktop, never with reduced motion, and not before the browser is idle after
 * the load, so the lights and the counter never wait for it. It plays only
 * while the hero is on screen.
 */
const props = defineProps<{
  /** False while the hero is scrolled away; the clip then pauses */
  active: boolean
}>()

const video = useTemplateRef<HTMLVideoElement>('video')
const reducedMotion = usePreferredReducedMotion()
const wide = useMediaQuery('(min-width: 768px)')
/** Set once the page has settled; before that the <video> is not even in the DOM */
const ready = ref(false)
let idle: number | ReturnType<typeof setTimeout> | undefined

function play() {
  const el = video.value
  if (!el) return
  if (props.active && !document.hidden) el.play().catch(() => undefined)
  else el.pause()
}

onMounted(() => {
  const settle = () => {
    ready.value = true
  }
  if ('requestIdleCallback' in window) idle = window.requestIdleCallback(settle, { timeout: 4000 })
  else idle = setTimeout(settle, 2500)
  document.addEventListener('visibilitychange', play)
})
onUnmounted(() => {
  if (typeof idle === 'number' && 'cancelIdleCallback' in window) window.cancelIdleCallback(idle)
  else if (idle !== undefined) clearTimeout(idle as ReturnType<typeof setTimeout>)
  document.removeEventListener('visibilitychange', play)
})
watch([() => props.active, video], play, { flush: 'post' })
</script>

<template>
  <div class="backdrop" aria-hidden="true">
    <picture class="backdrop-poster">
      <source type="image/avif" srcset="/img/start/fireflies-video-640.avif 640w, /img/start/fireflies-video-1280.avif 1280w, /img/start/fireflies-video-1920.avif 1920w" sizes="100vw">
      <source type="image/webp" srcset="/img/start/fireflies-video-640.webp 640w, /img/start/fireflies-video-1280.webp 1280w, /img/start/fireflies-video-1920.webp 1920w" sizes="100vw">
      <img src="/img/start/fireflies-video-1280.jpg" srcset="/img/start/fireflies-video-640.jpg 640w, /img/start/fireflies-video-1280.jpg 1280w, /img/start/fireflies-video-1920.jpg 1920w" sizes="100vw" alt="Glühwürmchen in einem Baum bei Nacht, der Hintergrund des Himmels aus Lichtern" loading="eager" fetchpriority="high" decoding="async" width="1920" height="1013">
    </picture>
    <video
      v-if="ready && wide && reducedMotion !== 'reduce'"
      ref="video"
      class="backdrop-clip"
      muted
      playsinline
      loop
      preload="auto"
      disablepictureinpicture
      poster="/img/start/fireflies-video-1280.webp"
    >
      <source src="/video/start/fireflies-1920.av1.mp4" type="video/mp4; codecs=av01.0.08M.10" media="(min-width: 1500px)">
      <source src="/video/start/fireflies-1280.av1.mp4" type="video/mp4; codecs=av01.0.08M.10">
      <source src="/video/start/fireflies-1920.h264.mp4" type="video/mp4" media="(min-width: 1500px)">
      <source src="/video/start/fireflies-1280.h264.mp4" type="video/mp4">
    </video>
    <div class="backdrop-tint"></div>
    <div class="backdrop-spot"></div>
    <div class="backdrop-grain"></div>
  </div>
</template>

<style scoped>
.backdrop {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
/* Poster and clip share one slow drift, so the clip takes over without a jump */
.backdrop-poster,
.backdrop-clip {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.58;
  filter: saturate(0.55);
  mix-blend-mode: screen;
  transform-origin: 50% 60%;
  animation: backdrop-drift 42s ease-in-out infinite alternate;
}
.backdrop-poster img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
@keyframes backdrop-drift {
  from { transform: scale(1.08) translate3d(0, 0, 0); }
  to { transform: scale(1.16) translate3d(-18px, -12px, 0); }
}
.backdrop-tint {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(14, 33, 20, 0.35) 0%, rgba(14, 33, 20, 0.72) 55%, var(--brand-night) 100%);
}
/* The torch: a soft warm cone that follows the pointer (HomeView sets --spot-x and --spot-y) */
.backdrop-spot {
  position: absolute;
  inset: 0;
  background: radial-gradient(640px 640px at var(--spot-x, 68%) var(--spot-y, 38%), rgba(255, 179, 122, 0.16), rgba(255, 179, 122, 0) 60%);
  transition: background-position 0.4s ease;
}
/* Film grain from one static tile, no live filter */
.backdrop-grain {
  position: absolute;
  inset: 0;
  background: url('/img/start/grain.png') repeat;
  background-size: 256px 256px;
  opacity: 0.07;
  mix-blend-mode: overlay;
}
@media (prefers-reduced-motion: reduce) {
  .backdrop-poster,
  .backdrop-clip {
    animation: none;
  }
}
</style>
