/**
 * Where visitors go next. Every link here is a deliberate hand-off:
 * the three core questions first, then places to start, learn, act and live.
 */

export interface CoreQuestion {
  key: 'why' | 'how' | 'who'
  kicker: string
  title: string
  description: string
  url: string
  domain: string
}

export const coreQuestions: readonly CoreQuestion[] = [
  {
    key: 'why',
    kicker: 'Die Frage nach dem Grund',
    title: 'Warum vegan?',
    description: 'Warum Tiere Rechte haben und was Speziesismus damit zu tun hat. Mit Dokus und Texten, die hängen bleiben.',
    url: 'https://warum-vegan.com/',
    domain: 'warum-vegan.com',
  },
  {
    key: 'how',
    kicker: 'Die Frage nach dem Weg',
    title: 'Wie vegan?',
    description: 'Der praktische Teil: Was essen, was anziehen, worauf beim Einkauf achten. Mit kostenlosen Guides zum Runterladen.',
    url: 'https://wie-vegan.com/',
    domain: 'wie-vegan.com',
  },
  {
    key: 'who',
    kicker: 'Die Frage nach den anderen',
    title: 'Mit wem?',
    description: 'Eine kostenlose Community mit Chat, Calls und Guides. Menschen, die den Weg schon gehen und dich mitnehmen.',
    url: 'https://vegan-community.de/',
    domain: 'vegan-community.de',
  },
]

export interface ActionLink {
  name: string
  url: string
  description: string
}

export interface ActionCategory {
  emoji: string
  title: string
  description: string
  links: readonly ActionLink[]
}

export const actionCategories: readonly ActionCategory[] = [
  {
    emoji: '🌱',
    title: 'Einfach anfangen',
    description: 'Du brauchst keinen perfekten Plan. Fang mit einer Challenge an, da bist du nicht allein.',
    links: [
      { name: 'Veganuary', url: 'https://veganuary.com/de/', description: '31 Tage vegan, mit Rezepten und Leuten, die gerade dasselbe ausprobieren' },
      { name: 'Challenge 22', url: 'https://www.challenge22.com/', description: '22 Tage mit persönlicher Begleitung, kostenlos' },
      { name: 'ProVeg', url: 'https://proveg.org/de/', description: 'Deutschlands größte Organisation für pflanzliche Ernährung' },
    ],
  },
  {
    emoji: '🎬',
    title: 'Augen öffnen',
    description: 'Diese Dokus haben bei vielen Menschen den Blick verändert. Vielleicht auch bei dir.',
    links: [
      { name: 'Dominion', url: 'https://www.watchdominion.org/', description: 'Die Doku über industrielle Tierhaltung. Schwer auszuhalten, aber wichtig.' },
      { name: 'Cowspiracy', url: 'https://www.cowspiracy.com/', description: 'Was Tierhaltung mit Klima, Wasser und Wald macht' },
      { name: 'Seaspiracy', url: 'https://www.seaspiracy.org/', description: 'Was Fischerei mit den Meeren macht' },
      { name: 'vegan.eu', url: 'https://www.vegan.eu/', description: 'Infoportal mit Fakten und Studien, auf Deutsch' },
      { name: 'Vegpool', url: 'https://www.vegpool.de/', description: 'Magazin mit Forum, auf Deutsch' },
    ],
  },
  {
    emoji: '✊',
    title: 'Stimme erheben',
    description: 'Diese Organisationen arbeiten jeden Tag für die Tiere. Sie freuen sich über jede helfende Hand.',
    links: [
      { name: 'ARIWA', url: 'https://www.ariwa.org/', description: 'Undercover-Recherchen und vegane Aufklärungsarbeit' },
      { name: 'Albert Schweitzer Stiftung', url: 'https://albert-schweitzer-stiftung.de/', description: 'Setzt sich gegen Massentierhaltung ein' },
      { name: 'Animal Equality', url: 'https://animalequality.de/', description: 'Internationale Tierrechtsorganisation mit deutschem Team' },
      { name: 'SOKO Tierschutz', url: 'https://soko-tierschutz.org/', description: 'Verdeckte Ermittlungen in Ställen und Schlachthöfen' },
      { name: 'Anonymous for the Voiceless', url: 'https://www.anonymousforthevoiceless.org/', description: 'Cube of Truth, Straßenaktivismus in deiner Stadt' },
      { name: 'Land der Tiere', url: 'https://www.land-der-tiere.de/', description: 'Lebenshof, auf dem du geretteten Tieren begegnen kannst' },
    ],
  },
  {
    emoji: '🥗',
    title: 'Jeden Tag leben',
    description: 'Vegan im Alltag. Diese Seiten helfen dir dabei.',
    links: [
      { name: 'HappyCow', url: 'https://www.happycow.net/', description: 'Vegane Restaurants und Cafés in deiner Nähe finden' },
      { name: 'NutritionFacts', url: 'https://nutritionfacts.org/', description: 'Ernährungsforschung, verständlich aufbereitet und kostenlos' },
      { name: 'V-Partei³', url: 'https://v-partei.de/', description: 'Politisch aktiv werden und vegan wählen' },
      { name: 'Tierschutzpartei', url: 'https://www.tierschutzpartei.de/', description: 'Partei Mensch Umwelt Tierschutz, die politische Stimme für Tiere' },
    ],
  },
]
