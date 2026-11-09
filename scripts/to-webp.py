# Convert the transparent drawings from prepare-assets.ps1 to WebP (about a
# fifth of the size). Run after that script:  python3 scripts/to-webp.py
# Needs Pillow (pip install pillow). Removes the PNG it converted.
import os
from PIL import Image

IMG = os.path.join(os.path.dirname(__file__), '..', 'public', 'img')
NAMES = ['friends', 'health-cycle', 'health-figure-1', 'health-figure-2', 'health-figure-3', 'sunny-tree', 'thumbs-up']

for name in NAMES:
    png = os.path.join(IMG, name + '.png')
    if not os.path.exists(png):
        continue
    webp = os.path.join(IMG, name + '.webp')
    Image.open(png).save(webp, 'WEBP', quality=86, method=6)
    print(f'{name}: {os.path.getsize(png) // 1024} kB -> {os.path.getsize(webp) // 1024} kB')
    os.remove(png)
