import type { RouteLocationNormalized } from 'vue-router'

export const SITE_URL = 'https://vegan.to'

export interface DocumentMeta {
  title: string
  description?: string
  /** Path without host, e.g. "/tiere/huehner" */
  path: string
  noindex?: boolean
}

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
 * page, so a shared deep link and a crawler that renders the SPA both see the
 * page they landed on, not the start page's tags.
 */
export function applyDocumentMeta({ title, description, path, noindex = false }: DocumentMeta): void {
  const url = `${SITE_URL}${path}`
  document.title = title
  setMeta('meta[property="og:title"]', title)
  setMeta('meta[name="twitter:title"]', title)
  if (description) {
    setMeta('meta[name="description"]', description)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[name="twitter:description"]', description)
  }
  setCanonical(url)
  setMeta('meta[property="og:url"]', url)
  setMeta('meta[name="robots"]', noindex ? 'noindex, follow' : 'index, follow, max-snippet:-1, max-image-preview:large')
}

/** Router hook for routes with static meta; dynamic pages call applyDocumentMeta themselves */
export function applyRouteMeta(to: RouteLocationNormalized): void {
  if (!to.meta.title) return
  applyDocumentMeta({
    title: to.meta.title,
    description: to.meta.description,
    path: to.path,
    noindex: to.name === 'NotFound',
  })
}
