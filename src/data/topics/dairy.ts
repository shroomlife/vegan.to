/**
 * Milchkühe und Kälber.
 *
 * - Bestand: Destatis 41312-0001, Mai 2026 und Mai 2010 (siehe livestock.ts).
 * - Schlachtungen: Destatis 41331-0001, 2025 (Kühe, Kälber, Färsen in animals.ts).
 * - Produktionsablauf und Kennzahlen: Thünen-Steckbrief Milchkühe 2025,
 *   Abbildung 14 und Tabelle 3 (Kennzahlen nach KTBL 2022 für Holstein bei
 *   mittlerem Leistungsniveau). Haltung und Weidegang: Daten von 2020.
 * - Trächtig geschlachtete Rinder: Bundestag Drucksache 18/12519 (2017),
 *   Antwort zu Frage 11, mit Studien aus den Jahren 2013 bis 2017.
 */
export const dairyModel = {
  milkKgPerYear: 8_500,
  firstInseminationMonths: 15,
  gestationDays: 285,
  firstCalvingMonths: 28.8,
  calvingIntervalDays: 417,
  inseminationAfterCalvingDays: 60,
  lactations: 3,
  replacementPercent: 33,
  calfLossPercent: 5,
  cowLossPercent: 1,
  /** 2020 */
  pastureSharePercent: 31,
  looseHousingSharePercent: 89,
  tieStallFarmsPercent: 35,
  milkTonnes2024: 33_900_000,
} as const

export const calvesMay2026 = { male: 941_988, female: 1_244_878 } as const
export const dairyHoldingsMay2026 = 46_231

/** Drucksache 18/12519, Antwort zu Frage 11 */
export const pregnantSlaughter = {
  signCattleSharePercent: 1.5,
  signCattleBase: 596_500,
  signFemaleSharePercent: 2.6,
  signFemaleBase: 356_000,
  ownStudyMinPercent: 6.4,
  ownStudyMaxPercent: 13,
  ownStudyFemales: 7_005,
  bagHighlyPregnantMinPercent: 0.8,
  bagHighlyPregnantMaxPercent: 2.5,
  bagViableCalves: 19_800,
} as const
