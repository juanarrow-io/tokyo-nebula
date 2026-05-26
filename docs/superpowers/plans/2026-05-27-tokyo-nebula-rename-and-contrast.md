# Tokyo Nebula — Rename, Author Cleanup & Contrast Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish Paolo Arroyo as sole author, rename the five variants to celestial names (Andromeda / Aurora / Eclipse / Solstice / Polaris), fix the demonstrable low-contrast bug in Zed's agent panel, and bring `UI_MAP` to full coverage of Zed's v0.2.0 theme schema.

**Architecture:** Tasks land in three logical phases — author cleanup → variant rename → mapping audit — followed by regeneration and a docs-scrub. Each phase ends in a coherent commit. The mapping changes are TDD: failing test first, mapping change second, passing test third.

**Tech Stack:** Node.js (built-in test runner via `node:test`), VS Code extension manifest schema, Zed theme schema v0.2.0.

**Spec:** `docs/superpowers/specs/2026-05-27-tokyo-nebula-rename-and-contrast-design.md`.

---

## File Structure

**Files modified:**
- `LICENSE` — copyright line
- `package.json` — author, publisher, repo, version, `contributes.themes[]`
- `README.md` — tagline, Variants section, Credits section
- `themes/tokyo-nebula.json` → renamed `themes/andromeda.json`; `name` + remove `author`
- `themes/tokyo-nebula-italic.json` → renamed `themes/aurora.json`; `name`
- `themes/equalizer.json` → renamed `themes/eclipse.json`; `name` + remove `author`
- `themes/dusk.json` → renamed `themes/solstice.json`; `name`
- `themes/operator.json` → renamed `themes/polaris.json`; `name`
- `zed-extension/extension.toml` — authors, repo, description
- `zed-extension/README.md` — Variants list
- `zed-extension/scripts/build.mjs` — `SOURCE_FILES`, `buildFamily` author, `UI_MAP` (rewrites + new entries), `buildAccents` (new function), `buildVariant` (emit `accents`)
- `zed-extension/scripts/build.test.mjs` — updated assertions + new tests
- `zed-extension/themes/tokyo-nebula.json` — regenerated
- `docs/superpowers/specs/2026-05-27-tokyo-nebula-zed-port-design.md` — scrubbed
- `docs/superpowers/plans/2026-05-27-tokyo-nebula-zed-port.md` — scrubbed

The NEW spec (`docs/superpowers/specs/2026-05-27-tokyo-nebula-rename-and-contrast-design.md`) and this plan are NOT scrubbed — they're the canonical record of the current change and intentionally describe what `ni3rav` references look like.

---

### Task 1: Update LICENSE copyright

**Files:**
- Modify: `LICENSE:3`

- [ ] **Step 1: Replace the copyright line**

In `LICENSE`, change:
```
Copyright (c) 2025 ni3rav
```
to:
```
Copyright (c) 2026 Paolo Arroyo
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "chore: set sole copyright to Paolo Arroyo (2026)"
```

---

### Task 2: Rename source theme files and update internal name fields

**Files:**
- Rename: `themes/tokyo-nebula.json` → `themes/andromeda.json`
- Rename: `themes/tokyo-nebula-italic.json` → `themes/aurora.json`
- Rename: `themes/equalizer.json` → `themes/eclipse.json`
- Rename: `themes/dusk.json` → `themes/solstice.json`
- Rename: `themes/operator.json` → `themes/polaris.json`
- Modify: each renamed file's `"name"` field (line 2 of each)

- [ ] **Step 1: Rename files with git mv to preserve history**

```bash
git mv themes/tokyo-nebula.json        themes/andromeda.json
git mv themes/tokyo-nebula-italic.json themes/aurora.json
git mv themes/equalizer.json           themes/eclipse.json
git mv themes/dusk.json                themes/solstice.json
git mv themes/operator.json            themes/polaris.json
```

- [ ] **Step 2: Verify renames landed**

Run: `ls themes/`
Expected: only `andromeda.json`, `aurora.json`, `eclipse.json`, `polaris.json`, `solstice.json`.

- [ ] **Step 3: Update each file's `"name"` field**

In `themes/andromeda.json`, find:
```json
"name": "Tokyo Nebula",
```
Replace with:
```json
"name": "Tokyo Nebula Andromeda",
```

In `themes/aurora.json`, find `"name": "Tokyo Nebula Italic",` → replace with `"name": "Tokyo Nebula Aurora",`.

In `themes/eclipse.json`, find `"name": "Tokyo Nebula Equalizer",` → replace with `"name": "Tokyo Nebula Eclipse",`.

In `themes/solstice.json`, find `"name": "Tokyo Nebula Dusk",` → replace with `"name": "Tokyo Nebula Solstice",`.

In `themes/polaris.json`, find `"name": "Tokyo Nebula Operator",` → replace with `"name": "Tokyo Nebula Polaris",`.

- [ ] **Step 4: Sanity-check name fields**

Run:
```bash
head -3 themes/*.json
```
Expected: each file shows its new `"name"` value on line 2.

- [ ] **Step 5: Commit**

```bash
git add themes/
git commit -m "feat: rename variants to celestial names (Andromeda/Aurora/Eclipse/Solstice/Polaris)"
```

---

### Task 3: Remove `author` field from source theme JSONs

**Files:**
- Modify: `themes/andromeda.json` (line ~3)
- Modify: `themes/eclipse.json` (line ~3)
- (Note: `themes/aurora.json`, `themes/solstice.json`, and `themes/polaris.json` do not currently carry an `author` field — verified by `grep -l '"author"' themes/*.json` returning only the two files above.)

- [ ] **Step 1: Confirm which files still carry the `author` field**

Run:
```bash
grep -l '"author"' themes/*.json
```
Expected: `themes/andromeda.json` and `themes/eclipse.json`.

