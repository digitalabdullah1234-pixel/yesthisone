from pathlib import Path

import fitz


pdf_path = Path("attached_assets/المنيو_تبع_بيانكو_3.5_1790157161605.pdf")
output_dir = Path(".agents/outputs/bianco-menu")
output_dir.mkdir(parents=True, exist_ok=True)
asset_dir = Path("artifacts/bianco-restaurant/public/menu-dishes")
asset_dir.mkdir(parents=True, exist_ok=True)

# Food-photo pages in the supplied menu, using the page order from the PDF.
dish_pages = {
    3: "mushroom-soup",
    4: "arancini",
    5: "chili-shrimp",
    6: "french-fries",
    8: "burrata-salad",
    9: "bianco-salad",
    10: "portobello-shrimp-salad",
    12: "margherita-pizza",
    13: "diavola-pizza",
    14: "beef-bianco-pizza",
    15: "chicken-polo-pizza",
    16: "truffle-pizza",
    18: "seafood-spaghetti",
    19: "penne-rose",
    20: "rigatoni-pesto",
    21: "funghi-risotto",
    22: "truffle-fettuccine",
    24: "beef-bianco",
    25: "grilled-salmon",
}

document = fitz.open(pdf_path)
print(f"pages={document.page_count}")
for page_number, page in enumerate(document):
    matrix = fitz.Matrix(1.2, 1.2)
    pixmap = page.get_pixmap(matrix=matrix, alpha=False)
    output_path = output_dir / f"page-{page_number + 1:02d}.png"
    pixmap.save(output_path)
    image_blocks = sum(1 for block in page.get_text("dict")["blocks"] if block.get("type") == 1)
    print(f"{page_number + 1:02d}: {page.rect.width:.0f}x{page.rect.height:.0f} image_blocks={image_blocks} -> {output_path}")

    dish_name = dish_pages.get(page_number + 1)
    if dish_name:
        images = []
        for image in page.get_images(full=True):
            xref = image[0]
            image_info = document.extract_image(xref)
            images.append((image_info["width"] * image_info["height"], image_info))
        if images:
            _, image_info = max(images, key=lambda item: item[0])
            suffix = image_info["ext"]
            asset_path = asset_dir / f"{dish_name}.{suffix}"
            asset_path.write_bytes(image_info["image"])
            print(f"  extracted {asset_path} ({image_info['width']}x{image_info['height']})")