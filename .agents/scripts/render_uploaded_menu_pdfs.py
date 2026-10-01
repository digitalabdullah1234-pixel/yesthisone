from pathlib import Path

import fitz


FILES = [
    Path("attached_assets/منيو_بيانكو_-_رهف_1790177513775.pdf"),
    Path("attached_assets/تحديث_منيو_بيانكو_1790177513779.pdf"),
    Path("attached_assets/المنيو_تبع_بيانكو_3.5_1790177513780.pdf"),
]

OUT = Path(".agents/outputs/menu-pdf-previews")
OUT.mkdir(parents=True, exist_ok=True)

for path in FILES:
    doc = fitz.open(path)
    folder = OUT / path.stem
    folder.mkdir(parents=True, exist_ok=True)
    print(f"{path.name}: {len(doc)} pages")
    for index, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(0.35, 0.35), alpha=False)
        output = folder / f"page-{index + 1:02d}.png"
        pix.save(output)
    doc.close()