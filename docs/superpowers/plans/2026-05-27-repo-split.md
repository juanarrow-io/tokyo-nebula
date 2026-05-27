# Tokyo Nebula — Repo Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split the monorepo into `tokyo-nebula` (VS Code, source of truth) and a new `tokyo-nebula-zed` (Zed distribution shell), with manual sync between them.

**Architecture:** Three logical phases — (1) restructure `tokyo-nebula` (move build script up one level, retarget output to `dist/`, untrack docs/, slim `.vscodeignore`); (2) initialize sibling `tokyo-nebula-zed/` directory with 6 files; (3) push to GitHub and verify both repos work. The build pipeline keeps its existing resolver logic — only paths change.

**Tech Stack:** Node.js (built-in test runner), GitHub CLI (`gh`), git subtree moves via `git mv` (no `git subtree split`).

**Prerequisite:** `feat/tokyo-nebula-port` must be merged to `main` of `tokyo-nebula` before this plan runs. The split work starts from `main`.

**Spec:** `docs/superpowers/specs/2026-05-27-repo-split-design.md`.

---

## File Structure

**Files moved (within tokyo-nebula):**
- `zed-extension/scripts/build.mjs` → `scripts/build.mjs`
- `zed-extension/scripts/build.test.mjs` → `scripts/build.test.mjs`

**Files deleted (from tokyo-nebula):**
- `zed-extension/extension.toml`
- `zed-extension/README.md`
- `zed-extension/themes/tokyo-nebula.json` (regenerated at new path)
- the now-empty `zed-extension/` directory

**Files created (in tokyo-nebula):**
- `scripts/sync-zed.sh` — sync helper
- `dist/tokyo-nebula.json` — tracked generated artifact (replaces old `zed-extension/themes/tokyo-nebula.json`)

**Files modified (in tokyo-nebula):**
- `scripts/build.mjs` — `main()` paths (3 line changes)
- `scripts/build.test.mjs` — 10 instances of `resolve(here, '..', '..', 'themes')` → `resolve(here, '..', 'themes')`
- `package.json` — no diff required (no `zed-extension/` references currently)
- `README.md` — replace `## Installation — Zed` section
- `.gitignore` — append `docs/`
- `.vscodeignore` — replaced wholesale

**Files created (in new tokyo-nebula-zed repo):**
- `extension.toml`
- `README.md`
- `LICENSE`
- `themes/tokyo-nebula.json` (copy of dist artifact)

---

### Task 1: Create `feat/repo-split` branch off main

**Files:** None (git plumbing only)

This task assumes `feat/tokyo-nebula-port` has already been merged to `main`. If it has not, STOP and surface the prerequisite to the user.

- [ ] **Step 1: Confirm prerequisite is met**

```bash
cd /Users/paolo/Tools/tokyo-nebula
git fetch origin
git log --oneline main..feat/tokyo-nebula-port 2>/dev/null | head -1
```

If the command returns any output (i.e., `main` is BEHIND `feat/tokyo-nebula-port`), the prerequisite hasn't landed yet. STOP and report:

> "Prerequisite missing: feat/tokyo-nebula-port has commits not yet on main. Merge that branch to main before starting this plan."

If output is empty, proceed.

- [ ] **Step 2: Check out main and pull latest**

```bash
git checkout main
git pull origin main
```

- [ ] **Step 3: Create and check out feat/repo-split**

```bash
git checkout -b feat/repo-split
```

- [ ] **Step 4: Confirm starting state**

```bash
git status
ls -la zed-extension/ scripts/ dist/ 2>/dev/null
```

Expected:
- `git status` shows clean working tree on `feat/repo-split`.
- `zed-extension/` exists with `scripts/`, `README.md`, `themes/`, `extension.toml`.
- `scripts/` does NOT exist at root yet.
- `dist/` does NOT exist at root yet.

If any of those are wrong, STOP and report.

- [ ] **Step 5: No commit — this task is branch setup only**

