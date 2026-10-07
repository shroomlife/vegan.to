import { inject, provide, reactive, readonly, type InjectionKey } from 'vue'
import { sources, type SourceId } from '@/data/sources'

/**
 * Sources on the start page work like the notes of a paper: every SourceLinks
 * renders a small number instead of the full line, and one list at the end of
 * the page holds all of them in the order they were first cited. One source,
 * one number, however often it is cited.
 *
 * The numbers follow the order in which the components mount, which is the
 * order of the template. The pages that do not provide a registry keep the
 * inline source lines.
 */
export interface Citations {
  /** The cited sources in order of their first citation; index + 1 is the number */
  order: readonly SourceId[]
  /** Numbers for the given sources, registering any not yet cited */
  cite: (ids: readonly SourceId[]) => number[]
}

const CITATIONS: InjectionKey<Citations> = Symbol('citations')

/** The anchor of a source in the list at the end of the page */
export function citationAnchor(number: number): string {
  return `quelle-${number}`
}

export function provideCitations(): Citations {
  const order = reactive<SourceId[]>([])
  const citations: Citations = {
    order: readonly(order) as readonly SourceId[],
    cite(ids) {
      return ids.map((id) => {
        if (!(id in sources)) throw new Error(`unknown source ${id}`)
        let index = order.indexOf(id)
        if (index === -1) {
          order.push(id)
          index = order.length - 1
        }
        return index + 1
      })
    },
  }
  provide(CITATIONS, citations)
  return citations
}

/** The registry of the page, or nothing on pages that list their sources inline */
export function useCitations(): Citations | undefined {
  return inject(CITATIONS, undefined)
}
