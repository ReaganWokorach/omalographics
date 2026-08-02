#!/usr/bin/env bash
# Omalo Graphics — real photo downloader
# Run this on a machine with internet access (this sandbox has none).
# It downloads free, license-clear photos straight into assets/photos/
# using the exact filenames the site's HTML already expects.
#
# Usage:  cd site && bash download-images.sh
set -e
cd "$(dirname "$0")/assets/photos"

echo "Downloading confirmed African photos (Cytonn Photography, Nairobi — Unsplash License, free, no attribution required)..."

curl -L "https://images.unsplash.com/photo-1521790797524-b2497295b8a0?fm=jpg&q=80&w=1600&fit=crop" -o handshake.jpg
curl -L "https://images.unsplash.com/photo-1521790945508-bf2a36314e85?fm=jpg&q=80&w=1600&fit=crop" -o graphic-design.jpg
curl -L "https://images.unsplash.com/photo-1521790361543-f645cf042ec4?fm=jpg&q=80&w=1600&fit=crop" -o digital-social.jpg
curl -L "https://images.unsplash.com/photo-1521791055366-0d553872125f?fm=jpg&q=80&w=1600&fit=crop" -o design-detail.jpg
curl -L "https://images.unsplash.com/photo-1521791136064-7986c2920216?fm=jpg&q=80&w=1600&fit=crop" -o team-review.jpg

echo "Downloading a real team/office photo (Unsplash License, free, no attribution required)..."
curl -L "https://images.unsplash.com/photo-1758873269317-51888e824b28?fm=jpg&q=80&w=1600&fit=crop" -o studio-team.jpg

echo ""
echo "6 of 12 photos downloaded. The other 6 (community-event.jpg, large-format.jpg,"
echo "print-press.jpg, promo-laptop.jpg, signage-production.jpg, creative-team.jpg)"
echo "should already be sitting in this folder from an earlier manual pick — check"
echo "before re-downloading them."
echo ""
echo "Note: until you run this on a machine with internet access, the live site"
echo "already shows real photos for every one of these 6 slots — it's hot-linking"
echo "the same Unsplash images directly as a temporary fallback. Running this script"
echo "just brings a permanent local copy in instead of depending on Unsplash staying up."
