---
name: PDF menu photo extraction
description: How to handle dish photography embedded in the Bianco menu PDF.
---

The Bianco menu PDF combines food photography with logos and decorative marks on each page. Selecting the largest embedded image is usually useful, but it can return a decorative asset on pages without a dish photo. Visually inspect the extracted images and map a photo only to the dish it actually depicts. If there is no confirmed match, use a clearly non-photographic placeholder or source a correct image; do not fill the slot with an unrelated dish or restaurant interior.

**Why:** A decorative image can pass file and dimension checks while rendering as a blank or ornament-only dish card, and unrelated imagery undermines trust in a restaurant menu.

**How to apply:** Keep verified dish photos in the restaurant's public menu asset directory. Check the dish-to-photo mapping visually; when no suitable asset exists, keep the menu honest with a distinct placeholder until a correct food photo is available.

For assets with a flat studio-color backdrop, remove only the connected background regions at the image edges and keep the original food pixels. Avoid global color-key removal: crust, sauce, and garnishes can share the backdrop color. Do not force this treatment onto white-on-white or real-world photos unless the result is visually clean.

**Why:** Broad color removal creates transparent holes in food, while complex backgrounds do not have a reliable single color to key out.

**How to apply:** Review each cutout composited on the site's cream surface before using it. Preserve the source photo and use a correct, non-cutout photo when a safe mask is not available.