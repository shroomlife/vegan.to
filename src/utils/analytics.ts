/**
 * Google Analytics 4, loaded only after the visitor agreed in the consent
 * banner. Before that not a single request goes to Google, which is why this
 * does not use consent mode with a "denied" default: that variant already
 * loads gtag.js and sends cookieless pings.
 *
 * Page views of the single page app come from enhanced measurement (browser
 * history events), which is what Google recommends for gtag.js:
 * https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications
 */
export const GA_MEASUREMENT_ID = 'G-1B0G94DX8X'

const DISABLE_FLAG = `ga-disable-${GA_MEASUREMENT_ID}` as const

declare global {
  interface Window {
    dataLayer?: unknown[]
    /** Google's documented opt-out switch, checked before every hit */
    [DISABLE_FLAG]?: boolean
  }
}

let loaded = false

export function enableAnalytics(): void {
  window[DISABLE_FLAG] = false
  if (loaded) return
  loaded = true

  const dataLayer = (window.dataLayer = window.dataLayer ?? [])
  // gtag.js expects the arguments object itself, not an array, exactly as in Google's snippet
  const gtag: (...args: unknown[]) => void = function () {
    dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', GA_MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
  document.head.append(script)
}

/** Stops further hits at once and removes the cookies Analytics has set */
export function disableAnalytics(): void {
  window[DISABLE_FLAG] = true
  deleteAnalyticsCookies()
}

function deleteAnalyticsCookies(): void {
  const names = document.cookie
    .split(';')
    .map((pair) => pair.split('=')[0]?.trim() ?? '')
    .filter((name) => name === '_ga' || name.startsWith('_ga_'))
  // gtag.js writes its cookies on the registrable domain (".vegan.to"), so
  // both that and the plain host are cleared
  const host = location.hostname
  const domains = ['', host, `.${host.replace(/^www\./, '')}`]
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`
    }
  }
}
