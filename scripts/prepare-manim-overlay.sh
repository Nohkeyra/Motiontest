#!/usr/bin/env bash
set -euo pipefail
# Optional import helper; no changes to the approved Remotion film timeline.
# bash scripts/prepare-manim-overlay.sh path/to/wawasan-manim-route.mp4
if [ "$#" -lt 1 ]; then echo "Usage: bash scripts/prepare-manim-overlay.sh video.mp4"; exit 2; fi
SOURCE="$1"
test -s "$SOURCE" || { echo "Missing Manim source MP4" >&2; exit 1; }
command -v ffmpeg >/dev/null || { echo "FFmpeg required" >&2; exit 1; }
mkdir -p videos/wawasan-authentic/public/generated
DEST="videos/wawasan-authentic/public/generated/manim-route-motion.mp4"
ffmpeg -hide_banner -loglevel error -y -i "$SOURCE" \
  -vf "fps=30,scale=1080:1920:flags=lanczos,format=yuv420p" -an \
  -c:v libx264 -crf 19 -preset medium -movflags +faststart "$DEST"
test -s "$DEST"
echo "Motion clip ready: $DEST"
