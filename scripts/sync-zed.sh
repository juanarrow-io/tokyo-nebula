#!/usr/bin/env bash
set -euo pipefail

# Regenerate the Zed family file and copy it into a sibling tokyo-nebula-zed
# checkout. Assumes the layout:
#   ~/Tools/tokyo-nebula/      (this repo)
#   ~/Tools/tokyo-nebula-zed/  (sibling)

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ZED_REPO="$(cd "$REPO_ROOT/.." && pwd)/tokyo-nebula-zed"

if [ ! -d "$ZED_REPO" ]; then
  echo "error: expected tokyo-nebula-zed at $ZED_REPO" >&2
  echo "       clone it as a sibling of this repo first." >&2
  exit 1
fi

node "$REPO_ROOT/scripts/build.mjs"
cp "$REPO_ROOT/dist/tokyo-nebula.json" "$ZED_REPO/themes/tokyo-nebula.json"

echo "synced -> $ZED_REPO/themes/tokyo-nebula.json"
echo "next: cd $ZED_REPO && git add themes/ && git commit && git push"
