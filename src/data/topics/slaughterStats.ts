/**
 * Schlachtzahlen nach Herkunft, Monat und Bundesland.
 * Abgerufen am 05.10.2026, GENESIS-Stand 21.09.2026.
 *
 * - 41331-0001: Deutschland, Jahre, nach Schlachtungsart (gewerblich inländischer
 *   Herkunft, gewerblich ausländischer Herkunft, Hausschlachtung), Anzahl und
 *   Schlachtmenge in Tonnen. 2025 endgültig ("e").
 * - 41331-0002: Deutschland, Monate. 2025 endgültig, 2026 vorläufig ("p"),
 *   August bis Dezember 2026 noch nicht veröffentlicht.
 * - 41331-0003: Bundesländer, Jahre. Gewerbliche Schlachtungen inländischer Herkunft.
 * - 41322-0001: Geflügelschlachtereien, Jahre, Anzahl und Schlachtmenge in kg.
 * - 41322-0002: Geflügelschlachtereien, Monate (bis Dezember 2025).
 * - 41322-0009: Geflügelschlachtereien, Bundesländer. Für mehrere Länder ohne
 *   Wert ("." geheim gehalten oder "-" nichts vorhanden).
 * - Pressemitteilungen 049/26 (13.02.2026) und 281/26 (Korrektur, Aug. 2026).
 */

export interface OriginRow {
  /** Plural as shown, e.g. "Schweine" */
  name: string
  domestic: number
  foreign: number
  home: number
  /** Schlachtmenge in Tonnen, gewerblich inländischer Herkunft */
  domesticTonnes: number
}

/** 41331-0001, Jahr 2025. "Rinder" ist die Summe aller Rinderkategorien einschließlich Kälbern */
export const byOrigin2025: readonly OriginRow[] = [
  { name: 'Schweine', domestic: 44_016_159, foreign: 758_353, home: 36_043, domesticTonnes: 4_242_335 },
  { name: 'Rinder', domestic: 2_772_791, foreign: 16_055, home: 17_655, domesticTonnes: 943_972 },
  { name: 'Lämmer', domestic: 578_042, foreign: 173_832, home: 7_507, domesticTonnes: 11_441 },
  { name: 'Schafe', domestic: 102_543, foreign: 2_980, home: 4_937, domesticTonnes: 2_963 },
  { name: 'Ziegen', domestic: 20_961, foreign: 617, home: 1_389, domesticTonnes: 377 },
  { name: 'Pferde', domestic: 3_499, foreign: 24, home: 63, domesticTonnes: 924 },
]

/** 41322-0001, Jahr 2025: Anzahl und Schlachtmenge in kg */
export const poultry2025 = {
  total: 697_298_079,
  broilers: 640_230_127,
  broilersKg: 1_146_266_716,
  boilingHens: 20_747_574,
  turkeys: 27_556_012,
  turkeysKg: 376_847_838,
  ducks: 8_347_759,
  geese: 414_898,
  ostriches: 925,
  pigeons: 532,
  slaughterhouses: 153,
} as const

/**
 * Tiere weiterer Geflügelarten, die 41322-0001 nicht einzeln ausweist:
 * Gesamtzahl minus aller einzeln genannten Arten (252 für 2025).
 */
export const otherUnlisted = poultry2025.total - (
  poultry2025.broilers
  + poultry2025.boilingHens
  + poultry2025.turkeys
  + poultry2025.ducks
  + poultry2025.geese
  + poultry2025.ostriches
  + poultry2025.pigeons
)

export const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'] as const

export interface MonthlySeries {
  pigs2025: readonly number[]
  pigs2026: readonly number[]
  cattle2025: readonly number[]
  cattle2026: readonly number[]
  lambs2025: readonly number[]
  poultry2025: readonly number[]
  geese2025: readonly (number | undefined)[]
}

