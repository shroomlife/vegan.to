/**
 * The background pages beside the species pages, one entry per page. Router,
 * sitemap, prerender, footer and the "Weiterlesen" links all read this list.
 * Only plain data here: vite.config.ts reads the paths through routes.ts, so
 * this file must not pull the app's runtime modules along.
 */
export interface TopicPage {
  path: string
  /** Router name, also the key of the view in the router */
  name: TopicName
  /** Short label for links, e.g. "Weltweit" */
  label: string
  /** One line saying what the page answers, for the link lists */
  teaser: string
  /** Which row of the start page chapter the page belongs to */
  group: TopicGroupKey
  /** The one figure the page is known for, as the page prints it */
  figure: string
  /** What the figure counts */
  figureLabel: string
  /** <title> */
  title: string
  /** Meta description */
  description: string
}

export type TopicName =
  | 'World'
  | 'Livestock'
  | 'SlaughterAge'
  | 'PerCapita'
  | 'SlaughterStats'
  | 'Chicks'
  | 'Dairy'
  | 'Losses'
  | 'Transport'
  | 'Stunning'
  | 'Comparison'
  | 'Timeline'

export type TopicGroupKey = 'numbers' | 'lives' | 'rules'

export interface TopicGroup {
  key: TopicGroupKey
  label: string
  /** What the row answers, one line */
  lead: string
}

export const topicGroups: readonly TopicGroup[] = [
  { key: 'numbers', label: 'Die Zahlen', lead: 'Wie viele, wo, und wie viel davon auf einen Menschen kommt' },
  { key: 'lives', label: 'Ihr Leben', lead: 'Wie kurz es ist und was davor passiert' },
  { key: 'rules', label: 'Die Regeln', lead: 'Was erlaubt ist, hier und anderswo, und wie es dazu kam' },
]

