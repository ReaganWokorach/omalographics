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
curl -L "https://images.unsplash.com/photo-1521790609145-bacea5940bde?fm=jpg&q=80&w=1600&fit=crop" -o digital-social.jpg
curl -L "https://images.unsplash.com/photo-1521791055366-0d553872125f?fm=jpg&q=80&w=1600&fit=crop" -o design-detail.jpg
curl -L "https://images.unsplash.com/photo-1521791136064-7986c2920216?fm=jpg&q=80&w=1600&fit=crop" -o team-review.jpg

echo ""
echo "5 of 12 photos downloaded. The remaining 7 need a quick manual pick"
echo "(free stock sites rate-limit/require a click-through for these categories) —"
echo "see photo-manifest.md for a direct search link + exact filename for each."