- [ ] **Step 2: Remove the `author` line from `themes/andromeda.json`**

Find and delete the line (likely line 3):
```json
  "author": "ni3rav",
```

- [ ] **Step 3: Remove the `author` line from `themes/eclipse.json`**

Find and delete the line:
```json
  "author": "ni3rav",
```

- [ ] **Step 4: Verify no `author` field remains in any theme JSON**

Run:
```bash
grep -l '"author"' themes/*.json
```
Expected: no output (empty result).

- [ ] **Step 5: Commit**

```bash
git add themes/
git commit -m "chore: remove author field from source theme JSONs"
```

---

### Task 4: Rewrite `package.json`

**Files:**
- Modify: `package.json` (entire file)

- [ ] **Step 1: Replace `package.json` contents**

Write the entire file as:
```json
{
  "name": "tokyo-nebula",
  "displayName": "Tokyo Nebula",
  "description": "A five-variant dark theme family for VS Code and Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris.",
  "version": "0.1.0",
  "license": "MIT",
  "author": {
    "name": "Paolo Arroyo"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/juanarrow-io/tokyo-nebula"
  },
  "bugs": {
    "url": "https://github.com/juanarrow-io/tokyo-nebula/issues"
  },
  "keywords": [
    "theme",
    "dark theme",
    "tokyo night",
    "andromeda",
    "color-theme"
  ],
  "engines": {
    "vscode": "^1.40.0"
  },
  "categories": [
    "Themes"
  ],
  "scripts": {
    "package": "vsce package",
    "publish": "vsce publish"
  },
  "contributes": {
    "themes": [
      {
        "label": "Tokyo Nebula Andromeda",
        "uiTheme": "vs-dark",
        "path": "./themes/andromeda.json"
      },
      {
        "label": "Tokyo Nebula Aurora",
        "uiTheme": "vs-dark",
        "path": "./themes/aurora.json"
      },
      {
        "label": "Tokyo Nebula Eclipse",
        "uiTheme": "vs-dark",
        "path": "./themes/eclipse.json"
      },
      {
        "label": "Tokyo Nebula Solstice",
        "uiTheme": "vs-dark",
        "path": "./themes/solstice.json"
      },
      {
        "label": "Tokyo Nebula Polaris",
        "uiTheme": "vs-dark",
        "path": "./themes/polaris.json"
      }
    ]
  },
  "icon": "images/icon.png"
}
```

- [ ] **Step 2: Validate JSON**

Run:
```bash
node -e "JSON.parse(require('fs').readFileSync('package.json'))"
```
Expected: no output (exits cleanly).

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: package.json — sole author, juanarrow-io repo, drop publisher, v0.1.0, new variant paths/labels"
```

---

### Task 5: Rewrite top-level `README.md`

**Files:**
- Modify: `README.md` (entire file)

- [ ] **Step 1: Replace `README.md` contents**

Write the entire file as:
```markdown
<div align="center">

![theme banner](images/main.png)

# Tokyo Nebula

A five-variant dark theme family fusing the vibrant syntax highlighting of Andromeda with the elegant palette of Tokyo Night. Available for VS Code and Zed.

> Tip: For the best experience with italic ligatures, try Cascadia Code Nerd Font.

</div>

## Variants

- **Tokyo Nebula Andromeda** — Flagship: vibrant Andromeda syntax over a Tokyo Night palette
- **Tokyo Nebula Aurora** — Andromeda with italic styling for keywords and comments
- **Tokyo Nebula Eclipse** — Stealth monochrome over the Tokyo Night base, for distraction-free coding
- **Tokyo Nebula Solstice** — Warm, sunset-tinged variant for evening sessions
- **Tokyo Nebula Polaris** — Navy, low-contrast variant with operator emphasis and subtle borders

## Installation — VS Code

1. Open the Extensions sidebar in Visual Studio Code
2. Search for **Tokyo Nebula**
3. Click **Install**, then reload
4. Preferences > Color Theme > **Tokyo Nebula Andromeda** (or pick a variant)

## Installation — Zed

See [`zed-extension/README.md`](./zed-extension/README.md).

## Credits

