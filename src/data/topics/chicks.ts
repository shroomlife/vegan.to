/**
 * Brütereien und Legehennen. Abgerufen am 05.10.2026, GENESIS-Stand 21.09.2026.
 *
 * - 41321-0001 (Brütereien): "Hühnerküken, Legerassen zum Gebrauch" und
 *   "Hühnerküken, aussortierte Hahnenküken". Laut Destatis-Definition sind
 *   aussortierte Hahnenküken die zur Mast vorgesehenen männlichen Küken der
 *   Legerassen; nach dem Schlupf getötete Küken sind nicht enthalten.
 *   Für 2021 ist dieser Wert nicht veröffentlicht ("."), vor 2020 ebenfalls nicht.
 *   Die Zahl der Brütereien umfasst alle Brütereien mit geschlüpften Küken von
 *   Legerassen, einschließlich Zucht und Vermehrung.
 * - 41323-0001 (Legehennen): Betriebe von Unternehmen mit mindestens 3.000 Hennenplätzen,
 *   Durchschnittsbestand des Jahres.
 */

export interface HatcheryYear {
  year: number
  /** Brütereien mit geschlüpften Küken der Legerassen, einschließlich Zucht und Vermehrung */
  hatcheries: number
  /** Eingelegte Bruteier, Legerassen zum Gebrauch */
  eggsSet: number
  /** Geschlüpfte Küken, Legerassen zum Gebrauch */
  hatched: number
  /** Zur Mast vorgesehene männliche Küken der Legerassen; undefined = nicht veröffentlicht */
  cockerels?: number
}

export const hatcheryYears: readonly HatcheryYear[] = [
  { year: 2015, hatcheries: 28, eggsSet: 121_737_595, hatched: 48_006_890 },
  { year: 2016, hatcheries: 30, eggsSet: 111_140_739, hatched: 44_096_993 },
  { year: 2017, hatcheries: 27, eggsSet: 116_312_198, hatched: 45_739_656 },
  { year: 2018, hatcheries: 25, eggsSet: 103_284_009, hatched: 42_154_673 },
  { year: 2019, hatcheries: 24, eggsSet: 104_992_142, hatched: 45_298_361 },
  { year: 2020, hatcheries: 22, eggsSet: 91_308_069, hatched: 40_501_315, cockerels: 1_178_787 },
  { year: 2021, hatcheries: 22, eggsSet: 72_721_385, hatched: 29_438_965 },
  { year: 2022, hatcheries: 15, eggsSet: 40_526_538, hatched: 16_228_622, cockerels: 10_592_215 },
  { year: 2023, hatcheries: 11, eggsSet: 47_747_620, hatched: 18_309_737, cockerels: 8_863_538 },
  { year: 2024, hatcheries: 8, eggsSet: 57_851_968, hatched: 20_904_991, cockerels: 4_851_698 },
  { year: 2025, hatcheries: 8, eggsSet: 60_522_947, hatched: 22_751_334, cockerels: 3_068_936 },
]

export interface HenSystem {
  system: string
  hens2015: number
  hens2025: number
}

export const hensBySystem: readonly HenSystem[] = [
  { system: 'Bodenhaltung', hens2015: 25_297_544, hens2025: 25_893_415 },
  { system: 'Freilandhaltung', hens2015: 7_045_920, hens2025: 11_232_047 },
  { system: 'Ökologische Erzeugung', hens2015: 3_760_796, hens2025: 6_699_679 },
  { system: 'Kleingruppen und ausgestaltete Käfige', hens2015: 4_060_403, hens2025: 1_389_874 },
]

export const hens = {
  total2015: 40_164_663,
  total2025: 45_215_015,
  eggs2025: 13_747_005_000,
  eggsPerHen2025: 304,
  farms2025: 2_262,
} as const
