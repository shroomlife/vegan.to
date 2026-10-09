import { onScopeDispose, readonly, shallowRef, toValue, watch, type MaybeRefOrGetter, type Ref } from 'vue'

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * A number that eases to every new value of its source while it is on screen, and simply takes the value while it is not: nobody sees the easing off screen, and every tick stays cheap.
 *
 * Every change starts from the figure shown right now. VueUse's useTransition with `disabled` keeps its own value from the moment it was disabled and only catches up on the next change, so a number that came back into view showed 0 or an old figure for a moment.
 */
export function useEasedNumber(source: MaybeRefOrGetter<number>, visible: Ref<boolean>, duration = 369): Readonly<Ref<number>> {
  const shown = shallowRef(toValue(source))
  let frame = 0

  watch(
    () => toValue(source),
    (to) => {
      cancelAnimationFrame(frame)
      if (!visible.value) {
        shown.value = to
        return
      }
      const from = shown.value
      const start = performance.now()
      const step = (now: number) => {
        // A frame's timestamp can lie a little before the change was seen; never ease backwards
        const progress = Math.min(1, Math.max(0, (now - start) / duration))
        shown.value = from + (to - from) * easeOutCubic(progress)
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    },
  )

  onScopeDispose(() => cancelAnimationFrame(frame))

  return readonly(shown)
}