/** 41331-0002, gewerblich inländischer Herkunft; 2026 vorläufig bis Juli */
export const monthly: MonthlySeries = {
  pigs2025: [3_816_492, 3_545_955, 3_814_296, 3_574_301, 3_520_101, 3_427_406, 3_716_934, 3_596_693, 3_816_859, 3_880_028, 3_759_598, 3_547_496],
  pigs2026: [3_855_843, 3_556_195, 3_877_751, 3_524_966, 3_382_152, 3_666_016, 3_656_068],
  cattle2025: [257_748, 221_101, 238_424, 225_833, 215_084, 196_534, 233_401, 197_461, 243_915, 268_073, 247_172, 228_045],
  cattle2026: [239_410, 211_296, 257_209, 222_075, 206_892, 212_570, 219_352],
  lambs2025: [36_016, 33_944, 35_814, 55_888, 41_669, 67_167, 45_517, 43_960, 49_770, 53_357, 51_899, 63_041],
  /** 41322-0002, alle Geflügelarten */
  poultry2025: [60_169_646, 52_639_624, 57_657_677, 59_283_239, 59_167_015, 57_192_099, 62_173_170, 57_327_008, 61_225_178, 58_814_018, 56_384_364, 55_265_041],
  /** 41322-0002, Gänse; undefined = nicht veröffentlicht oder nichts vorhanden */
  geese2025: [undefined, undefined, undefined, undefined, 15, undefined, undefined, undefined, 34_994, 103_795, 83_950, 139_492],
}

export interface StateSlaughter {
  state: string
  pigs?: number
  cattle?: number
  lambsAndSheep?: number
  poultry?: number
  /**
   * Why 41322-0009 has no poultry figure: 'secret' = geheim gehalten ("."),
   * 'none' = nichts vorhanden ("-"). Absent when a figure is published.
   */
  poultryStatus?: 'secret' | 'none'
}

/**
 * 2025, 41331-0003 (inländischer Herkunft) und 41322-0009.
 * Undefined, wo Destatis keinen Wert ausweist; beim Geflügel sagt poultryStatus, warum.
 */
export const byState2025: readonly StateSlaughter[] = [
  { state: 'Baden-Württemberg', pigs: 3_792_078, cattle: 351_111, lambsAndSheep: 90_736 + 13_550, poultry: 399_544 },
  { state: 'Bayern', pigs: 3_687_516, cattle: 715_252, lambsAndSheep: 87_647 + 10_625, poultry: 66_630_508 },
  { state: 'Berlin', poultryStatus: 'none' },
  { state: 'Brandenburg', pigs: 799_159, cattle: 31_375, lambsAndSheep: 38_700 + 6_371, poultryStatus: 'secret' },
  { state: 'Bremen', cattle: 74_128, poultryStatus: 'none' },
  { state: 'Hamburg', poultryStatus: 'none' },
  { state: 'Hessen', pigs: 479_530, cattle: 23_412, lambsAndSheep: 174_544 + 19_543, poultryStatus: 'secret' },
  { state: 'Mecklenburg-Vorpommern', pigs: 27_133, cattle: 98_603, lambsAndSheep: 1_730 + 820, poultryStatus: 'secret' },
  { state: 'Niedersachsen', pigs: 12_807_672, cattle: 693_381, lambsAndSheep: 24_117 + 8_467, poultry: 324_640_184 },
  { state: 'Nordrhein-Westfalen', pigs: 16_896_127, cattle: 469_670, lambsAndSheep: 61_223 + 18_079, poultry: 37_540_575 },
  { state: 'Rheinland-Pfalz', pigs: 1_053_449, cattle: 31_967, lambsAndSheep: 16_982 + 1_443, poultry: 33_780 },
  { state: 'Saarland', pigs: 21_064, cattle: 3_169, lambsAndSheep: 989 + 307, poultryStatus: 'secret' },
  { state: 'Sachsen', pigs: 200_300, cattle: 13_498, lambsAndSheep: 3_895 + 3_073, poultryStatus: 'secret' },
  { state: 'Sachsen-Anhalt', pigs: 2_990_847, cattle: 2_077, lambsAndSheep: 1_196 + 1_311, poultryStatus: 'secret' },
  { state: 'Schleswig-Holstein', pigs: 1_093_397, cattle: 167_277, lambsAndSheep: 74_702 + 14_081, poultry: 199_586 },
  { state: 'Thüringen', pigs: 167_887, cattle: 97_871, lambsAndSheep: 1_581 + 4_873, poultryStatus: 'secret' },
]

/** Pressemitteilungen 049/26 und 281/26 */
export const press = {
  meatTonnes2025: 6_900_000,
  peakYear: 2016,
  peakTonnes: 8_300_000,
  belowPeakPercent: 17.0,
  firstHalf2026: { tonnes: 3_400_000, mammals: 24_000_000, poultry: 343_200_000 },
} as const
