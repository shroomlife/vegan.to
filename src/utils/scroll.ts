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

/** Scrolls to the element a hash points at; false when there is no such element */
export function scrollToHash(hash: string): boolean {
  const target = document.getElementById(hash.replace(/^#/, ''))
  if (!target) return false
  const top = target.getBoundingClientRect().top + window.scrollY - anchorOffset()
  window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior() })
  return true
}
