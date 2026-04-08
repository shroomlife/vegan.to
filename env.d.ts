/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, never>, Record<string, never>, unknown>
  export default component
}

declare module 'humanize-duration' {
  interface HumanizeDurationOptions {
    language?: string
    fallbacks?: string[]
    round?: boolean
  }
  function humanizeDuration(ms: number, options?: HumanizeDurationOptions): string
  export default humanizeDuration
}
