import type { SourceId } from '../sources.ts'

/**
 * Die Zeitreise: Stationen von 1867 bis heute. Jede Station ist belegt, die
 * Quellen stehen in sources.ts. Recherchiert und geprüft am 05.10.2026.
 *
 * Weltweit geschlachtete Landtiere: FAOSTAT QCL, Fläche "World", Element
 * "Producing Animals/Slaughtered", 17 Fleischposten, Bulk-Datei vom
 * 23.12.2025 (siehe world.ts für 2004, 2014, 2024). Zwischenwerte hier
 * aus derselben Datei, Geflügel-Posten mal 1000.
 */
export interface WorldPoint {
  year: number
  /** Milliarden Landtiere */
  billions: number
}

export const worldSeries: readonly WorldPoint[] = [
  { year: 1961, billions: 8.36 },
  { year: 1970, billions: 13.31 },
  { year: 1980, billions: 21.45 },
  { year: 1990, billions: 31.29 },
  { year: 2000, billions: 46.48 },
  { year: 2010, billions: 64.06 },
  { year: 2020, billions: 81.56 },
  { year: 2024, billions: 87.9 },
]

export type StationKind = 'harm' | 'good' | 'number' | 'culture' | 'law' | 'promise'

export interface StationPicture {
  /** Base name under public/img/zeitreise, see SceneImage */
  name: string
  alt: string
}

export interface Station {
  year: string
  title: string
  text: string
  kind: StationKind
  sources: readonly SourceId[]
  /** A photo beside the station where the scene shows one */
  picture?: StationPicture
}

/** Akt I: vor der Fabrik */
export const earlyStations: readonly Station[] = [
  {
    year: '1867',
    title: 'Der erste vegetarische Verein',
    text: 'In Nordhausen im Harz gründet sich die erste deutsche „Vegetarische Vereinigung“.',
    kind: 'culture',
    sources: ['planetWissenVeg'],
    picture: { name: 'harvest-table', alt: 'Kürbisse, Mais, Möhren und Paprika auf einem alten Holztisch' },
  },
  {
    year: '1892',
    title: 'Deutscher Vegetarier-Bund',
    text: 'In Leipzig schließen sich kleinere Vereine zum Deutschen Vegetarier-Bund zusammen.',
    kind: 'culture',
    sources: ['fritzenVeg'],
    picture: { name: 'cow-pasture', alt: 'Eine braune Kuh auf der Weide schaut neugierig in die Kamera' },
  },
  {
    year: '1933',
    // Soft hyphens: the word alone is wider than a phone
    title: 'Ein Reichs\u00ADtierschutz\u00ADgesetz',
    text: 'Die NS-Regierung erlässt am 24. November 1933 ein reichsweites Tierschutzgesetz. In der Bundesrepublik gilt es bis 1972.',
    kind: 'law',
    sources: ['bgbl1972'],
    picture: { name: 'calf-mother', alt: 'Ein Kalb trinkt bei seiner Mutter' },
  },
  {
    year: '1944',
    title: 'Das Wort „vegan“',
    text: 'Donald Watson gründet mit fünf weiteren Menschen in England die Vegan Society. Das Wort besteht aus den ersten drei und den letzten zwei Buchstaben von „vegetarian“.',
    kind: 'culture',
    sources: ['veganSocietyHistory', 'fritzenVeg'],
    picture: { name: 'lambs-grass', alt: 'Ein Lamm döst im hohen Gras' },
  },
  {
    year: '1950 bis 1960',
    title: 'Der Fleischhunger wächst',
    text: 'In Westdeutschland steigt der Verbrauch von Schweinefleisch in zehn Jahren von 19 auf fast 30 Kilogramm pro Kopf. Bei Geflügel verdreifacht er sich.',
    kind: 'number',
    sources: ['bpbFleisch'],
    picture: { name: 'meat-counter', alt: 'Verpacktes rohes Fleisch in der Kühltheke eines Supermarkts' },
  },
]

/** Nach dem Zitat von 1971 */
export const foundationStations: readonly Station[] = [
  {
    year: '1972',
    title: 'Das Tierschutzgesetz',
    text: 'Das Tierschutzgesetz vom 24. Juli 1972, in Kraft seit dem 1. Oktober 1972. § 1: „Niemand darf einem Tier ohne vernünftigen Grund Schmerzen, Leiden oder Schäden zufügen.“',
    kind: 'good',
    sources: ['bgbl1972', 'tierSchG1'],
  },
  {
    year: '1974',
    title: 'Betäubung vor dem Schlachten',
    text: 'Die Europäische Gemeinschaft schreibt vor, dass Rinder, Schafe, Schweine, Ziegen und Pferde vor dem Schlachten betäubt werden müssen.',
    kind: 'good',
    sources: ['rl74_577'],
  },
  {
    year: '1980',
    title: '21,45 Milliarden Landtiere',
    text: 'So viele werden weltweit in einem Jahr geschlachtet. 1961 waren es 8,36 Milliarden.',
    kind: 'number',
    sources: ['faoQcl'],
  },
]

