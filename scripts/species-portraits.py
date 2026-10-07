"""Builds the web sizes of the AI-generated species portraits for /img/tiere.

For every original <slug>.png (square, generated with the OpenAI Image API)
three widths are written as AVIF, WebP and JPEG: <slug>-512 ... <slug>-1024.
src/components/SpeciesPortrait.vue turns them into a <picture>.

Every output carries an XMP packet that marks the picture as AI-generated in
the machine-readable IPTC way (DigitalSourceType trainedAlgorithmicMedia), the
EU AI Act asks for such a marking next to the visible note the component shows.
The originals keep their C2PA manifest and are not part of the repository.

Usage: python scripts/species-portraits.py <folder with originals> public/img/tiere [slug ...]
"""
from pathlib import Path
import sys

from PIL import Image

SOURCE = Path(sys.argv[1])
TARGET = Path(sys.argv[2])
WIDTHS = (512, 768, 1024)
SLUGS = [slug for slug in sys.argv[3:]] or None

XMP = """<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/">
   <Iptc4xmpExt:DigitalSourceType>http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia</Iptc4xmpExt:DigitalSourceType>
   <photoshop:Credit>vegan.to, KI-generiert mit OpenAI GPT Image 2.5</photoshop:Credit>
   <dc:description><rdf:Alt><rdf:li xml:lang="de">KI-generiertes Tierportraet fuer vegan.to</rdf:li></rdf:Alt></dc:description>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>""".encode('utf-8')

TARGET.mkdir(parents=True, exist_ok=True)
for original in sorted(SOURCE.glob('*.png')):
    slug = original.stem
    if SLUGS and slug not in SLUGS:
        continue
    with Image.open(original) as source:
        image = source.convert('RGB')
    if image.width != image.height:
        raise SystemExit(f'{original.name} is not square')
    for width in WIDTHS:
        scaled = image if image.width <= width else image.resize((width, width), Image.Resampling.LANCZOS)
        scaled.save(TARGET / f'{slug}-{width}.avif', quality=66, speed=3, xmp=XMP)
        scaled.save(TARGET / f'{slug}-{width}.webp', quality=82, method=6, xmp=XMP)
        scaled.save(TARGET / f'{slug}-{width}.jpg', quality=84, optimize=True, progressive=True, xmp=XMP)
    print(slug, image.size, 'done')
