import { onMounted, onUnmounted } from 'vue'

/**
 * Adds a schema.org JSON-LD block to <head> while the component is mounted.
 * Google reads structured data that JavaScript injects after rendering, so the
 * FAQ page markup can be generated from the same data the visitor sees.
 */
export function useJsonLd(id: string, data: Record<string, unknown>): void {
  let script: HTMLScriptElement | null = null

  onMounted(() => {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    script.text = JSON.stringify({ '@context': 'https://schema.org', ...data })
    document.head.append(script)
  })

  onUnmounted(() => {
    script?.remove()
  })
}