/** Nach dem Käfig von 1987 */
export const cageStations: readonly Station[] = [
  {
    year: '1999',
    title: 'Die Käfig-Verordnung ist nichtig',
    text: 'Das Bundesverfassungsgericht kippt die Hennenhaltungsverordnung. Der Käfig verhindere „das Aufbaumen, das Sandbaden, das Scharren oder die Eiablage an geschützter Stelle in einem Nest“.',
    kind: 'good',
    sources: ['bverfg1999'],
  },
  {
    year: '2002',
    title: 'Tiere im Grundgesetz',
    text: 'Der Bundestag nimmt den Tierschutz mit 543 Ja-Stimmen in Artikel 20a auf. Der Staat schützt seitdem „die natürlichen Lebensgrundlagen und die Tiere“.',
    kind: 'good',
    sources: ['gg20a', 'btPlenar14_237'],
  },
  {
    year: '2006',
    title: 'Der Käfig bekommt einen neuen Namen',
    text: 'Eine Änderung der Verordnung führt die „Kleingruppenhaltung“ ein, einen ausgestalteten Käfig. Die alten Käfige dürfen länger bleiben als geplant.',
    kind: 'harm',
    sources: ['bverfg2010'],
  },
  {
    year: '2007',
    title: 'Tierschutzvereine dürfen klagen',
    text: 'Bremen führt ein Verbandsklagerecht für Tierschutzvereine ein.',
    kind: 'good',
    sources: ['bremenVerbandsklage'],
  },
  {
    year: '2012',
    title: 'Konventionelle Käfige EU-weit verboten',
    text: 'Seit dem 1. Januar 2012 sind konventionelle Käfige ohne Nest, Sitzstange und Einstreu in der ganzen EU verboten.',
    kind: 'good',
    sources: ['rl1999_74'],
  },
]

/** Was das Gesetz heute ohne Betäubung erlaubt, § 5 Abs. 3 TierSchG */
export const legalToday: readonly { what: string; who: string }[] = [
  { what: 'Ferkeln den Schwanz kürzen', who: 'jünger als vier Tage' },
  { what: 'Lämmern den Schwanz kürzen', who: 'jünger als acht Tage' },
  { what: 'Ferkeln die Eckzähne abschleifen', who: 'jünger als acht Tage, wenn es die Sau oder die Geschwister schützen soll' },
  { what: 'Rinder enthornen', who: 'jünger als sechs Wochen' },
  { what: 'Rinder, Schafe und Ziegen kastrieren', who: 'jünger als vier Wochen, ohne auffälligen Befund' },
]

/** Akt VII: die Wende */
export const turnStations: readonly Station[] = [
  {
    year: '2013',
    title: 'Sauen in Gruppen',
    text: 'Tragende Sauen müssen EU-weit ab vier Wochen nach der Besamung in Gruppen gehalten werden.',
    kind: 'good',
    sources: ['eu2008_120'],
  },
  {
    year: '2016',
    title: 'Schluss mit dem Schnabelkürzen',
    text: 'Die Geflügelwirtschaft verpflichtet sich freiwillig: Ab August 2016 werden Legehennenküken die Schnäbel nicht mehr gekürzt. Erlaubt ist es bis heute, wenn eine Behörde zustimmt.',
    kind: 'good',
    sources: ['btDrs18_10105', 'tierSchG6'],
  },
  {
    year: '2016',
    title: 'Platz im Kastenstand',
    text: 'Das Bundesverwaltungsgericht entscheidet: Jede Sau muss im Kastenstand in Seitenlage die Beine ausstrecken können.',
    kind: 'good',
    sources: ['bverwgKastenstand2016'],
  },
  {
    year: '2016',
    title: '8,3 Millionen Tonnen Fleisch',
    text: 'Der Höchststand der Fleischproduktion in Deutschland. 2025 waren es 6,9 Millionen Tonnen, 17 Prozent weniger.',
    kind: 'number',
    sources: ['destatisMeatPress2025'],
  },
  {
    year: '2017',
    title: 'Schutz der Ungeborenen',
    text: 'Säugetiere im letzten Drittel der Trächtigkeit dürfen nicht mehr zur Schlachtung abgegeben werden. Schafe und Ziegen sind ausgenommen.',
    kind: 'good',
    sources: ['tierErzHaVerbG4'],
  },
  {
    year: '2019',
    title: 'Wirtschaft ist kein Grund',
    text: 'Das Bundesverwaltungsgericht: Das wirtschaftliche Interesse an Legehennen ist für sich genommen kein vernünftiger Grund, männliche Küken zu töten.',
    kind: 'good',
    sources: ['bverwgChicks2019'],
  },
  {
    year: '2021',
    title: 'Kastration nur noch mit Betäubung',
    text: 'Seit dem 1. Januar 2021 dürfen Ferkel nicht mehr ohne Betäubung kastriert werden. Der Bundestag hatte die Frist 2018 noch einmal um zwei Jahre verlängert.',
    kind: 'good',
    sources: ['tierSchG21', 'bregCastration', 'btCastration2018'],
  },
  {
    year: '2021',
    title: 'Die EU verspricht den Käfigausstieg',
    text: 'Die EU-Kommission sagt zu, bis 2023 einen Vorschlag für ein Käfigverbot vorzulegen. Beschlossen ist bis heute nichts.',
    kind: 'promise',
    sources: ['ecEndCageAge'],
  },
  {
    year: '2021',
    title: 'Kastenstände noch bis 2036',
    text: 'Die Reform von 2021 begrenzt die Fixierung von Sauen. Alte Abferkelbuchten dürfen aber noch bis 2036 genutzt werden, in Härtefällen bis 2038.',
    kind: 'harm',
    sources: ['tierSchNutztV45'],
  },
]