---

### Task 2: Move build script and tests up one level

**Files:**
- Rename: `zed-extension/scripts/build.mjs` → `scripts/build.mjs`
- Rename: `zed-extension/scripts/build.test.mjs` → `scripts/build.test.mjs`

- [ ] **Step 1: Create `scripts/` directory at repo root**

```bash
cd /Users/paolo/Tools/tokyo-nebula
mkdir -p scripts
```

- [ ] **Step 2: git mv both files**

```bash
git mv zed-extension/scripts/build.mjs       scripts/build.mjs
git mv zed-extension/scripts/build.test.mjs  scripts/build.test.mjs
```

- [ ] **Step 3: Verify renames recorded**

```bash
git status
```
Expected: two `renamed:` entries for `zed-extension/scripts/build.mjs` → `scripts/build.mjs` and `zed-extension/scripts/build.test.mjs` → `scripts/build.test.mjs`.

- [ ] **Step 4: Verify the now-empty `zed-extension/scripts/` directory is gone**

```bash
ls zed-extension/scripts/ 2>/dev/null || echo "absent (good)"
```
Expected: `absent (good)`.

- [ ] **Step 5: Run tests at the new path BEFORE adjusting paths — confirm they fail**

```bash
node --test scripts/build.test.mjs 2>&1 | tail -10
```

Expected: tests that resolve themes via `resolve(here, '..', '..', 'themes')` fail because they're now walking up from `<repo>/scripts/` (one level) to `<repo>/` then to its parent (out of repo). The exact failure mode is "loadSources" returning empty or throwing on missing files.

This failing state is EXPECTED and proves the next task is necessary. Do NOT commit yet — Tasks 2, 3, and 4 commit together at the end of Task 4.

---

### Task 3: Adjust paths inside `scripts/build.mjs`

**Files:**
- Modify: `scripts/build.mjs` `main()` function (3 line changes)

- [ ] **Step 1: Find the `main()` function**

Open `/Users/paolo/Tools/tokyo-nebula/scripts/build.mjs`. The `main()` function starts near line 377 and reads:

```js
async function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(scriptDir, '..', '..');
  const themesDir = join(repoRoot, 'themes');
  const outDir = join(scriptDir, '..', 'themes');
  const outFile = join(outDir, 'tokyo-nebula.json');

  const sources = await loadSources(themesDir);
  const family = buildFamily(sources);

  await mkdir(outDir, { recursive: true });
  await writeFile(outFile, JSON.stringify(family, null, 2) + '\n', 'utf8');
  process.stdout.write(`wrote ${outFile}\n`);
  process.stdout.write(`  variants: ${family.themes.map((t) => t.name).join(', ')}\n`);
}
```

- [ ] **Step 2: Replace `main()` with the new version**

Use the Edit tool. Replace exactly:

```js
async function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(scriptDir, '..', '..');
  const themesDir = join(repoRoot, 'themes');
  const outDir = join(scriptDir, '..', 'themes');
  const outFile = join(outDir, 'tokyo-nebula.json');
```

With:

```js
async function main() {
  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const repoRoot = resolve(scriptDir, '..');
  const themesDir = join(repoRoot, 'themes');
  const outDir = join(repoRoot, 'dist');
  const outFile = join(outDir, 'tokyo-nebula.json');
```

Three lines differ: `repoRoot` walks up one level instead of two; `outDir` resolves to `<repoRoot>/dist`; `outFile` derived from new `outDir`.

- [ ] **Step 3: Run the build script manually to verify it works**

```bash
cd /Users/paolo/Tools/tokyo-nebula
node scripts/build.mjs
```

Expected stdout:
```
wrote /Users/paolo/Tools/tokyo-nebula/dist/tokyo-nebula.json
  variants: Tokyo Nebula Andromeda, Tokyo Nebula Aurora, Tokyo Nebula Eclipse, Tokyo Nebula Solstice, Tokyo Nebula Polaris
```

