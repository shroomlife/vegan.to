import type { SourceId } from '../sources.ts'

/**
 * Alter bei der Schlachtung nach Nutzungsform, wörtlich nach BZL,
 * landwirtschaft.de "Wie lange leben Rind, Schwein, Schaf und Huhn?",
 * Stand 27.08.2025, abgerufen am 05.10.2026:
 *
 * "Milchkühe werden in der landwirtschaftlichen Praxis im Durchschnitt 5,5 Jahre
 * alt, Mastbullen sind im Alter von etwa 18 bis 21 Monaten schlachtreif. Sauen
 * für die Ferkelerzeugung werden drei bis vier Jahre alt, Mastschweine nur etwa
 * sechs bis sieben Monate. [...] Legehennen erreichen ein Alter von ungefähr
 * 16 Monaten, um dann als Suppenhühner geschlachtet zu werden, Masthühner sind
 * schon mit fünf bis sieben Wochen schlachtreif. Mastgänse werden je nach
 * Mastverfahren im Alter von 16 Wochen oder 30 Wochen geschlachtet. Bei Enten
 * liegt das Schlachtalter zwischen sieben und zehn Wochen, bei Puten zwischen
 * 16 und 22 Wochen. Mutterschafe werden etwa fünf Jahre alt, Mastlämmer je nach
 * Mastverfahren vier bis zwölf Monate. Milchziegen nutzt man etwa fünf Jahre,
 * Ziegenlämmer können schon mit fünf Wochen geschlachtet werden, meist werden
 * sie aber zehn bis fünfzehn Wochen gemästet."
 *
 * Pferde und Fische fehlen bewusst: Für beide gibt es keine aktuelle,
 * belastbare Quelle zum typischen Schlachtalter in Deutschland.
 */
export interface UsageAge {
  /** "Masthuhn", "Milchkuh" */
  use: string
  /** Singular as in animals.ts and lifespans.ts, for the possible lifespan */
  species: string
  /** As the source says it, e.g. "5 bis 7 Wochen" */
  ageText: string
  /** Upper end of the age, in days, for the share of the possible life */
  maxDays: number
  sources: readonly SourceId[]
}

const WEEK = 7
const MONTH = 30.4
const YEAR = 365

export const usageAges: readonly UsageAge[] = [
  { use: 'Masthuhn', species: 'Huhn', ageText: '5 bis 7 Wochen', maxDays: 7 * WEEK, sources: ['bzlAges'] },
  { use: 'Ente', species: 'Ente', ageText: '7 bis 10 Wochen', maxDays: 10 * WEEK, sources: ['bzlAges'] },
  { use: 'Ziegenlamm', species: 'Ziege', ageText: 'meist 10 bis 15 Wochen', maxDays: 15 * WEEK, sources: ['bzlAges'] },
  { use: 'Mastgans', species: 'Gans', ageText: '16 oder 30 Wochen', maxDays: 30 * WEEK, sources: ['bzlAges'] },
  { use: 'Pute', species: 'Truthuhn', ageText: '16 bis 22 Wochen', maxDays: 22 * WEEK, sources: ['bzlAges'] },
  { use: 'Mastschwein', species: 'Schwein', ageText: '6 bis 7 Monate', maxDays: 7 * MONTH, sources: ['bzlAges'] },
  { use: 'Mastlamm', species: 'Schaf', ageText: '4 bis 12 Monate', maxDays: 12 * MONTH, sources: ['bzlAges'] },
  { use: 'Legehenne', species: 'Huhn', ageText: 'rund 16 Monate', maxDays: 16 * MONTH, sources: ['bzlAges'] },
  { use: 'Mastbulle', species: 'Rind', ageText: '18 bis 21 Monate', maxDays: 21 * MONTH, sources: ['bzlAges'] },
  { use: 'Zuchtsau', species: 'Schwein', ageText: '3 bis 4 Jahre', maxDays: 4 * YEAR, sources: ['bzlAges'] },
  { use: 'Mutterschaf', species: 'Schaf', ageText: 'rund 5 Jahre', maxDays: 5 * YEAR, sources: ['bzlAges'] },
  { use: 'Milchziege', species: 'Ziege', ageText: 'rund 5 Jahre genutzt', maxDays: 5 * YEAR, sources: ['bzlAges'] },
  { use: 'Milchkuh', species: 'Rind', ageText: 'im Schnitt 5,5 Jahre', maxDays: 5.5 * YEAR, sources: ['bzlAges'] },
]