/** Deutschland heute */
export const todayStations: readonly Station[] = [
  {
    year: '2025',
    title: 'Die Käfige laufen aus',
    text: 'Kleingruppenhaltung und ausgestaltete Käfige für Legehennen waren nur noch bis Ende 2025 erlaubt, in Härtefällen bis 2028.',
    kind: 'good',
    sources: ['tierSchNutztV45'],
  },
  {
    year: '2026',
    title: 'Kameras im Schlachthof',
    text: 'Seit Juli 2026 liegt dem Bundestag ein Gesetzentwurf vor: Größere Schlachthöfe sollen Entladen, Betäuben und Töten auf Video aufzeichnen. Beschlossen ist er noch nicht.',
    kind: 'good',
    sources: ['btDrs21_6809'],
  },
  {
    year: '2027',
    title: 'Haltung auf dem Etikett',
    text: 'Ab dem 1. Januar 2027 muss frisches Schweinefleisch aus Deutschland zeigen, wie das Tier gehalten wurde: Stall, Stall+Platz, Frischluftstall, Auslauf/Weide oder Bio.',
    kind: 'good',
    sources: ['tierHaltKennzG', 'btDrs21_3292'],
  },
]

/**
 * Bilder und Videos der Zeitreise, lizenziert über Envato Elements am
 * 05.10.2026 (Konto des Betreibers). Die Originale liegen nicht im Repo;
 * public/img/zeitreise enthält die Web-Größen aus scripts/zeitreise-images.py,
 * public/video/zeitreise die stummen H.264-Clips in 1080p und 720p.
 */
export interface TimelineAsset {
  file: string
  envatoUrl: string
  title: string
  author: string
  kind: 'photo' | 'video'
}