If the path or the variants list is wrong, STOP — paths weren't adjusted correctly.

- [ ] **Step 4: Verify dist/ now exists with the family JSON**

```bash
ls -la dist/
```

Expected: `tokyo-nebula.json` (around 130KB).

- [ ] **Step 5: No commit yet — continue to Task 4**

---

### Task 4: Adjust test paths and verify suite passes

**Files:**
- Modify: `scripts/build.test.mjs` — 10 replacements of one specific string

- [ ] **Step 1: Apply the search-and-replace**

Use the Edit tool with `replace_all=true` on `scripts/build.test.mjs`. Find:

```js
  const themesDir = resolve(here, '..', '..', 'themes');
```

Replace with:

```js
  const themesDir = resolve(here, '..', 'themes');
```

`replace_all=true` applies the change to all 10 occurrences in one call.

- [ ] **Step 2: Verify exactly 10 substitutions occurred**

```bash
grep -c "resolve(here, '..', 'themes')"        scripts/build.test.mjs
grep -c "resolve(here, '..', '..', 'themes')"  scripts/build.test.mjs
```

Expected:
- First grep: `10`
- Second grep: `0`

- [ ] **Step 3: Run the full test suite**

```bash
cd /Users/paolo/Tools/tokyo-nebula
node --test scripts/build.test.mjs 2>&1 | tail -5
```

Expected: `pass 74`, `fail 0`. Same count as before the split.

- [ ] **Step 4: Commit Tasks 2 + 3 + 4 as ONE commit**

The three tasks together form one logical unit (move scripts + retarget paths + update test imports). Committing them separately would leave intermediate broken states.

```bash
git add scripts/ dist/tokyo-nebula.json
git commit -m "refactor: relocate build script to scripts/ and retarget output to dist/

- git mv zed-extension/scripts/{build.mjs,build.test.mjs} → scripts/
- build.mjs main() now writes to <repoRoot>/dist/ instead of zed-extension/themes/
- test imports updated: resolve(here, '..', '..', 'themes') → resolve(here, '..', 'themes')
- dist/tokyo-nebula.json tracked as the canonical generated artifact"
```

---

### Task 5: Delete the `zed-extension/` directory

**Files:**
- Delete: `zed-extension/README.md`
- Delete: `zed-extension/extension.toml`
- Delete: `zed-extension/themes/tokyo-nebula.json`
- Delete: directory `zed-extension/` (once empty)

