/**
 * Every external figure on the site points to one of these sources.
 * Single source of truth for the footer list and the inline source lines.
 * All URLs verified on 2026-09-12.
 */

export const sourceCategories = [
  'Schlachtzahlen',
  'Fische',
  'Dein Impact',
  'Veganer*innen in Deutschland',
  'Alter bei der Schlachtung',
] as const

export type SourceCategory = (typeof sourceCategories)[number]

export interface Source {
  /** Short label as shown to visitors */
  label: string
  url: string
  /** What the source is used for on the site */
  usedFor: string
  category: SourceCategory
}

export const sources = {
  destatisSlaughter: {
    label: 'Destatis, GENESIS 41331-0001: Gewerbliche Schlachtungen 2025',
    url: 'https://www-genesis.destatis.de/datenbank/online/table/41331-0001',
    usedFor: 'Rinder, Schweine, Schafe, Ziegen, Pferde (inländische Herkunft)',
    category: 'Schlachtzahlen',
  },
  destatisPoultry: {
    label: 'Destatis, GENESIS 41322-0001: Geflügelschlachtereien 2025',
    url: 'https://www-genesis.destatis.de/datenbank/online/table/41322-0001',
    usedFor: 'Hühner, Truthühner, Enten, Gänse',
    category: 'Schlachtzahlen',
  },
  fishcount: {
    label: 'fishcount.org.uk: Wildfang Deutschland, Schnitt 2003 bis 2022',
    url: 'https://fishcount.org.uk/estimates/wildfishes/data03/fishcount_global_wild_fish_estimate.php?selyear=2003to2022&selcountry=Germany&selspecies=*+All+species+*',
    usedFor: 'Fische, Schätzung 3,7 bis 5,0 Mrd., hier 4,4 Mrd.',
    category: 'Fische',
  },
  destatisAquaculture: {
    label: 'Destatis, Pressemitteilung 188/26: Aquakultur 2025',
    url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/06/PD26_188_41362.html',
    usedFor: 'Fische aus deutscher Aquakultur, 16.600 t, rund 24 Mio. Tiere',
    category: 'Fische',
  },
  bleLandings: {
    label: 'BLE: Anlandestatistik 2025',
    url: 'https://www.ble.de/SharedDocs/Pressemitteilungen/DE/2026/260701_Anlandestatistik2025.html',
    usedFor: 'Fangmenge der deutschen Fischerei, 173.733 t',
    category: 'Fische',
  },
  scarborough: {
    label: 'Scarborough et al. 2023, Nature Food: Vegans, vegetarians, fish-eaters and meat-eaters in the UK',
    url: 'https://doi.org/10.1038/s43016-023-00795-w',
    usedFor: 'CO2, Land und Wasser pro Tag, Differenz vegan zu mittlerem Fleischkonsum',
    category: 'Dein Impact',
  },
  destatisPopulation: {
    label: 'Destatis, Pressemitteilung 203/26: Bevölkerungsstand Ende 2025',
    url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/06/PD26_203_124.html',
    usedFor: 'Bevölkerung Deutschlands, 83,5 Mio.',
    category: 'Dein Impact',
  },
  uba: {
    label: 'Umweltbundesamt: Emissionsdaten Verkehr 2024',
    url: 'https://www.umweltbundesamt.de/themen/verkehr/emissionsdaten',
    usedFor: 'Rund 230 g CO2e pro Pkw-Kilometer inklusive Vorkette',
    category: 'Dein Impact',
  },
  myclimate: {
    label: 'myclimate Flugrechner',
    url: 'https://co2.myclimate.org/de/flight_calculators/new',
    usedFor: 'Frankfurt nach Mallorca und zurück, Economy, rund 494 kg CO2',
    category: 'Dein Impact',
  },
  bzlAges: {
    label: 'BZL, landwirtschaft.de: Wie lange leben Rind, Schwein, Schaf und Huhn?',
    url: 'https://www.landwirtschaft.de/tier-und-pflanze/tier/nutztiere-allgemein/wie-lange-leben-rind-schwein-schaf-und-huhn',
    usedFor: 'Alter bei der Schlachtung im Ticker',
    category: 'Alter bei der Schlachtung',
  },
  lflCarp: {
    label: 'LfL Bayern: Karpfenteichwirtschaft',
    url: 'https://www.lfl.bayern.de/ifi/karpfenteichwirtschaft/149835/index.php',
    usedFor: 'Alter von Speisekarpfen, drei Sommer',
    category: 'Alter bei der Schlachtung',
  },
  skopos: {
    label: 'SKOPOS 2016: 1,3 Millionen Deutsche leben vegan (mit NVS II 2008)',
    url: 'https://www.skopos-group.de/news/13-millionen-deutsche-leben-vegan.html',
    usedFor: 'Veganer*innen 2008 und 2016',
    category: 'Veganer*innen in Deutschland',
  },
  vebu: {
    label: 'VEBU 2015 via marktmeinungmensch.de',
    url: 'https://www.marktmeinungmensch.de/studien/anzahl-der-veganer-und-vegetarier-in-deutschland-u/',
    usedFor: 'Veganer*innen 2015',
    category: 'Veganer*innen in Deutschland',
  },
  awa: {
    label: 'IfD Allensbach, AWA via Statista',
    url: 'https://de.statista.com/statistik/daten/studie/445155/umfrage/umfrage-in-deutschland-zur-anzahl-der-veganer/',
    usedFor: 'Veganer*innen 2018 bis 2025',
    category: 'Veganer*innen in Deutschland',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof sources

export const sourceList: readonly Source[] = Object.values(sources)
