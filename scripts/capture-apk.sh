#!/usr/bin/env bash
set -euo pipefail
: "$GITHUB_WORKSPACE"
TAG="$APK_TAG"
APP="com.wawasanpakusop.app"
OUT="$GITHUB_WORKSPACE/capture"
mkdir -p "$OUT"
APK="$RUNNER_TEMP/wawasan.apk"
curl --fail --location --retry 3 --silent --show-error \
  "https://github.com/Nohkeyra/Pu/releases/download/$TAG/app-release-signed.apk" -o "$APK"
unzip -t "$APK" >/dev/null
SHA="$(sha256sum "$APK" | cut -d' ' -f1)"
adb install -r "$APK"
adb shell am force-stop "$APP" >/dev/null 2>&1 || true
adb shell am start -n "$APP/.MainActivity"

# Read accessibility bounds for the real Get Started control. No blind coordinates.
get_center() {
  adb shell uiautomator dump /sdcard/wawasan.xml >/dev/null 2>&1 || return 1
  adb pull /sdcard/wawasan.xml "$OUT/window.xml" >/dev/null 2>&1 || return 1
  python3 - "$OUT/window.xml" <<'PY'
import re, sys, xml.etree.ElementTree as ET
root=ET.parse(sys.argv[1]).getroot()
for node in root.iter():
    label=(node.attrib.get('text','')+' '+node.attrib.get('content-desc','')).lower()
    if 'get started' not in label: continue
    match=re.fullmatch(r'\[(\d+),(\d+)\]\[(\d+),(\d+)\]',node.attrib.get('bounds',''))
    if match:
        x1,y1,x2,y2=map(int,match.groups())
        print((x1+x2)//2,(y1+y2)//2)
        sys.exit(0)
sys.exit(1)
PY
}
position=""
for i in $(seq 1 30); do
  if position="$(get_center)"; then break; fi
  sleep 3
done
if [[ -z "$position" ]]; then
  echo '::error::Get Started control not accessible on emulator. No blind tap will be used.'
  exit 1
fi
adb exec-out screencap -p > "$OUT/welcome.png"
read -r X Y <<< "$position"
adb shell input tap "$X" "$Y"
sleep 12
adb exec-out screencap -p > "$OUT/after-start.png"
python3 - "$OUT" "$TAG" "$SHA" <<'PY'
import hashlib, json, pathlib, sys
out=pathlib.Path(sys.argv[1])
data={
  'source':'real_wawasan_signed_apk_android_emulator',
  'release_tag':sys.argv[2],
  'apk_sha256':sys.argv[3],
  'package':'com.wawasanpakusop.app',
  'action':'tapped Get Started at verified accessibility node bounds',
  'screens':{name:hashlib.sha256((out/name).read_bytes()).hexdigest()
             for name in ('welcome.png','after-start.png')}
}
(out/'capture.json').write_text(json.dumps(data,indent=2)+'\n')
PY
rm -f "$OUT/window.xml"
python3 scripts/verify.py capture "$OUT"