- [ ] **Step 1: Confirm what remains in zed-extension/**

```bash
cd /Users/paolo/Tools/tokyo-nebula
find zed-extension -type f
```

Expected: three files:
- `zed-extension/README.md`
- `zed-extension/extension.toml`
- `zed-extension/themes/tokyo-nebula.json`

The `scripts/` subdirectory should already be gone (deleted by `git mv` in Task 2).

- [ ] **Step 2: git rm the directory**

```bash
git rm -r zed-extension/
```

- [ ] **Step 3: Verify deletion recorded**

```bash
git status
ls zed-extension/ 2>/dev/null || echo "absent (good)"
```

Expected:
- `git status` shows three `deleted:` entries.
- `ls` reports `absent (good)`.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove zed-extension/ directory — moved to tokyo-nebula-zed repo"
```

---

### Task 6: Untrack `docs/` and add to `.gitignore`

**Files:**
- Modify: `.gitignore` (append one line)
- Untrack: everything under `docs/` (kept on disk)

- [ ] **Step 1: Append `docs/` to `.gitignore`**

Use Edit tool. Find:

```
node_modules
*.vsix
.env
.superpowers/
```

Replace with:

```
node_modules
*.vsix
.env
.superpowers/
docs/
```

- [ ] **Step 2: Untrack `docs/` from the git index but keep files on disk**

```bash
cd /Users/paolo/Tools/tokyo-nebula
git rm -r --cached docs/
```

- [ ] **Step 3: Verify docs/ still on disk but not tracked**

```bash
ls docs/ 2>&1 | head -5
git status --short | grep docs | head -5
git ls-files docs/ | head -5
```

Expected:
- `ls docs/` shows `superpowers/` directory (still present on disk).
- `git status --short` shows `D ` entries for the docs files (now deleted from index).
- `git ls-files docs/` returns empty (no longer tracked).

- [ ] **Step 4: Commit**

```bash
git add .gitignore
git commit -m "chore: untrack docs/ — design docs are local-only working artifacts"
```

---

### Task 7: Replace `.vscodeignore` and update README

**Files:**
- Modify: `.vscodeignore` (replace wholesale)
- Modify: `README.md` — replace `## Installation — Zed` section

- [ ] **Step 1: Replace `.vscodeignore`**

Use Write tool to overwrite `/Users/paolo/Tools/tokyo-nebula/.vscodeignore` with:

```
.vscode/**
.vscode-test/**
.gitignore
.vscodeignore
.superpowers/**
docs/**
scripts/**
dist/**
```

- [ ] **Step 2: Update README's Zed-install section**

In `/Users/paolo/Tools/tokyo-nebula/README.md`, find:

```markdown
## Installation — Zed

See [`zed-extension/README.md`](./zed-extension/README.md).
```

Replace with:

```markdown
## Installation — Zed

Tokyo Nebula for Zed is published as a separate repository:
[**juanarrow-io/tokyo-nebula-zed**](https://github.com/juanarrow-io/tokyo-nebula-zed).

In Zed: open the command palette (`cmd-shift-p`), run `zed: install dev extension`,
and pick a local clone of that repo.
```

- [ ] **Step 3: Verify README renders sanely**

```bash
grep -A 5 "Installation — Zed" README.md
```

Expected: shows the new section text with the link to the new repo.

- [ ] **Step 4: Commit**

```bash
git add .vscodeignore README.md
git commit -m "chore: slim .vsix bundle and point README at the new tokyo-nebula-zed repo"
```

---

### Task 8: Add `scripts/sync-zed.sh` helper

**Files:**
- Create: `scripts/sync-zed.sh`

- [ ] **Step 1: Write the script**

Create `/Users/paolo/Tools/tokyo-nebula/scripts/sync-zed.sh` with this exact content:

```bash
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
```

- [ ] **Step 2: Make it executable**

```bash
cd /Users/paolo/Tools/tokyo-nebula
chmod +x scripts/sync-zed.sh
```

- [ ] **Step 3: Verify executable bit is set**

```bash
ls -l scripts/sync-zed.sh
```
Expected: mode begins with `-rwxr-xr-x` or similar (an `x` in the user position).

Note: at this point `tokyo-nebula-zed` does not yet exist as a sibling, so running the script would fail with the sentinel error. That's expected — we test it after Task 9 creates the sibling.

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-zed.sh
git commit -m "chore: add scripts/sync-zed.sh helper for the manual sync flow"
```

---

### Task 9: Run tests and confirm tokyo-nebula side is fully restructured

**Files:** None — verification only.

- [ ] **Step 1: Run the full test suite**

```bash
cd /Users/paolo/Tools/tokyo-nebula
node --test scripts/build.test.mjs 2>&1 | tail -5
```

Expected: `pass 74`, `fail 0`.

- [ ] **Step 2: Run the build to confirm dist/ stays correct**

```bash
node scripts/build.mjs
```

Expected stdout:
```
wrote /Users/paolo/Tools/tokyo-nebula/dist/tokyo-nebula.json
  variants: Tokyo Nebula Andromeda, Tokyo Nebula Aurora, Tokyo Nebula Eclipse, Tokyo Nebula Solstice, Tokyo Nebula Polaris
```

- [ ] **Step 3: Confirm git status is clean (any regenerated dist/ matches the tracked version)**

```bash
git status
```

Expected: `nothing to commit, working tree clean`. If `dist/tokyo-nebula.json` shows as modified, the build is non-deterministic — STOP and investigate.

- [ ] **Step 4: Confirm zed-extension/ is truly gone**

```bash
ls zed-extension/ 2>/dev/null || echo "absent (good)"
git ls-files | grep -c '^zed-extension/'
```

Expected:
- `ls` reports `absent (good)`.
- `git ls-files` grep reports `0`.

- [ ] **Step 5: Confirm `docs/` is untracked but present on disk**

```bash
ls docs/superpowers/specs/ | wc -l
git ls-files docs/ | wc -l
```

Expected:
- `ls` reports `> 0` (e.g., 4 spec files locally).
- `git ls-files docs/` reports `0`.

- [ ] **Step 6: No commit — verification gate**

---

### Task 10: Initialize `tokyo-nebula-zed/` local directory

**Files:**
- Create: `/Users/paolo/Tools/tokyo-nebula-zed/extension.toml`
- Create: `/Users/paolo/Tools/tokyo-nebula-zed/themes/tokyo-nebula.json`
- Create: `/Users/paolo/Tools/tokyo-nebula-zed/README.md`
- Create: `/Users/paolo/Tools/tokyo-nebula-zed/LICENSE`

- [ ] **Step 1: Create the directory tree**

```bash
mkdir -p /Users/paolo/Tools/tokyo-nebula-zed/themes
```

- [ ] **Step 2: Write `extension.toml`**

Write `/Users/paolo/Tools/tokyo-nebula-zed/extension.toml` with this exact content:

```toml
schema_version = 1
id = "tokyo-nebula"
name = "Tokyo Nebula"
version = "0.1.0"
description = "Tokyo Nebula — a five-variant dark theme family for Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris."
authors = ["Paolo Arroyo"]
repository = "https://github.com/juanarrow-io/tokyo-nebula-zed"
```

- [ ] **Step 3: Copy the generated theme JSON**

```bash
cp /Users/paolo/Tools/tokyo-nebula/dist/tokyo-nebula.json \
   /Users/paolo/Tools/tokyo-nebula-zed/themes/tokyo-nebula.json
```

- [ ] **Step 4: Verify the copy**

```bash
diff -q /Users/paolo/Tools/tokyo-nebula/dist/tokyo-nebula.json \
        /Users/paolo/Tools/tokyo-nebula-zed/themes/tokyo-nebula.json
```

Expected: no output (files identical).

- [ ] **Step 5: Write `README.md`**

Write `/Users/paolo/Tools/tokyo-nebula-zed/README.md` with this exact content:

```markdown
# Tokyo Nebula for Zed

A five-variant dark theme family for Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris.

The source themes and build pipeline live in
[**juanarrow-io/tokyo-nebula**](https://github.com/juanarrow-io/tokyo-nebula).
This repo is a thin distribution shell — the `themes/tokyo-nebula.json` file
is generated from the VS Code source themes in the main repo.

## Variants

- Tokyo Nebula Andromeda — violet signature
- Tokyo Nebula Aurora — green signature, italic accents
- Tokyo Nebula Eclipse — cyan signature, deeper background
- Tokyo Nebula Solstice — yellow signature, warm background
- Tokyo Nebula Polaris — blue signature, deepest navy background

## Install (from source)

1. Clone this repo.
2. In Zed: open the command palette (`cmd-shift-p`), run `zed: install dev extension`.
3. Pick this directory.
4. Open the theme picker (`cmd-k cmd-t`) and choose a Tokyo Nebula variant.

## License

[MIT](./LICENSE) — Copyright (c) 2026 Paolo Arroyo
```

- [ ] **Step 6: Copy LICENSE**

```bash
cp /Users/paolo/Tools/tokyo-nebula/LICENSE \
   /Users/paolo/Tools/tokyo-nebula-zed/LICENSE
```

- [ ] **Step 7: Verify the new repo's file list**

```bash
find /Users/paolo/Tools/tokyo-nebula-zed -type f -not -path '*/.*'
```

Expected (4 files exactly):
```
/Users/paolo/Tools/tokyo-nebula-zed/LICENSE
/Users/paolo/Tools/tokyo-nebula-zed/README.md
/Users/paolo/Tools/tokyo-nebula-zed/extension.toml
/Users/paolo/Tools/tokyo-nebula-zed/themes/tokyo-nebula.json
```

- [ ] **Step 8: No commit yet (the new repo isn't a git repo until Task 11)**

---

### Task 11: Initialize git in tokyo-nebula-zed and commit

**Files:** None added; git plumbing only.

- [ ] **Step 1: git init and stage**

```bash
cd /Users/paolo/Tools/tokyo-nebula-zed
git init
git add .
```

- [ ] **Step 2: Commit**

```bash
git commit -m "init: Tokyo Nebula theme family for Zed

