# Tokyo Nebula — VS Code → Zed Port (Design Spec)

Date: 2026-05-27
Status: Approved (pending user review of this written spec)

## Overview

Port the existing 5-variant VS Code theme (currently published as "Andromeda Night")
to Zed as a single theme family extension. As part of the port, rebrand the entire
repository from `andromeda-night` to `tokyo-nebula`. Colors are preserved 1:1 from
the VS Code sources where Zed has an equivalent key; mapping is lossy in places
where Zed and VS Code partition the UI/syntax space differently, so a documented
fallback chain handles missing keys.

The flagship Zed theme is named **Tokyo Nebula**. The 5 variants:

- Tokyo Nebula
- Tokyo Nebula Italic
- Tokyo Nebula Equalizer
- Tokyo Nebula Dusk
- Tokyo Nebula Operator

## Scope

In scope:

- Rebrand the existing repo (directory, `package.json`, README, internal theme
  `name` fields, theme JSON filenames) from `andromeda-night` → `tokyo-nebula`.
- Generate a Zed extension under `zed-extension/` containing all 5 variants in
  one theme family JSON.
- Best-effort syntax mapping from VS Code TextMate scopes to Zed tree-sitter
  scopes (~45 Zed scopes covered).
- Manual smoke test of the extension in Zed before claiming completion.

Out of scope (YAGNI):

- Icon theme port.
- Keymap port.
- Automated screenshot generation.
- Publishing the Zed extension to the registry (separate follow-up).

## File Layout

```
tokyo-nebula/                       # renamed from andromeda-night/
├── package.json                    # name/displayName/labels → "Tokyo Nebula"
├── README.md                       # rebranded
├── themes/                         # VS Code theme JSONs, renamed
│   ├── tokyo-nebula.json
│   ├── tokyo-nebula-italic.json
│   ├── equalizer.json              # internal "name" updated; file kept
│   ├── dusk.json
│   └── operator.json
├── images/                         # unchanged
├── docs/superpowers/specs/         # this spec lives here
└── zed-extension/                  # NEW — self-contained Zed extension
    ├── extension.toml
    ├── themes/
    │   └── tokyo-nebula.json       # family with 5 variants
    ├── scripts/
    │   └── build.mjs               # generator: source VS Code JSONs → family
    └── README.md
```

The parent directory rename happens **last** so the working directory stays
valid during edits.

`extension.toml` shape:

```toml
schema_version = 1
id = "tokyo-nebula"
name = "Tokyo Nebula"
version = "0.0.1"
description = "Tokyo Nebula — a dark theme family ported from the Andromeda Night VS Code theme."
authors = ["ni3rav (original)", "Paolo Arroyo (Zed port)"]
repository = "https://github.com/ni3rav/andromeda-night"
```

## Zed Family JSON Schema

The family file follows Zed's `theme.json` v0.2.0 schema:

```jsonc
{
  "$schema": "https://zed.dev/schema/themes/v0.2.0.json",
  "name": "Tokyo Nebula",
  "author": "ni3rav (port: Paolo Arroyo)",
  "themes": [
    {
      "name": "Tokyo Nebula",
      "appearance": "dark",
      "style": {
        /* ~80 UI keys (see UI mapping table) */
        "players": [ /* 8 collaboration cursor entries */ ],
        "syntax": {
          "keyword":  { "color": "#…", "font_style": null, "font_weight": null },
          "string":   { "color": "#…" },
          "comment":  { "color": "#…", "font_style": "italic" }
          /* … one entry per resolved Zed scope */
        }
      }
    }
    /* 4 more variant entries */
  ]
}
```

## UI Color Mapping (VS Code → Zed)

Listed by Zed key. **Fallback rule:** if the listed VS Code source is absent
in a given variant, walk the fallback chain shown; if still missing, derive
from the nearest available palette color (typically by alpha-overlaying
`foreground` on `background`).