- [Andromeda](https://github.com/EliverLara/Andromeda) — the original syntax-highlighting design
- [Tokyo Night](https://github.com/tokyo-night/tokyo-night-vscode-theme) — the palette foundation
- [Andromeda Night](https://github.com/ni3rav/andromeda-night) — the upstream theme this family was forked from

## License

[MIT License](./LICENSE)

Enjoy! :) 😺
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README — new variant names + tightened Credits"
```

---

### Task 6: Rewrite `zed-extension/extension.toml`

**Files:**
- Modify: `zed-extension/extension.toml` (entire file)

- [ ] **Step 1: Replace contents**

Write the entire file as:
```toml
schema_version = 1
id = "tokyo-nebula"
name = "Tokyo Nebula"
version = "0.1.0"
description = "Tokyo Nebula — a five-variant dark theme family for Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris."
authors = ["Paolo Arroyo"]
repository = "https://github.com/juanarrow-io/tokyo-nebula"
```

- [ ] **Step 2: Commit**

```bash
git add zed-extension/extension.toml
git commit -m "chore(zed): extension.toml — sole author, juanarrow-io repo, new description"
```

---

### Task 7: Rewrite `zed-extension/README.md`

**Files:**
- Modify: `zed-extension/README.md` (entire file)

- [ ] **Step 1: Replace contents**

Write the entire file as:
```markdown
# Tokyo Nebula for Zed

A five-variant dark theme family for Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris.

## Variants

- Tokyo Nebula Andromeda
- Tokyo Nebula Aurora
- Tokyo Nebula Eclipse
- Tokyo Nebula Solstice
- Tokyo Nebula Polaris

## Install (from source)

1. Clone this repo.
2. In Zed: open the command palette (`cmd-shift-p`), run `zed: install dev extension`.
3. Pick the `zed-extension/` directory.
4. Open the theme picker (`cmd-k cmd-t`) and choose a Tokyo Nebula variant.

## Regenerating the theme

The Zed family file is generated from the VS Code source themes by a small Node script:

```bash
cd zed-extension
node scripts/build.mjs
```

This reads `../themes/*.json` and writes `themes/tokyo-nebula.json`.

## License

[MIT](../LICENSE)
```

- [ ] **Step 2: Commit**

```bash
git add zed-extension/README.md
git commit -m "docs(zed): README — new variant names"
```

---

### Task 8: Update `build.mjs` `SOURCE_FILES` and `buildFamily` author; update existing test

**Files:**
- Modify: `zed-extension/scripts/build.mjs:306-313` (`buildFamily` author)
- Modify: `zed-extension/scripts/build.mjs:319-325` (`SOURCE_FILES`)
- Modify: `zed-extension/scripts/build.test.mjs:237` (assertion)

- [ ] **Step 1: Update `SOURCE_FILES` in `build.mjs`**

Find:
```js
const SOURCE_FILES = [
  'tokyo-nebula.json',
  'tokyo-nebula-italic.json',
  'equalizer.json',
  'dusk.json',
  'operator.json',
];
```
Replace with:
```js
const SOURCE_FILES = [
  'andromeda.json',
  'aurora.json',
  'eclipse.json',
  'solstice.json',
  'polaris.json',
];
```

- [ ] **Step 2: Update `buildFamily` author in `build.mjs`**

Find:
```js
export function buildFamily(sources) {
  return {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: 'Tokyo Nebula',
    author: 'ni3rav (port: Paolo Arroyo)',
    themes: sources.map(buildVariant),
  };
}
```
Replace the `author` line with:
```js
    author: 'Paolo Arroyo',
```

- [ ] **Step 3: Update the existing test assertion**

In `zed-extension/scripts/build.test.mjs`, find:
```js
  assert.equal(family.author, 'ni3rav (port: Paolo Arroyo)');
```
Replace with:
```js
  assert.equal(family.author, 'Paolo Arroyo');
```

- [ ] **Step 4: Run the test suite**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs
git commit -m "feat(zed): build.mjs — sole-author metadata, new SOURCE_FILES"
```

---

### Task 9: Contrast-fix `UI_MAP` rewrites (TDD)

**Files:**
- Modify: `zed-extension/scripts/build.test.mjs` (append tests)
- Modify: `zed-extension/scripts/build.mjs:22-134` (update entries in `UI_MAP`)

- [ ] **Step 1: Append failing tests at the end of `build.test.mjs`**

Add to the end of the file:
```js
test('UI_MAP: text uses editor.foreground (not foreground) when both present', () => {
  const source = {
    colors: {
      'editor.foreground': '#a9b1d6',
      'foreground': '#787c99',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui.text, '#a9b1d6');
});

test('UI_MAP: text falls back to input.foreground if editor.foreground missing', () => {
  const source = {
    colors: {
      'input.foreground': '#a9b1d6',
      'foreground': '#787c99',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui.text, '#a9b1d6');
});

test('UI_MAP: text.muted prefers foreground over descriptionForeground', () => {
  const source = {
    colors: {
      'foreground': '#787c99',
      'descriptionForeground': '#515670',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['text.muted'], '#787c99');
});

test('UI_MAP: icon prefers editor.foreground over foreground when icon.foreground missing', () => {
  const source = {
    colors: {
      'editor.foreground': '#a9b1d6',
      'foreground': '#787c99',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui.icon, '#a9b1d6');
});

test('UI_MAP: icon.muted prefers foreground over descriptionForeground', () => {
  const source = {
    colors: {
      'foreground': '#787c99',
      'descriptionForeground': '#515670',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['icon.muted'], '#787c99');
});

test('UI_MAP: element.background uses list.inactiveSelectionBackground, not button.background', () => {
  const source = {
    colors: {
      'button.background': '#3d59a1dd',
      'list.inactiveSelectionBackground': '#1c1d29',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['element.background'], '#1c1d29');
});

test('UI_MAP: ghost_element.background is unmapped (Zed default transparent)', () => {
  // After the change, ghost_element.background has no source mapping.
  // It should be absent from UI_MAP entirely so stripNullKeys omits it from output.
  assert.ok(!('ghost_element.background' in UI_MAP));
});

test('UI_MAP: text.placeholder falls back to descriptionForeground', () => {
  const source = { colors: { 'descriptionForeground': '#515670' } };
  const ui = resolveUi(source);
  assert.equal(ui['text.placeholder'], '#515670');
});

test('UI_MAP: text.disabled falls back to descriptionForeground', () => {
  const source = { colors: { 'descriptionForeground': '#515670' } };
  const ui = resolveUi(source);
  assert.equal(ui['text.disabled'], '#515670');
});
```

- [ ] **Step 2: Run tests, verify they FAIL**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: 9 new tests fail. The contrast tests will fail because `text` currently maps to `foreground` alone and `text.muted` to `descriptionForeground` alone.

- [ ] **Step 3: Apply the `UI_MAP` rewrites in `build.mjs`**

In `zed-extension/scripts/build.mjs`, find and update these specific entries inside the `UI_MAP` object:

Replace:
```js
  'text':                                      ['foreground'],
  'text.muted':                                ['descriptionForeground'],
  'text.placeholder':                          ['input.placeholderForeground'],
  'text.disabled':                             ['disabledForeground'],
```
With:
```js
  'text':                                      ['editor.foreground', 'input.foreground', 'sideBarSectionHeader.foreground', 'foreground'],
  'text.muted':                                ['foreground', 'descriptionForeground'],
  'text.placeholder':                          ['input.placeholderForeground', 'descriptionForeground'],
  'text.disabled':                             ['disabledForeground', 'descriptionForeground'],
```

Replace:
```js
  'icon':                                      ['icon.foreground', 'foreground'],
  'icon.muted':                                ['descriptionForeground'],
```
With:
```js
  'icon':                                      ['icon.foreground', 'editor.foreground', 'foreground'],
  'icon.muted':                                ['foreground', 'descriptionForeground'],
```

Replace:
```js
  'element.background':                        ['button.background'],
```
With:
```js
  'element.background':                        ['list.inactiveSelectionBackground', 'editorWidget.background'],
```

Remove the entire line:
```js
  'ghost_element.background':                  ['editor.background'],
```

- [ ] **Step 4: Run tests, verify they PASS**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests (existing + 9 new) pass.

- [ ] **Step 5: Commit**

```bash
git add zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs
git commit -m "fix(zed): UI_MAP — contrast fixes for text, icon, element.background"
```

---

### Task 10: New `UI_MAP` keys — diagnostics state triplets (TDD)

**Files:**
- Modify: `zed-extension/scripts/build.test.mjs` (append)
- Modify: `zed-extension/scripts/build.mjs` (append entries to `UI_MAP`)

- [ ] **Step 1: Append failing tests**

Add to the end of `build.test.mjs`:
```js
test('UI_MAP: hidden triplet maps to descriptionForeground', () => {
  const source = { colors: { 'descriptionForeground': '#515670' } };
  const ui = resolveUi(source);
  assert.equal(ui.hidden, '#515670');
  assert.equal(ui['hidden.background'], '#515670');
  assert.equal(ui['hidden.border'], '#515670');
});

test('UI_MAP: ignored triplet prefers gitDecoration.ignoredResourceForeground', () => {
  const source = {
    colors: {
      'gitDecoration.ignoredResourceForeground': '#404252',
      'disabledForeground': '#545c7e',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui.ignored, '#404252');
  assert.equal(ui['ignored.background'], '#404252');
  assert.equal(ui['ignored.border'], '#404252');
});

test('UI_MAP: ignored triplet falls back to disabledForeground', () => {
  const source = { colors: { 'disabledForeground': '#545c7e' } };
  const ui = resolveUi(source);
  assert.equal(ui.ignored, '#545c7e');
});

test('UI_MAP: renamed triplet prefers gitDecoration.renamedResourceForeground', () => {
  const source = {
    colors: {
      'gitDecoration.renamedResourceForeground': '#80a856',
      'gitDecoration.modifiedResourceForeground': '#c49a5a',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui.renamed, '#80a856');
  assert.equal(ui['renamed.background'], '#80a856');
  assert.equal(ui['renamed.border'], '#80a856');
});

test('UI_MAP: renamed falls back to modifiedResourceForeground', () => {
  const source = {
    colors: { 'gitDecoration.modifiedResourceForeground': '#c49a5a' },
  };
  const ui = resolveUi(source);
  assert.equal(ui.renamed, '#c49a5a');
});

test('UI_MAP: unreachable triplet maps to descriptionForeground', () => {
  const source = { colors: { 'descriptionForeground': '#515670' } };
  const ui = resolveUi(source);
  assert.equal(ui.unreachable, '#515670');
  assert.equal(ui['unreachable.background'], '#515670');
  assert.equal(ui['unreachable.border'], '#515670');
});
```

- [ ] **Step 2: Run tests, verify they FAIL**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: the 6 new tests fail (keys missing from UI_MAP).

- [ ] **Step 3: Append the new entries to `UI_MAP` in `build.mjs`**

Inside the `UI_MAP` object literal, before the closing brace `};` (just after the existing `'predictive.border':` line), insert:
```js
  'hidden':                                    ['descriptionForeground'],
  'hidden.background':                         ['descriptionForeground'],
  'hidden.border':                             ['descriptionForeground'],
  'ignored':                                   ['gitDecoration.ignoredResourceForeground', 'disabledForeground'],
  'ignored.background':                        ['gitDecoration.ignoredResourceForeground', 'disabledForeground'],
  'ignored.border':                            ['gitDecoration.ignoredResourceForeground', 'disabledForeground'],
  'renamed':                                   ['gitDecoration.renamedResourceForeground', 'gitDecoration.modifiedResourceForeground'],
  'renamed.background':                        ['gitDecoration.renamedResourceForeground', 'gitDecoration.modifiedResourceForeground'],
  'renamed.border':                            ['gitDecoration.renamedResourceForeground', 'gitDecoration.modifiedResourceForeground'],
  'unreachable':                               ['descriptionForeground'],
  'unreachable.background':                    ['descriptionForeground'],
  'unreachable.border':                        ['descriptionForeground'],
```

- [ ] **Step 4: Run tests, verify they PASS**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs
git commit -m "feat(zed): UI_MAP — add hidden/ignored/renamed/unreachable diagnostic triplets"
```

---

### Task 11: New `UI_MAP` keys — `version_control.*` (TDD)

**Files:**
- Modify: `zed-extension/scripts/build.test.mjs` (append)
- Modify: `zed-extension/scripts/build.mjs` (append entries)

- [ ] **Step 1: Append failing tests**

Add to the end of `build.test.mjs`:
```js
test('UI_MAP: version_control.added maps to gitDecoration.addedResourceForeground', () => {
  const source = { colors: { 'gitDecoration.addedResourceForeground': '#9ece6a' } };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.added'], '#9ece6a');
});

test('UI_MAP: version_control.modified maps to gitDecoration.modifiedResourceForeground', () => {
  const source = { colors: { 'gitDecoration.modifiedResourceForeground': '#c49a5a' } };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.modified'], '#c49a5a');
});

test('UI_MAP: version_control.deleted maps to gitDecoration.deletedResourceForeground', () => {
  const source = { colors: { 'gitDecoration.deletedResourceForeground': '#bb616b' } };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.deleted'], '#bb616b');
});

test('UI_MAP: version_control.word_added maps to diffEditor.insertedTextBackground', () => {
  const source = { colors: { 'diffEditor.insertedTextBackground': '#1e3a1e80' } };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.word_added'], '#1e3a1e80');
});

test('UI_MAP: version_control.word_deleted maps to diffEditor.removedTextBackground', () => {
  const source = { colors: { 'diffEditor.removedTextBackground': '#3a1e1e80' } };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.word_deleted'], '#3a1e1e80');
});

test('UI_MAP: conflict_marker.ours prefers merge.currentHeaderBackground', () => {
  const source = {
    colors: {
      'merge.currentHeaderBackground': '#3d59a1',
      'editorWarning.foreground': '#e0af68',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.conflict_marker.ours'], '#3d59a1');
});

test('UI_MAP: conflict_marker.ours falls back to editorWarning.foreground', () => {
  const source = { colors: { 'editorWarning.foreground': '#e0af68' } };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.conflict_marker.ours'], '#e0af68');
});

test('UI_MAP: conflict_marker.theirs prefers merge.incomingHeaderBackground', () => {
  const source = {
    colors: {
      'merge.incomingHeaderBackground': '#9a7ecc',
      'editorInfo.foreground': '#7dcfff',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['version_control.conflict_marker.theirs'], '#9a7ecc');
});
```

- [ ] **Step 2: Run tests, verify they FAIL**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: 8 new tests fail.

- [ ] **Step 3: Append the new entries to `UI_MAP`**

Inside the `UI_MAP` object, near the existing `'created':`, `'modified':`, `'deleted':` entries, add (immediately after the `'predictive.border':` line, alongside the entries just added in Task 10):
```js
  'version_control.added':                     ['gitDecoration.addedResourceForeground'],
  'version_control.modified':                  ['gitDecoration.modifiedResourceForeground'],
  'version_control.deleted':                   ['gitDecoration.deletedResourceForeground'],
  'version_control.word_added':                ['diffEditor.insertedTextBackground'],
  'version_control.word_deleted':              ['diffEditor.removedTextBackground'],
  'version_control.conflict_marker.ours':      ['merge.currentHeaderBackground', 'editorWarning.foreground'],
  'version_control.conflict_marker.theirs':    ['merge.incomingHeaderBackground', 'editorInfo.foreground'],
```

- [ ] **Step 4: Run tests, verify they PASS**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs
git commit -m "feat(zed): UI_MAP — add version_control.* entries"
```

---

### Task 12: New `UI_MAP` keys — search, link, hover_line_number, dim terminal (TDD)

**Files:**
- Modify: `zed-extension/scripts/build.test.mjs` (append)
- Modify: `zed-extension/scripts/build.mjs` (append entries)

- [ ] **Step 1: Append failing tests**

Add to the end of `build.test.mjs`:
```js
test('UI_MAP: search.active_match_background prefers editor.findMatchBackground', () => {
  const source = {
    colors: {
      'editor.findMatchBackground': '#3d59a1',
      'editor.findMatchHighlightBackground': '#3d59a166',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['search.active_match_background'], '#3d59a1');
});

test('UI_MAP: search.active_match_background falls back to findMatchHighlightBackground', () => {
  const source = { colors: { 'editor.findMatchHighlightBackground': '#3d59a166' } };
  const ui = resolveUi(source);
  assert.equal(ui['search.active_match_background'], '#3d59a166');
});

test('UI_MAP: editor.hover_line_number prefers active line number color', () => {
  const source = {
    colors: {
      'editorLineNumber.activeForeground': '#a9b1d6',
      'editorLineNumber.foreground': '#3b4261',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['editor.hover_line_number'], '#a9b1d6');
});

test('UI_MAP: link_text.hover prefers textLink.activeForeground', () => {
  const source = {
    colors: {
      'textLink.activeForeground': '#7dcfff',
      'textLink.foreground': '#3d59a1',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['link_text.hover'], '#7dcfff');
});

test('UI_MAP: terminal dim red maps to terminal.ansiRed (no separate dim in source)', () => {
  const source = { colors: { 'terminal.ansiRed': '#bb616b' } };
  const ui = resolveUi(source);
  assert.equal(ui['terminal.ansi.dim_red'], '#bb616b');
});

test('UI_MAP: terminal dim black prefers ansiBrightBlack over ansiBlack', () => {
  const source = {
    colors: {
      'terminal.ansiBlack': '#000000',
      'terminal.ansiBrightBlack': '#414868',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['terminal.ansi.dim_black'], '#414868');
});

test('UI_MAP: terminal dim white prefers ansiBrightWhite over ansiWhite', () => {
  const source = {
    colors: {
      'terminal.ansiWhite': '#a9b1d6',
      'terminal.ansiBrightWhite': '#ffffff',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['terminal.ansi.dim_white'], '#ffffff');
});
```

- [ ] **Step 2: Run tests, verify they FAIL**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: 7 new tests fail.

- [ ] **Step 3: Append the new entries to `UI_MAP`**

Inside the `UI_MAP` object, locate the existing `'search.match_background':` entry and add immediately after it:
```js
  'search.active_match_background':            ['editor.findMatchBackground', 'editor.findMatchHighlightBackground'],
```

Locate the existing `'editor.active_line_number':` entry and add immediately after it:
```js
  'editor.hover_line_number':                  ['editorLineNumber.activeForeground', 'editorLineNumber.foreground'],
```

At the bottom of the existing terminal-ansi block (after `'terminal.ansi.bright_white':`), insert:
```js
  'terminal.ansi.dim_black':                   ['terminal.ansiBrightBlack', 'terminal.ansiBlack'],
  'terminal.ansi.dim_red':                     ['terminal.ansiRed'],
  'terminal.ansi.dim_green':                   ['terminal.ansiGreen'],
  'terminal.ansi.dim_yellow':                  ['terminal.ansiYellow'],
  'terminal.ansi.dim_blue':                    ['terminal.ansiBlue'],
  'terminal.ansi.dim_magenta':                 ['terminal.ansiMagenta'],
  'terminal.ansi.dim_cyan':                    ['terminal.ansiCyan'],
  'terminal.ansi.dim_white':                   ['terminal.ansiBrightWhite', 'terminal.ansiWhite'],
```

Inside the `UI_MAP` object, near the bottom, append:
```js
  'link_text.hover':                           ['textLink.activeForeground', 'textLink.foreground'],
```

- [ ] **Step 4: Run tests, verify they PASS**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs
git commit -m "feat(zed): UI_MAP — add search/link/hover_line_number/dim terminal entries"
```

---

### Task 13: New `buildAccents` function + emit in `buildVariant` (TDD)

**Files:**
- Modify: `zed-extension/scripts/build.test.mjs` (append)
- Modify: `zed-extension/scripts/build.mjs:152-171` (after `buildPlayers`) — add `buildAccents`
- Modify: `zed-extension/scripts/build.mjs:291-304` (`buildVariant`) — call and emit `accents`

- [ ] **Step 1: Append failing tests**

Add to the end of `build.test.mjs`:
```js
import { buildAccents } from './build.mjs';

test('buildAccents: returns 5 entries', () => {
  const source = {
    colors: {
      'button.background': '#3d59a1',
      'editorBracketHighlight.foreground1': '#698cd6',
      'editorBracketHighlight.foreground2': '#68b3de',
      'editorBracketHighlight.foreground3': '#9a7ecc',
      'editorBracketHighlight.foreground4': '#25aac2',
      'editorBracketHighlight.foreground5': '#80a856',
    },
  };
  const accents = buildAccents(source);
  assert.equal(accents.length, 5);
});

test('buildAccents: uses bracket highlight colors 1..5', () => {
  const source = {
    colors: {
      'button.background': '#3d59a1',
      'editorBracketHighlight.foreground1': '#698cd6',
      'editorBracketHighlight.foreground2': '#68b3de',
      'editorBracketHighlight.foreground3': '#9a7ecc',
      'editorBracketHighlight.foreground4': '#25aac2',
      'editorBracketHighlight.foreground5': '#80a856',
    },
  };
  const accents = buildAccents(source);
  assert.equal(accents[0], '#698cd6');
  assert.equal(accents[1], '#68b3de');
  assert.equal(accents[2], '#9a7ecc');
  assert.equal(accents[3], '#25aac2');
  assert.equal(accents[4], '#80a856');
});

test('buildAccents: falls back to button.background when a bracket color is missing', () => {
  const source = {
    colors: {
      'button.background': '#3d59a1',
      'editorBracketHighlight.foreground1': '#698cd6',
    },
  };
  const accents = buildAccents(source);
  assert.equal(accents[0], '#698cd6');
  assert.equal(accents[1], '#3d59a1');
});

test('buildAccents: returns normalized hex strings', () => {
  const source = { colors: { 'button.background': '#ABC' } };
  const accents = buildAccents(source);
  assert.equal(accents[0], '#aabbcc');
});

test('buildVariant: emits style.accents alongside style.players', () => {
  const source = {
    name: 'Test',
    colors: {
      'editor.background': '#1a1b26',
      'button.background': '#3d59a1',
    },
    tokenColors: [],
  };
  const variant = buildVariant(source);
  assert.ok(Array.isArray(variant.style.accents));
  assert.equal(variant.style.accents.length, 5);
});
```

- [ ] **Step 2: Run tests, verify they FAIL**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: 5 new tests fail (`buildAccents` is not exported; `variant.style.accents` is undefined).

- [ ] **Step 3: Add the `buildAccents` function in `build.mjs`**

In `zed-extension/scripts/build.mjs`, immediately after the `buildPlayers` function (around line 171), add:
```js
export function buildAccents(source) {
  const colors = (source && source.colors) || {};
  const accent = normalizeHex(colors['button.background']) || '#7e83b2';
  const bracket = (i) =>
    normalizeHex(colors[`editorBracketHighlight.foreground${i}`]) || accent;

  return [bracket(1), bracket(2), bracket(3), bracket(4), bracket(5)];
}
```

- [ ] **Step 4: Wire `accents` into `buildVariant`**

In `zed-extension/scripts/build.mjs`, find `buildVariant`:
```js
export function buildVariant(source) {
  const ui = stripNullKeys(resolveUi(source));
  const syntax = resolveSyntax(source);
  const players = buildPlayers(source);
  return {
    name: source.name,
    appearance: 'dark',
    style: {
      ...ui,
      players,
      syntax,
    },
  };
}
```
Replace with:
```js
export function buildVariant(source) {
  const ui = stripNullKeys(resolveUi(source));
  const syntax = resolveSyntax(source);
  const players = buildPlayers(source);
  const accents = buildAccents(source);
  return {
    name: source.name,
    appearance: 'dark',
    style: {
      ...ui,
      players,
      accents,
      syntax,
    },
  };
}
```

- [ ] **Step 5: Run tests, verify they PASS**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs
git commit -m "feat(zed): emit style.accents derived from bracket highlight colors"
```

---

### Task 14: Add end-to-end variant-name test

**Files:**
- Modify: `zed-extension/scripts/build.test.mjs` (append)

- [ ] **Step 1: Append a test that builds the full family from disk and asserts variant names**

Add to the end of `build.test.mjs`:
```js
import { loadSources } from './build.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

test('loadSources + buildFamily: 5 variants with the expected celestial names', async () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const themesDir = resolve(here, '..', '..', 'themes');
  const sources = await loadSources(themesDir);
  const family = buildFamily(sources);
  const names = family.themes.map((t) => t.name);
  assert.deepEqual(names, [
    'Tokyo Nebula Andromeda',
    'Tokyo Nebula Aurora',
    'Tokyo Nebula Eclipse',
    'Tokyo Nebula Solstice',
    'Tokyo Nebula Polaris',
  ]);
});
```

- [ ] **Step 2: Run tests, verify they PASS**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass (the variants on disk already carry the new `name` fields after Task 2).

- [ ] **Step 3: Commit**

```bash
git add zed-extension/scripts/build.test.mjs
git commit -m "test(zed): assert 5 variants resolve to the new celestial names"
```

---

### Task 15: Regenerate `zed-extension/themes/tokyo-nebula.json`

**Files:**
- Modify: `zed-extension/themes/tokyo-nebula.json` (regenerated)

- [ ] **Step 1: Run the build script**

Run:
```bash
node zed-extension/scripts/build.mjs
```
Expected output (text on stdout):
```
wrote /Users/paolo/Tools/tokyo-nebula/zed-extension/themes/tokyo-nebula.json
  variants: Tokyo Nebula Andromeda, Tokyo Nebula Aurora, Tokyo Nebula Eclipse, Tokyo Nebula Solstice, Tokyo Nebula Polaris
```

- [ ] **Step 2: Sanity-check the generated file**

Run:
```bash
node -e "
const t = require('./zed-extension/themes/tokyo-nebula.json');
console.log('author:', t.author);
console.log('variants:', t.themes.map(v => v.name).join(', '));
const v = t.themes[0];
console.log('text:', v.style.text);
console.log('text.muted:', v.style['text.muted']);
console.log('element.background:', v.style['element.background']);
console.log('ghost_element.background:', v.style['ghost_element.background']);
console.log('accents.length:', v.style.accents && v.style.accents.length);
console.log('version_control.added:', v.style['version_control.added']);
"
```

Expected output:
- `author: Paolo Arroyo`
- `variants: Tokyo Nebula Andromeda, Tokyo Nebula Aurora, Tokyo Nebula Eclipse, Tokyo Nebula Solstice, Tokyo Nebula Polaris`
- `text: #a9b1d6` (brighter than the old `#787c99`)
- `text.muted: #787c99`
- `element.background: #1c1d29` (neutral, not the accent blue)
- `ghost_element.background: undefined` (omitted from the JSON entirely)
- `accents.length: 5`
- `version_control.added: #449dab` (or whatever the source palette uses)

- [ ] **Step 3: Commit the regenerated file**

```bash
git add zed-extension/themes/tokyo-nebula.json
git commit -m "build(zed): regenerate family JSON with new variants + contrast fixes"
```

---

### Task 16: Scrub historical docs in `docs/superpowers/`

**Files:**
- Modify: `docs/superpowers/specs/2026-05-27-tokyo-nebula-zed-port-design.md`
- Modify: `docs/superpowers/plans/2026-05-27-tokyo-nebula-zed-port.md`

These are the **previous** (zed-port) spec and plan, which still describe the migration in terms of `ni3rav` / `andromeda-night` / `Andromeda Night`. The user has chosen "scrub everything" for these.

**Do NOT modify** the current spec (`2026-05-27-tokyo-nebula-rename-and-contrast-design.md`) or this plan file — they intentionally describe what `ni3rav` references look like for purposes of the current change.

- [ ] **Step 1: Inspect the references to scrub**

Run:
```bash
grep -n "ni3rav\|andromeda-night\|Andromeda Night" docs/superpowers/specs/2026-05-27-tokyo-nebula-zed-port-design.md docs/superpowers/plans/2026-05-27-tokyo-nebula-zed-port.md
```
Expected: a set of line-numbered hits. Read each context line before mass-replacing — some occurrences are in code blocks describing OLD file contents (e.g., the old `extension.toml`), and rewriting those would falsify history.

- [ ] **Step 2: Apply substitutions with manual care**

For each hit, apply one of the following replacements per context:

| Source phrase | Replacement |
|---|---|
| `ni3rav (original)` (in authorship lists) | `Paolo Arroyo` (remove the comma + second entry) |
| `"author": "ni3rav (port: Paolo Arroyo)"` (in JSON snippets describing build output) | `"author": "Paolo Arroyo"` |
| `"publisher": "ni3rav"` (in package.json snippets) | *(remove this line entirely)* |
| `"name": "ni3rav"` (in author object snippets) | `"name": "Paolo Arroyo"` |
| `github.com/ni3rav/andromeda-night` (URLs) | `github.com/juanarrow-io/tokyo-nebula` |
| `andromeda-night` (as bare slug, e.g., in `git remote` commands) | `tokyo-nebula` |
| `/Users/paolo/Tools/andromeda-night` (filesystem paths) | `/Users/paolo/Tools/tokyo-nebula` |
| `Andromeda Night` (as a theme display name, e.g., "rename Andromeda Night to Tokyo Nebula") | `the prior theme name` |
| `the existing Andromeda Night VS Code theme` | `the existing VS Code theme` |
| `"ni3rav (original)" and "Paolo Arroyo (Zed port)"` (in authors arrays) | `"Paolo Arroyo"` |
| Bare `ni3rav` references as a person/maintainer name | `the upstream maintainer` (or remove the sentence if it's now empty of useful content) |

Use `Edit` or `Edit` with `replace_all` for unambiguous patterns. For ambiguous occurrences (e.g., inside long code-block fixtures), read the surrounding context and apply the rule that preserves the document's meaning.

- [ ] **Step 3: Verify no remaining `ni3rav` or `andromeda-night` strings (other than the explicitly retained ones)**

Run:
```bash
grep -n "ni3rav\|andromeda-night" docs/superpowers/specs/2026-05-27-tokyo-nebula-zed-port-design.md docs/superpowers/plans/2026-05-27-tokyo-nebula-zed-port.md
```
Expected: zero hits.

```bash
grep -n "Andromeda Night" docs/superpowers/specs/2026-05-27-tokyo-nebula-zed-port-design.md docs/superpowers/plans/2026-05-27-tokyo-nebula-zed-port.md
```
Expected: zero hits.

- [ ] **Step 4: Confirm the current spec and this plan are untouched**

Run:
```bash
grep -c "ni3rav\|andromeda-night\|Andromeda Night" docs/superpowers/specs/2026-05-27-tokyo-nebula-rename-and-contrast-design.md docs/superpowers/plans/2026-05-27-tokyo-nebula-rename-and-contrast.md
```
Expected: both files report > 0 hits (these are the canonical record of the current change and are intentionally retained).

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/
git commit -m "docs: scrub ni3rav/andromeda-night references from historical zed-port docs"
```

---

### Task 17: Final validation pass

**Files:**
- None — this task only runs checks.

- [ ] **Step 1: Run the full test suite**

Run:
```bash
node --test zed-extension/scripts/build.test.mjs
```
Expected: all tests pass, no failures.

- [ ] **Step 2: Confirm no old filenames or `ni3rav` references linger in shipped files**

Run two precise greps:

```bash
# Old filenames (these should NEVER appear in shipped, non-historical files)
grep -rn "tokyo-nebula-italic\.json\|equalizer\.json\|dusk\.json\|operator\.json" \
  package.json zed-extension/extension.toml zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs 2>/dev/null
```
Expected: zero hits.

```bash
# ni3rav strings outside of the legitimate README Credits attribution
grep -n "ni3rav" package.json LICENSE zed-extension/extension.toml \
  zed-extension/scripts/build.mjs zed-extension/scripts/build.test.mjs themes/*.json 2>/dev/null
```
Expected: zero hits.

```bash
# In README.md the only legitimate ni3rav hit is the upstream Credits bullet
grep -n "ni3rav" README.md
```
Expected: exactly one line — the Credits bullet `[Andromeda Night](https://github.com/ni3rav/andromeda-night) — the upstream theme this family was forked from`.

If anything else shows up, fix it before continuing.

- [ ] **Step 3: Confirm package.json is valid and shows the new state**

Run:
```bash
node -e "
const p = require('./package.json');
console.log('version:', p.version);
console.log('author:', p.author && p.author.name);
console.log('publisher present:', 'publisher' in p);
console.log('repo:', p.repository.url);
console.log('themes:', p.contributes.themes.map(t => t.label).join(' | '));
"
```
Expected:
- `version: 0.1.0`
- `author: Paolo Arroyo`
- `publisher present: false`
- `repo: https://github.com/juanarrow-io/tokyo-nebula`
- `themes: Tokyo Nebula Andromeda | Tokyo Nebula Aurora | Tokyo Nebula Eclipse | Tokyo Nebula Solstice | Tokyo Nebula Polaris`

- [ ] **Step 4: Confirm git status is clean**

Run:
```bash
git status
```
Expected: `nothing to commit, working tree clean`.

- [ ] **Step 5: (No commit) Report ready for manual verification**

State to the user that automated checks pass and manual verification in Zed is the next step.

---

### Task 18: Manual verification in Zed (USER STEP)

**Files:** None — this is a hands-on check the user (or engineer running the plan) performs in the Zed editor.

This task is not commit-producing; it is a verification gate.

- [ ] **Step 1: Install the dev extension**

In Zed:
1. Open the command palette (`cmd-shift-p`).
2. Run `zed: install dev extension`.
3. Pick `/Users/paolo/Tools/tokyo-nebula/zed-extension/`.

- [ ] **Step 2: Open the theme picker and cycle each variant**

In Zed:
1. Open the theme picker (`cmd-k cmd-t`).
2. Select **Tokyo Nebula Andromeda**.
3. Repeat for Aurora, Eclipse, Solstice, and Polaris.

For each variant, confirm:
- Editor renders. Side bar, status bar, tab bar visible.
- Open the agent panel (right-side).
- Message body text in the thread is clearly readable on the panel background (the original bug).
- Tool-call cards in the thread show a neutral elevated tint, not a saturated blue cast.
- Code blocks inside agent messages have a visible boundary against the panel background.
- Tabs, sidebar, and title bar retain a clear visual hierarchy.

- [ ] **Step 3: Report findings**

If everything looks correct, report success. If any variant shows a regression vs. the prior state, capture a screenshot and open a new debugging session — do not silently amend this plan.

---

## Self-Review notes (for the planner)

- **Spec coverage:** Tasks 1–7 cover Section 1 (author cleanup). Task 2 + Task 4 cover Section 2 (variant rename). Tasks 8–14 cover Section 3 (mapping audit). Task 15 covers regeneration. Task 16 covers the docs scrub. Task 17–18 cover Section 4 (testing & manual verification). No gaps.
- **Placeholder scan:** No "TBD" / "TODO" / "implement later" in any task.
- **Type consistency:** All function names (`buildPlayers`, `buildAccents`, `buildVariant`, `buildFamily`, `resolveUi`, `loadSources`) used consistently. Hex values in test fixtures match the Tokyo Nebula source palette.
- **Risk acknowledgement:** Some new keys (e.g., `version_control.word_added` ← `diffEditor.insertedTextBackground`) may not resolve on all 5 source variants. The fallback chains tolerate this; absent values are omitted and Zed uses engine defaults. This is documented in the spec's "Open risks" section.
