# Tokyo Nebula — Variant Rename, Author Cleanup & Contrast-Mapping Audit

**Date:** 2026-05-27
**Branch:** `feat/tokyo-nebula-port`
**Status:** Design

## Summary

Three coupled changes to the Tokyo Nebula theme family:

1. **Author cleanup.** Establish Paolo Arroyo as sole author across all shipped artifacts (`package.json`, `LICENSE`, theme JSONs, `extension.toml`, build scripts, README copyright). Upstream theme attribution (Andromeda, Tokyo Night, ni3rav's original "Andromeda Night") remains in the README **Credits** section as lineage acknowledgement.
2. **Variant rename.** Each of the five variants gets a distinct celestial name under the Tokyo Nebula family: **Andromeda, Aurora, Eclipse, Solstice, Polaris**. Source theme JSON filenames, display labels, and internal `name` fields are all updated.
3. **Color-mapping audit.** Fix the demonstrable low-contrast bug in Zed's agent/thread panel (root cause: `text` mapped to the dim `foreground` instead of the palette's real body-text color), and bring `UI_MAP` in line with the full Zed v0.2.0 schema by adding all currently-unmapped keys.

## Goals

- Ship a visually correct agent panel (WCAG AA-or-better contrast for message text on panel background).
- Remove sole-authorship ambiguity. All `author` / `publisher` / copyright fields name only Paolo Arroyo.
- Give the five variants meaningful, themed names tied to the family identity.
- Eliminate Zed engine-default fallbacks by covering every key in the v0.2.0 schema that our palette can resolve.

## Non-goals

- No change to syntax token colors (`SYNTAX_MAP`).
- No change to the source palette hex values. Mapping layer only.
- No move to publish on the VS Code Marketplace in this branch (publisher field stays removed).
- No rewrite of `docs/superpowers/plans/` content beyond scrubbing `ni3rav` / `andromeda-night` / `Andromeda Night` strings.

---

## Section 1 — Author & branding cleanup

### `package.json`

- Remove the `publisher` field entirely. (Local installs still work; marketplace publishing is deferred until the user has a publisher ID.)
- `author`: `{ "name": "Paolo Arroyo" }`.
- `repository`: `{ "type": "git", "url": "https://github.com/juanarrow-io/tokyo-nebula" }`.
- `bugs`: `{ "url": "https://github.com/juanarrow-io/tokyo-nebula/issues" }`.
- `contributes.themes[]`: each entry's `label` and `path` updated per Section 2.
- `version`: bump `0.0.7` → `0.1.0` (variant rename is a user-visible display change).

### `LICENSE`

- Replace `Copyright (c) 2025 ni3rav` with `Copyright (c) 2026 Paolo Arroyo`. No other text changes.

### `README.md` (top level)

