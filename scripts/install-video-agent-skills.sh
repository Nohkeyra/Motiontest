#!/usr/bin/env bash
# Copy pinned upstream agent-skill instructions and data; do not execute their code.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
UI_SHA="2de1134dc4d1cfe112934611ae5803ae17a1bd7e"
REMOTION_SHA="6f55706d1069e512430582ad86e4e57dc07afe1b"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT
download_repo() {
  local owner="$1" repository="$2" sha="$3" destination="$4"
  mkdir -p "$destination"
  curl -fLSs --retry 3 --max-time 120 \
    "https://codeload.github.com/$owner/$repository/tar.gz/$sha" \
    -o "$destination.tar.gz"
  tar -xzf "$destination.tar.gz" --strip-components=1 -C "$destination"
}
download_repo nextlevelbuilder ui-ux-pro-max-skill "$UI_SHA" "$work/ui"
download_repo remotion-dev skills "$REMOTION_SHA" "$work/remotion"
test -s "$work/ui/.claude/skills/ui-ux-pro-max/SKILL.md"
test -s "$work/ui/.claude/skills/ui-ux-pro-max/scripts/search.py"
test -s "$work/ui/.claude/skills/ui-ux-pro-max/data/ux-guidelines.csv"
test -s "$work/ui/LICENSE"
test -s "$work/remotion/skills/remotion-best-practices/SKILL.md"
test -s "$work/remotion/skills/remotion-best-practices/remotion-render/REFERENCE.md"
mkdir -p .agents/skills
rm -rf .agents/skills/ui-ux-pro-max .agents/skills/remotion-best-practices
cp -a "$work/ui/.claude/skills/ui-ux-pro-max" .agents/skills/
cp "$work/ui/LICENSE" .agents/skills/ui-ux-pro-max/UPSTREAM-LICENSE
cp -a "$work/remotion/skills/remotion-best-practices" .agents/skills/
cat > .agents/skills/MOTION_ADDONS_SOURCES.md <<EOF
# Pinned motion-agent guidance

- UI/UX Pro Max: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
  - commit $UI_SHA (includes datasets, scripts, references and MIT license)
  - usage: python3 .agents/skills/ui-ux-pro-max/scripts/search.py "mobile food ordering" --domain ux
- Official Remotion Best Practices: https://github.com/remotion-dev/skills
  - commit $REMOTION_SHA (includes full reference skill tree)

The above files support AI coding agents; they do not execute in a video render.
EOF
python3 - <<'PY'
from pathlib import Path
ui=Path('.agents/skills/ui-ux-pro-max')
rm=Path('.agents/skills/remotion-best-practices')
assert (ui/'SKILL.md').is_file() and (ui/'scripts/search.py').is_file()
assert len(list((ui/'data').rglob('*.csv')))>3
assert (rm/'SKILL.md').is_file()
assert len(list(rm.rglob('REFERENCE.md')))>7
print('Installed complete agent skills:',len(list(ui.rglob('*'))),len(list(rm.rglob('*'))))
PY
