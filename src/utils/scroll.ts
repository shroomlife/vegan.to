/** Respect the visitor's motion preference for programmatic scrolling */
export function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: scrollBehavior() })
}

/** Scrolls to an element by hash, leaving room for the sticky header */
export function scrollToHash(hash: string): boolean {
  const target = document.querySelector<HTMLElement>(hash)
  if (!target) return false
  const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 0
  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16
  window.scrollTo({ top: Math.max(0, top), behavior: scrollBehavior() })
  return true
}
