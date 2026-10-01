---
name: Splash image reveal
description: Reliable bottom-to-top loading animation for the Bianco splash artwork.
---

For the Bianco splash artwork, render the hand as a direct image and animate a bottom-anchored vertical transform from 0 to 1. Nested CSS background and clip layers did not paint reliably in the proxied preview.

**Why:** The direct image consistently loads in the preview while CSS background and clipped reveal layers intermittently showed only a tiny fragment.

**How to apply:** Keep the splash background matched to the artwork's maroon fill, preserve the image aspect ratio, and anchor the transform origin at the bottom center so the drawing grows upward during the 0–100% sequence.