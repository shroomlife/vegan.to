<script setup lang="ts">
import ContentPage from '@/components/ContentPage.vue'
import { useConsent } from '@/composables/useConsent'
import { operator, privacyPolicyDate } from '@/data/legal'
import { CONSENT_STORAGE_KEY } from '@/utils/consentStorage'
import { TRACKER_STORAGE_KEY } from '@/composables/usePersonalTracker'
import { GA_MEASUREMENT_ID } from '@/utils/analytics'

const { choice, openSettings } = useConsent()
const gaCookieSuffix = GA_MEASUREMENT_ID.replace(/^G-/, '')
</script>

<template>
  <ContentPage
    kicker="Rechtliches"
    title="Datenschutzerklärung"
    lead="Was beim Besuch von vegan.to mit deinen Daten passiert. Kurz gesagt: ohne deine Einwilligung nur das, was ein Webserver technisch braucht."
  >
    <h2>Verantwortlich</h2>
    <address>
      {{ operator.name }}<br>
      {{ operator.street }}<br>
      {{ operator.city }}<br>
      E-Mail: <a :href="`mailto:${operator.email}`">{{ operator.email }}</a>
    </address>

    <h2>Hosting bei GitHub Pages</h2>
    <p>
      vegan.to liegt auf GitHub Pages, einem Dienst der GitHub, Inc., 88 Colin P. Kelly Jr. St., San Francisco, CA 94107,
      USA. Beim Aufruf einer Seite überträgt dein
      Browser zwangsläufig deine IP-Adresse an die Server von GitHub. GitHub schreibt dazu: Wird eine GitHub-Pages-Seite
      besucht, wird die IP-Adresse aus Sicherheitsgründen protokolliert und gespeichert, unabhängig davon, ob du bei GitHub
      angemeldet bist. Wie lange GitHub diese Protokolle speichert, legt GitHub selbst fest. Eine feste Frist nennt GitHub
      nicht.
    </p>
    <p>
      Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO: das berechtigte Interesse, die Seite sicher und zuverlässig
      auszuliefern. GitHub ist nach dem EU-US Data Privacy Framework zertifiziert, auf das sich die Übermittlung in die USA
      stützt. Mehr in der
      <a href="https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection" target="_blank" rel="noopener">Dokumentation zu GitHub Pages</a>
      und im
      <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener">GitHub Privacy Statement</a>.
    </p>

    <h2>Was nur in deinem Browser bleibt</h2>
    <p>vegan.to speichert ohne Einwilligung nur, was für die Seite selbst nötig ist oder was du ausdrücklich eingibst:</p>
    <ul>
      <li>
        <strong>Deine Entscheidung zu Google Analytics</strong> im lokalen Speicher deines Browsers (<code>{{ CONSENT_STORAGE_KEY }}</code>),
        damit der Hinweis nicht bei jedem Besuch wieder erscheint.
      </li>
      <li>
        <strong>Dein Startdatum</strong> im Bereich „Dein Impact“ (<code>{{ TRACKER_STORAGE_KEY }}</code>), nur wenn du dort eines
        einträgst. Du kannst es dort jederzeit wieder löschen.
      </li>
      <li>
        <strong>Ein Offline-Speicher</strong> (Service Worker) mit den Dateien der Seite. Er dient nur dazu, dir die Seite,
        die du aufrufst, schneller und auch ohne Netz auszuliefern.
      </li>
    </ul>
    <p>
      Diese Einträge bleiben in deinem Browser, bis du sie löschst, etwa über das Startdatum im Bereich „Dein Impact“ oder
      in den Einstellungen deines Browsers. Der Offline-Speicher wird mit jeder neuen Version der Seite automatisch ersetzt.
    </p>
    <p>
      Nichts davon wird an uns oder an Dritte übertragen. Rechtsgrundlagen sind § 25 Abs. 2 Nr. 2 TDDDG und Art. 6 Abs. 1 lit. f
      DSGVO. Diese Speicherung ist für den Dienst, den du nutzt, unbedingt erforderlich.
    </p>
    <p>
      Die Schriften (Lato und Unbounded) liegen auf dem Server von vegan.to selbst. Es gibt keine Verbindung zu Google Fonts
      oder anderen Schriftanbietern.
    </p>

    <h2>Google Analytics, nur mit Einwilligung</h2>
    <p>
      Wenn du im Hinweis „Einverstanden“ wählst, nutzt vegan.to Google Analytics 4, einen Dienst der Google Ireland Limited,
      Gordon House, Barrow Street, Dublin 4, Irland. Damit sehen wir, welche Seiten aufgerufen werden und wie Besucherinnen
      und Besucher auf vegan.to kommen. Vorher wird nichts von Google geladen.
    </p>
    <ul>
      <li>
        <strong>Rechtsgrundlage:</strong> deine Einwilligung nach Art. 6 Abs. 1 lit. a DSGVO und § 25 Abs. 1 TDDDG.
      </li>
      <li>
        <strong>Cookies:</strong> <code>_ga</code> (unterscheidet Nutzerinnen und Nutzer) und <code>_ga_{{ gaCookieSuffix }}</code>
        (hält die Sitzung fest), laut Google jeweils mit einer Laufzeit von zwei Jahren.
      </li>
      <li>
        <strong>Verarbeitete Daten:</strong> aufgerufene Seiten, Zeitpunkt, ungefährer Standort (Stadt, Land), Gerät, Browser,
        Bildschirmgröße, die Seite, von der du kommst, Interaktionen wie Scrollen, Klicks auf externe Links und Downloads
        sowie eine zufällige Kennung aus dem Cookie <code>_ga</code>.
      </li>
      <li>
        <strong>IP-Adresse:</strong> Laut Google werden IP-Adressen von Nutzerinnen und Nutzern in der EU nicht protokolliert
        oder gespeichert, sondern nur zur Ableitung des ungefähren Standorts genutzt und danach sofort gelöscht.
      </li>
      <li>
        <strong>Ausgeschaltet:</strong> Google Signals und die Nutzung für personalisierte Werbung sind ausgeschaltet.
      </li>
      <li>
        <strong>Speicherdauer:</strong> Einzelne Nutzer- und Ereignisdaten löscht Google Analytics nach zwei Monaten.
        Zusammengefasste Berichte ohne Personenbezug bleiben erhalten.
      </li>
      <li>
        <strong>Auftragsverarbeitung:</strong> Google verarbeitet die Daten in unserem Auftrag. Dafür gelten die
        Datenverarbeitungsbedingungen von Google (Art. 28 DSGVO).
      </li>
      <li>
        <strong>Übermittlung in die USA:</strong> Google kann Daten an die Google LLC in den USA übermitteln. Google LLC ist
        nach dem EU-US Data Privacy Framework zertifiziert.
      </li>
    </ul>
    <p>
      Mehr dazu in den
      <a href="https://support.google.com/analytics/answer/12017362?hl=de" target="_blank" rel="noopener">Hinweisen von Google zum Datenschutz in Analytics</a>
      und in der
      <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">Datenschutzerklärung von Google</a>.
    </p>

    <h3>Einwilligung ändern oder widerrufen</h3>
    <p>
      Du kannst deine Entscheidung jederzeit ändern, mit Wirkung für die Zukunft. Beim Widerruf werden die Analytics-Cookies
      gelöscht und keine Daten mehr gesendet.
      <!-- The choice lives in the visitor's browser only. The prerender stores its own
           'denied', so it drops this line from the snapshot (data-client-only) -->
      <span v-if="choice === 'granted'" data-client-only>Aktuell hast du der Nutzung von Google Analytics <strong>zugestimmt</strong>.</span>
      <span v-else-if="choice" data-client-only>Aktuell hast du die Nutzung von Google Analytics <strong>abgelehnt</strong>.</span>
    </p>
    <p>
      <button type="button" class="privacy-settings" @click="openSettings">Cookie-Einstellungen öffnen</button>
    </p>

    <h2>Links zu anderen Seiten</h2>
    <p>
      vegan.to verlinkt auf Quellen und andere Angebote. Erst wenn du einen solchen Link anklickst, baut dein Browser eine
      Verbindung zu dieser Seite auf. Ab dann gilt deren Datenschutzerklärung.
    </p>

    <h2>Kontakt per E-Mail</h2>
    <p>
      Wenn du uns schreibst, verarbeiten wir deine Adresse und deine Nachricht, um zu antworten (Art. 6 Abs. 1 lit. f DSGVO).
      Die Nachricht wird gelöscht, wenn die Anfrage erledigt ist und keine gesetzliche Aufbewahrungspflicht besteht.
    </p>

    <h2>Deine Rechte</h2>
    <p>
      Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der
      Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine Einwilligung kannst du jederzeit widerrufen
      (Art. 7 Abs. 3). Schreib dafür einfach an <a :href="`mailto:${operator.email}`">{{ operator.email }}</a>.
    </p>
    <h3>Widerspruchsrecht</h3>
    <p>
      Soweit Daten auf Grundlage berechtigter Interessen (Art. 6 Abs. 1 lit. f DSGVO) verarbeitet werden, kannst du aus
      Gründen, die sich aus deiner besonderen Situation ergeben, jederzeit widersprechen (Art. 21 Abs. 1 DSGVO). Eine
      formlose Nachricht an <a :href="`mailto:${operator.email}`">{{ operator.email }}</a> genügt.
    </p>
    <p>
      Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Zuständig ist der
      Landesbeauftragte für den Datenschutz und die Informationsfreiheit Baden-Württemberg, Heilbronner Straße 35,
      70191 Stuttgart,
      <a href="https://www.baden-wuerttemberg.datenschutz.de" target="_blank" rel="noopener">baden-wuerttemberg.datenschutz.de</a>.
    </p>

    <p class="privacy-date">Stand: {{ privacyPolicyDate }}</p>
  </ContentPage>
</template>

<style scoped>
.privacy-settings {
  padding: 11px 20px;
  border-radius: 999px;
  border: 1.5px solid rgba(20, 54, 31, 0.25);
  background: #fff;
  color: var(--brand-green);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 0.15s;
}
.privacy-settings:hover,
.privacy-settings:focus-visible {
  border-color: var(--brand-accent);
}
.privacy-date {
  margin-top: 2.5rem;
  font-size: 0.85rem;
  color: var(--brand-faint);
}
</style>
