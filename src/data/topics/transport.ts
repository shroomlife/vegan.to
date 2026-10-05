/**
 * Tiertransporte.
 *
 * - Exporte lebender Tiere in Drittstaaten: Bundestag Drucksache 21/7484
 *   (03.08.2026), Anlage 1, Tabellen 1 bis 18 (Summenzeilen). Grundlage sind
 *   TRACES-Daten; Angaben ab 2017. Für Geflügel steht 2025 als Summe
 *   29.521.238 Tiere, ohne Angabe der Kategorie.
 * - Fahrzeiten: Verordnung (EG) Nr. 1/2005, Anhang I Kapitel V;
 *   TierSchTrV § 10.
 * - EU-Reform: Kommissionsvorschlag COM(2023) 770, Stand laut Legislative
 *   Train des Europäischen Parlaments vom 20.09.2026.
 */
export interface ExportYear {
  year: number
  cattle: number
  pigs: number
}

export const thirdCountryExports: readonly ExportYear[] = [
  { year: 2017, cattle: 213_886, pigs: 140_626 },
  { year: 2018, cattle: 186_015, pigs: 349_752 },
  { year: 2019, cattle: 138_313, pigs: 1_100_754 },
  { year: 2020, cattle: 104_213, pigs: 598_945 },
  { year: 2021, cattle: 94_017, pigs: 51_027 },
  { year: 2022, cattle: 48_449, pigs: 69_831 },
  { year: 2023, cattle: 38_051, pigs: 56_158 },
  { year: 2024, cattle: 21_209, pigs: 68_769 },
  { year: 2025, cattle: 6_613, pigs: 24_075 },
]

export const poultryExports2025 = 29_521_238
