# vegan.to

**Echtzeit-Zähler für Tierschlachtungen in Deutschland.**

Jede Sekunde werden in Deutschland Tiere getötet. Diese Seite macht das sichtbar — mit Live-Zahlen, die auf offiziellen Statistiken des Statistischen Bundesamts (Destatis) basieren.

**[vegan.to](https://vegan.to)**

---

## Was die Seite zeigt

- **Echtzeit-Schlachtzähler** — Tiere pro Sekunde, heute, dieses Jahr
- **Victim Ticker** — Namen, Alter und Schlachthof-Standorte als aufsteigende Bubbles
- **Persönlicher Impact** — Wie viel du sparst, wenn du vegan lebst (Tierleben, Wasser, CO2, Land)
- **Wachstum der Bewegung** — Live-Odometer mit der Zahl der Veganer\*innen in Deutschland
- **Ressourcen** — 18 verifizierte Links zum Starten, Informieren und Aktivwerden

## Datenquellen

| Kategorie | Quelle | Jahr |
|-----------|--------|------|
| Rinder, Schweine, Schafe, Ziegen, Pferde | [Destatis GENESIS 41331-0001](https://www-genesis.destatis.de/genesis/online?selectionname=41331-0001) | 2024 |
| Hühner, Enten, Truthühner, Gänse | [Destatis GENESIS 41322-0001](https://www-genesis.destatis.de/genesis/online?selectionname=41322-0001) | 2025 |
| Impact-Berechnung | Poore & Nemecek (2018, *Science*), Oxford Martin School | — |
| Veganer\*innen in DE | IfD Allensbach / AWA, BMEL Ernährungsreport | 2025 |
| Schlachthof-Standorte | Tönnies, Vion, Westfleisch, PHW, Danish Crown u.a. | 130+ Orte |

## Tech Stack

- **Vue 3.5** + TypeScript + Composition API
- **Vite 6** + vite-plugin-pwa
- **motion-v** — Scroll-Animationen, Staggered Reveals
- **@vueuse/core** — `useTransition` für animierte Zahlenwerte
- **dayjs** + **humanize-duration** — Zeitberechnung
- **Bun** als Package Manager

## Entwicklung

```bash
bun install       # Abhängigkeiten installieren
bun run dev       # Dev-Server mit HMR
bun run build     # Type-Check + Production Build → docs/
bun run preview   # Production Build lokal testen
bun run lint      # ESLint
```

Build-Output geht nach `docs/` für GitHub Pages (CNAME: vegan.to).

## Lizenz

ISC

---

For the animals. 🐷🐮🐔🐑🐐🦆🦃🐴🪿
