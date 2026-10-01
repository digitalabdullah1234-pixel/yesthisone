from pathlib import Path

import pymupdf


FILES = [
    ("rahaf_full", "attached_assets/منيو_بيانكو_-_رهف_1790585630320.pdf"),
    ("menu_v3_5", "attached_assets/المنيو_تبع_بيانكو_3.5_1790585630321.pdf"),
    ("menu_update", "attached_assets/تحديث_منيو_بيانكو_1790585630321.pdf"),
]
OUTPUT_ROOT = Path(".agents/outputs/bianco-menu-review")
PAGE_SCALE = 0.9
SHEET_COLUMNS = 3
SHEET_ROWS = 3
CELL_WIDTH = 376
CELL_HEIGHT = 490
SHEET_MARGIN = 24


def render_contact_sheets(name: str, source: pymupdf.Document) -> None:
    sheet_size = SHEET_COLUMNS * CELL_WIDTH + 2 * SHEET_MARGIN
    sheet_height = SHEET_ROWS * CELL_HEIGHT + 2 * SHEET_MARGIN
    pages_per_sheet = SHEET_COLUMNS * SHEET_ROWS

    for start in range(0, source.page_count, pages_per_sheet):
        sheet = pymupdf.open()
        canvas = sheet.new_page(width=sheet_size, height=sheet_height)
        for cell, page_index in enumerate(
            range(start, min(start + pages_per_sheet, source.page_count))
        ):
            column = cell % SHEET_COLUMNS
            row = cell // SHEET_COLUMNS
            x = SHEET_MARGIN + column * CELL_WIDTH
            y = SHEET_MARGIN + row * CELL_HEIGHT
            canvas.draw_rect(
                pymupdf.Rect(x, y, x + CELL_WIDTH - 8, y + CELL_HEIGHT - 8),
                color=(0.78, 0.75, 0.70),
                width=0.5,
            )
            canvas.insert_text(
                pymupdf.Point(x + 8, y + 15),
                f"Page {page_index + 1}",
                fontsize=9,
                color=(0.25, 0.25, 0.25),
            )
            image_rect = pymupdf.Rect(
                x + 8,
                y + 24,
                x + CELL_WIDTH - 16,
                y + CELL_HEIGHT - 16,
            )
            canvas.show_pdf_page(
                image_rect,
                source,
                page_index,
                keep_proportion=True,
            )

        out_path = OUTPUT_ROOT / f"{name}-contact-{start // pages_per_sheet + 1}.png"
        sheet[0].get_pixmap(matrix=pymupdf.Matrix(1.5, 1.5), alpha=False).save(out_path)
        sheet.close()


def main() -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    summary_lines: list[str] = []

    for name, file_name in FILES:
        path = Path(file_name)
        document = pymupdf.open(path)
        info = document.metadata
        image_dir = OUTPUT_ROOT / f"{name}-pages"
        image_dir.mkdir(parents=True, exist_ok=True)
        page_texts: list[str] = []
        image_pages: list[str] = []

        for page_index, page in enumerate(document):
            pixmap = page.get_pixmap(
                matrix=pymupdf.Matrix(PAGE_SCALE, PAGE_SCALE),
                alpha=False,
            )
            pixmap.save(image_dir / f"page-{page_index + 1:02d}.png")
            page_texts.append(
                f"\n--- PAGE {page_index + 1} ---\n{page.get_text(sort=True)}"
            )
            image_count = len(page.get_images(full=True))
            image_pages.append(f"page {page_index + 1}: {image_count} embedded images")

        (OUTPUT_ROOT / f"{name}-text.txt").write_text(
            "\n".join(page_texts),
            encoding="utf-8",
        )
        render_contact_sheets(name, document)
        summary_lines.extend(
            [
                f"{name}: {path}",
                f"  pages: {document.page_count}",
                f"  title: {info.get('title')}",
                f"  author: {info.get('author')}",
                f"  created: {info.get('creationDate')}",
                f"  modified: {info.get('modDate')}",
                f"  embedded images: {'; '.join(image_pages)}",
            ]
        )
        document.close()

    summary = "\n".join(summary_lines)
    (OUTPUT_ROOT / "summary.txt").write_text(summary, encoding="utf-8")
    print(summary)


if __name__ == "__main__":
    main()