export const topicPages: readonly TopicPage[] = [
  {
    path: '/weltweit',
    name: 'World',
    group: 'numbers',
    figure: '87,9 Mrd.',
    figureLabel: 'Landtiere weltweit geschlachtet, 2024',
    label: 'Weltweit',
    teaser: 'Wie viele Tiere weltweit für Fleisch sterben, live und nach Art',
    title: 'Wie viele Tiere werden weltweit geschlachtet? Live-Zähler | vegan.to',
    description: 'Rund 87,9 Milliarden Landtiere wurden 2024 weltweit für Fleisch geschlachtet, laut FAO. Dazu kommen geschätzt über eine Billion wild gefangene Fische pro Jahr (Mittel 2000 bis 2019). Mit laufendem Zähler, allen Tierarten und Quellen.',
  },
  {
    path: '/tierbestand',
    name: 'Livestock',
    group: 'numbers',
    figure: '21 Mio.',
    figureLabel: 'Schweine in deutschen Ställen, Mai 2026',
    label: 'Tierbestand',
    teaser: 'Wie viele Schweine, Rinder, Hühner und Ziegen in Deutschland leben',
    title: 'Wie viele Schweine, Rinder und Hühner gibt es in Deutschland? | vegan.to',
    description: 'Tierbestand in Deutschland nach Destatis: 21 Mio. Schweine und 10,4 Mio. Rinder (Mai 2026), 156 Mio. Hühner (März 2023) und mehr. Und warum jedes Jahr mehr Schweine geschlachtet werden, als in den Ställen stehen.',
  },
  {
    path: '/schlachtalter',
    name: 'SlaughterAge',
    group: 'lives',
    figure: '5 bis 7\u00A0Wochen',
    figureLabel: 'lebt ein Masthuhn',
    label: 'Schlachtalter',
    teaser: 'Wie alt Tiere bei der Schlachtung sind und wie alt sie werden könnten',
    title: 'Wie alt werden Schweine, Hühner und Rinder bis zur Schlachtung? | vegan.to',
    description: 'Masthühner leben fünf bis sieben Wochen, Mastschweine sechs bis sieben Monate, Milchkühe im Schnitt 5,5 Jahre. Alle Arten im Vergleich mit ihrer möglichen Lebenserwartung, mit Quellen.',
  },
  {
    path: '/pro-kopf',
    name: 'PerCapita',
    group: 'numbers',
    figure: '54,9 kg',
    figureLabel: 'Fleisch pro Kopf in Deutschland, 2025',
    label: 'Pro Kopf',
    teaser: 'Wie viele Tiere und wie viel Fleisch auf einen Menschen kommen',
    title: 'Wie viele Tiere isst ein Mensch? Fleischkonsum pro Kopf in Deutschland | vegan.to',
    description: 'Fleischverzehr pro Kopf in Deutschland 2025: 54,9 kg, laut BLE. Wie viele Tiere das im Jahr und im Leben sind, warum das Ergebnis eine Spanne ist und wie sich der Verzehr seit 2010 verändert hat.',
  },
  {
    path: '/schlachtzahlen',
    name: 'SlaughterStats',
    group: 'numbers',
    figure: '697 Mio.',
    figureLabel: 'Geflügeltiere in Deutschland geschlachtet, 2025',
    label: 'Schlachtzahlen',
    teaser: 'Schlachtzahlen nach Monat und Bundesland, mit allen Schlachtungsarten',
    title: 'Schlachtzahlen Deutschland 2025 und 2026: nach Monat und Bundesland | vegan.to',
    description: 'Die amtlichen Schlachtzahlen für Deutschland: 2025 insgesamt, Monat für Monat bis Juli 2026 und nach Bundesland. Wo die meisten Schweine, Rinder und das meiste Geflügel geschlachtet werden.',
  },
  {
    path: '/kueken-und-legehennen',
    name: 'Chicks',
    group: 'lives',
    figure: '45 Mio.',
    figureLabel: 'Legehennen in Deutschland, 2025',
    label: 'Küken und Legehennen',
    teaser: 'Was seit dem Verbot des Kükentötens passiert und wie Legehennen leben',
    title: 'Kükentöten-Verbot, Bruderhähne und Legehennen: die Zahlen | vegan.to',
    description: 'Seit 2022 ist das Töten männlicher Küken in Deutschland verboten. Was die amtliche Brütereistatistik seitdem zeigt, wie viele Legehennen es gibt und was am Ende mit ihnen passiert.',
  },
  {
    path: '/milchkuehe-und-kaelber',
    name: 'Dairy',
    group: 'lives',
    figure: '3,6 Mio.',
    figureLabel: 'Milchkühe in Deutschland, Mai 2026',
    label: 'Milchkühe und Kälber',
    teaser: 'Warum es ohne Kalb keine Milch gibt und was mit den Kälbern passiert',
    title: 'Milchkühe und Kälber: wie lange sie leben und was mit ihnen passiert | vegan.to',
    description: 'Eine Milchkuh gibt nur Milch, wenn sie ein Kalb geboren hat. Wie viele Milchkühe es in Deutschland gibt, wie lange sie genutzt werden, was mit den Kälbern passiert und wie viele Kühe jedes Jahr geschlachtet werden.',
  },
  {
    path: '/vor-der-schlachtung',
    name: 'Losses',
    group: 'lives',
    figure: '13,5 Mio.',
    figureLabel: 'Schweine starben 2016 im Stall, geschätzt',
    label: 'Tod vor der Schlachtung',
    teaser: 'Die Tiere, die vor der Schlachtung sterben und in keiner Statistik stehen',
    title: 'Wie viele Tiere sterben vor der Schlachtung im Stall? | vegan.to',
    description: 'Die Schlachtstatistik zählt nur Tiere, die geschlachtet werden. Wie viele vorher im Stall sterben, wird bei Rindern erfasst, aber nicht veröffentlicht, bei Schweinen gar nicht zentral gezählt. Was Studien, die Bundesregierung und das Thünen-Institut dazu sagen.',
  },
  {
    path: '/tiertransporte',
    name: 'Transport',
    group: 'rules',
    figure: '29,5 Mio.',
    figureLabel: 'Stück Geflügel 2025 in Länder außerhalb der EU exportiert',
    label: 'Tiertransporte',
    teaser: 'Wie lange Tiere unterwegs sein dürfen und wohin Deutschland sie exportiert',
    title: 'Tiertransporte: erlaubte Dauer und Exporte in Drittstaaten | vegan.to',
    description: 'Wie lange Rinder, Schweine und Kälber transportiert werden dürfen, wie viele Tiere Deutschland seit 2017 in Länder außerhalb der EU exportiert hat und wo die EU-Reform steht.',
  },
  {
    path: '/betaeubung',
    name: 'Stunning',
    group: 'rules',
    figure: '4 bis über 9\u00A0%',
    figureLabel: 'der Rinder brauchen einen zweiten Bolzenschuss',
    label: 'Betäubung',
    teaser: 'Wie Tiere vor der Schlachtung betäubt werden und wie oft es nicht gelingt',
    title: 'Betäubung bei der Schlachtung: Methoden und Fehlbetäubungen | vegan.to',
    description: 'CO2 bei Schweinen, Bolzenschuss bei Rindern, Wasserbad bei Geflügel: was das Gesetz vorschreibt, wie oft die Betäubung laut Studien nicht gelingt und was die EFSA empfiehlt.',
  },
  {
    path: '/tierschutz-im-vergleich',
    name: 'Comparison',
    group: 'rules',
    figure: '16 Regeln',
    figureLabel: 'Deutschland neben der Schweiz, Österreich, Schweden und anderen',
    label: 'Tierschutz im Vergleich',
    teaser: 'Wo Deutschland beim Tierschutz weiter ist und wo andere Länder',
    title: 'Tierschutz im Vergleich: Wo Deutschland vorn liegt und wo nicht | vegan.to',
    description: 'Kükentöten, Kastenstand, Schwanzkupieren, Schächten, Tiertransporte: Wo Deutschland strenger ist und wo die Schweiz, Schweden, Österreich und andere Länder Tieren mehr Schutz geben. Mit Gesetzestexten.',
  },
  {
    path: '/zeitreise',
    name: 'Timeline',
    group: 'rules',
    figure: '10,5-mal',
    figureLabel: 'so viele Landtiere wie 1961 werden heute weltweit geschlachtet',
    label: 'Zeitreise',
    teaser: 'Von 1867 bis heute: wie wir mit Tieren umgehen, als Reise zum Scrollen',
    title: 'Zeitreise: Wie wir mit Tieren umgehen, von 1867 bis heute | vegan.to',
    description: '1961 wurden weltweit 8,36 Milliarden Landtiere geschlachtet, 2024 waren es 87,9 Milliarden. Eine Zeitreise durch Massentierhaltung, Käfige, Transporte und die Gesetze, die Tieren Schritt für Schritt Schutz gaben. Mit Quellen zu jeder Station.',
  },
]

export const topicPaths: readonly string[] = topicPages.map((topic) => topic.path)

export function topicByName(name: TopicName): TopicPage {
  const topic = topicPages.find((entry) => entry.name === name)
  if (!topic) throw new Error(`Unknown topic ${name}`)
  return topic
}
