/**
 * Weltweit geschlachtete Landtiere nach FAOSTAT.
 *
 * Quelle: FAO, FAOSTAT Crops and livestock products (QCL), Bulk-Download
 * "Production_Crops_Livestock_E_All_Data_(Normalized)", Datei vom 23.12.2025,
 * Fläche "World" (Code 5000), Element "Producing Animals/Slaughtered",
 * abgerufen am 05.10.2026. Lizenz CC BY 4.0.
 *
 * Geflügel, Kaninchen und Nagetiere meldet die FAO in 1000 Tieren, hier
 * ausmultipliziert. Je Art steht ein Fleisch-Posten ("Meat of chickens,
 * fresh or chilled" usw.). Gegengeprüft: die fünf Geflügelposten ergeben
 * 84.118.567 Tsd., die FAO-Summe "Meat, Poultry" 84.118.568 Tsd. (Rundung).
 * Viele Werte tragen das Kennzeichen "E", also FAO-Schätzung.
 */

export interface WorldSpecies {
  name: string
  emoji: string
  /** Animals slaughtered worldwide per year */
  counts: { 2004: number; 2014: number; 2024: number }
}

export const WORLD_YEAR = 2024

export const worldSpecies: readonly WorldSpecies[] = [
  { name: 'Hühner', emoji: '🐔', counts: { 2004: 45_188_945_000, 2014: 61_854_419_000, 2024: 78_533_923_000 } },
  { name: 'Enten', emoji: '🦆', counts: { 2004: 2_096_025_000, 2014: 2_807_726_000, 2024: 4_227_882_000 } },
  { name: 'Schweine', emoji: '🐷', counts: { 2004: 1_179_075_771, 2014: 1_460_692_661, 2024: 1_493_796_985 } },
  { name: 'Gänse', emoji: '🪿', counts: { 2004: 495_365_000, 2014: 699_482_000, 2024: 803_201_000 } },
  { name: 'Schafe', emoji: '🐑', counts: { 2004: 491_113_877, 2014: 559_474_982, 2024: 703_861_354 } },
  { name: 'Kaninchen und Hasen', emoji: '🐇', counts: { 2004: 684_775_000, 2014: 890_613_000, 2024: 604_235_000 } },
  { name: 'Ziegen', emoji: '🐐', counts: { 2004: 351_239_520, 2014: 465_231_526, 2024: 563_722_557 } },
  { name: 'Truthühner', emoji: '🦃', counts: { 2004: 617_738_000, 2014: 594_129_000, 2024: 504_128_000 } },
  { name: 'Rinder', emoji: '🐄', counts: { 2004: 273_001_293, 2014: 286_273_909, 2024: 304_744_668 } },
  { name: 'andere Nagetiere', emoji: '🐹', counts: { 2004: 65_500_000, 2014: 70_693_000, 2024: 69_257_000 } },
  { name: 'Tauben und andere Vögel', emoji: '🐦', counts: { 2004: 59_612_000, 2014: 57_788_000, 2024: 49_433_000 } },
  { name: 'Büffel', emoji: '🐃', counts: { 2004: 20_676_206, 2014: 26_349_313, 2024: 29_040_868 } },
  { name: 'Pferde', emoji: '🐴', counts: { 2004: 4_782_114, 2014: 4_618_843, 2024: 4_451_641 } },
  { name: 'Kamele', emoji: '🐪', counts: { 2004: 1_720_968, 2014: 2_478_699, 2024: 3_123_404 } },
  { name: 'andere Kameliden', emoji: '🦙', counts: { 2004: 540_000, 2014: 913_060, 2024: 972_619 } },
  { name: 'Esel', emoji: '🫏', counts: { 2004: 2_406_634, 2014: 2_528_614, 2024: 873_452 } },
  { name: 'Maultiere', emoji: '🫏', counts: { 2004: 637_500, 2014: 482_600, 2024: 82_572 } },
]

export function worldTotal(year: keyof WorldSpecies['counts']): number {
  return worldSpecies.reduce((sum, species) => sum + species.counts[year], 0)
}

/**
 * Fische, nur als Schätzspanne: amtlich werden weltweit Tonnen erfasst, keine Tiere.
 * - Wildfang: Mood und Brooke 2024, Mittel der Jahre 2000 bis 2019,
 *   1,1 bis 2,2 Billionen pro Jahr. Ohne illegalen Fang, Rückwürfe und Geisternetze.
 * - Aquakultur: Mood et al. 2023, Jahr 2019, 124 Mrd. (Spanne 78 bis 171 Mrd.).
 *   Ohne Tiere, die während der Aufzucht sterben.
 */
export const worldFish = {
  wild: { min: 1_100_000_000_000, max: 2_200_000_000_000, period: '2000 bis 2019' },
  farmed: { mid: 124_000_000_000, min: 78_000_000_000, max: 171_000_000_000, year: 2019 },
} as const