| Zed key | VS Code source (fallbacks → after arrow) |
|---|---|
| `background` | `editor.background` |
| `foreground` | `foreground` |
| `border` | `panel.border` → `sideBar.border` |
| `border.variant` | `editorGroup.border` |
| `border.focused` | `focusBorder` |
| `border.selected` | `list.activeSelectionBackground` |
| `surface.background` | `sideBar.background` |
| `elevated_surface.background` | `editorWidget.background` → `sideBar.background` |
| `element.background` | `button.background` |
| `element.hover` | `list.hoverBackground` |
| `element.active` | `list.activeSelectionBackground` |
| `element.selected` | `list.inactiveSelectionBackground` |
| `drop_target.background` | `list.dropBackground` |
| `ghost_element.background` | `editor.background` |
| `text` | `foreground` |
| `text.muted` | `descriptionForeground` |
| `text.placeholder` | `input.placeholderForeground` |
| `text.disabled` | `disabledForeground` |
| `text.accent` | `textLink.foreground` → `button.background` |
| `panel.background` | `panel.background` → `sideBar.background` |
| `pane.focused_border` | `focusBorder` |
| `editor.background` | `editor.background` |
| `editor.foreground` | `editor.foreground` |
| `editor.gutter.background` | `editorGutter.background` → `editor.background` |
| `editor.line_number` | `editorLineNumber.foreground` |
| `editor.active_line_number` | `editorLineNumber.activeForeground` |
| `editor.active_line.background` | `editor.lineHighlightBackground` |
| `editor.highlighted_line.background` | `editor.rangeHighlightBackground` |
| `editor.subheader.background` | `editor.background` |
| `editor.document_highlight.read_background` | `editor.wordHighlightBackground` |
| `editor.document_highlight.write_background` | `editor.wordHighlightStrongBackground` |
| `terminal.background` | `terminal.background` → `panel.background` |
| `terminal.foreground` | `terminal.foreground` → `foreground` |
| `terminal.ansi.{black,red,green,yellow,blue,magenta,cyan,white}` | `terminal.ansi.<same>` |
| `terminal.ansi.bright_{…}` | `terminal.ansi.bright<Same>` |
| `tab.active_background` | `tab.activeBackground` |
| `tab.inactive_background` | `tab.inactiveBackground` |
| `tab_bar.background` | `editorGroupHeader.tabsBackground` |
| `title_bar.background` | `titleBar.activeBackground` |
| `status_bar.background` | `statusBar.background` |
| `toolbar.background` | `editorGroupHeader.tabsBackground` |
| `scrollbar.thumb.background` | `scrollbarSlider.background` |
| `scrollbar.thumb.hover_background` | `scrollbarSlider.hoverBackground` |
| `scrollbar.thumb.border` | transparent (no VS Code equivalent) |
| `scrollbar.track.background` | `editor.background` |
| `scrollbar.track.border` | transparent |
| `search.match_background` | `editor.findMatchHighlightBackground` |
| `created` | `gitDecoration.addedResourceForeground` |
| `modified` | `gitDecoration.modifiedResourceForeground` |
| `deleted` | `gitDecoration.deletedResourceForeground` |
| `conflict` | `editorWarning.foreground` |
| `success` | `notebookStatusSuccessIcon.foreground` → `editorInfo.foreground` |
| `warning` | `editorWarning.foreground` |
| `error` | `editorError.foreground` |
| `info` | `editorInfo.foreground` |
| `hint` | `editorHint.foreground` |
| `predictive` | `editorGhostText.foreground` → `descriptionForeground` |
| `players[0..7]` | accent (`button.background`), then `editorBracketHighlight.foreground1..6`, then `editorWarning.foreground` |

Keys not listed above but present in the Zed v0.2.0 schema are filled with
sensible derivations (transparent or `foreground`-on-`background` overlays).
The build script (below) is the source of truth for the full enumeration.

## Syntax Scope Mapping (TextMate → Zed)

VS Code theme files have a `tokenColors` array. Each entry has a `scope`
(string or array) and `settings` (color, optional `fontStyle`). To resolve
each Zed scope, the build script searches that array for the **first**
TextMate scope from the priority list below that matches an entry in the
source (matching by exact string or dotted prefix; longest match wins
within a single priority slot).

Zed scopes populated (~45 total):

```
attribute, boolean, comment, comment.doc, constant, constructor,
embedded, emphasis, emphasis.strong, enum, function, function.builtin,
function.definition, function.method, function.method.builtin,
function.special.definition, hint, keyword, keyword.control, label,
link_text, link_uri, number, operator, predictive, preproc, primary,
property, punctuation, punctuation.bracket, punctuation.delimiter,
punctuation.list_marker, punctuation.special, string, string.escape,
string.regex, string.special, string.special.symbol, tag, text.literal,
title, type, type.builtin, variable, variable.special, variant
```

