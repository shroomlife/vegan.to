/**
 * Fleischverzehr und Selbstversorgung nach der Versorgungsbilanz Fleisch der
 * BLE, Open-Data-CSV, Datensatz aktualisiert am 01.10.2026, abgerufen am
 * 05.10.2026. Alle Werte mit Datenstand "e" (endgültig), Einheit kg pro Kopf.
 *
 * "Verzehr" ist der Teil, der rechnerisch auf das Essen entfällt. "Verbrauch"
 * enthält zusätzlich Knochen und andere nicht verzehrte Teile des
 * Schlachtkörpers, Verluste, die industrielle Verwendung und die Herstellung
 * von Heimtiernahrung (BLE-Pressemitteilung vom 07.04.2026).
 *
 * Eier: Versorgungsbilanz Eier 2025. Fisch: Versorgungsbilanz Fisch 2025,
 * vorläufig ("v").
 */

export interface ConsumptionYear {
  year: number
  total: number
  pork: number
  poultry: number
  beef: number
  sheepGoat: number
}

export const meatConsumption: readonly ConsumptionYear[] = [
  { year: 2010, total: 62.91, pork: 38.99, poultry: 11.48, beef: 9.62, sheepGoat: 0.63 },
  { year: 2011, total: 63.77, pork: 38.91, poultry: 11.9, beef: 10.18, sheepGoat: 0.74 },
  { year: 2012, total: 61.48, pork: 37.51, poultry: 11.36, beef: 10.05, sheepGoat: 0.62 },
  { year: 2013, total: 61.06, pork: 37.21, poultry: 11.56, beef: 9.89, sheepGoat: 0.61 },
  { year: 2014, total: 61.59, pork: 36.94, poultry: 11.78, beef: 10.12, sheepGoat: 0.58 },
  { year: 2015, total: 61.27, pork: 35.95, poultry: 12.03, beef: 10.49, sheepGoat: 0.61 },
  { year: 2016, total: 60.61, pork: 34.46, poultry: 12.55, beef: 10.88, sheepGoat: 0.66 },
  { year: 2017, total: 61.06, pork: 34.72, poultry: 12.62, beef: 10.96, sheepGoat: 0.66 },
  { year: 2018, total: 61.42, pork: 34.34, poultry: 13.48, beef: 10.83, sheepGoat: 0.72 },
  { year: 2019, total: 59.15, pork: 32.19, poultry: 13.32, beef: 10.85, sheepGoat: 0.69 },
  { year: 2020, total: 57.81, pork: 30.82, poultry: 13.71, beef: 10.8, sheepGoat: 0.75 },
  { year: 2021, total: 57.18, pork: 31.04, poultry: 13.51, beef: 10.34, sheepGoat: 0.58 },
  { year: 2022, total: 52.83, pork: 28.54, poultry: 12.38, beef: 9.6, sheepGoat: 0.64 },
  { year: 2023, total: 52.94, pork: 28.47, poultry: 13.1, beef: 9.32, sheepGoat: 0.62 },
  { year: 2024, total: 53.47, pork: 28.21, poultry: 13.72, beef: 9.46, sheepGoat: 0.56 },
  { year: 2025, total: 54.94, pork: 28.33, poultry: 14.66, beef: 9.74, sheepGoat: 0.64 },
]

/** Verbrauch pro Kopf 2025, kg, alle Fleischarten */
export const meatUsePerCapita2025 = 76.31

/**
 * Selbstversorgungsgrad 2025 in Prozent: Erzeugung im Inland geteilt durch
 * Verbrauch im Inland. Über 100 heißt: Es wird mehr erzeugt als verbraucht.
 * Schlüssel wie die Singulare in animals.ts.
 */
export const selfSufficiency2025: Readonly<Record<string, number>> = {
  Schwein: 138.6,
  Rind: 96.54,
  Huhn: 93.33,
  Truthuhn: 92.09,
  Ente: 42.32,
  Gans: 19.93,
  Schaf: 39.09,
  Ziege: 39.09,
  Pferd: 44.46,
}
export const selfSufficiencyAllMeat2025 = 114.57

export const eggsPerCapita2025 = 251.64
export const eggSelfSufficiency2025 = 71.99

export const fishUsePerCapita2025 = 15
export const fishSelfSufficiency2025 = 17

/** Destatis, Lebenserwartung bei Geburt 2025 */
export const lifeExpectancy2025 = { women: 83.6, men: 79.1 } as const