- Tagline: keep "fusing Andromeda's vibrant syntax highlighting with Tokyo Night's elegant palette" — this references upstream **themes**, not the prior maintainer.
- **Variants** section: regenerated against the five new names (see Section 2).
- **Credits** section keeps three bullets:
  - [Andromeda](https://github.com/EliverLara/Andromeda)
  - [Tokyo Night](https://github.com/tokyo-night/tokyo-night-vscode-theme)
  - [Andromeda Night](https://github.com/ni3rav/andromeda-night) — the lineage source this family was forked from.
- No `Author` or `Maintainer` section is added. Authorship lives in `package.json`, `LICENSE`, and `extension.toml`.

### `themes/*.json` (5 source files)

- Remove the `"author"` field entirely from each file. (VS Code's color-theme schema doesn't require it; cleaner than carrying a name field that needs maintenance.)
- Update the `"name"` field per Section 2.

### `zed-extension/extension.toml`

- `authors = ["Paolo Arroyo"]`.
- `repository = "https://github.com/juanarrow-io/tokyo-nebula"`.
- `description`: rewrite to drop "ported from the Andromeda Night VS Code theme." Replacement: `"Tokyo Nebula — a five-variant dark theme family for Zed: Andromeda, Aurora, Eclipse, Solstice, Polaris."`

### `zed-extension/README.md`

- Variants list updated to the five new names.
- No other changes (this file does not currently reference ni3rav).

### `zed-extension/scripts/build.mjs` and `build.test.mjs`

- `buildFamily()` sets `author: 'Paolo Arroyo'`.
- Existing test assertion `family.author === 'ni3rav (port: Paolo Arroyo)'` updated to `=== 'Paolo Arroyo'`.

### `docs/superpowers/specs/` and `/plans/`

- Replace `ni3rav` → `Paolo Arroyo` (or remove altogether, depending on context — e.g., a sentence saying "ni3rav's original theme" becomes "the upstream Andromeda Night theme").
- Replace `andromeda-night` (repo slug) → `tokyo-nebula`.
- Replace `Andromeda Night` (theme display name in historical migration commands) → `Tokyo Nebula`.
- Where the docs describe a `git remote set-url` to `ni3rav/tokyo-nebula.git`, update the remote to `juanarrow-io/tokyo-nebula.git`.
- Andromeda mentions that refer to the **upstream theme by EliverLara** (the design lineage) stay intact.

---

## Section 2 — Variant rename

### Mapping table

| Old display name | New display name | Old filename | New filename | Variant character |
|---|---|---|---|---|
| Tokyo Nebula | **Tokyo Nebula Andromeda** | `tokyo-nebula.json` | `andromeda.json` | Flagship; heritage nod |
| Tokyo Nebula Italic | **Tokyo Nebula Aurora** | `tokyo-nebula-italic.json` | `aurora.json` | Italic; flowing color |
| Tokyo Nebula Equalizer | **Tokyo Nebula Eclipse** | `equalizer.json` | `eclipse.json` | Monochrome blackout |
| Tokyo Nebula Dusk | **Tokyo Nebula Solstice** | `dusk.json` | `solstice.json` | Warm sunset |
| Tokyo Nebula Operator | **Tokyo Nebula Polaris** | `operator.json` | `polaris.json` | Steady navy |

### File renames

Performed via `git mv` to preserve history:

```bash
git mv themes/tokyo-nebula.json        themes/andromeda.json
git mv themes/tokyo-nebula-italic.json themes/aurora.json
git mv themes/equalizer.json           themes/eclipse.json
git mv themes/dusk.json                themes/solstice.json
git mv themes/operator.json            themes/polaris.json
```

### Internal `name` field updates

Inside each source theme JSON, replace the `"name"` value:

| File | New `"name"` value |
|---|---|
| `themes/andromeda.json` | `"Tokyo Nebula Andromeda"` |
| `themes/aurora.json` | `"Tokyo Nebula Aurora"` |
| `themes/eclipse.json` | `"Tokyo Nebula Eclipse"` |
| `themes/solstice.json` | `"Tokyo Nebula Solstice"` |
| `themes/polaris.json` | `"Tokyo Nebula Polaris"` |

### `package.json` `contributes.themes[]`

Replace the existing five entries with:

```json
[
  { "label": "Tokyo Nebula Andromeda", "uiTheme": "vs-dark", "path": "./themes/andromeda.json" },
  { "label": "Tokyo Nebula Aurora",    "uiTheme": "vs-dark", "path": "./themes/aurora.json" },
  { "label": "Tokyo Nebula Eclipse",   "uiTheme": "vs-dark", "path": "./themes/eclipse.json" },
  { "label": "Tokyo Nebula Solstice",  "uiTheme": "vs-dark", "path": "./themes/solstice.json" },
  { "label": "Tokyo Nebula Polaris",   "uiTheme": "vs-dark", "path": "./themes/polaris.json" }
]
```

### `zed-extension/scripts/build.mjs` `SOURCE_FILES`

```js
const SOURCE_FILES = [
  'andromeda.json',
  'aurora.json',
  'eclipse.json',
  'solstice.json',
  'polaris.json',
];
```

### Generated `zed-extension/themes/tokyo-nebula.json`

Regenerated by running `node zed-extension/scripts/build.mjs`. The Zed family name stays `Tokyo Nebula`; each entry in its `themes[]` array gets one of the five new variant names (e.g., `"name": "Tokyo Nebula Andromeda"`).

---

## Section 3 — Color-mapping audit

### Root-cause summary

The agent/thread panel screenshot showed three coupled defects:

1. **Body text is too dim.** Zed's `text` key resolved to VS Code's `foreground` (`#787c99`), a mid-gray. Against `panel.background` (`#16161e`), that's ~3.5:1 — below WCAG AA. The palette's actual "body text" color (`#a9b1d6`) sits at `editor.foreground` / `input.foreground` / `sideBarSectionHeader.foreground` and was never used for `text`.
2. **Tool-call cards are accent-saturated.** `element.background` mapped to `button.background` (`#3d59a1dd`). After alpha blending on the panel, that yields roughly `#385090` — a heavy accent blue. `element.background` is the neutral surface for inline cards; mapping it to the accent role was incorrect.
3. **`text.muted` is too dim.** Mapped to `descriptionForeground` (`#515670`), which is darker than the body-text dim role typically used in this palette. The proper muted role is `foreground` (`#787c99`).

### Contrast-fix mapping changes

| Zed key | Current chain | New chain |
|---|---|---|
| `text` | `['foreground']` | `['editor.foreground', 'input.foreground', 'sideBarSectionHeader.foreground', 'foreground']` |
| `text.muted` | `['descriptionForeground']` | `['foreground', 'descriptionForeground']` |
| `text.placeholder` | `['input.placeholderForeground']` | `['input.placeholderForeground', 'descriptionForeground']` |
| `text.disabled` | `['disabledForeground']` | `['disabledForeground', 'descriptionForeground']` |
| `icon` | `['icon.foreground', 'foreground']` | `['icon.foreground', 'editor.foreground', 'foreground']` |
| `icon.muted` | `['descriptionForeground']` | `['foreground', 'descriptionForeground']` |
| `element.background` | `['button.background']` | `['list.inactiveSelectionBackground', 'editorWidget.background']` |
| `ghost_element.background` | `['editor.background']` | *(remove entry — leaves null → Zed renders transparent)* |

### New keys (full-schema audit)

All keys present in Zed's `assets/themes/one/one.json` but absent from our current `UI_MAP`. For each, the resolver tries the chain in order and uses the first present, normalized value; if no source key resolves, the output omits the key (Zed falls back to its engine default).

| New Zed key | Source chain |
|---|---|
| `search.active_match_background` | `['editor.findMatchBackground', 'editor.findMatchHighlightBackground']` |
| `editor.hover_line_number` | `['editorLineNumber.activeForeground', 'editorLineNumber.foreground']` |
| `link_text.hover` | `['textLink.activeForeground', 'textLink.foreground']` |
| `version_control.added` | `['gitDecoration.addedResourceForeground']` |
| `version_control.modified` | `['gitDecoration.modifiedResourceForeground']` |
| `version_control.deleted` | `['gitDecoration.deletedResourceForeground']` |
| `version_control.word_added` | `['diffEditor.insertedTextBackground']` |
| `version_control.word_deleted` | `['diffEditor.removedTextBackground']` |
| `version_control.conflict_marker.ours` | `['merge.currentHeaderBackground', 'editorWarning.foreground']` |
| `version_control.conflict_marker.theirs` | `['merge.incomingHeaderBackground', 'editorInfo.foreground']` |
| `hidden`, `.background`, `.border` | `['descriptionForeground']` |
| `ignored`, `.background`, `.border` | `['gitDecoration.ignoredResourceForeground', 'disabledForeground']` |
| `renamed`, `.background`, `.border` | `['gitDecoration.renamedResourceForeground', 'gitDecoration.modifiedResourceForeground']` |
| `unreachable`, `.background`, `.border` | `['descriptionForeground']` |
| `terminal.ansi.dim_black` | `['terminal.ansiBrightBlack', 'terminal.ansiBlack']` |
| `terminal.ansi.dim_red` | `['terminal.ansiRed']` |
| `terminal.ansi.dim_green` | `['terminal.ansiGreen']` |
| `terminal.ansi.dim_yellow` | `['terminal.ansiYellow']` |
| `terminal.ansi.dim_blue` | `['terminal.ansiBlue']` |
| `terminal.ansi.dim_magenta` | `['terminal.ansiMagenta']` |
| `terminal.ansi.dim_cyan` | `['terminal.ansiCyan']` |
| `terminal.ansi.dim_white` | `['terminal.ansiBrightWhite', 'terminal.ansiWhite']` |

### `accents` array (new)

Add a `buildAccents(source)` function alongside `buildPlayers`. It returns an array of 5 distinct hex strings drawn from `editorBracketHighlight.foreground1..5`, falling back to `button.background` if any are missing. Emit `accents` on each variant inside `style`, parallel to `players`.

### Resolver behavior (no change)

`resolveUi` continues to iterate each key's chain in order, returning the first non-null normalized hex. Keys with no resolved value are stripped by the existing `stripNullKeys` step before being merged into the variant's `style`. Behavior identical; only the data driving it changes.

---

## Section 4 — Tests & verification

### Updated assertions in `build.test.mjs`

- `family.author === 'Paolo Arroyo'` (was: `'ni3rav (port: Paolo Arroyo)'`).
- The five variant names in `family.themes.map(t => t.name)` equal `['Tokyo Nebula Andromeda', 'Tokyo Nebula Aurora', 'Tokyo Nebula Eclipse', 'Tokyo Nebula Solstice', 'Tokyo Nebula Polaris']`.
- `SOURCE_FILES` exported (or its effect on `loadSources`) covers `andromeda.json` through `polaris.json`.

### New test cases

- **Contrast lift for `text`.** Given a source with `editor.foreground: '#a9b1d6'` and `foreground: '#787c99'`, `resolveUi(source).text === '#a9b1d6ff'` (not `#787c99ff`).
- **`element.background` neutralized.** Given a source with `button.background: '#3d59a1dd'` and `list.inactiveSelectionBackground: '#1c1d29'`, `resolveUi(source)['element.background'] === '#1c1d29ff'`.
- **`text.muted` re-tiered.** Maps to `foreground` when present (not `descriptionForeground`).
- **`accents` array.** `buildVariant(source).style.accents.length === 5` and contains valid normalized hex values.
- **One new schema key per group covered.** Assertions for `version_control.added`, `hidden`, `terminal.ansi.dim_red`, and `search.active_match_background` each resolve to expected values for a representative source theme.

### Manual verification

After the build script regenerates `zed-extension/themes/tokyo-nebula.json`:

1. Install the dev extension in Zed (`zed: install dev extension` → `zed-extension/`).
2. For each of the five variants, open a workspace with both the editor and the agent panel visible. Verify:
   - Agent message body text is clearly readable on the panel background.
   - Tool-call cards have a neutral elevated tint, not a saturated blue cast.
   - Code blocks inside agent messages have a visible boundary against the panel.
   - Tabs, sidebar, status bar all retain their intended hierarchy.

---

## Open risks

- **`editor.findMatchBackground` may not be defined in all source palettes.** If the chain falls through, `search.active_match_background` is omitted and Zed uses its engine default. Acceptable (no regression).
- **`diffEditor.insertedTextBackground` / `removedTextBackground` similarly may be absent.** Same handling.
- **Bumping `version` to `0.1.0`** changes the marketplace versioning trajectory. Acceptable for this branch since `publisher` is removed and we're not publishing.
- **The Operator variant lacks several palette keys** (e.g., no `descriptionForeground`, no `disabledForeground`). The fallback chains tolerate this — but a few new keys (e.g., `hidden`, `unreachable`) will resolve to nothing on Operator and inherit Zed defaults. Acceptable; if Operator looks off in manual verification, address in a follow-up.

## Out of scope

- Adding new variants.
- Changing `SYNTAX_MAP` (token color resolution).
- VS Code Marketplace publishing.
- Renaming the Zed extension `id` or family-level `name`.
