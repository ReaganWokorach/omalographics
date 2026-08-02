# Photo manifest — assets/photos/

Every image slot on the site now points to `assets/photos/<name>.jpg`.
Until a real photo exists at that path, the page automatically falls back
to the old illustration of the same name, so nothing ever looks broken —
each photo just needs to be dropped into this folder to take over.

Run `bash download-images.sh` first — it auto-fetches 9 of the 12, all
real, free, license-clear African photography (Cytonn Photography in
Nairobi, Kenya; Tunde Buremo at Bodija Market in Ibadan, Nigeria; Raymond
Owusu-Afriyie in Kumasi, Ghana — all Unsplash License, free for
commercial use, no attribution required).

The remaining 3 need one manual click each — authentic African shots of
print-production and signage equipment specifically are rare on free
stock sites, so these are worth hand-picking rather than auto-grabbing.
For each: open the link, click "Download free," and save it into
`assets/photos/` using the exact filename listed.

## ✅ Auto-downloaded by the script

| File | Used for | Source |
|---|---|---|
| `handshake.jpg` | Corporate Branding | Cytonn Photography, Nairobi |
| `graphic-design.jpg` | Graphic Design | Cytonn Photography, Nairobi |
| `digital-social.jpg` | Digital and Social | Cytonn Photography, Nairobi |
| `design-detail.jpg` | About page (design detail) | Cytonn Photography, Nairobi |
| `team-review.jpg` | Homepage hero | Cytonn Photography, Nairobi |
| `community-event.jpg` | Event Branding | Tunde Buremo, Bodija Market, Ibadan, Nigeria |
| `studio-team.jpg` | Approach page | Raymond Owusu-Afriyie, Kumasi, Ghana |
| `creative-team.jpg` | About page | Raymond Owusu-Afriyie, Kumasi, Ghana |
| `promo-laptop.jpg` | Promotional Materials | Raymond Owusu-Afriyie, Kumasi, Ghana |

## 🖱️ Pick one manually (1 click each)

| File | Used for | Search a match here |
|---|---|---|
| `print-press.jpg` | Printing | [Unsplash: print shop / printing press](https://unsplash.com/s/photos/print-shop) |
| `large-format.jpg` | Large Format | [Unsplash: printing machine / large format](https://unsplash.com/s/photos/printing-machine) |
| `signage-production.jpg` | Signage and Displays | [Unsplash: signage / storefront sign](https://unsplash.com/s/photos/signage) |

**Tip:** on Unsplash, adding a city name (Lagos, Nairobi, Accra,
Johannesburg, Kumasi) to a search narrows results to authentically
African shots. Look for "Free to use under the Unsplash License" on the
photo page — that means free for commercial use, no attribution required.

## Sizing
Any JPG roughly 1200–1800px wide works well; the CSS already crops/scales
these panels responsively.
