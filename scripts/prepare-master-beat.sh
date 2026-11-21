#!/usr/bin/env bash
set -euo pipefail
# Source: "Techno Fights" by Alejandro Magaña (A. M.), Mixkit #171.
# Mixkit Stock Music Free License: online ads and social media posts permitted.
# Downloaded to temporary CI runtime, never committed as a raw music asset.
cd "$GITHUB_WORKSPACE/videos/wawasan-authentic"
mkdir -p public/audio
track="$RUNNER_TEMP/mixkit-171.mp3"
curl --fail --location --retry 4 --retry-delay 3 --silent --show-error \
  'https://assets.mixkit.co/music/171/171.mp3' -o "$track"
test "$(wc -c < "$track")" -gt 150000 || { echo '::error::Music download too small'; exit 1; }
duration="$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 "$track")"
python3 - "$duration" <<'PY'
import sys
assert float(sys.argv[1])>35, 'Licensed track is too short'
PY
ffmpeg -hide_banner -loglevel error -y -i "$track" -t 30 \
  -af 'loudnorm=I=-16:TP=-4:LRA=9,afade=t=in:st=0:d=0.10,afade=t=out:st=28.7:d=1.3' \
  -ar 48000 -ac 2 public/audio/master-beat.wav
test -s public/audio/master-beat.wav
echo 'Music: Techno Fights / Alejandro Magaña / Mixkit #171, Stock Music Free License'