Five-variant dark theme family for Zed:
- Tokyo Nebula Andromeda — violet signature
- Tokyo Nebula Aurora — green signature with italic accents
- Tokyo Nebula Eclipse — cyan signature, deeper background
- Tokyo Nebula Solstice — yellow signature, warm background
- Tokyo Nebula Polaris — blue signature, deepest navy background

Source themes and build pipeline live in juanarrow-io/tokyo-nebula."
```

- [ ] **Step 3: Verify the initial commit**

```bash
git log --stat --oneline -1
```

Expected: a single commit listing exactly 4 files added: `LICENSE`, `README.md`, `extension.toml`, `themes/tokyo-nebula.json`.

- [ ] **Step 4: No additional commit needed**

---

### Task 12: Create the GitHub repo and push

**Files:** None (remote git only).

- [ ] **Step 1: Confirm `gh` is authenticated**

```bash
gh auth status
```

Expected: shows `Logged in to github.com as <user>`. If not authenticated, STOP and ask the user to run `gh auth login` before continuing.

- [ ] **Step 2: Create the repo**

```bash
cd /Users/paolo/Tools/tokyo-nebula-zed
gh repo create juanarrow-io/tokyo-nebula-zed \
  --public \
  --description "Five-variant dark theme family for Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris" \
  --source=. \
  --remote=origin \
  --push
