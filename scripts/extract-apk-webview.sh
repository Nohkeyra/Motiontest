#!/usr/bin/env bash
set -euo pipefail
tag="$APK_TAG"
root="$GITHUB_WORKSPACE"
apk="$RUNNER_TEMP/wawasan-release.apk"
mkdir -p "$root/apk-site" "$root/capture"
curl --fail --location --retry 4 --retry-delay 2 --silent --show-error \
  "https://github.com/Nohkeyra/Pu/releases/download/$tag/app-release-signed.apk" -o "$apk"
unzip -t "$apk" >/dev/null
if ! unzip -Z1 "$apk" | grep -qx 'assets/public/index.html'; then
  echo "::error::Signed APK has no embedded Capacitor web bundle at assets/public."
  exit 1
fi
unzip -q "$apk" 'assets/public/*' -d "$root/apk-site"
mv "$root/apk-site/assets/public" "$root/apk-site/site"
rmdir "$root/apk-site/assets" || true
test -f "$root/apk-site/site/index.html"
test -d "$root/apk-site/site/assets"
hash="$(sha256sum "$apk" | cut -d' ' -f1)"
python3 - "$root/capture" "$tag" "$hash" <<'PY'
import json,pathlib,sys
(pathlib.Path(sys.argv[1])/'origin.json').write_text(json.dumps({
  'source':'signed_apk_bundled_webview_assets',
  'release_tag':sys.argv[2],
  'apk_sha256':sys.argv[3],
  'method':'Extracted compiled frontend from signed APK; rendered in mobile Chromium, not an Android emulator'
},indent=2))
PY
# Original sign artwork and Outfit Latin subset are shipped inside this same APK.
# Assets are used only by the video renderer; the screen pixels are not redrawn.
for item in "assets/illustrations/wawasan-native-sign-cutout.webp:brand-sign.webp" "assets/fonts/wawasan-ui-1.woff2:outfit-latin.woff2"; do
  source="${item%%:*}"
  dest="${item#*:}"
  test -s "$root/apk-site/site/$source" || { echo "::error::Signed APK missing expected original asset $source"; exit 1; }
  cp "$root/apk-site/site/$source" "$root/capture/$dest"
done
echo "APK web bundle extracted, SHA256: $hash"
