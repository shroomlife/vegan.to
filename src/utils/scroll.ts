/** Where an element counts as arrived: this share of the viewport height from the top, 85 % means 15 % above the bottom edge. Reveals (v-reveal) and scroll scenes that settle in (useSceneProgress 'enter') both start here. */
export const ENTER_LINE = 0.85

/** Air between the sticky header and an anchored section */
const ANCHOR_MARGIN = 16

/** Respect the visitor's motion preference for programmatic scrolling */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

/** Sticky header height from the CSS token, so CSS stays the single source of truth */
export function headerHeight(): number {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
}

/** Offset every anchored scroll leaves free at the top, for the router and manual scrolls alike */
export function anchorOffset(): number {
  return headerHeight() + ANCHOR_MARGIN
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: scrollBehavior() })
}

/**
 * Document position of the element a hash points at, with the header offset
 * taken off; undefined when there is no such element.
 *
 * Sections below the fold use content-visibility and only carry an estimated
 * size until they are rendered. Measuring through them would land anywhere,
 * so every section is rendered for this one read (custom.css, .is-measuring);
 * from then on each remembers its real size.
 */
export function hashPosition(hash: string): number | undefined {
  const target = document.getElementById(hash.replace(/^#/, ''))
  if (!target) return undefined
  const root = document.documentElement
  root.classList.add('is-measuring')
  const top = target.getBoundingClientRect().top + window.scrollY - anchorOffset()
  // The browser records a section's real size only while rendering a frame with it visible,
  // so the class stays on for one frame; from then on every section keeps its real size
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('is-measuring')))
  return Math.max(0, top)
}

/** Scrolls to the element a hash points at; false when there is no such element */
export function scrollToHash(hash: string): boolean {
  const top = hashPosition(hash)
  if (top === undefined) return false
  window.scrollTo({ top, behavior: scrollBehavior() })
  return true
}