export const timelineAssets: readonly TimelineAsset[] = [
  { file: 'broilers-video.jpg', envatoUrl: 'https://elements.envato.com/thousands-of-young-broiler-chicks-in-a-modern-comm-P5SJT7E', title: 'Thousands of young broiler chicks in a modern commercial poultry farm', author: 'aracrative', kind: 'video' },
  { file: 'cow-eye.jpg', envatoUrl: 'https://elements.envato.com/holstein-cow-4-years-old-looking-at-camera-close-u-PTKKDTK', title: 'Holstein cow, 4 years old, looking at camera, close up on eye', author: 'Lifeonwhite', kind: 'photo' },
  { file: 'hen-cage.jpg', envatoUrl: 'https://elements.envato.com/chicken-in-cage-flock-of-hens-behind-bars-8H8RMAF', title: 'Chicken in cage. Flock of hens behind bars', author: 'newman_studio', kind: 'photo' },
  { file: 'cattle-truck.jpg', envatoUrl: 'https://elements.envato.com/trucking-cattle-hauler-4XDBGG8', title: 'Cattle hauler', author: 'AZ-BLT', kind: 'photo' },
  { file: 'pig-eye.jpg', envatoUrl: 'https://elements.envato.com/close-up-of-a-pig-eye-PHQ26ZN', title: 'Close-up of a pig eye', author: 'aetb', kind: 'photo' },
  { file: 'piglets.jpg', envatoUrl: 'https://elements.envato.com/young-pigs-in-hog-farms-pig-industry-8VXTQJS', title: 'Young pigs in hog farms', author: 'thananit_s', kind: 'photo' },
  { file: 'truck-video.jpg', envatoUrl: 'https://elements.envato.com/beautiful-wide-shot-footage-of-a-semi-truck-haulin-8U3TGLK', title: 'Semi-truck hauling cattle at sunset', author: 'BlackBoxGuild', kind: 'video' },
  { file: 'hens-cages-video.jpg', envatoUrl: 'https://elements.envato.com/hens-in-cages-industrial-farm-4k-TZKBC8B', title: 'White chickens housed inside cages at farm', author: 'egunes_', kind: 'video' },
  { file: 'piglets-straw-video.jpg', envatoUrl: 'https://elements.envato.com/group-of-piglets-standing-in-a-pigpen-with-straw-c-UE6AX5F', title: 'Group of piglets standing in a pigpen with straw covered floor', author: 'BlackBoxGuild', kind: 'video' },
  { file: 'pigs-cozy-video.jpg', envatoUrl: 'https://elements.envato.com/pigs-enjoying-their-time-in-a-cozy-barn-environmen-6T9UCNY', title: 'Pink piglets looking at camera on a farm', author: 'Borovikk', kind: 'video' },
  { file: 'chicks-box-video.jpg', envatoUrl: 'https://elements.envato.com/white-plastic-box-full-of-yellow-chicks-moving-on--55LNJNS', title: 'White plastic box full of yellow chicks moving on the conveyor line', author: 'megafilm', kind: 'video' },
  { file: 'cows-misty-video.jpg', envatoUrl: 'https://elements.envato.com/grazing-cows-in-bucolic-landscape-misty-sunrise-ae-4KH5VRP', title: 'Grazing cows in bucolic landscape, misty sunrise aerial horizon reveal', author: 'BlackBoxGuild', kind: 'video' },
  { file: 'harvest-table.jpg', envatoUrl: 'https://elements.envato.com/beautiful-arrengament-of-autumn-vegetables-on-wood-JTXNU8T', title: 'Fresh vegetables on rustic wooden surface, top view', author: 'FabrikaPhoto', kind: 'photo' },
  { file: 'cow-pasture.jpg', envatoUrl: 'https://elements.envato.com/brown-cow-on-green-pasture-8PVD4SA', title: 'Brown and white cow in grassy field', author: 'Alexlukin', kind: 'photo' },
  { file: 'calf-mother.jpg', envatoUrl: 'https://elements.envato.com/unweaned-calf-suckling-from-his-mother-bovine-catt-HQB5985', title: 'Unweaned calf suckling from his mother', author: 'ABBPhoto', kind: 'photo' },
  { file: 'lambs-grass.jpg', envatoUrl: 'https://elements.envato.com/closeup-portrait-of-very-cute-flurry-wooly-white-l-955VXWN', title: 'Peaceful sheep grazing in tall green grass', author: 'Brinjaschmidt', kind: 'photo' },
  { file: 'meat-counter.jpg', envatoUrl: 'https://elements.envato.com/close-up-view-of-arranged-raw-meat-in-grocery-shop-NLFERUR', title: 'Fresh raw meat cuts in a shop display', author: 'LightFieldStudios', kind: 'photo' },
  { file: 'veggie-bowl.jpg', envatoUrl: 'https://elements.envato.com/healthy-vegetarian-buddha-bowl-2JZMRQL', title: 'Colorful vegan grain bowl with vegetables and grains', author: 'sea_wave', kind: 'photo' },
  { file: 'pasture-golden.jpg', envatoUrl: 'https://elements.envato.com/cows-graze-in-the-field-golden-hour-beautiful-warm-LK5MYUJ', title: 'Cows graze in the field, golden hour', author: 'Anastasiia_V', kind: 'photo' },
  { file: 'hens-free.jpg', envatoUrl: 'https://elements.envato.com/free-range-chickens-outdoors-in-early-morning-ligh-837SK3T', title: 'Free range chickens outdoors in early morning light', author: 'Mint_Images', kind: 'photo' },
  { file: 'pig-safe.jpg', envatoUrl: 'https://elements.envato.com/no-animals-violence-and-vegan-vegetarian-food-conc-ZHMZMZW', title: 'Relaxed and safe pig', author: 'simonapilolla', kind: 'photo' },
  { file: 'hands-chick.jpg', envatoUrl: 'https://elements.envato.com/human-hands-holding-a-little-yellow-chick-no-peopl-97MYNZG', title: 'Human hands holding a little yellow chick, sunset light', author: 'alinabitta', kind: 'photo' },
]
