/**
 * Where visitors go next. Every link here is a deliberate hand-off: the main
 * one into Veganstart, the three core questions as a small line, then places
 * to start, learn, act and live. Every URL was opened and read before it was added.
 */

/** The main hand-off of the page, in the header and in the "Mach mit" chapter */
export const handOff = {
  url: 'https://www.veganstart.de/',
  domain: 'veganstart.de',
  kicker: 'Der erste Schritt',
  title: 'Go vegan. Mit Veganstart an deiner Seite.',
  // Wording checked against veganstart.de on 2026-10-07: PETA's free 30-day programme, app or e-mail, recipes, tips, support
  description: 'Das kostenlose 30-Tage-Programm von PETA: jeden Tag Tipps und Rezepte per App oder E-Mail, dazu ein Einkaufsguide und ein Team, das Fragen beantwortet. Schritt für Schritt, ohne Druck.',
  label: '#GoVegan',
} as const

/** The spots on this site a visitor can leave for Veganstart from */
export type HandOffPlacement = 'header' | 'mach-mit' | 'pause'

/**
 * The Veganstart link with campaign parameters. veganstart.de runs Google Tag
 * Manager with GA4 (checked on 2026-10-07), which reads the standard utm_*
 * parameters from the landing URL, so PETA sees that the visit came from
 * vegan.to and from which spot on the page.
 */
export function handOffUrl(placement: HandOffPlacement): string {
  const url = new URL(handOff.url)
  url.searchParams.set('utm_source', 'vegan.to')
  url.searchParams.set('utm_medium', 'referral')
  url.searchParams.set('utm_campaign', 'govegan')
  url.searchParams.set('utm_content', placement)
  return url.toString()
}

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
    description: 'Eine kostenlose Community mit Chat, Video-Treffen und Guides. Menschen, die den Weg schon gehen und dich mitnehmen.',
    url: 'https://vegan-community.de/',
    domain: 'vegan-community.de',
  },
]

export interface EntryStep {
  /** The size of the step, e.g. "Eine Mahlzeit heute" */
  label: string
  /** One short line on what it takes */
  hint: string
  /** Only the two challenges link out; the first steps need nothing but a kitchen */
  url?: string
}

/** Four sizes of a first step, smallest first. Shown as a row above the link cards. */
export const entrySteps: readonly EntryStep[] = [
  { label: 'Eine Mahlzeit heute', hint: 'Ein Gericht, das du schon kennst, einmal ohne Tier' },
  { label: 'Ein Tag pro Woche', hint: 'Fester Tag, feste Gewohnheit, kein Druck an den anderen' },
  { label: '22 Tage mit Begleitung', hint: 'Challenge 22, kostenlos, mit Mentor*innen', url: 'https://www.challenge22.com/' },
  { label: 'Veganuary mit Community', hint: '31 Tage, Rezepte und Leute, die gerade dasselbe ausprobieren', url: 'https://veganuary.com/de/' },
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
    description: 'Ein perfekter Plan ist nicht nötig. Eine Challenge gibt Struktur, und du bist nicht allein damit.',
    links: [
      { name: 'Veganuary', url: 'https://veganuary.com/de/', description: '31 Tage vegan, mit Rezepten und Leuten, die gerade dasselbe ausprobieren' },
      { name: 'Challenge 22', url: 'https://www.challenge22.com/', description: '22 Tage mit persönlicher Begleitung, kostenlos' },
      { name: 'ProVeg', url: 'https://proveg.org/de/', description: 'Deutschlands größte Organisation für pflanzliche Ernährung' },
    ],
  },
  {
    emoji: '🥗',
    title: 'Jeden Tag leben',
    description: 'Vegan im Alltag: essen gehen, nachlesen, dranbleiben.',
    links: [
      { name: 'HappyCow', url: 'https://www.happycow.net/', description: 'Vegane Restaurants und Cafés in deiner Nähe finden' },
      { name: 'NutritionFacts', url: 'https://nutritionfacts.org/', description: 'Ernährungsforschung, verständlich aufbereitet und kostenlos' },
    ],
  },
  {
    emoji: '🎬',
    title: 'Augen öffnen',
    description: 'Diese Dokus haben bei vielen Menschen den Blick verändert. Vielleicht auch bei dir.',
    links: [
      { name: 'Dominion', url: 'https://www.watchdominion.org/', description: 'Die Doku über industrielle Tierhaltung. Schwer auszuhalten, aber wichtig. Nicht für Kinder.' },
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
    emoji: '🗳️',
    title: 'Politik',
    description: 'Wer wählen will, dass sich Gesetze ändern.',
    links: [
      { name: 'V-Partei³', url: 'https://v-partei.de/', description: 'Veränderung, Vielfalt, Vegan: Partei mit veganem Programm' },
      { name: 'Tierschutzpartei', url: 'https://www.tierschutzpartei.de/', description: 'Heute Partei Mensch Klima Tierschutz: Menschenrechte, Klima und Tierschutz als Kernthemen' },
    ],
  },
  {
    emoji: '🏠',
    title: 'Familie und Alltag',
    description: 'Für alle, die nicht nur für sich selbst kochen und einkaufen.',
    links: [
      {
        name: 'Gesund ins Leben',
        url: 'https://www.gesund-ins-leben.de/fuer-fachkreise/ernaehrung-und-bewegung-fuer-kleinkinder/handlungsempfehlungen/ernaehrung/vegetarische-und-vegane-ernaehrung/',
        description: 'Empfehlungen des BMEL-Netzwerks für Kleinkinder: vegetarisch deckt den Bedarf, vegan nur mit Supplementen und ärztlicher Kontrolle',
      },
      {
        name: 'Zucker&Jagdwurst',
        url: 'https://www.zuckerjagdwurst.com/de',
        description: 'Veganer Foodblog aus Berlin, Rezepte filterbar nach Zeit, viele unter 20 Minuten',
      },
      {
        name: 'Verbraucherzentrale',
        url: 'https://www.verbraucherzentrale.de/wissen/lebensmittel/gesund-ernaehren/vegetarische-und-vegane-lebensmittel-erkennen-worauf-muss-ich-achten-68457',
        description: 'Vegane Lebensmittel erkennen: V-Label, Veganblume und versteckte tierische Zutaten',
      },
    ],
  },
]
