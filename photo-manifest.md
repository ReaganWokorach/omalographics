# Photo manifest — assets/photos/

Every image slot on the site now shows a **real photo** — no illustrations
in the loop anymore. Each slot tries three things, in order:

1. The local file at `assets/photos/<name>.jpg`, if it's been downloaded.
2. If that's missing, the same real photo hot-linked straight from Unsplash
   (so the site never shows a broken image or a placeholder illustration).
3. Only if a visitor's browser can't reach Unsplash at all does it fall
   back to the old illustration, as a last-resort safety net.

Run `bash download-images.sh` on a machine with internet access to pull
permanent local copies of the 6 photos currently running on the Unsplash
fallback — this removes the third-party dependency and speeds up the page.
All sources below are Unsplash License: free for commercial use, no
attribution required.

## ✅ Local file already in this folder

| File | Used for |
|---|---|
| `print-press.jpg` | Printing |
| `large-format.jpg` | Large Format |
| `signage-production.jpg` | Signage and Displays |
| `community-event.jpg` | Event Branding |
| `promo-laptop.jpg` | Promotional Materials |
| `creative-team.jpg` | About page |

## 🌐 Currently live via Unsplash hot-link — run download-images.sh for a local copy

| File | Used for | Source |
|---|---|---|
| `handshake.jpg` | Corporate Branding | [Cytonn Photography, Nairobi](https://unsplash.com/photos/two-person-handshaking-vWchRczcQwM) |
| `graphic-design.jpg` | Graphic Design | [Cytonn Photography, Nairobi](https://unsplash.com/photos/man-sits-typing-on-macbook-air-on-table-l3MMvRYdPhc) |
| `digital-social.jpg` | Digital and Social | [Cytonn Photography, Nairobi](https://unsplash.com/photos/persons-hand-on-macbook-near-iphone-flat-lay-photography-ZJEKICY5EXY) |
| `design-detail.jpg` | About page (design detail) | [Cytonn Photography, Nairobi](https://unsplash.com/photos/person-writing-on-white-paper-GJao3ZTX9gU) |
| `team-review.jpg` | Homepage hero | [Cytonn Photography, Nairobi](https://unsplash.com/photos/two-people-shaking-hands-n95VMLxqM2I) |
| `studio-team.jpg` | Approach page | [Vitaly Gariev](https://unsplash.com/photos/diverse-team-collaborating-around-a-table-in-office-oiqFyLx_KDU) |

## Sizing
Any JPG roughly 1200–1800px wide works well; the CSS already crops/scales
these panels responsively.
