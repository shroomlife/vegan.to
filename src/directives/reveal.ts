import type { Directive } from 'vue'

/**
 * v-reveal: fade and slide an element in the first time it scrolls into view.
 *
 * The same effect motion-v's whileInView gave, done with one IntersectionObserver
 * per threshold and a CSS transition. motion-v mounts a feature per element and
 * reads `offsetParent` while doing so, which forced a full page layout for every
 * animated element in the mount task (about a second on a slow phone for the
 * start page). This directive only writes styles during mount; nothing is read.
 *
 * With reduced motion the element simply appears. The prerender strips the
 * start state from `[data-reveal]` so the static HTML never hides content.
 */
export interface RevealOptions {
  /** Horizontal start offset in px */
  x?: number
  /** Vertical start offset in px */
  y?: number
  /** Start scale */
  scale?: number
  /** Seconds */
  duration?: number
  /** Seconds */
  delay?: number
  /** Share of the element that has to be visible, 0 to 1 */
  amount?: number
}

const DEFAULTS: Required<RevealOptions> = { x: 0, y: 24, scale: 1, duration: 0.45, delay: 0, amount: 0 }

const observers = new Map<number, IntersectionObserver>()
const pending = new WeakMap<Element, () => void>()

function observerFor(amount: number): IntersectionObserver {
  const existing = observers.get(amount)
  if (existing) return existing
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const show = pending.get(entry.target)
        if (show) {
          pending.delete(entry.target)
          show()
        }
        observer.unobserve(entry.target)
      }
    },
    { threshold: amount },
  )
  observers.set(amount, observer)
  return observer
}

export const reveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const options: Required<RevealOptions> = { ...DEFAULTS, ...binding.value }
    const transform: string[] = []
    if (options.x !== 0 || options.y !== 0) transform.push(`translate3d(${options.x}px, ${options.y}px, 0)`)
    if (options.scale !== 1) transform.push(`scale(${options.scale})`)

    el.dataset.reveal = ''
    el.style.opacity = '0'
    if (transform.length > 0) el.style.transform = transform.join(' ')

    pending.set(el, () => {
      const timing = `${options.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${options.delay}s`
      el.style.transition = `opacity ${timing}, transform ${timing}`
      el.addEventListener('transitionend', () => el.style.removeProperty('transition'), { once: true })
      // Next frame, so the start state has been painted and the transition has something to run from
      requestAnimationFrame(() => {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
      })
    })
    observerFor(options.amount).observe(el)
  },
  unmounted(el) {
    pending.delete(el)
    for (const observer of observers.values()) observer.unobserve(el)
  },
}
