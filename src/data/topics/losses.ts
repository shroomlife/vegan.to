/**
 * Tiere, die vor der Schlachtung sterben.
 *
 * - Verendete Rinder laut HI-Tier 2010 bis 2016: Bundestag Drucksache
 *   18/12519 vom 29.05.2017 (Schreiben vom 24.05.2017), Antwort zu Frage 29.
 *   Neuere Werte sind dort nicht enthalten.
 * - TiHo-Studie: untersucht wurden Mast- und Zuchtschweine. Bei etwa 20 Prozent
 *   wäre eine Tötung unumgänglich gewesen, um ihnen Leiden zu ersparen.
 * - Schweine 2016, etwa 13,5 Mio. verendete, eingeschläferte und notgetötete
 *   Tiere: Schätzung nach Große Beilage (2017), zitiert im NaTiMon-Modellbericht Schwein.
 * - TiHo Hannover, Pressemitteilung 16.11.2017: vier Verarbeitungsbetriebe für
 *   tierische Nebenprodukte, Januar bis April 2016, 57 Anlieferungen.
 * - Kennzahlen Thünen-Steckbriefe 2025: Schweine nach InterPIG 2023,
 *   Milchkühe nach KTBL 2022.
 */
export const deadCattleHit: readonly { year: number; count: number }[] = [
  { year: 2010, count: 571_949 },
  { year: 2011, count: 549_123 },
  { year: 2012, count: 527_901 },
  { year: 2013, count: 537_250 },
  { year: 2014, count: 527_721 },
  { year: 2015, count: 547_713 },
  { year: 2016, count: 579_111 },
]

export const deadPigsEstimate2016 = 13_500_000

export const tihoStudy = {
  period: 'Januar bis April 2016',
  plants: 4,
  deliveries: 57,
  fatteningPigsChecked: 485,
  breedingPigsChecked: 147,
  fatteningPigsSufferingPercent: 13.2,
  breedingPigsSufferingPercent: 11.6,
  killingUnavoidablePercent: 20,
  killingUnavoidablePerYear: 1_170_000,
  pigsWithKillingSigns: 165,
  incorrectKillingPercent: 61.8,
} as const

export const modelLosses = {
  pigletsBeforeWeaningPercent: 15,
  sowMortalityPercent: 7,
  calfLossPercent: 5,
  cowLossPercent: 1,
} as const