```

Expected: `gh` reports the repo created at `https://github.com/juanarrow-io/tokyo-nebula-zed` and pushes the initial commit.

If `gh` errors with a permissions message (e.g., "you don't have permission to create a repo in juanarrow-io"), STOP and report to the user:

> "Cannot create repo via gh CLI in juanarrow-io org. Create the empty repo manually at https://github.com/organizations/juanarrow-io/repositories/new (named tokyo-nebula-zed, public, no README/license/gitignore), then re-run: cd /Users/paolo/Tools/tokyo-nebula-zed && git remote add origin https://github.com/juanarrow-io/tokyo-nebula-zed.git && git branch -M main && git push -u origin main"

- [ ] **Step 3: Verify the push succeeded**

```bash
git ls-remote origin HEAD
git remote -v
```

Expected:
- First command outputs a commit SHA followed by `HEAD`.
- Second command shows `origin` pointing at `github.com/juanarrow-io/tokyo-nebula-zed`.

- [ ] **Step 4: Confirm repo is visible on GitHub**

```bash
gh repo view juanarrow-io/tokyo-nebula-zed --json url,visibility,description | head
```

Expected: JSON output with the URL, `"visibility":"PUBLIC"`, and the description string.

---

### Task 13: Verify the sync script works end-to-end

**Files:** None — verification.

Now that `tokyo-nebula-zed` exists as a sibling, the helper script in `tokyo-nebula/scripts/sync-zed.sh` should run cleanly.

- [ ] **Step 1: Touch a source theme to simulate a palette change**

For this verification, we'll make a no-op change: regenerate without editing.

```bash
cd /Users/paolo/Tools/tokyo-nebula
./scripts/sync-zed.sh
```

