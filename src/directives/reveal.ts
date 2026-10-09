import type { Directive } from 'vue'
import { ENTER_LINE } from '@/utils/scroll'

/**
 * v-reveal: fade and slide an element in the first time it scrolls into view.
 *
 * The same effect motion-v's whileInView gave, done with IntersectionObserver
 * and a CSS transition. motion-v mounts a feature per element and reads
 * `offsetParent` while doing so, which forced a full page layout for every
 * animated element in the mount task (about a second on a slow phone for the
 * start page). This directive only writes styles during mount; nothing is read.
 *
 * Every element starts when its top edge crosses the same line, ENTER_LINE of
 * the viewport height from the top, whatever its size. A share of the element
 * as threshold would fire a tall card on a phone half a screen later than a
 * short one, and a zero threshold would play the animation at the very bottom
 * edge where nobody looks yet. Elements that cross the line in the same frame
 * (one row of a grid) start one after another; an element arriving alone
 * starts at once, so a single column on a phone never waits for a stagger
 * meant for a row on a desktop.
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
}

const DEFAULTS: Required<RevealOptions> = { x: 0, y: 24, scale: 1, duration: 0.45 }

/** Seconds between elements that cross the line in the same frame */
const STAGGER = 0.07
/** The last element of a long row still starts while the first one is moving */
const MAX_STAGGER = 0.28

/** Reveals an element after the given stagger in seconds, or without a transition for null */
const pending = new Map<Element, (stagger: number | null) => void>()

let lineObserver: IntersectionObserver | undefined
let endObserver: IntersectionObserver | undefined

function start(targets: Element[], animate = true) {
  targets.forEach((target, index) => {
    const show = pending.get(target)
    if (!show) return
    pending.delete(target)
    lineObserver?.unobserve(target)
    endObserver?.unobserve(target)
    show(animate ? Math.min(index * STAGGER, MAX_STAGGER) : null)
  })
}

/** Top to bottom, then left to right: the order a row is read in */
function byReadingOrder(a: IntersectionObserverEntry, b: IntersectionObserverEntry): number {
  return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left
}

function onLine(entries: IntersectionObserverEntry[]) {
  start(entries.filter((entry) => entry.isIntersecting).sort(byReadingOrder).map((entry) => entry.target))
  // Already above the viewport (a jump to an anchor, a restored scroll position): nobody watched it arrive.
  // A box without height has no layout yet (a content-visibility section not rendered), not a place above.
  start(entries.filter(isAboveViewport).map((entry) => entry.target), false)
}

function isAboveViewport(entry: IntersectionObserverEntry): boolean {
  const rect = entry.boundingClientRect
  return !entry.isIntersecting && rect.height > 0 && rect.bottom <= 0
}

/**
 * A short element at the very end of the page may never reach the line, the
 * page ends before. Fully in view is enough for such an element; any other
 * waits for the line, or a short title would start at the bottom edge.
 */
function onEnd(entries: IntersectionObserverEntry[]) {
  const lowestLine = document.documentElement.scrollHeight - window.innerHeight * (1 - ENTER_LINE)
  start(
    entries
      .filter((entry) => entry.intersectionRatio >= 1 && entry.boundingClientRect.top + window.scrollY > lowestLine)
      .sort(byReadingOrder)
      .map((entry) => entry.target),
  )
}

function observe(el: Element) {
  lineObserver ??= new IntersectionObserver(onLine, { rootMargin: `0px 0px -${Math.round((1 - ENTER_LINE) * 100)}% 0px` })
  endObserver ??= new IntersectionObserver(onEnd, { threshold: 1 })
  lineObserver.observe(el)
  endObserver.observe(el)
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

    pending.set(el, (stagger) => {
      if (stagger === null) {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
        return
      }
      const timing = `${options.duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${stagger}s`
      el.style.transition = `opacity ${timing}, transform ${timing}`
      el.addEventListener('transitionend', () => el.style.removeProperty('transition'), { once: true })
      // Next frame, so the start state has been painted and the transition has something to run from
      requestAnimationFrame(() => {
        el.style.removeProperty('opacity')
        el.style.removeProperty('transform')
      })
    })
    observe(el)
  },
  unmounted(el) {
    pending.delete(el)
    lineObserver?.unobserve(el)
    endObserver?.unobserve(el)
  },
}
