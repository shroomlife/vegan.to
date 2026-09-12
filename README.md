# vegan.to

**Echtzeit-Zähler für Tierschlachtungen in Deutschland.**

Jede Sekunde werden in Deutschland Tiere getötet. Diese Seite macht das sichtbar, mit Live-Zahlen auf Basis der offiziellen Statistiken des Statistischen Bundesamts (Destatis).

**[vegan.to](https://vegan.to)**

---

## Was die Seite zeigt

- Echtzeit-Schlachtzähler: Tiere pro Sekunde, heute, dieses Jahr, Fische als gekennzeichnete Schätzung
- Victim Ticker: Namen, Alter und Schlachthof-Standorte als aufsteigende Bubbles
- Persönlicher Impact: Was du sparst, wenn du vegan lebst (Tierleben, Wasser, CO2, Land)
- Wachstum der Bewegung: Live-Odometer mit der Zahl der Veganer\*innen in Deutschland
- Ressourcen: 20 geprüfte Links zum Starten, Informieren und Aktivwerden, darunter warum-vegan.com und wie-vegan.com

## Datenquellen

| Kategorie | Quelle | Jahr |
|-----------|--------|------|
| Rinder, Schweine, Schafe, Ziegen, Pferde | [Destatis GENESIS 41331-0001](https://www-genesis.destatis.de/genesis/online?selectionname=41331-0001) | 2025 |
| Hühner, Enten, Truthühner, Gänse | [Destatis GENESIS 41322-0001](https://www-genesis.destatis.de/genesis/online?selectionname=41322-0001) | 2025 |
| Fische (Schätzung) | [fishcount.org.uk](https://fishcount.org.uk/estimates/wildfishes/data03/fishcount_global_wild_fish_estimate.php?selyear=2003to2022&selcountry=Germany&selspecies=*+All+species+*) Fang der deutschen Fischerei, [Destatis Aquakultur](https://www.destatis.de/DE/Presse/Pressemitteilungen/2026/06/PD26_188_41362.html) | Schnitt 2003 bis 2022, 2025 |
| Impact-Berechnung | Scarborough et al. (2023, *Nature Food*), Destatis, Umweltbundesamt, myclimate | 2023 |
| Veganer\*innen in DE | NVS II, VEBU, SKOPOS, IfD Allensbach (AWA) | 2008 bis 2025 |
| Schlachthof-Standorte | Tönnies, Vion, Westfleisch, PHW, Danish Crown u.a. | 130+ Orte |

## Tech Stack

- **Vue 3.5** + TypeScript + Composition API
- **Vite 6** + vite-plugin-pwa
- **motion-v**: Scroll-Animationen, Staggered Reveals
- **@vueuse/core**: `useTransition` für animierte Zahlenwerte
- **dayjs** + **humanize-duration**: Zeitberechnung
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
