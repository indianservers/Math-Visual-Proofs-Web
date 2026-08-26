from pathlib import Path
from PIL import Image, ImageChops, ImageEnhance
import numpy as np

root = Path(__file__).parent
refs = Path(r"D:\Math App Screenshots for UI Update\Visual Proofs")
names = [
    "001-pythagorean-theorem-area-rearrangement.png",
    "002-triangle-area-half-rectangle.png",
    "003-triangle-angle-sum.png",
    "004-exterior-angle-theorem.png",
    "005-similar-triangles-proportional-sides.png",
]
for i, name in enumerate(names, 1):
    render = Image.open(root / f"render-{i:03}.png").convert("RGB")
    reference = Image.open(refs / name).convert("RGB").resize(render.size, Image.Resampling.LANCZOS)
    Image.blend(reference, render, 0.5).save(root / f"overlay-{i:03}.png")
    diff = ImageChops.difference(reference, render)
    ImageEnhance.Contrast(diff).enhance(2.5).save(root / f"diff-{i:03}.png")
    mae = np.asarray(diff, dtype=np.float32).mean() / 255
    print(f"{i:03}: {render.width}x{render.height}, normalized MAE={mae:.4f}")
