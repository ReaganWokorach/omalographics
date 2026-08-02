#!/usr/bin/env bash
# Omalo Graphics — real photo downloader
# Run this on a machine with internet access (this sandbox has none).
# Downloads free, license-clear African photography straight into
# assets/photos/ using the exact filenames the site's HTML expects.
#
# Usage:  cd site && bash download-images.sh
set -e
cd "$(dirname "$0")/assets/photos"

echo "Downloading real African photos (free Unsplash License, no attribution required)..."

# Cytonn Photography — Nairobi, Kenya
curl -L "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?fm=jpg&q=80&w=1600&fit=crop" -o handshake.jpg
curl -L "https://images.unsplash.com/photo-1521790945508-bf2a36314e85?fm=jpg&q=80&w=1600&fit=crop" -o graphic-design.jpg
curl -L "https://images.unsplash.com/photo-1521790609145-bacea5940bde?fm=jpg&q=80&w=1600&fit=crop" -o digital-social.jpg
curl -L "https://images.unsplash.com/photo-1521791055366-0d553872125f?fm=jpg&q=80&w=1600&fit=crop" -o design-detail.jpg
curl -L "https://images.unsplash.com/photo-1521791136064-7986c2920216?fm=jpg&q=80&w=1600&fit=crop" -o team-review.jpg

# Tunde Buremo — Bodija Market, Ibadan, Nigeria
curl -L "https://images.unsplash.com/photo-1734255026082-82fdc81991f0?fm=jpg&q=80&w=1600&fit=crop" -o community-event.jpg

# Raymond Owusu-Afriyie — Kumasi, Ghana
curl -L "https://images.unsplash.com/photo-1666866834805-8cc91d4774ac?fm=jpg&q=80&w=1600&fit=crop" -o studio-team.jpg
curl -L "https://images.unsplash.com/photo-1624278268445-6a58c27656ec?fm=jpg&q=80&w=1600&fit=crop" -o creative-team.jpg
curl -L "https://images.unsplash.com/photo-1666866868698-67ee989fba70?fm=jpg&q=80&w=1600&fit=crop" -o promo-laptop.jpg

echo ""
echo "9 of 12 photos downloaded automatically."
echo "3 remain (print-press.jpg, large-format.jpg, signage-production.jpg) —"
echo "genuine African shots of print/signage equipment specifically are rare"
echo "on free stock sites, so these are best hand-picked. See photo-manifest.md"
echo "for a direct search link + exact filename for each."
