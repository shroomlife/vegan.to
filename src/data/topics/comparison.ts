import type { SourceId } from '../sources.ts'

/**
 * Tierschutzrecht im Vergleich, Stand 05.10.2026. Jede Regel stammt aus dem
 * Gesetzestext oder einer amtlichen Seite, siehe sources. Bewusst weggelassen,
 * weil nicht belegt: Startdatum in Schweden für die Ferkelkastration, das
 * Schweizer Batteriekäfig-Verbot von 1992, die Lage in Luxemburg, Slowenien,
 * Wallonien und Finnland, der Stand der niederländischen Kamerapflicht.
 */
/** 'mixed': Germany is stricter than some of the compared rules and more lenient than others. */
export type Verdict = 'germany' | 'mixed' | 'others' | 'unclear'

export interface CountryRule {
  country: string
  rule: string
}

export interface Comparison {
  topic: string
  verdict: Verdict
  germany: string
  others: readonly CountryRule[]
  summary: string
  sources: readonly SourceId[]
}

export const comparisons: readonly Comparison[] = [
  {
    topic: 'Töten männlicher Küken',
    verdict: 'germany',
    germany: 'Seit 2022 verboten, für alle Rassen. Seit 2024 dürfen Embryonen nach einer Geschlechtsbestimmung im Ei ab dem 13. Bebrütungstag nicht mehr getötet werden.',
    others: [
      { country: 'Frankreich', rule: 'Seit 2023 verboten. Ausnahme laut Regierung: Küken weißer und traditioneller Legelinien, rund 15 Prozent der Legehennen, dürfen vergast werden, wenn sie als Tierfutter dienen. Das Schreddern ist ausnahmslos verboten.' },
      { country: 'Österreich', rule: 'Das Schreddern lebender Küken ist verboten. Getötet werden dürfen Küken aber weiterhin, wenn sie als Futter dienen.' },
      { country: 'Schweiz', rule: 'Verboten ist nur das Schreddern. Andere Arten der Tötung sind erlaubt.' },
      { country: 'Italien', rule: 'Ein Verbot ab 31. Dezember 2026 ist beschlossen, mit Ausnahmen für Fehler bei der Geschlechtsbestimmung.' },
      { country: 'Übrige EU', rule: 'Kein Verbot gefunden.' },
    ],
    summary: 'Deutschland verbietet das Töten männlicher Küken ohne Ausnahme für bestimmte Rassen. Frankreich lässt eine Ausnahme für einige Legelinien zu, Österreich und die Schweiz verbieten nur das Schreddern.',
    sources: ['tierSchG4c', 'frChicks', 'frChicksAN', 'atTSchG', 'chTSchV', 'itChicks'],
  },
  {
    topic: 'Besatzdichte bei Masthühnern',
    verdict: 'germany',
    germany: 'Zu keinem Zeitpunkt mehr als 39 Kilogramm Lebendgewicht je Quadratmeter. Wiegen die Hühner im Durchschnitt weniger als 1,6 Kilogramm, dürfen es im Mittel dreier Mastdurchgänge höchstens 35 Kilogramm sein.',
    others: [
      { country: 'EU-Recht', rule: 'Grundregel 33 Kilogramm je Quadratmeter. Mitgliedstaaten dürfen bis 39 Kilogramm zulassen, wenn der Stall zusätzliche Anforderungen erfüllt, und bis 42 Kilogramm, wenn der Betrieb zuletzt ohne Beanstandung blieb und die Sterblichkeit niedrig war.' },
    ],
    summary: 'Das EU-Recht erlaubt mit Ausnahmen bis zu 42 Kilogramm je Quadratmeter. Deutschland macht bei 39 Kilogramm Schluss und verlangt bei leichten Tieren im Durchschnitt 35.',
    sources: ['tierSchNutztV19', 'eu2007_43'],
  },
  {
    topic: 'Kastenstand im Deckzentrum',
    verdict: 'germany',
    germany: 'Ein Kastenstand ist ein enger Stand aus Metallstangen, in dem sich die Sau nicht umdrehen kann. Im Deckzentrum, dem Stallbereich für die Zeit vom Absetzen der Ferkel bis zur Besamung, ist er künftig nicht mehr erlaubt: Sauen müssen dort in der Gruppe stehen und mindestens fünf Quadratmeter je Tier haben. Alte Ställe dürfen noch bis 9. Februar 2029 weiterlaufen, in Härtefällen bis 2031.',
    others: [
      { country: 'EU-Recht', rule: 'Gruppenhaltung ist nur für die Zeit von vier Wochen nach dem Decken bis eine Woche vor der Geburt vorgeschrieben. Davor dürfen Sauen einzeln gehalten werden, ohne Frist für einen Ausstieg.' },
    ],
    summary: 'Das EU-Recht erlaubt den Kastenstand im Deckzentrum weiter. Deutschland steigt bis 2029 aus, in Härtefällen bis 2031. Die Schweiz, Schweden und Norwegen sind trotzdem weiter.',
    sources: ['tierSchNutztV30', 'tierSchNutztV45', 'eu2008_120'],
  },
  {
    topic: 'Ausgestaltete Käfige für Legehennen',
    verdict: 'germany',
    germany: 'Ställe für Legehennen müssen mindestens 2,5 Quadratmeter groß und zwei Meter hoch sein, mit Nest, Einstreu und Sitzstangen für alle Hennen. Die Kleingruppenhaltung, Käfige mit etwas mehr Platz, Nest, Einstreu und Sitzstangen, war nur noch bis Ende 2025 erlaubt, in Härtefällen bis Ende 2028.',
    others: [
      { country: 'EU-Recht', rule: 'Ausgestaltete Käfige bleiben erlaubt: 750 Quadratzentimeter je Henne, ein Nest, Einstreu und 15 Zentimeter Sitzstange. Verboten sind seit 2012 nur die alten Käfige ohne diese Ausstattung.' },
    ],
    summary: 'Das EU-Recht erlaubt ausgestaltete Käfige weiter. Deutschland hat sie bis Ende 2025 auslaufen lassen, Härtefälle bis Ende 2028.',
    sources: ['tierSchNutztV13a', 'tierSchNutztV45', 'bverfg2010', 'rl1999_74'],
  },
  {
    topic: 'Kastration von Ferkeln',
    verdict: 'mixed',
    germany: 'Seit 1. Januar 2021 nur noch mit Betäubung. Bis dahin durften Ferkel unter acht Tagen ohne Betäubung kastriert werden.',
    others: [
      { country: 'Schweiz', rule: 'Schmerzausschaltung ist Pflicht, das Verbot gilt seit 2010, elf Jahre vor Deutschland.' },
      { country: 'Norwegen', rule: 'Kastrieren dürfen nur Tierärztinnen und Tierärzte, mit Betäubung und lang wirkender Schmerzbehandlung.' },
      { country: 'Österreich', rule: 'Ferkel bis sieben Tage dürfen mit Schmerzbehandlung, aber ohne Betäubung kastriert werden.' },
      { country: 'EU-Recht', rule: 'Bis zum siebten Lebenstag darf ohne Betäubung kastriert werden. Erst danach sind Tierarzt, Betäubung und Schmerzmittel Pflicht.' },
    ],
    summary: 'Strenger als das EU-Recht und Österreich, lockerer als die Schweiz und Norwegen: Die Schweiz hat die Kastration ohne Betäubung elf Jahre früher verboten, in Norwegen darf nur der Tierarzt kastrieren.',
    sources: ['tierSchG5', 'tierSchG21', 'chTSchG', 'chTSchV', 'noSvin', 'at1ThVO', 'eu2008_120'],
  },
  {
    topic: 'Pflicht zur Haltungskennzeichnung',
    verdict: 'germany',
    germany: 'Ab 1. Januar 2027 muss frisches Schweinefleisch von in Deutschland gehaltenen und geschlachteten Tieren ein staatliches Label mit der Haltungsform tragen. Für Importware ist es freiwillig. Das Gesetz ist beschlossen, die Pflicht gilt aber noch nicht.',
    others: [
      { country: 'Dänemark', rule: 'Ein staatliches Tierwohl-Label gibt es schon seit 2017, es ist aber freiwillig.' },
    ],
    summary: 'Deutschland führt eine Pflicht ein, vorerst nur für Schweinefleisch. Dänemark war früher dran, aber ohne Pflicht.',
    sources: ['tierHaltKennzG', 'dkLabel'],
  },
  {
    topic: 'Kastenstand für Sauen',
    verdict: 'others',
    germany: 'Erlaubt mit langen Übergangsfristen: im Deckzentrum bis 2029 (Härtefälle bis 2031), im Abferkelbereich, also dort, wo die Sau ihre Ferkel bekommt und säugt, bis 2036 (Härtefälle bis 2038). Danach höchstens fünf Tage rund um die Geburt.',
    others: [
      { country: 'Schweiz', rule: 'Kastenstand höchstens zehn Tage in der Deckzeit. In der Abferkelbucht muss sich die Sau frei drehen können.' },
      { country: 'Schweden', rule: 'Sauen dürfen nur in Ausnahmefällen fixiert werden, etwa bei aggressivem Verhalten in den ersten Tagen nach der Geburt.' },
      { country: 'Norwegen', rule: 'Fixieren ist verboten, außer beim Füttern, bei Behandlung oder Besamung, bei besonders unruhigen Einzeltieren in der Brunst und bei unruhigen Sauen bis sieben Tage nach der Geburt.' },
      { country: 'Großbritannien', rule: 'Kastenstände für trächtige Sauen sind seit 1999 verboten. Abferkelkäfige sind weiter erlaubt, England hat 2025 angekündigt, davon wegzukommen.' },
    ],
    summary: 'In der Schweiz, Schweden und Norwegen bewegen sich Sauen heute schon weitgehend frei. Deutschland steigt erst bis 2029 und 2036 aus, in Härtefällen bis 2031 und 2038.',
    sources: ['tierSchNutztV45', 'chTSchV', 'seL106', 'noSvin', 'ukSowStalls', 'defraStrategy2025'],
  },
  {
    topic: 'Schwänze kupieren',
    verdict: 'others',
    germany: 'Im Einzelfall erlaubt, bei Ferkeln unter vier Tagen ohne Betäubung.',
    others: [
      { country: 'Schweiz', rule: 'Ausnahmslos verboten.' },
      { country: 'Norwegen', rule: 'Nur bei tierärztlicher Indikation, durch Tierärzte und mit Betäubung.' },
      { country: 'Schweden', rule: 'Eingriffe nur aus tiermedizinischen Gründen.' },
    ],
    summary: 'In der Schweiz ist das Kürzen der Ringelschwänze ganz verboten. In Deutschland ist es im Einzelfall weiter zulässig.',
    sources: ['tierSchG5', 'chTSchV', 'noSvin', 'seDjurskyddslag', 'eu2008_120'],
  },
  {
    topic: 'Vollspaltenboden für Mastschweine',
    verdict: 'others',
    germany: 'Kein Verbot. Ein Vollspaltenboden besteht in der ganzen Bucht aus Spalten, durch die Kot und Harn fallen, ohne geschlossene Liegefläche.',
    others: [
      { country: 'Österreich', rule: 'Unstrukturierte Vollspaltenbuchten ohne Funktionsbereiche sind für Neu- und Umbauten seit 2023 verboten, für bestehende Ställe ab 1. Juni 2034. Wer in den 16 Jahren davor gebaut hat, bekommt 16 Jahre ab Fertigstellung.' },
      { country: 'Norwegen', rule: 'Der Liegeplatz muss einen geschlossenen Boden oder Einstreu haben.' },
      { country: 'Schweiz', rule: 'Ein zusammenhängender Liegebereich mit nur wenig Perforation ist Pflicht.' },
    ],
    summary: 'Österreich steigt aus dem einfachen Vollspaltenboden aus. Deutschland hat dafür keine Regel.',
    sources: ['atTSchG', 'noSvin', 'chTSchV'],
  },
  {
    topic: 'Schlachten ohne Betäubung',
    verdict: 'others',
    germany: 'Mit behördlicher Ausnahmegenehmigung aus religiösen Gründen erlaubt.',
    others: [
      { country: 'Schweden, Norwegen, Dänemark', rule: 'Eine Betäubung vor dem Schlachten ist immer Pflicht, auch bei religiöser Schlachtung.' },
      { country: 'Schweiz', rule: 'Säugetiere dürfen nur mit Betäubung geschlachtet werden. Geflügel muss ebenfalls betäubt werden, außer bei ritueller Schlachtung.' },
      { country: 'Österreich', rule: 'Die Tiere müssen mindestens direkt nach dem Schnitt betäubt werden.' },
    ],
    summary: 'Mehrere Länder verlangen immer eine Betäubung. Der Europäische Gerichtshof hat 2020 bestätigt, dass Mitgliedstaaten das dürfen.',
    sources: ['tierSchG4a', 'seDjurskyddslag', 'noDyrevelferd', 'dkSlaughter', 'chTSchG', 'chTSchV', 'atTSchG', 'eugh336_19'],
  },
  {
    topic: 'Dauer von Tiertransporten',
    verdict: 'others',
    germany: 'Innerhalb Deutschlands zum Schlachthof höchstens acht Stunden, bei über 30 Grad viereinhalb. Die Acht-Stunden-Grenze entfällt für Fahrzeuge und Transportunternehmen mit Zulassung für lange Beförderungen, die Hitzeregel nicht.',
    others: [
      { country: 'Schweiz', rule: 'Höchstens sechs Stunden Fahrzeit und acht Stunden Transportdauer im Inland. Rinder, Schafe, Ziegen, Schweine sowie Schlachtpferde und Schlachtgeflügel dürfen nur per Bahn oder Flugzeug durch die Schweiz reisen.' },
    ],
    summary: 'In der Schweiz sind Tiertransporte deutlich kürzer begrenzt als in Deutschland.',
    sources: ['tierSchTrV10', 'chTSchG', 'chTSchV'],
  },
  {
    topic: 'Weide und Anbindehaltung bei Rindern',
    verdict: 'others',
    germany: 'Keine bundesweite Regel. Einzelne Behörden handeln: Die Region Hannover verlangt seit Juli 2026, dass ganzjährige Anbindung innerhalb von 18 Monaten endet, kombinierte und saisonale Anbindung je nach Fall innerhalb von fünf bis sieben Jahren.',
    others: [
      { country: 'Schweden', rule: 'Rinder in der Milchproduktion, die älter als sechs Monate sind, müssen im Sommer auf die Weide. Andere Rinder über sechs Monate, außer Bullen, müssen im Sommer auf die Weide oder ins Freie.' },
      { country: 'Österreich', rule: 'Dauernde Anbindehaltung ist verboten. Rinder brauchen an mindestens 90 Tagen im Jahr Bewegung, Auslauf oder Weide, außer zwingende rechtliche oder technische Gründe stehen entgegen. Diese Ausnahme wird ab 2030 enger.' },
      { country: 'Schweiz', rule: 'Angebundene Rinder brauchen an mindestens 60 Tagen im Sommer und 30 Tagen im Winter Auslauf.' },
      { country: 'Tschechien', rule: 'Anbindehaltung von Nutztieren ist seit 2021 gesetzlich verboten.' },
    ],
    summary: 'Schweden schreibt Weidegang für Rinder in der Milchproduktion per Gesetz vor, Österreich verbietet dauernde Anbindung. Deutschland hat keine Bundesregel.',
    sources: ['hannoverTethering', 'seDjurskyddsforordning', 'atTSchG', 'chTSchV', 'czAnimalProtection'],
  },
  {
    topic: 'Käfige für Legehennen',
    verdict: 'others',
    germany: 'Konventionelle Käfige sind verboten. Die Kleingruppenhaltung war bis Ende 2025 erlaubt, in Härtefällen bis Ende 2028.',
    others: [
      { country: 'Österreich', rule: 'Konventionelle Käfige nur bis Ende 2008, neue ausgestaltete Käfige durften ab 2005 nicht mehr gebaut werden.' },
      { country: 'Tschechien', rule: 'Ab 1. Januar 2027 sind alle Käfige verboten, auch ausgestaltete.' },
    ],
    summary: 'Deutschland hat Käfige weitgehend abgeschafft, Österreich war aber früher fertig, und Tschechien verbietet ab 2027 alle Käfige.',
    sources: ['tierSchNutztV45', 'atTSchG', 'czCages'],
  },
  {
    topic: 'Pelztierhaltung',
    verdict: 'others',
    germany: 'Pelztierhaltung ist nicht ausdrücklich gesetzlich verboten.',
    others: [
      { country: 'Österreich', rule: 'Verboten.' },
      { country: 'England und Wales', rule: 'Verboten seit 2003.' },
      { country: 'Niederlande', rule: 'Verboten seit 8. Januar 2021.' },
      { country: 'Tschechien', rule: 'Zucht und Tötung von Tieren vor allem für Pelz verboten.' },
    ],
    summary: 'Mehrere Länder verbieten Pelzfarmen ausdrücklich per Gesetz. Deutschland nicht.',
    sources: ['atTSchG', 'ukFur', 'nlFur', 'czAnimalProtection'],
  },
  {
    topic: 'Videoüberwachung in Schlachthöfen',
    verdict: 'others',
    germany: 'Ein Gesetzentwurf der Bundesregierung vom 1. Juli 2026 sieht Kameras für größere Schlachthöfe vor. Beschlossen ist er noch nicht.',
    others: [
      { country: 'England', rule: 'Pflicht seit 2018.' },
      { country: 'Spanien', rule: 'Pflicht in allen Schlachthöfen, unabhängig von der Größe.' },
    ],
    summary: 'In England und Spanien sind Kameras im Schlachthof schon Pflicht. Deutschland berät noch.',
    sources: ['btDrs21_6809', 'ukCctv', 'esCctv'],
  },
  {
    topic: 'Betäubung von Schweinen mit CO2',
    verdict: 'unclear',
    germany: 'Erlaubt und weit verbreitet.',
    others: [
      { country: 'England', rule: 'Hat im Dezember 2025 angekündigt, die Betäubung von Schweinen mit CO2 anzugehen. Ein Verbot gibt es noch nicht.' },
      { country: 'Übrige untersuchte Länder', rule: 'Kein Verbot und kein fester Ausstiegsplan gefunden.' },
    ],
    summary: 'Die EFSA nennt hoch konzentriertes CO2 stark belastend für Schweine. Kein Land hat die Methode bisher verboten. England hat im Dezember 2025 angekündigt, das Problem anzugehen.',
    sources: ['efsaPigs2020', 'agrarheuteCo2', 'defraStrategy2025'],
  },
]
