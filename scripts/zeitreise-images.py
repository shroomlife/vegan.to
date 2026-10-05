"""Builds the web sizes of the licensed Envato originals for /img/zeitreise.

For every original <name>.jpg four widths are written as AVIF, WebP and JPEG:
<name>-640.avif ... <name>-2560.jpg, which src/components/SceneImage.vue turns
into a <picture>. 2560 serves 4K screens at full bleed; quality is set high
enough that the backdrops stay clean without a dark overlay.

Usage: python scripts/zeitreise-images.py <folder with originals> public/img/zeitreise [name ...]
The licensed originals are not part of the repository.
"""
from pathlib import Path
import sys

from PIL import Image, ImageOps

SOURCE = Path(sys.argv[1])
TARGET = Path(sys.argv[2])
WIDTHS = (640, 1280, 1920, 2560)
NAMES = [p for p in sys.argv[3:]] or None

for original in sorted(SOURCE.glob('*.jpg')):
    name = original.stem
    if NAMES and name not in NAMES:
        continue
    with Image.open(original) as source:
        image = ImageOps.exif_transpose(source).convert('RGB')
    for width in WIDTHS:
        if image.width < width:
            scaled = image.copy()
        else:
            height = round(image.height * width / image.width)
            scaled = image.resize((width, height), Image.Resampling.LANCZOS)
        scaled.save(TARGET / f'{name}-{width}.avif', quality=68, speed=3)
        scaled.save(TARGET / f'{name}-{width}.webp', quality=84, method=6)
        scaled.save(TARGET / f'{name}-{width}.jpg', quality=86, optimize=True, progressive=True)
    print(name, image.size, 'done')
