import { onMounted, onUnmounted, reactive, readonly, ref } from 'vue'
import { usePreferredReducedMotion } from '@vueuse/core'

/**
 * How an element's progress is read from its place in the viewport.
 *
 * - `scene`: a tall track with a sticky stage inside. Progress starts as soon
 *   as the upper half of the scene has come into view (a scene that is already
 *   in view when the page opens starts at once) and reaches 1 when the track's
 *   bottom edge meets the bottom of the viewport, the moment the stage unpins.
 *   An element no taller than the viewport falls back to `enter`.
 * - `enter`: an element that settles in: 0 once its top edge is 15 % up from
 *   the bottom of the viewport, 1 after at most half a viewport of scrolling.
 * - `pass`: the whole pass, for parallax: 0 as the top edge enters at the
 *   bottom, 1 as the bottom edge leaves at the top.
 */
export type SceneMode = 'scene' | 'enter' | 'pass'

/**
 * Scroll progress for scenes. Everything is read in one rAF per scroll event,
 * so the scenes never fight each other for layout.
 *
 * With reduced motion every scene reports 1: all effects show their end state.
 */
export function useSceneProgress() {
  const tracks = new Map<string, { el: HTMLElement; mode: SceneMode }>()
  const progress = reactive<Record<string, number>>({})
  /** 0 at the top of the document, 1 at the end */
  const page = ref(0)
  const reducedMotion = usePreferredReducedMotion()
  let queued = false

  const clamp = (value: number) => Math.min(1, Math.max(0, value))

  function register(id: string, el: HTMLElement | null, mode: SceneMode = 'scene') {
    if (el) tracks.set(id, { el, mode })
    else tracks.delete(id)
    if (!(id in progress)) progress[id] = 0
  }

  function read(rect: DOMRect, mode: SceneMode, viewport: number): number {
    if (mode === 'pass') {
      return (viewport - rect.top) / (viewport + rect.height)
    }
    const span = rect.height - viewport
    if (mode === 'enter' || span <= 0) {
      return (viewport * 0.85 - rect.top) / Math.min(rect.height, viewport * 0.55)
    }
    // How far above the viewport top the track may be before it counts as started: half a
    // viewport, or less for a track that sits that close to the top of the document
    const lead = Math.min(viewport * 0.5, Math.max(0, rect.top + window.scrollY))
    return (lead - rect.top) / (span + lead)
  }

  function measure() {
    const doc = document.documentElement
    const viewport = window.innerHeight
    page.value = clamp(window.scrollY / Math.max(1, doc.scrollHeight - viewport))
    const still = reducedMotion.value === 'reduce'
    for (const [id, { el, mode }] of tracks) {
      progress[id] = still ? 1 : clamp(read(el.getBoundingClientRect(), mode, viewport))
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
