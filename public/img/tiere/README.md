# Artenporträts

Zehn Porträts in einem Stil, eins je Tierart (`src/data/species.ts`), für das
Kapitel „Wer sie sind“ auf der Startseite und die Artenseiten.

Die Bilder sind KI-generiert (OpenAI GPT Image 2.5, Oktober 2026) und zeigen
keine realen Tiere. Jedes Bild trägt den Hinweis sichtbar
(`src/components/SpeciesPortrait.vue`) und maschinenlesbar im XMP
(`Iptc4xmpExt:DigitalSourceType` = `trainedAlgorithmicMedia`), wie es der
EU AI Act verlangt. Die Originale (PNG mit C2PA-Manifest) liegen nicht im
Repository.

Hier liegen nur die Web-Größen: je Art `<slug>-512`, `-768` und `-1024` als
AVIF, WebP und JPEG. Neu erzeugen mit

    python scripts/species-portraits.py <Ordner mit Originalen> public/img/tiere