Expected output:
```
wrote /Users/paolo/Tools/tokyo-nebula/dist/tokyo-nebula.json
  variants: Tokyo Nebula Andromeda, Tokyo Nebula Aurora, Tokyo Nebula Eclipse, Tokyo Nebula Solstice, Tokyo Nebula Polaris
synced -> /Users/paolo/Tools/tokyo-nebula-zed/themes/tokyo-nebula.json
next: cd /Users/paolo/Tools/tokyo-nebula-zed && git add themes/ && git commit && git push
```

- [ ] **Step 2: Confirm the two files are identical**

```bash
diff -q /Users/paolo/Tools/tokyo-nebula/dist/tokyo-nebula.json \
        /Users/paolo/Tools/tokyo-nebula-zed/themes/tokyo-nebula.json
```

Expected: no output.

- [ ] **Step 3: Confirm tokyo-nebula-zed has no dirty diff (sync was a no-op)**

```bash
cd /Users/paolo/Tools/tokyo-nebula-zed
git status
```

Expected: `nothing to commit, working tree clean`.

If it shows the themes file modified, the sync script produced a different output than the committed file — investigate (likely a determinism issue or stale dist/).

- [ ] **Step 4: No commit — verification only**

---

### Task 14: Final validation pass

**Files:** None — verification only.

- [ ] **Step 1: Confirm tokyo-nebula tests pass**

```bash
cd /Users/paolo/Tools/tokyo-nebula
node --test scripts/build.test.mjs 2>&1 | tail -5
```

Expected: `pass 74`, `fail 0`.

- [ ] **Step 2: Confirm .vsix bundle excludes Zed/dev artifacts**

```bash
cd /Users/paolo/Tools/tokyo-nebula
npx vsce package --no-yarn 2>&1 | tail -10
```

If `vsce` is not installed, install it first: `npm install -g @vscode/vsce`. The `package` command produces a `.vsix` in the repo root.

Now inspect it:

```bash
unzip -l tokyo-nebula-0.1.0.vsix | grep -E '(scripts|dist|docs|zed-extension|\.superpowers)'
```

Expected: zero matches. None of `scripts/`, `dist/`, `docs/`, `zed-extension/`, or `.superpowers/` should be in the bundle.

```bash
unzip -l tokyo-nebula-0.1.0.vsix | grep -E '(extension/themes|extension/package\.json|extension/README\.md|extension/LICENSE|extension/images)'
```

Expected: matches showing `themes/`, `package.json`, `README.md`, `LICENSE`, `images/` ARE bundled.

Clean up:

```bash
rm tokyo-nebula-0.1.0.vsix
```

- [ ] **Step 3: Confirm tokyo-nebula-zed has the expected structure**

```bash
cd /Users/paolo/Tools/tokyo-nebula-zed
find . -type f -not -path '*/.git*' | sort
```

Expected exactly 4 lines:
```
./LICENSE
./README.md
./extension.toml
./themes/tokyo-nebula.json
```

- [ ] **Step 4: Confirm both git working trees are clean**

```bash
cd /Users/paolo/Tools/tokyo-nebula && git status
cd /Users/paolo/Tools/tokyo-nebula-zed && git status
```

Expected: both say `nothing to commit, working tree clean`.

- [ ] **Step 5: Confirm tokyo-nebula's docs/ is gone from tracking but present locally**

```bash
cd /Users/paolo/Tools/tokyo-nebula
git ls-files docs/ | wc -l
ls docs/superpowers/specs/ | wc -l
```

Expected:
- First: `0` (no tracked files under docs/).
- Second: `> 0` (specs still on disk).

- [ ] **Step 6: Report ready for manual verification in Zed**

This task is not commit-producing. Surface the validation summary to the user and move on to Task 15.

---

### Task 15: Manual verification in Zed (USER STEP)

**Files:** None — hands-on check.

- [ ] **Step 1: Install tokyo-nebula-zed as a Zed dev extension**

