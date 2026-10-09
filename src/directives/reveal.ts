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

/** Scrolling quiet for this long counts as settled */
const SETTLE_MS = 150

let lineObserver: IntersectionObserver | undefined
let settleTimer = 0

function start(targets: Element[], animate = true) {
  targets.forEach((target, index) => {
    const show = pending.get(target)
    if (!show) return
    pending.delete(target)
    lineObserver?.unobserve(target)
    show(animate ? Math.min(index * STAGGER, MAX_STAGGER) : null)
  })
}

/** Top to bottom, then left to right: the order a row is read in */
function byReadingOrder(a: { rect: DOMRectReadOnly }, b: { rect: DOMRectReadOnly }): number {
  return a.rect.top - b.rect.top || a.rect.left - b.rect.left
}

function onLine(entries: IntersectionObserverEntry[]) {
  const arrived = entries.filter((entry) => entry.isIntersecting).map((entry) => ({ target: entry.target, rect: entry.boundingClientRect }))
  start(arrived.sort(byReadingOrder).map((item) => item.target))
  // Already above the viewport (a jump to an anchor, a restored scroll position): nobody watched it arrive.
  // A box without height has no layout yet (a content-visibility section not rendered), not a place above.
  start(entries.filter((entry) => !entry.isIntersecting && entry.boundingClientRect.height > 0 && entry.boundingClientRect.bottom <= 0).map((entry) => entry.target), false)
}

/**
 * What the line cannot catch, checked once scrolling has settled: an element
 * a fast scroll carried past the viewport within one frame (the observer only
 * reports changes, it never saw it intersect), and a short element at the
 * very end of the page that the line never reaches because the page ends first.
 */
function sweep() {
  const viewport = window.innerHeight
  const lowestLine = document.documentElement.scrollHeight - viewport * (1 - ENTER_LINE)
  const passed: Element[] = []
  const atEnd: { target: Element; rect: DOMRect }[] = []
  for (const target of pending.keys()) {
    const rect = target.getBoundingClientRect()
    if (rect.height === 0) continue
    if (rect.bottom <= 0) passed.push(target)
    else if (rect.top >= 0 && rect.bottom <= viewport && rect.top + window.scrollY > lowestLine) atEnd.push({ target, rect })
  }
  start(passed, false)
  start(atEnd.sort(byReadingOrder).map((item) => item.target))
}

function settleLater() {
  window.clearTimeout(settleTimer)
  settleTimer = window.setTimeout(sweep, SETTLE_MS)
}

function observe(el: Element) {
  if (!lineObserver) {
    lineObserver = new IntersectionObserver(onLine, { rootMargin: `0px 0px -${Math.round((1 - ENTER_LINE) * 100)}% 0px` })
    window.addEventListener('scroll', settleLater, { passive: true })
  }
  lineObserver.observe(el)
  // One sweep after mounting too: a short page that never scrolls still shows its end
  settleLater()
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
      // Only the element's own opacity transition ends the reveal, not one bubbling up from a child
      const done = (event: TransitionEvent) => {
        if (event.target !== el || event.propertyName !== 'opacity') return
        el.style.removeProperty('transition')
        el.removeEventListener('transitionend', done)
      }
      el.addEventListener('transitionend', done)
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
  },
}