| Zed scope | TextMate scope priority (first match wins) |
|---|---|
| `comment` | `comment`, `comment.line`, `comment.block` |
| `comment.doc` | `comment.block.documentation`, `comment.documentation` |
| `string` | `string`, `string.quoted` |
| `string.escape` | `constant.character.escape`, `string.escape` |
| `string.regex` | `string.regexp` |
| `string.special` | `string.template`, `string.interpolated` |
| `string.special.symbol` | `constant.other.symbol` |
| `number` | `constant.numeric` |
| `boolean` | `constant.language.boolean`, `constant.language` |
| `constant` | `constant`, `variable.other.constant` |
| `keyword` | `keyword`, `storage.type`, `storage.modifier` |
| `keyword.control` | `keyword.control` |
| `operator` | `keyword.operator` |
| `function` | `entity.name.function`, `meta.function-call` |
| `function.method` | `entity.name.function.member`, `meta.function-call.method` |
| `function.builtin` | `support.function`, `support.function.builtin` |
| `function.definition` | `entity.name.function`, `meta.definition.function` |
| `function.method.builtin` | `support.function.method`, `support.function.builtin` |
| `function.special.definition` | `entity.name.function.preprocessor`, `meta.function.preprocessor` |
| `type` | `entity.name.type`, `support.type`, `storage.type` |
| `type.builtin` | `support.type.builtin`, `support.type.primitive` |
| `variable` | `variable`, `variable.other` |
| `variable.special` | `variable.language` |
| `property` | `variable.other.property`, `meta.object-literal.key`, `support.type.property-name` |
| `attribute` | `entity.other.attribute-name` |
| `tag` | `entity.name.tag` |
| `constructor` | `entity.name.class`, `entity.name.type.class` |
| `enum` | `entity.name.type.enum`, `variable.other.enummember` |
| `variant` | `variable.other.enummember` |
| `label` | `entity.name.label` |
| `preproc` | `meta.preprocessor`, `keyword.control.directive` |
| `punctuation` | `punctuation` |
| `punctuation.bracket` | `punctuation.section.brackets`, `meta.brace` |
| `punctuation.delimiter` | `punctuation.separator`, `punctuation.terminator` |
| `punctuation.list_marker` | `punctuation.definition.list`, `markup.list` |
| `punctuation.special` | `punctuation.definition.template-expression` |
| `embedded` | `meta.embedded`, `source` (fallback: `foreground`) |
| `emphasis` | `markup.italic` |
| `emphasis.strong` | `markup.bold` |
| `title` | `markup.heading`, `entity.name.section` |
| `link_text` | `markup.underline.link` |
| `link_uri` | `markup.underline.link`, `string.other.link` |
| `text.literal` | `markup.raw`, `markup.inline.raw` |
| `hint` | (UI key `editorHint.foreground`, not from `tokenColors`) |
| `predictive` | (UI key `editorGhostText.foreground`, not from `tokenColors`) |
| `primary` | falls back to `foreground` |

**Font style propagation:** When the resolved TextMate entry has
`fontStyle: "italic"`, the Zed scope gets `font_style: "italic"`. When it has
`"bold"`, the Zed scope gets `font_weight: 700`. The Italic variant in
particular will carry italics on `comment`, `keyword`, `keyword.control`,
`variable.special`, and `storage.modifier` per its source file.

**Unresolved scopes:** If no priority entry matches the source, the Zed scope
is **omitted** from the `syntax` block — Zed falls back to `foreground`
automatically. No colors are invented.

## Color Value Normalization

- 3-digit hex (`#abc`) → expand to 6-digit (`#aabbcc`).
- 4-/8-digit hex with alpha → kept as `#rrggbbaa` (Zed accepts this form).
- All hex values lowercased.

## Build Procedure

A small Node script (`zed-extension/scripts/build.mjs`) reads the 5 source
files at `themes/*.json` (post-rename) and writes
`zed-extension/themes/tokyo-nebula.json`. The mapping tables (UI and syntax)
live as data structures in the script, not in prose. The script is
re-runnable: if the VS Code source changes, regenerate in one command.

Per variant, the conversion is a pure function:

1. Parse VS Code variant JSON.
2. Build the `style` block by walking the UI mapping table, applying
   fallbacks.
3. Build `players[]`: 8 entries — accent (`button.background`), then
   `editorBracketHighlight.foreground1..6`, then `editorWarning.foreground`
   (or accent if missing).
4. Build the `syntax` block by walking the scope mapping table.
5. Emit one entry into the family's `themes[]` array.

## Validation

1. `jq empty zed-extension/themes/tokyo-nebula.json` — valid JSON.
2. Schema check: every required Zed v0.2.0 key present, no unknown keys.
3. Spot-check: hand-pick 4–5 colors and assert they round-trip from source
   to output (e.g. the main `#1a1b26`-ish editor background must appear at
   `themes[0].style.editor.background`).
4. **Manual smoke test** — install the extension in Zed via the command
   palette (`zed: install dev extension`), switch through all 5 variants,
   open a TS file, a Rust file, and a Markdown file. Eyeball syntax + UI
   versus VS Code side-by-side. The port is not "done" until this passes.

## Risks

- **Zed schema drift.** The schema link pins v0.2.0 but Zed may evolve.
  Mitigation: the build script is the source of truth; re-running it
  against an updated schema is the upgrade path.
- **Lossy syntax mapping.** Some VS Code scopes have no clean Zed analog
  (e.g. embedded language scopes, language-specific overrides). Accepted
  loss; the spot-check during validation catches anything egregious.
- **Renaming the parent directory while the working tree is active.** The
  rename is the last step to avoid breaking in-flight tool operations.
