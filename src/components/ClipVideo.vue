<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * A silent clip of the start page, AV1 first and H.264 as the fallback.
 * scripts/clip-video.sh writes /video/<folder>/<name>-<width>.av1.mp4 and
 * .h264.mp4 plus the poster <name>-video under /img/<folder>.
 *
 * Nothing loads before the clip is near the viewport, it plays only while
 * visible, and with reduced motion the poster stays as a still picture.
 */
const props = withDefaults(
  defineProps<{
    /** Folder under public/video and public/img, e.g. "start" */
    folder: string
    /** Base name of the clip, e.g. "mahlzeit" */
    name: string
    /** The widths that exist, largest first */
    widths: readonly number[]
    /** What the clip shows, for assistive technology */
    label: string
    /** Shown as a small note on the clip when it is AI-generated */
    note?: string
  }>(),
  { note: undefined },
)

const video = useTemplateRef<HTMLVideoElement>('video')
const reducedMotion = usePreferredReducedMotion()
let observer: IntersectionObserver | null = null

const large = () => props.widths[0] ?? 0
const small = () => props.widths[props.widths.length - 1] ?? large()

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
  <div class="clip">
    <video
      ref="video"
      class="clip-video"
      muted
      playsinline
      loop
      preload="none"
      disablepictureinpicture
      :poster="`/img/${folder}/${name}-video-1280.webp`"
      :aria-label="label"
    >
      <source :src="`/video/${folder}/${name}-${large()}.av1.mp4`" type="video/mp4; codecs=av01.0.08M.10" media="(min-width: 700px)">
      <source :src="`/video/${folder}/${name}-${small()}.av1.mp4`" type="video/mp4; codecs=av01.0.08M.10">
      <source :src="`/video/${folder}/${name}-${large()}.h264.mp4`" type="video/mp4" media="(min-width: 700px)">
      <source :src="`/video/${folder}/${name}-${small()}.h264.mp4`" type="video/mp4">
    </video>
    <span v-if="note" class="clip-note">{{ note }}</span>
  </div>
</template>

<style scoped>
.clip {
  position: relative;
}
.clip-video {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.clip-note {
  position: absolute;
  right: 12px;
  top: 12px;
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
}
</style>
