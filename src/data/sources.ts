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
  'Lebenserwartung',
  'Wer sie sind',
  'Wie sie lebten',
  'Ernährung und Umwelt',
  'Weltweit',
  'Tierbestand',
  'Haltung und Produktion',
  'Verbrauch',
  'Küken und Legehennen',
  'Milchkühe und Kälber',
  'Gesetze und Bundestag',
  'Tod vor der Schlachtung',
  'Betäubung',
  'Tierschutz im Vergleich',
  'Zeitreise',
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
    label: 'Destatis, GENESIS 41331-0001: Gewerbliche Schlachtungen 1993 bis 2025',
    url: 'https://www-genesis.destatis.de/datenbank/online/table/41331-0001',
    usedFor: 'Rinder, Schweine, Schafe, Ziegen, Pferde (inländische Herkunft), Jahreswert und Zeitreihe; Schlachtungen nach Herkunft, Hausschlachtungen und Schlachtmenge 2025',
    category: 'Schlachtzahlen',
  },
  destatisPoultry: {
    label: 'Destatis, GENESIS 41322-0001: Geflügelschlachtereien 2010 bis 2025',
    url: 'https://www-genesis.destatis.de/datenbank/online/table/41322-0001',
    usedFor: 'Hühner, Truthühner, Enten, Gänse, Jahreswert und Zeitreihe',
    category: 'Schlachtzahlen',
  },
  destatisSlaughterMonthly: {
    label: 'Destatis, GENESIS 41331-0002: Geschlachtete Tiere nach Monaten',
    url: 'https://genesis.destatis.de/datenbank/online/table/41331-0002',
    usedFor: 'Schweine, Rinder und Lämmer Monat für Monat, 2025 endgültig, Januar bis Juli 2026 vorläufig',
    category: 'Schlachtzahlen',
  },
  destatisSlaughterStates: {
    label: 'Destatis, GENESIS 41331-0003: Geschlachtete Tiere nach Bundesländern',
    url: 'https://genesis.destatis.de/datenbank/online/table/41331-0003',
    usedFor: 'Schweine, Rinder, Schafe und Lämmer inländischer Herkunft je Bundesland, 2025',
    category: 'Schlachtzahlen',
  },
  destatisPoultryMonthly: {
    label: 'Destatis, GENESIS 41322-0002: Geflügelschlachtereien nach Monaten',
    url: 'https://genesis.destatis.de/datenbank/online/table/41322-0002',
    usedFor: 'Geflügel und Gänse Monat für Monat, 2025',
    category: 'Schlachtzahlen',
  },
  destatisPoultryStates: {
    label: 'Destatis, GENESIS 41322-0009: Geflügelschlachtereien nach Bundesländern',
    url: 'https://genesis.destatis.de/datenbank/online/table/41322-0009',
    usedFor: 'Geschlachtetes Geflügel je Bundesland, 2025',
    category: 'Schlachtzahlen',
  },
  destatisMeatPress2025: {
    label: 'Destatis, Pressemitteilung 049/26: Fleischproduktion 2025',
    url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/02/PD26_049_413.html',
    usedFor: '6,9 Mio. Tonnen Fleisch 2025, Höchststand 2016 mit 8,3 Mio. Tonnen, 17,0 Prozent darunter',
    category: 'Schlachtzahlen',
  },
  destatisMeatPressH1: {
    label: 'Destatis, Pressemitteilung 281/26 (Korrektur): Fleischproduktion im 1. Halbjahr 2026',
    url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/08/PD26_281_413.html',
    usedFor: 'Knapp 3,4 Mio. Tonnen Fleisch, 24,0 Mio. Schweine, Rinder, Schafe, Ziegen und Pferde sowie 343,2 Mio. Hühner, Puten und Enten',
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
    usedFor: 'Frankfurt nach Mallorca und zurück, Economy, rund 618 kg CO2',
    category: 'Dein Impact',
  },
  bzlAges: {
    label: 'BZL, landwirtschaft.de: Wie lange leben Rind, Schwein, Schaf und Huhn?',
    url: 'https://www.landwirtschaft.de/tier-und-pflanze/tier/nutztiere-allgemein/wie-lange-leben-rind-schwein-schaf-und-huhn',
    usedFor: 'Alter bei der Schlachtung im Ticker; Lebenserwartung Huhn, Schwein, Schaf, Ziege, Rind; Milchkühe im Schnitt 5,5 Jahre',
    category: 'Alter bei der Schlachtung',
  },
  vierPfotenRinder: {
    label: 'Vier Pfoten: Lebenserwartung von Rindern',
    url: 'https://www.vier-pfoten.de/kampagnen-themen/themen/nutztiere/rinder/lebenserwartung-von-rindern',
    usedFor: 'Rind, einzelne Rinder erreichen 20 Jahre',
    category: 'Lebenserwartung',
  },
  vierPfotenSchweine: {
    label: 'Vier Pfoten: Lebenserwartung von Schweinen',
    url: 'https://www.vier-pfoten.de/kampagnen-themen/themen/nutztiere/schweine/lebenserwartung-von-schweinen',
    usedFor: 'Schwein, natürliche Lebenserwartung 10 Jahre',
    category: 'Lebenserwartung',
  },
  vierPfotenGaense: {
    label: 'Vier Pfoten: Lebenserwartung von Gänsen',
    url: 'https://www.vier-pfoten.de/kampagnen-themen/themen/nutztiere/gaense/lebenserwartung-von-gaensen',
    usedFor: 'Gans, natürliche Lebenserwartung 15 Jahre',
    category: 'Lebenserwartung',
  },
  tierschutzbundPuten: {
    label: 'Deutscher Tierschutzbund, jugendtierschutz.de: Puten',
    url: 'https://www.jugendtierschutz.de/tierwissen/tiere-in-der-landwirtschaft/puten/',
    usedFor: 'Truthuhn, natürliche Lebenserwartung 10 Jahre',
    category: 'Lebenserwartung',
  },
  vgtLebenserwartung: {
    label: 'VGT: Lebenserwartung von Nutztieren',
    url: 'https://vgt.at/presse/news/2020/news20201112ih.php',
    usedFor: 'Ente, natürliche Lebenserwartung 6 bis 8 Jahre',
    category: 'Lebenserwartung',
  },
  allianzPferde: {
    label: 'Allianz: Wie alt werden Pferde?',
    url: 'https://www.allianz.de/gesundheit/pferdekrankenversicherung/wie-alt-werden-pferde/',
    usedFor: 'Pferd, Lebenserwartung 20 bis 35 Jahre',
    category: 'Lebenserwartung',
  },
  fishbaseSprotte: {
    label: 'FishBase: Sprattus sprattus',
    url: 'https://www.fishbase.se/summary/Sprattus-sprattus.html',
    usedFor: 'Fisch, Höchstalter der Sprotte 6 Jahre',
    category: 'Lebenserwartung',
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

  // Wer sie sind
  marinoChicken: {
    label: 'Marino 2017, Animal Cognition: Thinking chickens',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5306232/',
    usedFor: 'Hühner: mindestens 24 Lautäußerungen, Wiedererkennen von Artgenossen, emotionale Ansteckung',
    category: 'Wer sie sind',
  },
  marinoPigs: {
    label: 'Marino und Colvin 2015, Int. J. Comp. Psychology: Thinking pigs',
    url: 'https://www.wellbeingintlstudiesrepository.org/acwp_asie/43/',
    usedFor: 'Schweine: kognitiv komplex, viele Eigenschaften mit als klug geltenden Tieren gemeinsam',
    category: 'Wer sie sind',
  },
  mclennanCattle: {
    label: 'McLennan 2013, University of Northampton: Social bonds in dairy cattle',
    url: 'https://pure.northampton.ac.uk/en/studentTheses/social-bonds-in-dairy-cattle-the-effect-of-dynamic-group-systems--2/',
    usedFor: 'Rinder: niedrigere Herzfrequenz mit der bevorzugten Partnerin',
    category: 'Wer sie sind',
  },
  assPuten: {
    label: 'Albert Schweitzer Stiftung: Puten in der Massentierhaltung',
    url: 'https://albert-schweitzer-stiftung.de/massentierhaltung/puten',
    usedFor: 'Truthühner: keine artspezifischen gesetzlichen Vorgaben, Eckwerte 52 bis 58 kg/m²',
    category: 'Wer sie sind',
  },
  martinhoDucks: {
    label: 'Martinho und Kacelnik 2016, Science, via ScienceDaily',
    url: 'https://www.sciencedaily.com/releases/2016/07/160714151856.htm',
    usedFor: 'Enten: Küken lernen das Konzept gleich oder verschieden ohne Training',
    category: 'Wer sie sind',
  },
  knolleSheep: {
    label: 'Knolle et al. 2017, Royal Society Open Science, via University of Cambridge',
    url: 'https://www.cam.ac.uk/research/news/sheep-are-able-to-recognise-human-faces-from-photographs',
    usedFor: 'Schafe: erkennen Gesichter auf Fotos, auch den eigenen Betreuer',
    category: 'Wer sie sind',
  },
  nawrothGoats: {
    label: 'Nawroth et al. 2016, Biology Letters',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4971169/',
    usedFor: 'Ziegen: suchen bei unlösbaren Aufgaben den Blick des Menschen',
    category: 'Wer sie sind',
  },
  smithHorses: {
    label: 'Smith et al. 2016, Biology Letters, via University of Sussex',
    url: 'https://blogs.sussex.ac.uk/psychology/2016/04/04/horses-read-human-facial-expressions-of-emotion-sussex-research/',
    usedFor: 'Pferde: reagieren auf wütende Menschengesichter mit Linksblick und Puls',
    category: 'Wer sie sind',
  },
  klfGeese: {
    label: 'Konrad-Lorenz-Forschungsstelle, Universität Wien: Graugänse',
    url: 'https://klf.univie.ac.at/de/forschung/modellarten/graugaense/',
    usedFor: 'Gänse: lebenslang zusammenbleibende Paare',
    category: 'Wer sie sind',
  },
  wascherGeese: {
    label: 'Wascher et al. 2017, Behavioural Processes, via ORF',
    url: 'https://science.orf.at/v2/stories/2853953/',
    usedFor: 'Gänse: zwei Tage Trennung vom Partner erhöhen die Stresshormone',
    category: 'Wer sie sind',
  },
  sneddonFish: {
    label: 'Sneddon 2019, Phil. Trans. R. Soc. B, via University of Liverpool',
    url: 'https://news.liverpool.ac.uk/2019/09/25/fish-experience-pain-with-striking-similarity-to-mammals/',
    usedFor: 'Fische: Schmerzverhalten, das mit Schmerzmittel ausbleibt',
    category: 'Wer sie sind',
  },

  // Wie sie lebten
  tierSchNutztV19: {
    label: 'TierSchNutztV § 19: Masthühner',
    url: 'https://www.gesetze-im-internet.de/tierschnutztv/__19.html',
    usedFor: 'Besatzdichte zu keinem Zeitpunkt über 39 kg/m²',
    category: 'Wie sie lebten',
  },
  assMasthuehner: {
    label: 'Albert Schweitzer Stiftung: Masthühner',
    url: 'https://albert-schweitzer-stiftung.de/massentierhaltung/huehner/masthuehner',
    usedFor: 'Rund 24 Tiere pro m², Mastdauer 29 bis 42 Tage, 1950er: 101 Tage für 1,8 kg, heute 32',
    category: 'Wie sie lebten',
  },
  tierSchNutztV29: {
    label: 'TierSchNutztV § 29: Mastschweine',
    url: 'https://www.gesetze-im-internet.de/tierschnutztv/__29.html',
    usedFor: '0,75 m² pro Schwein zwischen 50 und 110 kg',
    category: 'Wie sie lebten',
  },
  assMastschweine: {
    label: 'Albert Schweitzer Stiftung: Mastschweine',
    url: 'https://albert-schweitzer-stiftung.de/massentierhaltung/schweine/mastschweine',
    usedFor: '96 Prozent der Mastplätze mit Spaltenboden',
    category: 'Wie sie lebten',
  },
  tierSchNutztV30: {
    label: 'TierSchNutztV § 30 und § 45: Sauen, Übergangsfristen',
    url: 'https://www.gesetze-im-internet.de/tierschnutztv/__30.html',
    usedFor: 'Fixierung um die Geburt längstens fünf Tage, Übergang für den Abferkelbereich bis 2036',
    category: 'Wie sie lebten',
  },
  tierSchG4c: {
    label: 'TierSchG § 4c: Verbot des Kükentötens',
    url: 'https://www.gesetze-im-internet.de/tierschg/__4c.html',
    usedFor: 'Verbot seit 2022',
    category: 'Wie sie lebten',
  },
  bmlehInOvo: {
    label: 'BMLEH: Ausstieg aus dem Kükentöten',
    url: 'https://www.bmleh.de/DE/themen/tiere/tierschutz/tierwohl-forschung-in-ovo.html',
    usedFor: 'Rund 40 Millionen getötete Küken pro Jahr vor dem Verbot',
    category: 'Wie sie lebten',
  },
  agrarheuteCo2: {
    label: 'agrarheute: Kritik an der CO2-Betäubung nimmt zu',
    url: 'https://www.agrarheute.com/tier/schwein/tierwohl-beim-schlachten-kritik-co2-betaeubung-nimmt-614062',
    usedFor: 'CO2-Betäubung in 90 Prozent der großen Schlachtbetriebe, geschätzt 34 Mio. Schweine, Wahrnehmungslosigkeit erst nach 20 bis 30 Sekunden',
    category: 'Wie sie lebten',
  },
  dgsWaterbath: {
    label: 'DGS Magazin: Betäubung bei der Schlachtung, Gas versus Elektrowasserbad',
    url: 'https://www.dgs-magazin.de/aktuelles/news/article-7961925-4627/betaeubung-bei-der-schlachtung-gas-versus-elektrowasserbad-.html',
    usedFor: 'Knapp eine Minute kopfüber bei Bewusstsein vor dem Elektrowasserbad',
    category: 'Wie sie lebten',
  },
  euTransport: {
    label: 'Verordnung (EG) Nr. 1/2005, Anhang I Kapitel V: Tiertransporte',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32005R0001',
    usedFor: 'Grundregel 8 Stunden, mit zugelassenen Fahrzeugen Schweine 24 Stunden, Rinder 14 + 1 + 14 Stunden',
    category: 'Wie sie lebten',
  },
  assEnten: {
    label: 'Albert Schweitzer Stiftung: Enten',
    url: 'https://albert-schweitzer-stiftung.de/massentierhaltung/enten',
    usedFor: 'Pekingenten: 6 bis 7 Wochen Mast, praktisch ohne Badewasser',
    category: 'Wie sie lebten',
  },

  // Ernährung und Umwelt
  dge2024: {
    label: 'DGE 2024: Positionspapier zu veganer Ernährung',
    url: 'https://www.dge.de/presse/meldungen/2024/positionspapier-zu-veganer-ernaehrung/',
    usedFor: 'Vegan kann für gesunde Erwachsene gesundheitsfördernd sein, mit Vitamin B12',
    category: 'Ernährung und Umwelt',
  },
  academyNutrition: {
    // The 2016 position ("all stages of the life cycle") expired on 2021-12-31
    // and the 2025 replacement is deliberately limited to adults.
    label: 'Academy of Nutrition and Dietetics 2025: Vegetarian Dietary Patterns for Adults',
    url: 'https://www.andeal.org/files/files/Vegetarian/VegetarianPP_2025.pdf',
    usedFor: 'Bei Erwachsenen nährstoffdeckend und mit langfristigem Nutzen, gut geplant',
    category: 'Ernährung und Umwelt',
  },
  bzlFeedArea: {
    label: 'BZL, landwirtschaft.de: Was wächst auf Deutschlands Feldern?',
    url: 'https://www.landwirtschaft.de/tier-und-pflanze/pflanze/nutzpflanzen-allgemein/was-waechst-auf-deutschlands-feldern',
    usedFor: '9,2 Mio. Hektar, 55 Prozent der Agrarfläche, für Futter',
    category: 'Ernährung und Umwelt',
  },
  bleGrain: {
    label: 'BLE: Getreidebilanz 2024/25',
    url: 'https://www.ble.de/SharedDocs/Pressemitteilungen/DE/2025/251211_Getreidebilanz.html',
    usedFor: '50 Prozent des Getreides als Futter, 23 Prozent als Nahrung',
    category: 'Ernährung und Umwelt',
  },
  ubaAgriculture: {
    label: 'Umweltbundesamt: Beitrag der Landwirtschaft zu den Treibhausgas-Emissionen',
    url: 'https://www.umweltbundesamt.de/daten/umweltzustand-trends/land-forstwirtschaft/beitrag-der-landwirtschaft-zu-den-treibhausgas',
    usedFor: '2025: 53,3 Mio. t CO2-Äq, 8,2 Prozent der Emissionen, 64,5 Prozent davon aus der Tierhaltung',
    category: 'Ernährung und Umwelt',
  },
  whoMeat: {
    label: 'WHO/IARC: Carcinogenicity of red and processed meat',
    url: 'https://www.who.int/news-room/questions-and-answers/item/cancer-carcinogenicity-of-the-consumption-of-red-meat-and-processed-meat',
    usedFor: 'Verarbeitetes Fleisch Gruppe 1, rotes Fleisch 2A (Einstufung; die 18 Prozent stehen seit der Überarbeitung vom 23.09.2026 nur noch in den IARC-Dokumenten)',
    category: 'Ernährung und Umwelt',
  },
  eatLancet: {
    label: 'EAT-Lancet Commission 2019: Summary Report',
    url: 'https://eatforum.org/wp-content/uploads/2025/09/EAT-Lancet_Commission_Summary_Report.pdf',
    usedFor: 'Ernährung als stärkster Hebel für Gesundheit und Umwelt',
    category: 'Ernährung und Umwelt',
  },
  schweitzer: {
    label: 'Albert Schweitzer, Die Ehrfurcht vor dem Leben (Hrsg. Bähr 1991), zitiert nach der Albert Schweitzer Stiftung',
    url: 'https://albert-schweitzer-stiftung.de/aktuell/jubilaeum-albert-schweitzers-ehrfurcht-vor-dem-leben',
    usedFor: 'Zitat zur Ehrfurcht vor dem Leben',
    category: 'Ernährung und Umwelt',
  },

  // Tierbestand
  destatisCattleStock: {
    label: 'Destatis, GENESIS 41312-0001: Rinder nach Kategorien, Stichmonate Mai und November',
    url: 'https://genesis.destatis.de/datenbank/online/table/41312-0001',
    usedFor: 'Rinder, Milchkühe und Kälber im Mai 2026, Haltungen mit Rindern, Vergleich mit Mai 2010',
    category: 'Tierbestand',
  },
  destatisCattleStockStates: {
    label: 'Destatis, GENESIS 41312-0010: Rinder nach Bundesländern',
    url: 'https://genesis.destatis.de/datenbank/online/table/41312-0010',
    usedFor: 'Rinderbestand je Bundesland, Mai 2026',
    category: 'Tierbestand',
  },
  destatisPigStock: {
    label: 'Destatis, GENESIS 41313-0001: Schweine nach Kategorien, Stichmonate Mai und November',
    url: 'https://genesis.destatis.de/datenbank/online/table/41313-0001',
    usedFor: 'Schweine, Ferkel, Mastschweine und Zuchtsauen im Mai 2026 und November 2025, Betriebe, Vergleich mit Mai 2010',
    category: 'Tierbestand',
  },
  destatisPigStockStates: {
    label: 'Destatis, GENESIS 41313-0010: Schweine nach Bundesländern',
    url: 'https://genesis.destatis.de/datenbank/online/table/41313-0010',
    usedFor: 'Schweinebestand je Bundesland, Mai 2026',
    category: 'Tierbestand',
  },
  destatisSheepStock: {
    label: 'Destatis, GENESIS 41314-0001: Schafe nach Kategorien, Stichmonat November',
    url: 'https://genesis.destatis.de/datenbank/online/table/41314-0001',
    usedFor: 'Schafe und Betriebe mit Schafhaltung im November 2025, Vergleich mit November 2011',
    category: 'Tierbestand',
  },
  destatisFarmCensus: {
    label: 'Destatis, GENESIS 41141-0004: Viehbestand in landwirtschaftlichen Betrieben, Stichtag 1. März 2023',
    url: 'https://genesis.destatis.de/datenbank/online/table/41141-0004',
    usedFor: 'Hühner, Legehennen, Masthühner, Truthühner, Enten, Ziegen und Einhufer, Agrarstrukturerhebung 2023',
    category: 'Tierbestand',
  },
  destatisQualityCattle: {
    label: 'Destatis, Qualitätsbericht: Erhebung über die Rinderbestände',
    url: 'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Land-Forstwirtschaft-Fischerei/viehbestand-rinder.pdf',
    usedFor: 'Rinderbestand als vollständige Auswertung von HI-Tier, dem zentralen Herkunftsregister für Rinder',
    category: 'Tierbestand',
  },
  destatisQualityPigs: {
    label: 'Destatis, Qualitätsbericht: Erhebung über die Schweinebestände',
    url: 'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Land-Forstwirtschaft-Fischerei/viehbestand-schweine.pdf',
    usedFor: 'Schweinebestand: Stichprobe in Betrieben ab 50 Schweinen oder 10 Zuchtsauen, hochgerechnet',
    category: 'Tierbestand',
  },
  destatisQualitySheep: {
    label: 'Destatis, Qualitätsbericht: Erhebung über die Schafbestände',
    url: 'https://www.destatis.de/DE/Methoden/Qualitaet/Qualitaetsberichte/Land-Forstwirtschaft-Fischerei/viehbestand-schafe.pdf',
    usedFor: 'Schafbestand: Stichprobe in Betrieben ab 20 Schafen, hochgerechnet',
    category: 'Tierbestand',
  },

  // Haltung und Produktion
  thuenenPigs: {
    label: 'Thünen-Institut 2025: Steckbriefe zur Tierhaltung in Deutschland, Ferkelerzeugung und Schweinemast',
    url: 'https://www.thuenen.de/media/ti-themenfelder/Nutztierhaltung_und_Aquakultur/Haltungsverfahren_in_Deutschland/Schweinehaltung/Steckbrief_Schweine_2025.pdf',
    usedFor: 'Kennzahlen 2023 nach InterPIG: Mastdauer 106 Tage, 2,94 Durchgänge je Mastplatz, 15 Prozent Saugferkelverluste, 7 Prozent Sauenmortalität',
    category: 'Haltung und Produktion',
  },
  thuenenPoultry: {
    label: 'Thünen-Institut 2025: Steckbriefe zur Tierhaltung in Deutschland, Mastgeflügel',
    url: 'https://www.thuenen.de/media/ti-themenfelder/Nutztierhaltung_und_Aquakultur/Haltungsverfahren_in_Deutschland/Mastgefluegel/Steckbrief_Mastgefluegel_2025.pdf',
    usedFor: 'Durchgänge pro Jahr: Hähnchen 7 bis 8, Enten 6,5, Gänse 2,6, Truthühner 2,2 bis 2,9; Mastdauer und Verluste in der Hähnchenmast',
    category: 'Haltung und Produktion',
  },

  // Verbrauch
  bleMeatBalance: {
    label: 'BLE Open Data: Versorgungsbilanz Fleisch 2010 bis 2025 (Datenlizenz Deutschland Zero 2.0)',
    url: 'https://open-data.ble.de/dataset/versorgungsbilanz-fleisch',
    usedFor: 'Verzehr und Verbrauch pro Kopf nach Fleischart, Selbstversorgungsgrade 2025',
    category: 'Verbrauch',
  },
  bleMeatPress: {
    label: 'BLE, Pressemitteilung vom 7. April 2026: Fleischbilanz 2025',
    url: 'https://www.ble.de/SharedDocs/Pressemitteilungen/DE/2026/260407_Fleischbilanz.html',
    usedFor: 'Verzehr 54,9 kg pro Kopf; Verbrauch enthält auch Knochen und andere nicht verzehrte Teile des Schlachtkörpers, Verluste, die industrielle Verwendung und die Herstellung von Heimtiernahrung',
    category: 'Verbrauch',
  },
  bleEggBalance: {
    label: 'BLE Open Data: Versorgungsbilanz Eier',
    url: 'https://open-data.ble.de/dataset/versorgungsbilanz-eier',
    usedFor: '251,64 Eier pro Kopf 2025, Selbstversorgungsgrad 72 Prozent',
    category: 'Verbrauch',
  },
  bleFishBalance: {
    label: 'BLE Open Data: Versorgungsbilanz Fisch',
    url: 'https://open-data.ble.de/dataset/versorgungsbilanz-fisch',
    usedFor: 'Fisch 2025, vorläufig: 15 kg Verbrauch pro Kopf, Selbstversorgungsgrad 17 Prozent',
    category: 'Verbrauch',
  },
  destatisLifeExpectancy: {
    label: 'Destatis, Pressemitteilung 236/26: Lebenserwartung bei Geburt 2025',
    url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/07/PD26_236_12621.html',
    usedFor: 'Lebenserwartung bei Geburt 2025: Frauen 83,6 Jahre, Männer 79,1 Jahre',
    category: 'Verbrauch',
  },

  // Küken und Legehennen
  destatisHatcheries: {
    label: 'Destatis, GENESIS 41321-0001: Brütereien, eingelegte Bruteier, geschlüpfte Küken',
    url: 'https://genesis.destatis.de/datenbank/online/table/41321-0001',
    usedFor: 'Brütereien für Legerassen, eingelegte Bruteier und geschlüpfte Küken von Legerassen, aussortierte Hahnenküken, 2015 bis 2025',
    category: 'Küken und Legehennen',
  },
  destatisLayingHens: {
    label: 'Destatis, GENESIS 41323-0001: Legehennen und erzeugte Eier nach Haltungsform',
    url: 'https://genesis.destatis.de/datenbank/online/table/41323-0001',
    usedFor: 'Legehennen im Jahresschnitt 2015 und 2025 nach Haltungsform, Betriebe von Unternehmen mit mindestens 3.000 Hennenplätzen',
    category: 'Küken und Legehennen',
  },
  destatisEggPress: {
    label: 'Destatis, Pressemitteilung 086/26: Eierproduktion 2025',
    url: 'https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/03/PD26_086_413.html',
    usedFor: '13,7 Mrd. Eier, 304 Eier je Henne; Kleingruppenhaltung und ausgestaltete Käfige regulär nur noch bis Ende 2025, Härtefälle bis Ende 2028',
    category: 'Küken und Legehennen',
  },
  bregChicks: {
    label: 'Bundesregierung: Verbot des Kükentötens reformiert',
    url: 'https://www.bundesregierung.de/breg-de/aktuelles/toetung-von-huehnerembryonen-2187950',
    usedFor: 'Seit 1. Januar 2024 gilt der 13. statt des 7. Bebrütungstags, begründet mit dem Schmerzempfinden der Embryonen',
    category: 'Küken und Legehennen',
  },
  bzlChicks: {
    label: 'BZL, landwirtschaft.de: Was ist seit dem Verbot vom Kükentöten passiert?',
    url: 'https://www.landwirtschaft.de/tier-und-pflanze/tier/gefluegel/was-ist-seit-dem-verbot-vom-kuekentoeten-passiert',
    usedFor: 'Vor dem Verbot etwa 45 Mio. getötete Küken pro Jahr; Bruderhähne 2022 und 2024; Brütereien halbiert; Junghennen aus dem Ausland',
    category: 'Küken und Legehennen',
  },

  // Milchkühe und Kälber
  thuenenDairy: {
    label: 'Thünen-Institut 2025: Steckbriefe zur Tierhaltung in Deutschland, Milchkühe',
    url: 'https://www.thuenen.de/media/ti-themenfelder/Nutztierhaltung_und_Aquakultur/Haltungsverfahren_in_Deutschland/Milchviehhaltung/Steckbrief_Milchkuehe_2025.pdf',
    usedFor: 'Produktionsablauf und Kennzahlen: Erstkalbealter 28,8 Monate, Zwischenkalbezeit (Abstand zwischen zwei Geburten) 417 Tage, 3 Laktationen, 33 Prozent Remontierung (Herdenerneuerung), 5 Prozent Kälberverluste; 31 Prozent Weidegang, 89 Prozent Laufstall (2020)',
    category: 'Milchkühe und Kälber',
  },
  bzlCalves: {
    label: 'BZL, landwirtschaft.de: Was passiert mit den Kälbern von Milchkühen?',
    url: 'https://www.landwirtschaft.de/tier-und-pflanze/tier/rinder/was-passiert-mit-den-kaelbern-von-milchkuehen',
    usedFor: 'Trennung wenige Stunden nach der Geburt, Abgabe nach wenigen Wochen, Niederlande als wichtigster Abnehmer, Schlachtalter',
    category: 'Milchkühe und Kälber',
  },
  tierSchTrV10: {
    label: 'TierSchTrV § 10: Begrenzung von Transporten',
    url: 'https://www.gesetze-im-internet.de/tierschtrv_2009/__10.html',
    usedFor: 'Innerstaatlich zum Schlachthof höchstens 8 Stunden, bei über 30 Grad 4,5 Stunden; Kälber unter 28 Tagen dürfen innerstaatlich nicht befördert werden',
    category: 'Gesetze und Bundestag',
  },
  btDrs18_12519: {
    label: 'Deutscher Bundestag, Drucksache 18/12519 (29. Mai 2017): Antwort der Bundesregierung, Tierschutz bei der Tötung von Nutztieren',
    url: 'https://dserver.bundestag.de/btd/18/125/1812519.pdf',
    usedFor: 'Trächtig geschlachtete Rinder; Fehlbetäubungen bei Rindern und Schweinen; tote Rinder laut HI-Tier 2010 bis 2016',
    category: 'Gesetze und Bundestag',
  },
  btDrs21_7484: {
    label: 'Deutscher Bundestag, Drucksache 21/7484 (3. August 2026): Antwort der Bundesregierung zu Tiertransporten in Drittstaaten',
    url: 'https://dserver.bundestag.de/btd/21/074/2107484.pdf',
    usedFor: 'Exporte lebender Rinder, Schweine und Geflügel in Drittstaaten 2017 bis 2025; keine Daten zu Kälbertransporten; EFSA-Mindestalter 5 Wochen; Vorhaben VerLak und MiKuWi',
    category: 'Gesetze und Bundestag',
  },
  epTransportReform: {
    label: 'Europäisches Parlament, Legislative Train: Revision of EU legislation on animal welfare (Transport, COM(2023) 770)',
    url: 'https://www.europarl.europa.eu/legislative-train/theme-a-european-green-deal/file-revision-of-eu-legislation-on-animal-welfare',
    usedFor: 'Vorschlag vom 7. Dezember 2023: Schlachttiere höchstens 9 Stunden, andere Tiere 21 Stunden; Stand September 2026: noch nicht beschlossen',
    category: 'Gesetze und Bundestag',
  },
  tierErzHaVerbG4: {
    label: 'Tiererzeugnisse-Handels-Verbotsgesetz § 4: Trächtige Tiere',
    url: 'https://www.gesetze-im-internet.de/khfeverbg/__4.html',
    usedFor: 'Verbot, Säugetiere außer Schafen und Ziegen im letzten Drittel der Trächtigkeit zur Schlachtung abzugeben, seit 1. September 2017',
    category: 'Gesetze und Bundestag',
  },
  btDrs21_4071: {
    label: 'Deutscher Bundestag, Drucksache 21/4071 (10. Februar 2026): Antwort der Bundesregierung zur Mortalität landwirtschaftlich gehaltener Tiere',
    url: 'https://dserver.bundestag.de/btd/21/040/2104071.pdf',
    usedFor: 'Die Bundesregierung hat keine Zahlen zu verendeten oder getöteten Nutztieren; das Ziel einer Rechtsgrundlage für die Kontrolle toter Tiere steht im Koalitionsvertrag und wird in der Anfrage zitiert',
    category: 'Gesetze und Bundestag',
  },

  // Tod vor der Schlachtung
  natimonPigs: {
    label: 'Nationales Tierwohl-Monitoring (NaTiMon): Modellbericht Schwein, gefördert vom BMEL, Projekt 2019 bis 2023',
    url: 'https://www.nationales-tierwohl-monitoring.de/fileadmin/nationales_tierwohl_monitoring/Berichte/Modellberichte/Tierwohl-Modellbericht-Schwein.pdf',
    usedFor: 'Verendete, eingeschläferte und notgetötete Schweine werden nicht zentral erfasst; Schätzung für 2016: etwa 13,5 Millionen',
    category: 'Tod vor der Schlachtung',
  },
  tihoPigs: {
    label: 'Tierärztliche Hochschule Hannover, Pressemitteilung vom 16. November 2017: Untersuchungen an verendeten und getöteten Schweinen',
    url: 'https://www.tiho-hannover.de/universitaet/aktuelles-veroeffentlichungen/pressemitteilungen/detail/untersuchungen-an-verendeten-getoeteten-schweinen-in-verarbeitungsbetrieben-fuer-tierische-nebenprodukte',
    usedFor: '13,2 Prozent der Mastschweine und 11,6 Prozent der Sauen mit erheblichen Schmerzen oder Leiden; etwa 1,17 Mio. Schweine pro Jahr hätten früher getötet werden müssen; 61,8 Prozent fehlerhafte Tötungen',
    category: 'Tod vor der Schlachtung',
  },
  btDrs17_10021: {
    label: 'Deutscher Bundestag, Drucksache 17/10021 (15. Juni 2012): Antwort der Bundesregierung, Tierschutz bei der Tötung von Schlachttieren',
    url: 'https://dserver.bundestag.de/btd/17/100/1710021.pdf',
    usedFor: 'Fehlbetäubungen: Schweine 10,9 bis 12,5 Prozent bei Handzangen, 3,3 Prozent automatisch; Rinder 4 bis über 9 Prozent; Reaktionen vor dem Brühen bei 0,1 bis 1 Prozent',
    category: 'Gesetze und Bundestag',
  },
  btDrs21_6809: {
    label: 'Deutscher Bundestag, Drucksache 21/6809 (1. Juli 2026): Gesetzentwurf der Bundesregierung zur Videoüberwachung in Schlachthöfen',
    url: 'https://dserver.bundestag.de/btd/21/068/2106809.pdf',
    usedFor: 'Pflicht zur Videoaufzeichnung in Schlachtbetrieben mit Tierschutzbeauftragtem, Speicherung für 30 Schlachttage',
    category: 'Gesetze und Bundestag',
  },

  // Betäubung
  tierSchlVAnlage1: {
    label: 'Tierschutz-Schlachtverordnung, Anlage 1: Betäubungs- und Tötungsverfahren',
    url: 'https://www.gesetze-im-internet.de/tierschlv_2013/anlage_1.html',
    usedFor: 'CO2 nur für Schweine und Puten zur Schlachtung, mindestens 100 Sekunden; Bolzenschuss nicht in den Hinterkopf; 120 mA im Wasserbad für Hühner',
    category: 'Betäubung',
  },
  efsaPigs2020: {
    label: 'EFSA 2020: Welfare of pigs at slaughter, EFSA Journal 18(6):6148',
    url: 'https://doi.org/10.2903/j.efsa.2020.6148',
    usedFor: 'CO2 über 80 Prozent ist stark belastend, verursacht Schmerz, Angst und Atemnot und sollte durch weniger belastende Gasgemische ersetzt werden',
    category: 'Betäubung',
  },

  // Tierschutz im Vergleich
  eugh336_19: {
    label: 'Europäischer Gerichtshof, Urteil vom 17. Dezember 2020, C-336/19',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:62019CJ0336',
    usedFor: 'Mitgliedstaaten dürfen auch bei religiöser Schlachtung eine umkehrbare Betäubung vorschreiben',
    category: 'Tierschutz im Vergleich',
  },
  itChicks: {
    label: 'Italien, Decreto legislativo 7 dicembre 2023, n. 205',
    url: 'https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2023-12-07;205',
    usedFor: 'Verbot des Tötens männlicher Küken ab 31. Dezember 2026',
    category: 'Tierschutz im Vergleich',
  },
  defraStrategy2025: {
    label: 'Defra, 22. Dezember 2025: Animal Welfare Strategy for England',
    url: 'https://defrafarming.blog.gov.uk/2025/12/22/animal-welfare-strategy-for-england-published',
    usedFor: 'England will die CO2-Betäubung von Schweinen angehen und von Abferkelkäfigen wegkommen',
    category: 'Tierschutz im Vergleich',
  },
  atTSchG: {
    label: 'Österreich, Tierschutzgesetz (RIS, geltende Fassung)',
    url: 'https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20003541',
    usedFor: 'Kükenschreddern verboten (§ 6 Abs. 2a), Vollspaltenbuchten ohne Funktionsbereiche verboten (§ 18 Abs. 2a, § 44 Abs. 30), keine dauernde Anbindung (§ 16), Pelztierhaltung verboten (§ 25 Abs. 5), Betäubung direkt nach dem Schnitt (§ 32 Abs. 5)',
    category: 'Tierschutz im Vergleich',
  },
  at1ThVO: {
    label: 'Österreich, 1. Tierhaltungsverordnung (RIS, geltende Fassung)',
    url: 'https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=20003820',
    usedFor: 'Ferkelkastration bis 7 Tage mit Schmerzbehandlung, ohne Betäubung',
    category: 'Tierschutz im Vergleich',
  },
  chTSchV: {
    label: 'Schweiz, Tierschutzverordnung (TSchV, Fedlex)',
    url: 'https://www.fedlex.admin.ch/eli/cc/2008/416/de',
    usedFor: 'Kupierverbot bei Ferkeln (Art. 18), Kastenstand höchstens 10 Tage in der Deckzeit (Art. 48), Abferkelbucht ohne Fixierung (Art. 50), Auslauf für angebundene Rinder (Art. 40)',
    category: 'Tierschutz im Vergleich',
  },
  chTSchG: {
    label: 'Schweiz, Tierschutzgesetz (TSchG, Fedlex)',
    url: 'https://www.fedlex.admin.ch/eli/cc/2008/414/de',
    usedFor: 'Säugetiere nur mit Betäubung schlachten (Art. 21), Fahrzeit höchstens 6 Stunden (Art. 15)',
    category: 'Tierschutz im Vergleich',
  },
  seDjurskyddsforordning: {
    label: 'Schweden, Djurskyddsförordning (2019:66)',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/djurskyddsforordning-201966_sfs-2019-66/',
    usedFor: 'Weidegang im Sommer für Milchkühe über sechs Monate (2 kap. 3 §)',
    category: 'Tierschutz im Vergleich',
  },
  seDjurskyddslag: {
    label: 'Schweden, Djurskyddslag (2018:1192)',
    url: 'https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/djurskyddslag-20181192_sfs-2018-1192/',
    usedFor: 'Operative Eingriffe nur unter Betäubung, Entblutung nur nach Betäubung',
    category: 'Tierschutz im Vergleich',
  },
  seL106: {
    label: 'Schweden, Jordbruksverket SJVFS 2019:20 (L106)',
    url: 'https://lagen.nu/sjvfs/2019:20',
    usedFor: 'Sauen dürfen nur in Ausnahmefällen fixiert werden',
    category: 'Tierschutz im Vergleich',
  },
  noSvin: {
    label: 'Norwegen, Forskrift om hold av svin',
    url: 'https://lovdata.no/dokument/SF/forskrift/2003-02-18-175',
    usedFor: 'Kastration nur durch Tierärzte mit Betäubung (§ 10), Kupieren nur aus tierärztlichen Gründen (§ 10), Fixierung nur in Ausnahmen (§ 11), geschlossener Liegeplatz (§ 8)',
    category: 'Tierschutz im Vergleich',
  },
  noDyrevelferd: {
    label: 'Norwegen, Dyrevelferdsloven',
    url: 'https://lovdata.no/dokument/NL/lov/2009-06-19-97',
    usedFor: 'Betäubung vor der Tötung ist Pflicht (§ 12)',
    category: 'Tierschutz im Vergleich',
  },
  ukSowStalls: {
    label: 'Vereinigtes Königreich, Welfare of Pigs Regulations 1991',
    url: 'https://www.legislation.gov.uk/uksi/1991/1477/made',
    usedFor: 'Kastenstände für trächtige Sauen verboten, Übergangsfrist bis 1. Januar 1999',
    category: 'Tierschutz im Vergleich',
  },
  ukFur: {
    label: 'Vereinigtes Königreich, Fur Farming (Prohibition) Act 2000',
    url: 'https://www.legislation.gov.uk/ukpga/2000/33/section/7',
    usedFor: 'Pelztierhaltung in England und Wales verboten seit 2003',
    category: 'Tierschutz im Vergleich',
  },
  ukCctv: {
    label: 'England, Mandatory Use of Closed Circuit Television in Slaughterhouses Regulations 2018',
    url: 'https://www.legislation.gov.uk/uksi/2018/556/contents/made',
    usedFor: 'Videopflicht in Schlachthöfen seit 2018',
    category: 'Tierschutz im Vergleich',
  },
  esCctv: {
    label: 'Spanien, Real Decreto 695/2022',
    url: 'https://www.boe.es/eli/es/rd/2022/08/23/695/con',
    usedFor: 'Videopflicht in allen Schlachthöfen',
    category: 'Tierschutz im Vergleich',
  },
  dkSlaughter: {
    label: 'Dänemark, Bekendtgørelse nr. 817 vom 15. Juni 2023 (Tötung und Schlachtung)',
    url: 'https://www.retsinformation.dk/eli/lta/2023/817',
    usedFor: 'Auch rituelle Schlachtung nur mit vorheriger Betäubung',
    category: 'Tierschutz im Vergleich',
  },
  czAnimalProtection: {
    label: 'Tschechien, Zákon č. 246/1992 Sb. (Tierschutzgesetz)',
    url: 'https://www.zakonyprolidi.cz/cs/1992-246',
    usedFor: 'Verbot der Anbindehaltung von Nutztieren, Verbot von Pelzfarmen',
    category: 'Tierschutz im Vergleich',
  },
  czCages: {
    label: 'Tschechien, Zákon č. 501/2020 Sb.',
    url: 'https://www.zakonyprolidi.cz/cs/2020-501',
    usedFor: 'Verbot aller Käfige für Legehennen ab 1. Januar 2027',
    category: 'Tierschutz im Vergleich',
  },
  nlFur: {
    label: 'Niederlande, RVO: Vervroegd verbod pelsdierhouderij',
    url: 'https://www.rvo.nl/onderwerpen/dieren-houden/vervroegd-verbod-pelsdierhouderij',
    usedFor: 'Pelztierhaltung verboten seit 8. Januar 2021',
    category: 'Tierschutz im Vergleich',
  },
  frChicks: {
    label: 'Frankreich, Landwirtschaftsministerium: Ende des Tötens männlicher Küken',
    url: 'https://agriculture.gouv.fr/la-france-sera-le-premier-pays-au-monde-avec-lallemagne-mettre-fin-lelimination-des-poussins-males',
    usedFor: 'Verbot des Schredderns und Vergasens männlicher Küken seit 2023, mit Ausnahmen',
    category: 'Tierschutz im Vergleich',
  },
  frChicksAN: {
    label: 'Assemblée nationale, Frage 16-8820 mit Antwort der Regierung',
    url: 'https://questions.assemblee-nationale.fr/q16/16-8820QE.htm',
    usedFor: 'Ausnahme für weiße und traditionelle Legelinien',
    category: 'Tierschutz im Vergleich',
  },
  eu2008_120: {
    label: 'RL 2008/120/EG über Mindestanforderungen für den Schutz von Schweinen',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32008L0120',
    usedFor: 'Kupieren nicht routinemäßig; Kastration ohne Betäubung bis zum 7. Lebenstag erlaubt',
    category: 'Tierschutz im Vergleich',
  },
  dkLabel: {
    label: 'Fødevarestyrelsen: Bedre Dyrevelfærd',
    url: 'https://en.foedevarestyrelsen.dk/animals/animal-welfare/the-governmental-animal-welfare-label',
    usedFor: 'Staatliches, freiwilliges Tierwohl-Siegel in Dänemark seit 2017',
    category: 'Tierschutz im Vergleich',
  },
  tierSchG5: {
    label: 'TierSchG § 5: Eingriffe ohne Betäubung',
    url: 'https://www.gesetze-im-internet.de/tierschg/__5.html',
    usedFor: 'Ausnahmen von der Betäubungspflicht, zum Beispiel Schwanzkürzen bei Ferkeln unter vier Tagen',
    category: 'Tierschutz im Vergleich',
  },
  tierSchG4a: {
    label: 'TierSchG § 4a: Schlachten nur mit Betäubung, Ausnahmen',
    url: 'https://www.gesetze-im-internet.de/tierschg/__4a.html',
    usedFor: 'Ausnahmegenehmigung für das Schlachten ohne Betäubung aus religiösen Gründen',
    category: 'Tierschutz im Vergleich',
  },
  tierSchNutztV45: {
    label: 'TierSchNutztV § 45: Übergangsregelungen',
    url: 'https://www.gesetze-im-internet.de/tierschnutztv/__45.html',
    usedFor: 'Kastenstand im Deckzentrum bis 2029, im Abferkelbereich bis 2036; Kleingruppenhaltung bis Ende 2025, Härtefälle bis 2028',
    category: 'Tierschutz im Vergleich',
  },
  tierHaltKennzG: {
    label: 'Tierhaltungskennzeichnungsgesetz',
    url: 'https://www.gesetze-im-internet.de/tierhaltkennzg/',
    usedFor: 'Pflicht zur staatlichen Haltungskennzeichnung ab 1. Januar 2027, vorerst für Schweinefleisch',
    category: 'Tierschutz im Vergleich',
  },
  hannoverTethering: {
    label: 'Region Hannover, Allgemeinverfügung vom 7. Juli 2026 zur Anbindehaltung von Rindern',
    url: 'https://www.hannover.de/Leben-in-der-Region-Hannover/Gesundheit/Veterinärwesen/Tierschutz/07.07.2026-Allgemeinverfügung-zur-Untersagung-der-Anbindehaltung-von-Rindern',
    usedFor: 'Ganzjährige Anbindehaltung muss innerhalb von 18 Monaten enden',
    category: 'Tierschutz im Vergleich',
  },

  // Zeitreise
  planetWissenVeg: {
    label: 'Planet Wissen (WDR/SWR): Vegetarier',
    url: 'https://www.planet-wissen.de/gesellschaft/essen/vegetarier/index.html',
    usedFor: '1867 Gründung der ersten deutschen „Vegetarischen Vereinigung“ in Nordhausen',
    category: 'Zeitreise',
  },
  fritzenVeg: {
    label: 'Florentine Fritzen: Gemüseheilige, Franz Steiner Verlag 2016 (Leseprobe)',
    url: 'https://media.dav-medien.de/sample/9783515114295_p.pdf',
    usedFor: '1892 Zusammenschluss zum Deutschen Vegetarier-Bund in Leipzig; das Wort „vegan“ entsteht 1944',
    category: 'Zeitreise',
  },
  veganSocietyHistory: {
    label: 'The Vegan Society: History',
    url: 'https://www.vegansociety.com/about-us/history',
    usedFor: 'November 1944: Donald Watson und fünf weitere gründen die Vegan Society; Herkunft des Wortes „vegan“',
    category: 'Zeitreise',
  },
  bpbFleisch: {
    label: 'bpb, APuZ 2021: Vom Wohlstands- zum Krisensymbol',
    url: 'https://www.bpb.de/shop/zeitschriften/apuz/fleisch-2021/344826/vom-wohlstands-zum-krisensymbol/',
    usedFor: 'Schweinefleischverbrauch 1950 bis 1960 von 19 auf fast 30 kg pro Kopf, Geflügel verdreifacht',
    category: 'Zeitreise',
  },
  btDrsVI2559: {
    label: 'Deutscher Bundestag, Drucksache VI/2559 (7. September 1971): Regierungsentwurf eines Tierschutzgesetzes',
    url: 'https://www.jura.uni-mannheim.de/media/Lehrstuehle/jura/Buelte/Dokumente/Tierschutzrecht/Gesetzesentwurf_BReg_TierschutzG__7.9.1971.pdf',
    usedFor: 'Begründung: „Die Entwicklung zur Massentierhaltung ist im letzten Jahrzehnt weltweit erfolgt“',
    category: 'Zeitreise',
  },
  bgbl1972: {
    label: 'Tierschutzgesetz vom 24. Juli 1972, BGBl. I S. 1277',
    url: 'https://www.jura.uni-mannheim.de/media/Lehrstuehle/jura/Buelte/Dokumente/Tierschutzrecht/BGBl._I_1972__S._1277.pdf',
    usedFor: 'In Kraft seit 1. Oktober 1972; löst das Tierschutzgesetz vom 24. November 1933 ab (§ 23)',
    category: 'Zeitreise',
  },
  tierSchG1: {
    label: 'TierSchG § 1: Grundsatz',
    url: 'https://www.gesetze-im-internet.de/tierschg/BJNR012770972.html',
    usedFor: '„Niemand darf einem Tier ohne vernünftigen Grund Schmerzen, Leiden oder Schäden zufügen.“',
    category: 'Zeitreise',
  },
  rl74_577: {
    label: 'Richtlinie 74/577/EWG über die Betäubung von Tieren vor dem Schlachten',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:31974L0577',
    usedFor: 'Seit 1974 müssen Rinder, Schafe, Schweine, Ziegen und Pferde vor dem Schlachten betäubt werden',
    category: 'Zeitreise',
  },
  rl1999_74: {
    label: 'Richtlinie 1999/74/EG: Mindestanforderungen zum Schutz von Legehennen',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:31999L0074',
    usedFor: 'Unausgestaltete Käfige in der EU ab 1. Januar 2012 verboten',
    category: 'Zeitreise',
  },
  bverfg1999: {
    label: 'Bundesverfassungsgericht, Urteil vom 6. Juli 1999, 2 BvF 3/90',
    url: 'https://www.bundesverfassungsgericht.de/SharedDocs/Entscheidungen/DE/1999/07/fs19990706_2bvf000390.html',
    usedFor: 'Hennenhaltungsverordnung von 1987 (450 cm² je Henne) für nichtig erklärt',
    category: 'Zeitreise',
  },
  bverfg2010: {
    label: 'Bundesverfassungsgericht, Urteil vom 12. Oktober 2010, 2 BvF 1/07',
    url: 'https://www.bundesverfassungsgericht.de/SharedDocs/Entscheidungen/DE/2010/10/fs20101012_2bvf000107.html',
    usedFor: 'Abschaffung konventioneller Käfige 2002, Einführung der Kleingruppenhaltung 2006, Regeln formell mit Art. 20a GG unvereinbar',
    category: 'Zeitreise',
  },
  gg20a: {
    label: 'Grundgesetz Art. 20a',
    url: 'https://www.gesetze-im-internet.de/gg/art_20a.html',
    usedFor: 'Tierschutz als Staatsziel seit 2002: „die natürlichen Lebensgrundlagen und die Tiere“',
    category: 'Zeitreise',
  },
  btPlenar14_237: {
    label: 'Deutscher Bundestag, Plenarprotokoll 14/237 (17. Mai 2002)',
    url: 'https://dserver.bundestag.de/btp/14/14237.pdf',
    usedFor: 'Abstimmung über die Aufnahme des Tierschutzes ins Grundgesetz: 543 Ja, 19 Nein, 15 Enthaltungen',
    category: 'Zeitreise',
  },
  bremenVerbandsklage: {
    label: 'Gesetzblatt der Freien Hansestadt Bremen 2021 Nr. 103',
    url: 'https://www.gesetzblatt.bremen.de/fastmedia/218/2021_09_27_GBl_Nr_0103_signed.pdf',
    usedFor: 'Gesetz über das Verbandsklagerecht für Tierschutzvereine vom 25. September 2007',
    category: 'Zeitreise',
  },
  rl2008_119: {
    label: 'Richtlinie 2008/119/EG: Mindestanforderungen für den Schutz von Kälbern',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32008L0119',
    usedFor: 'Kälber über acht Wochen nicht in Einzelbuchten, für alle Betriebe ab 31. Dezember 2006',
    category: 'Zeitreise',
  },
  vo1099_2009: {
    label: 'Verordnung (EG) Nr. 1099/2009 über den Schutz von Tieren zum Zeitpunkt der Tötung',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32009R1099',
    usedFor: 'Ausstieg aus der CO2-Betäubung von Schweinen „aus wirtschaftlicher Sicht nicht tragbar“',
    category: 'Zeitreise',
  },
  btDrs18_10105: {
    label: 'Deutscher Bundestag, Drucksache 18/10105: Antwort der Bundesregierung zum Schnabelkürzen',
    url: 'https://dserver.bundestag.de/btd/18/101/1810105.pdf',
    usedFor: 'Freiwilliger Ausstieg der Branche: ab 1. August 2016 kein Schnabelkürzen bei Legehennenküken',
    category: 'Zeitreise',
  },
  bverwgKastenstand2016: {
    label: 'Bundesverwaltungsgericht, Beschluss vom 8. November 2016, 3 B 11.16',
    url: 'https://www.bverwg.de/081116B3B11.16.0',
    usedFor: 'Jede Sau muss im Kastenstand die Gliedmaßen in Seitenlage ausstrecken können',
    category: 'Zeitreise',
  },
  bverwgChicks2019: {
    label: 'Bundesverwaltungsgericht, Pressemitteilung 47/2019 zu 3 C 28.16 und 3 C 29.16',
    url: 'https://www.bverwg.de/de/pm/2019/47',
    usedFor: 'Wirtschaftliches Interesse allein ist kein vernünftiger Grund für das Töten männlicher Küken',
    category: 'Zeitreise',
  },
  btCastration2018: {
    label: 'Deutscher Bundestag, Textarchiv 29. November 2018: Änderung des Tierschutzgesetzes',
    url: 'https://www.bundestag.de/dokumente/textarchiv/2018/kw48-de-tierschutzgesetz-580094',
    usedFor: 'Verlängerung der betäubungslosen Ferkelkastration um zwei Jahre bis Ende 2020',
    category: 'Zeitreise',
  },
  bregCastration: {
    label: 'Bundesregierung: Wichtiger Schritt zu mehr Tierschutz',
    url: 'https://www.bundesregierung.de/breg-de/aktuelles/wichtiger-schritt-zu-mehr-tierschutz-1608074',
    usedFor: '„Ab 2021 ist die betäubungslose Kastration von Ferkeln endgültig verboten.“',
    category: 'Zeitreise',
  },
  tierSchG21: {
    label: 'TierSchG § 21: Übergangsregelungen',
    url: 'https://www.gesetze-im-internet.de/tierschg/__21.html',
    usedFor: 'Kastration ohne Betäubung bei Ferkeln unter acht Tagen längstens bis 31. Dezember 2020',
    category: 'Zeitreise',
  },
  ecEndCageAge: {
    label: 'Europäische Kommission, Pressemitteilung vom 30. Juni 2021 zur Bürgerinitiative „End the Cage Age“',
    url: 'https://ec.europa.eu/commission/presscorner/detail/de/ip_21_3297',
    usedFor: 'Zusage, bis 2023 einen Vorschlag für ein Käfigverbot vorzulegen',
    category: 'Zeitreise',
  },
  bregChicksBan: {
    label: 'Bundesregierung: Kükentöten wird verboten',
    url: 'https://www.bundesregierung.de/breg-de/aktuelles/koekentoeten-wird-verboten-1841098',
    usedFor: 'Etwa 45 Millionen getötete Hühnerküken pro Jahr vor dem Verbot',
    category: 'Zeitreise',
  },
  btDrs21_3292: {
    label: 'Deutscher Bundestag, Drucksache 21/3292: Änderung des Tierhaltungskennzeichnungsgesetzes',
    url: 'https://dserver.bundestag.de/btd/21/032/2103292.pdf',
    usedFor: 'Pflicht zur Haltungskennzeichnung vom 1. März 2026 auf den 1. Januar 2027 verschoben',
    category: 'Zeitreise',
  },
  ubaOrganic: {
    label: 'Umweltbundesamt: Indikator Ökologischer Landbau',
    url: 'https://www.umweltbundesamt.de/daten/umweltindikatoren/indikator-oekologischer-landbau',
    usedFor: 'Anteil der ökologisch bewirtschafteten Fläche 2,9 Prozent (1999) bis 11,2 Prozent (2024)',
    category: 'Zeitreise',
  },
  tierSchG6: {
    label: 'TierSchG § 6: Verbot der Amputation',
    url: 'https://www.gesetze-im-internet.de/tierschg/__6.html',
    usedFor: 'Behörden können das Kürzen der Schnabelspitzen bei Küken unter zehn Tagen erlauben',
    category: 'Zeitreise',
  },

  // Weltweit
  faoQcl: {
    label: 'FAO. 2025. FAOSTAT: Crops and livestock products (QCL), Element "Producing Animals/Slaughtered". Abgerufen am 5. Oktober 2026. Licence: CC-BY-4.0',
    url: 'https://www.fao.org/faostat/en/#data/QCL',
    usedFor: 'Weltweit geschlachtete Landtiere 2004, 2014 und 2024 nach Art, rund 87,9 Mrd. im Jahr 2024',
    category: 'Weltweit',
  },
  moodBrookeWild: {
    label: 'Mood und Brooke 2024, Animal Welfare 33: Estimating global numbers of fishes caught from the wild annually from 2000 to 2019',
    url: 'https://doi.org/10.1017/awf.2024.7',
    usedFor: 'Wild gefangene Fische weltweit: 1,1 bis 2,2 Billionen pro Jahr, Mittel 2000 bis 2019',
    category: 'Weltweit',
  },
  moodFarmed: {
    label: 'Mood, Lara, Boyland und Brooke 2023, Animal Welfare 32: Estimating global numbers of farmed fishes killed for food annually from 1990 to 2019',
    url: 'https://doi.org/10.1017/awf.2023.4',
    usedFor: 'Fische aus Aquakultur weltweit 2019: 124 Mrd., Spanne 78 bis 171 Mrd.',
    category: 'Weltweit',
  },

  // Tierschutz im Vergleich, Deutschland gegenüber dem EU-Mindeststandard
  eu2007_43: {
    label: 'RL 2007/43/EG mit Mindestvorschriften zum Schutz von Masthühnern',
    url: 'https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32007L0043',
    usedFor: 'Besatzdichte: Grundregel 33 kg/m², mit Auflagen bis 39 kg/m², bei erfüllten Kriterien des Anhangs V bis 42 kg/m² (Art. 3 Abs. 2 bis 5)',
    category: 'Tierschutz im Vergleich',
  },
  tierSchNutztV13a: {
    label: 'TierSchNutztV § 13a: Besondere Anforderungen an Haltungseinrichtungen für Legehennen',
    url: 'https://www.gesetze-im-internet.de/tierschnutztv/__13a.html',
    usedFor: 'Haltungseinrichtungen mindestens 2,5 m² groß und zwei Meter hoch, ein Quadratmeter nutzbare Fläche je neun Hennen, Nest, Einstreu und Sitzstangen',
    category: 'Tierschutz im Vergleich',
  },
  tierSchTrV23: {
    label: 'TierSchTrV § 23: Anwendungsbestimmungen',
    url: 'https://www.gesetze-im-internet.de/tierschtrv_2009/__23.html',
    usedFor: 'Die 28-Tage-Regel für Kälber in § 10 Absatz 4 gilt seit dem 1. Januar 2023, bis dahin galt die Fassung vom 30. November 2021 weiter',
    category: 'Gesetze und Bundestag',
  },

  // Handlungsteil und FAQ, geprüft am 5. Oktober 2026
  vdpEckwerte: {
    label: 'Bundeseinheitliche Eckwerte für eine freiwillige Vereinbarung zur Haltung von Mastputen, Fassung März 2013 (Initiative VDP, bereitgestellt vom Nds. Landwirtschaftsministerium)',
    url: 'https://www.ml.niedersachsen.de/download/72923/Bundes_Eckwerte.pdf',
    usedFor: 'Für die Putenmast keine speziellen Rechtsvorschriften; mit Gesundheitskontrollprogramm bis zu 52 kg (Hennen) und 58 kg (Hähne) Lebendgewicht pro m² zulässig, sonst 45 und 50 kg; Grundlage ist die Vereinbarung von 1999',
    category: 'Wer sie sind',
  },
  iarcPressMeat: {
    label: 'IARC, Pressemitteilung Nr. 240 vom 26. Oktober 2015: IARC Monographs evaluate consumption of red meat and processed meat',
    url: 'https://www.iarc.who.int/wp-content/uploads/2018/07/pr240_E.pdf',
    usedFor: 'Jede Portion von 50 g verarbeitetem Fleisch pro Tag erhöht das Darmkrebsrisiko um 18 Prozent; für den Einzelnen bleibt das Risiko klein, es steigt mit der Menge',
    category: 'Ernährung und Umwelt',
  },
  iarcQaMeat: {
    label: 'IARC 2015: Q&A on the carcinogenicity of the consumption of red meat and processed meat',
    url: 'https://www.iarc.who.int/wp-content/uploads/2018/07/Monographs-QA_Vol114.pdf',
    usedFor: 'Auswertung von zehn Studien; rund 34.000 Krebstodesfälle pro Jahr weltweit durch Ernährung mit viel verarbeitetem Fleisch, gegenüber etwa 1 Million durch Tabak',
    category: 'Ernährung und Umwelt',
  },
  gesundInsLebenToddlers: {
    label: 'Netzwerk Gesund ins Leben (BZfE/BMEL): Handlungsempfehlungen Kleinkind, vegetarische und vegane Ernährung, Stand 27. Juni 2022',
    url: 'https://www.gesund-ins-leben.de/fuer-fachkreise/ernaehrung-und-bewegung-fuer-kleinkinder/handlungsempfehlungen/ernaehrung/vegetarische-und-vegane-ernaehrung/',
    usedFor: 'Ovo-lakto-vegetarisch kann den Bedarf von Kleinkindern decken; vegan nur mit Supplementen (Vitamin B12), ärztlicher Überprüfung der Versorgung und individueller Beratung der Eltern',
    category: 'Ernährung und Umwelt',
  },
  vzVegan: {
    label: 'Verbraucherzentrale: Vegan essen und trinken, was ist zu beachten? Stand 2. März 2026',
    url: 'https://www.verbraucherzentrale.de/wissen/lebensmittel/gesund-ernaehren/vegan-essen-und-trinken-was-ist-zu-beachten-68149',
    usedFor: 'Bei Kindern, Schwangeren, Stillenden und Senior*innen individuelle Beratung durch eine qualifizierte Ernährungsfachkraft',
    category: 'Ernährung und Umwelt',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof sources

export const sourceList: readonly Source[] = Object.values(sources)
