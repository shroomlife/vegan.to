import { formatNumber } from './formatNumber'

/** Attributive forms, as they stand before a noun: "ein Prozent", "drei Laktationen" */
const WORDS = ['null', 'ein', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn', 'elf', 'zwölf'] as const

/**
 * Writes whole numbers up to twelve as words, as German prose does; everything
 * else falls back to formatNumber. `capitalize` is for a sentence start.
 */
export function numberWord(value: number, options: { capitalize?: boolean } = {}): string {
  const word = Number.isInteger(value) && value >= 0 && value < WORDS.length ? WORDS[value] : undefined
  const text = word ?? formatNumber(value)
  return options.capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text
}
