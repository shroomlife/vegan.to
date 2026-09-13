import type { RouteLocationNormalized } from 'vue-router'

export const SITE_URL = 'https://vegan.to'

function setMeta(selector: string, content: string) {
  const el = document.head.querySelector<HTMLMetaElement>(selector)
  if (el) el.content = content
}

function setCanonical(href: string) {
  const link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (link) link.href = href
}

/**
 * Keeps title, description, canonical and the Open Graph copies in sync with the
 * route, so a shared /quellen link and a crawler that renders the SPA both see
 * the page they landed on, not the start page's tags.
 */
export function applyRouteMeta(to: RouteLocationNormalized): void {
  const { title, description } = to.meta
  const url = `${SITE_URL}${to.path}`
  if (title) {
    document.title = title
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[name="twitter:title"]', title)
  }
  if (description) {
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[name="twitter:description"]', description)
  }
  setCanonical(url)
  setMeta('meta[property="og:url"]', url)
  // The 404 page must not be indexed under whatever path was typed
  setMeta('meta[name="robots"]', to.name === 'NotFound' ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large')
}
