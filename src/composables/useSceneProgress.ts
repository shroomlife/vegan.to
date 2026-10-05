import { onMounted, onUnmounted, reactive, readonly, ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * Scroll progress for pinned scenes. A scene is a tall "track" element with a
 * sticky stage inside; its progress runs from 0 when the track enters the
 * viewport at the top to 1 when its bottom edge reaches the bottom of the
 * viewport. Everything is read in one rAF per scroll event, so the scenes
 * never fight each other for layout.
 *
 * With reduced motion every scene reports 1: all effects show their end state.
 */
export function useSceneProgress() {
  const tracks = new Map<string, HTMLElement>()
  const progress = reactive<Record<string, number>>({})
  /** 0 at the top of the document, 1 at the end */
  const page = ref(0)
  const reducedMotion = usePreferredReducedMotion()
  let queued = false

  const clamp = (value: number) => Math.min(1, Math.max(0, value))

  function register(id: string, el: HTMLElement | null) {
    if (el) tracks.set(id, el)
    else tracks.delete(id)
    if (!(id in progress)) progress[id] = 0
  }

  function measure() {
    const doc = document.documentElement
    const viewport = window.innerHeight
    page.value = clamp(window.scrollY / Math.max(1, doc.scrollHeight - viewport))
    const still = reducedMotion.value === 'reduce'
    for (const [id, el] of tracks) {
      if (still) {
        progress[id] = 1
        continue
      }
      const rect = el.getBoundingClientRect()
      const span = rect.height - viewport
      // A track no taller than the viewport has no pin; it starts at 0 while its top is still
      // below the viewport top and reaches 1 when 40 percent of the viewport is left below it
      progress[id] = span > 0 ? clamp(-rect.top / span) : clamp(-rect.top / Math.max(1, rect.height - viewport * 0.4))
    }
  }

  function onScroll() {
    if (queued) return
    queued = true
    requestAnimationFrame(() => {
      queued = false
      measure()
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // Measured in the next frame, so the first read happens after the mount's own layout, not inside it
    onScroll()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  })

  return { register, progress: readonly(progress), page: readonly(page), reducedMotion }
}

/** Maps a 0..1 progress onto a sub-range, e.g. the second half of a scene */
export function span(value: number, from: number, to: number): number {
  return Math.min(1, Math.max(0, (value - from) / (to - from)))
}
