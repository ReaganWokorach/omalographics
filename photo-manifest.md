# Photo manifest — assets/photos/

Every image slot on the site now points to `assets/photos/<name>.jpg`.
Until a real photo exists at that path, the page automatically falls back
to the old illustration of the same name, so nothing ever looks broken —
each photo just needs to be dropped into this folder to take over.

Run `bash download-images.sh` first — it auto-fetches 5 of the 12 using
real, free, license-clear African photography (Cytonn Photography, shot
in Nairobi, Kenya — Unsplash License, free for commercial use, no
attribution required). The remaining 7 need one manual click each,
because good African-context matches for these specific categories are
best hand-picked rather than auto-grabbed. For each: open the link,
click "Download free," and save it into `assets/photos/` using the exact
filename listed.

## ✅ Auto-downloaded by the script

| File | Used for | Source |
|---|---|---|
| `handshake.jpg` | Corporate Branding | [Cytonn Photography, Nairobi](https://unsplash.com/photos/two-person-handshaking-vWchRczcQwM) |
| `graphic-design.jpg` | Graphic Design | [Cytonn Photography, Nairobi](https://unsplash.com/photos/man-sits-typing-on-macbook-air-on-table-l3MMvRYdPhc) |
| `digital-social.jpg` | Digital and Social | [Cytonn Photography, Nairobi](https://unsplash.com/photos/person-using-macbook-pro-on-brown-wooden-table-YVqy4V2REqI) |
| `design-detail.jpg` | About page (design detail) | [Cytonn Photography, Nairobi](https://unsplash.com/photos/person-writing-on-white-paper-GJao3ZTX9gU) |
| `team-review.jpg` | Homepage hero | [Cytonn Photography, Nairobi](https://unsplash.com/photos/two-people-shaking-hands-n95VMLxqM2I) |

## 🖱️ Pick one manually (1 click each)

| File | Used for | Search a match here |
|---|---|---|
| `print-press.jpg` | Printing | [Unsplash: African print shop / printing press](https://unsplash.com/s/photos/print-press) |
| `large-format.jpg` | Large Format | [Unsplash: large format printer / billboard printing](https://unsplash.com/s/photos/printing-machine) |
| `signage-production.jpg` | Signage and Displays | [Unsplash: African shop signage / storefront](https://unsplash.com/s/photos/african-business) |
| `community-event.jpg` | Event Branding | [Unsplash: African conference / event crowd](https://unsplash.com/s/photos/african-community) |
| `promo-laptop.jpg` | Promotional Materials | [Unsplash: branded merchandise / promo items](https://unsplash.com/s/photos/business-hand-shake) |
| `studio-team.jpg` | Approach page | [Unsplash: African creative team, office](https://unsplash.com/s/photos/african-office) |
| `creative-team.jpg` | About page | [Unsplash: African graphic designers at work](https://unsplash.com/s/photos/african-graphic-designers) |

**Tip:** on Unsplash, adding `&africa` or a specific city (Lagos, Nairobi,
Accra, Johannesburg) to a search narrows results to authentically African
shots. Look for "Free to use under the Unsplash License" on the photo
page — that means free for commercial use, no attribution required.

## Sizing
Any JPG roughly 1200–1800px wide works well; the CSS already crops/scales
these panels responsively.
