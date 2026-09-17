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
    usedFor: 'Rinder, Schweine, Schafe, Ziegen, Pferde (inländische Herkunft), Jahreswert und Zeitreihe',
    category: 'Schlachtzahlen',
  },
  destatisPoultry: {
    label: 'Destatis, GENESIS 41322-0001: Geflügelschlachtereien 2010 bis 2025',
    url: 'https://www-genesis.destatis.de/datenbank/online/table/41322-0001',
    usedFor: 'Hühner, Truthühner, Enten, Gänse, Jahreswert und Zeitreihe',
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
    usedFor: 'Alter bei der Schlachtung im Ticker; Lebenserwartung Huhn, Schwein, Schaf, Ziege, Rind',
    category: 'Alter bei der Schlachtung',
  },
  lflCarp: {
    label: 'LfL Bayern: Karpfenteichwirtschaft',
    url: 'https://www.lfl.bayern.de/ifi/karpfenteichwirtschaft/149835/index.php',
    usedFor: 'Alter von Speisekarpfen, drei Sommer',
    category: 'Alter bei der Schlachtung',
  },
  vierPfotenRinder: {
    label: 'Vier Pfoten: Lebenserwartung von Rindern',
    url: 'https://www.vier-pfoten.de/kampagnen-themen/themen/nutztiere/rinder/lebenserwartung-von-rindern',
    usedFor: 'Rind, natürliche Lebenserwartung 20 Jahre',
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
    url: 'https://tierschutz.hessen.de/sites/tierschutz.hessen.de/files/2022-11/vo_ueber_den_schutz_von_tieren_beim_transport-22120411.pdf',
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
    label: 'Academy of Nutrition and Dietetics 2016: Position on vegetarian diets',
    url: 'https://higherlogicdownload.s3.amazonaws.com/THEACADEMY/859dd171-3982-43db-8535-56c4fdc42b51/UploadedImages/VN/Documents/Position-of-the-Academy-of-Nutrition-and-Dietetics-Vegetarian-Diets.pdf',
    usedFor: 'Gut geplant für alle Lebensphasen geeignet',
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
    usedFor: 'Verarbeitetes Fleisch Gruppe 1, rotes Fleisch 2A, 50 g täglich plus 18 Prozent Darmkrebsrisiko',
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
} satisfies Record<string, Source>

export type SourceId = keyof typeof sources

export const sourceList: readonly Source[] = Object.values(sources)