In Zed:
1. Open the command palette (`cmd-shift-p`).
2. Run `zed: install dev extension`.
3. Pick `/Users/paolo/Tools/tokyo-nebula-zed/`.

- [ ] **Step 2: Open theme picker and cycle each variant**

`cmd-k cmd-t` → select each of the 5 Tokyo Nebula variants in turn. For each:
- Editor: open a code file. Confirm the signature hue dominates keywords; functions / types / strings appear in expected colors.
- Agent panel: open a chat. Confirm text reads cleanly against the panel.
- Terminal: run a command with colored output. Confirm ANSI colors render.

- [ ] **Step 3: Report findings**

If everything works, the split is complete. If a variant looks wrong or doesn't load, capture details and report — do NOT silently amend this plan.

---

### Task 16: Open PR on tokyo-nebula for the split

**Files:** None — git/GitHub plumbing.

- [ ] **Step 1: Push the split branch**

```bash
cd /Users/paolo/Tools/tokyo-nebula
git push -u origin feat/repo-split
```

- [ ] **Step 2: Open PR**

```bash
gh pr create --base main --head feat/repo-split \
  --title "Split: extract zed-extension into juanarrow-io/tokyo-nebula-zed" \
  --body "$(cat <<'EOF'
## Summary

- Moves `zed-extension/scripts/build.{mjs,test.mjs}` up to `scripts/` at repo root
- Build output now lands at `dist/tokyo-nebula.json` (tracked) instead of `zed-extension/themes/`
- Removes `zed-extension/` entirely — its contents now live in [juanarrow-io/tokyo-nebula-zed](https://github.com/juanarrow-io/tokyo-nebula-zed)
- Untracks `docs/` (kept locally; gitignored)
- Slims `.vscodeignore` so `vsce package` no longer bundles scripts/dist/docs
- Adds `scripts/sync-zed.sh` helper for the manual cross-repo sync flow

## Test plan

- [x] `node --test scripts/build.test.mjs` — 74 pass, 0 fail
- [x] `npx vsce package` produces a .vsix without scripts/dist/docs
- [x] `./scripts/sync-zed.sh` regenerates and copies cleanly to sibling repo
- [ ] Manual install of tokyo-nebula-zed in Zed cycles all 5 variants

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 3: Report the PR URL to the user**

The PR URL printed by `gh pr create` is the final deliverable. User reviews + merges when ready.

---

## Self-Review notes

- **Spec coverage:**
  - Section 1 (Order of ops + prerequisite check) → Task 1
  - Section 2.1 (move build files) → Task 2
  - Section 2.2 (adjust build.mjs paths) → Task 3
  - Section 2.3 (adjust test paths) → Task 4
  - Section 2.4 (delete zed-extension/) → Task 5
  - Section 2.5 (track dist/) → Task 4 (Step 4 commit includes dist/)
  - Section 2.6 (untrack docs/) → Task 6
  - Section 2.7 (.vscodeignore) → Task 7
  - Section 2.8 (README update) → Task 7
  - Section 2.9 (sync-zed.sh) → Task 8
  - Section 3.1 (new repo files) → Task 10
  - Section 3.2 (gh repo create) → Task 12
  - Section 4 (sync workflow verification) → Task 13
  - Section 5 (tests pass) → Task 9, Task 14
  - Section 6 (manual verification) → Task 15
  - Open risks (vsce package check) → Task 14
  - PR opening → Task 16
- **Placeholder scan:** No "TBD"/"TODO"/"similar to". All paths, contents, and commands explicit.
- **Type consistency:** All paths use `/Users/paolo/Tools/tokyo-nebula/` and `/Users/paolo/Tools/tokyo-nebula-zed/`. Branch name `feat/repo-split` consistent. Repo URL `juanarrow-io/tokyo-nebula-zed` consistent across all references.
- **One spec-side correction:** Spec mentions `git tag v0.1.0` for Zed registry submission. That's out-of-scope per the spec's "Out of scope" section, so not included as a task. Recorded here for follow-up.
