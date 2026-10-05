/**
 * Tierbestand in Deutschland, abgerufen am 05.10.2026 (GENESIS-Stand 21.09.2026).
 *
 * - Rinder: Destatis 41312-0001 (Deutschland) und 41312-0010 (Länder),
 *   Stichmonate Mai und November, Werte mit Kennzeichen "e" (endgültig).
 * - Schweine: Destatis 41313-0001 und 41313-0010, Stichmonate Mai und November.
 * - Schafe: Destatis 41314-0001, Stichmonat November.
 * - Geflügel, Ziegen, Einhufer: Destatis 41141-0004, Agrarstrukturerhebung,
 *   Stichtag 01.03.2023. Diese Arten werden nur in den mehrjährigen
 *   Agrarstrukturerhebungen gezählt, 2023 ist der jüngste Stand. Gänse sind dort
 *   mit "/" gekennzeichnet, also ohne veröffentlichten Wert.
 */

export interface StockFigure {
  label: string
  count: number
  /** "Mai 2026", "1. März 2023" */
  asOf: string
}

export const cattleStock = {
  may2026: 10_352_501,
  nov2025: 10_420_269,
  may2010: 12_809_492,
  dairyCowsMay2026: 3_588_779,
  dairyCowsMay2010: 4_183_111,
  calvesUpTo8MonthsMay2026: 2_186_866,
  holdingsMay2026: 120_271,
  holdingsMay2010: 176_369,
} as const

export const pigStock = {
  may2026: 20_950_800,
  nov2025: 21_545_300,
  may2010: 26_509_100,
  pigletsMay2026: 6_506_400,
  fatteningMay2026: 8_968_000,
  sowsMay2026: 1_391_200,
  farmsMay2026: 14_550,
  farmsMay2010: 33_400,
} as const

export const sheepStock = {
  nov2025: 1_524_900,
  nov2011: 1_657_800,
  farmsNov2025: 9_380,
} as const

/** Agrarstrukturerhebung, Stichtag 01.03.2023 */
export const census2023 = {
  chickens: 156_300_900,
  layingHens: 55_809_300,
  broilers: 88_091_700,
  pullets: 12_399_900,
  turkeys: 8_999_000,
  ducks: 1_593_100,
  goats: 162_600,
  equines: 486_500,
} as const

export interface StateStock {
  state: string
  /** Undefined where Destatis publishes no value ("." or "-") */
  pigs?: number
  cattle: number
}

/** Mai 2026, 41312-0010 und 41313-0010 */
export const stockByState: readonly StateStock[] = [
  { state: 'Baden-Württemberg', pigs: 1_240_600, cattle: 869_941 },
  { state: 'Bayern', pigs: 2_400_800, cattle: 2_685_976 },
  { state: 'Berlin', cattle: 689 },
  { state: 'Brandenburg', pigs: 528_600, cattle: 412_175 },
  { state: 'Bremen', cattle: 7_606 },
  { state: 'Hamburg', cattle: 5_124 },
  { state: 'Hessen', pigs: 354_100, cattle: 368_810 },
  { state: 'Mecklenburg-Vorpommern', pigs: 555_500, cattle: 447_643 },
  { state: 'Niedersachsen', pigs: 6_844_900, cattle: 2_209_421 },
  { state: 'Nordrhein-Westfalen', pigs: 5_881_400, cattle: 1_234_083 },
  { state: 'Rheinland-Pfalz', pigs: 82_400, cattle: 274_949 },
  { state: 'Saarland', pigs: 1_000, cattle: 37_371 },
  { state: 'Sachsen', pigs: 476_800, cattle: 412_910 },
  { state: 'Sachsen-Anhalt', pigs: 1_005_700, cattle: 258_589 },
  { state: 'Schleswig-Holstein', pigs: 986_700, cattle: 867_094 },
  { state: 'Thüringen', pigs: 592_200, cattle: 260_120 },
]
