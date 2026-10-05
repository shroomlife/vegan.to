# Bilder der Zeitreise

Alle Motive sind über Envato Elements lizenziert (05.10.2026). Die Zuordnung
Datei zu Envato-Artikel steht in `src/data/topics/timeline.ts`
(`timelineAssets`). Die Originale liegen nicht im Repository.

Hier liegen nur die Web-Größen: je Motiv `<name>-640`, `-1280`, `-1920` und `-2560`
als AVIF, WebP und JPEG. `src/components/SceneImage.vue` baut daraus ein
`<picture>`. Neu erzeugen mit

    python scripts/zeitreise-images.py <Ordner mit Originalen> public/img/zeitreise

Die Clips liegen unter `public/video/zeitreise` (H.264, 1440p, 1080p und 720p,
25 fps, ohne Ton), gebaut mit `scripts/zeitreise-video.sh`; die Poster heißen
`<clip>-video` und entstehen aus dem Standbild bei Sekunde 1 mit demselben
Bild-Skript.
