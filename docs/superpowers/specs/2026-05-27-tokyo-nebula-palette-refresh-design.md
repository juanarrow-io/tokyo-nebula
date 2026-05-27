# Tokyo Nebula — Palette Refresh Design

**Date:** 2026-05-27
**Branch:** `feat/tokyo-nebula-port`
**Status:** Design

## Summary

Refresh the source palettes of all five Tokyo Nebula variants to a unified high-contrast neon aesthetic. The five variants share a five-hue family vocabulary (violet, green, cyan, yellow, blue); each variant carves out one of those hues as its signature, which drives its keyword color, button/link/focus accents, and overall personality. Diagnostic colors (error/warning/info/hint) and terminal ANSI palettes are shared across variants for affordance consistency. Orange is removed across the board (replaced with yellow, amber-shifted yellow, or pink-red depending on the role).

This design refreshes the VS Code source themes in `themes/*.json`. The Zed extension picks up the changes automatically through the existing `build.mjs` mapping pipeline — no `UI_MAP` or `SYNTAX_MAP` changes required.

## Goals

- Deliver a coherent five-variant family that reads as one product, with each variant clearly distinct through its signature hue.
- Eliminate orange usage. Where orange carried meaning, replace with the closest hue in the family vocabulary (typically yellow or pink-red).
- Maintain WCAG AA contrast (~4.5:1) for syntax tokens against the editor background in every variant.
- Slightly darken each variant's editor + sidebar background to make the neon syntax pop harder.

## Non-goals

- No changes to `zed-extension/scripts/build.mjs` mapping logic. The build pipeline already produces the right Zed output once source palettes are refreshed and the file is regenerated.
- No changes to variant **names**, **filenames**, or any non-color metadata in the source theme JSONs.
- No new variants. The five existing variants (Andromeda, Aurora, Eclipse, Solstice, Polaris) are refreshed in place.
- No changes to icon themes, banners, or marketing imagery (`images/main.png`).

---

## Family palette — 5 hues shared by every variant

These five hex values are the entire syntax-color vocabulary. Every syntax token across every variant resolves to one of them (plus a per-variant muted comment color and editor foreground).

| Role | Hex | Notes |
|---|---|---|
| Violet | `#a78bfa` | Tailwind violet-400; chosen for ~5.6:1 contrast on dark navy (the magenta `#c74ded` we originally tried read dim) |
| Green  | `#7ce38b` | Spring/mint green, leans cool |
| Cyan   | `#00d4ff` | Saturated electric cyan |
| Yellow | `#ffd866` | Warm but not orange — used for "warm" signals (warning, Solstice signature) |
| Blue   | `#7aa2f7` | Tokyo Night blue; pairs naturally with violet |

---

## Per-variant background, foreground, and comment color

Backgrounds were each dropped ~5 luminance points from the current source values, with sidebar slightly darker than editor (Tokyo Night convention).

| Variant | editor.background | sideBar.background | editor.foreground | Comment (muted) |
|---|---|---|---|---|
| Andromeda | `#15161f` | `#11121a` | `#a9b1d6` | `#5a5d8a` (cool muted purple-gray) |
| Aurora    | `#15161f` | `#11121a` | `#a9b1d6` | `#5a5d8a` (italic — see Aurora syntax notes) |
| Eclipse   | `#0f131c` | `#0a0e15` | `#a9b1d6` | `#3a5a6a` (muted teal) |
| Solstice  | `#181611` | `#13110d` | `#e8e1d0` | `#6a5a3a` (muted gold) |
| Polaris   | `#0a0c14` | `#06080d` | `#d5ced9` | `#3a4e6a` (muted blue) |

Solstice and Polaris also adjust their foreground to pair with their tinted backgrounds (warm gold-white for Solstice, cool lilac-white for Polaris). The other three keep the Tokyo Night classic `#a9b1d6`.

---

## Per-variant signature & UI accent

The signature hue drives `button.background`, `textLink.foreground`, `focusBorder`, `editorBracketHighlight.foreground1`, and the selection/highlight backgrounds (at low alpha).

| Variant | Signature | Concept |
|---|---|---|
| Andromeda | Violet `#a78bfa` | Galaxy core |
| Aurora    | Green `#7ce38b` | Northern lights |
| Eclipse   | Cyan `#00d4ff` | Lunar corona |
| Solstice  | Yellow `#ffd866` | Sun at peak |
| Polaris   | Blue `#7aa2f7` | North star |

### UI accent resolution per role

For each variant, derive UI keys from its signature hue using these alpha modulations:

| VS Code key | Derivation |
|---|---|
| `button.background` | signature + alpha `cc` (e.g., `#a78bfacc` for Andromeda) |
| `button.foreground` | `#0a0a0a` (signature hues are bright; dark text reads on them) |
| `textLink.foreground` | signature at full opacity |
| `textLink.activeForeground` | signature lightened ~15% (per-variant; spec table below) |
| `focusBorder` | signature + alpha `66` |
| `editorBracketHighlight.foreground1` | signature at full opacity |
| `list.activeSelectionBackground` | signature + alpha `25` |
| `editor.selectionBackground` | signature + alpha `30` |
| `editor.findMatchBackground` | signature + alpha `66` (more saturated for active match) |
| `editor.findMatchHighlightBackground` | signature + alpha `33` |

### Per-variant `textLink.activeForeground` (lightened signature)

| Variant | Active link |
|---|---|
| Andromeda | `#c4a8ff` |
| Aurora    | `#9eff9b` |
| Eclipse   | `#5ff0ff` |
| Solstice  | `#ffe98a` |
| Polaris   | `#a4c0ff` |

---

## Per-variant syntax token assignments

For each variant, each token role resolves to one of the five family hues. The signature hue dominates keywords; the other four cycle through string / function / type / variable / number per the table below.

### Token-by-token table

| Token | Andromeda | Aurora | Eclipse | Solstice | Polaris |
|---|---|---|---|---|---|
| `keyword` (control + storage) | Violet | Green *(italic)* | Cyan | Yellow | Blue |
| `entity.name.function` | Yellow | Yellow | Green | Green | Cyan |
| `support.function` | Yellow | Yellow | Green | Green | Cyan |
| `string` | Blue | Violet | Violet | Violet | Violet |
| `entity.name.type` | Cyan | Cyan | Yellow | Blue | Yellow |
| `support.type` | Cyan | Cyan | Yellow | Blue | Yellow |
| `variable` | Green | Blue | Blue | Cyan | Green |
| `variable.parameter` | Green | Blue | Blue | Violet | Green |
| `constant.numeric` | Green | Cyan | Yellow | Green | Green |
| `constant.language` | Violet | Violet | Violet | Violet | Violet |
| `constant.character.escape` | Cyan | Cyan | Yellow | Violet | Cyan |
| `entity.other.attribute-name` | Cyan | Cyan | Yellow | Blue | Yellow |
| `entity.name.tag` | Violet | Green | Cyan | Yellow | Blue |
| `punctuation` (general) | `#a9b1d6cc` | `#a9b1d6cc` | `#a9b1d6cc` | `#e8e1d0cc` | `#d5ced9cc` |
| `comment` | `#5a5d8a` | `#5a5d8a` *(italic)* | `#3a5a6a` | `#6a5a3a` | `#3a4e6a` |
| `markup.heading` | Violet | Green | Cyan | Yellow | Blue |
| `markup.bold` | Yellow *(bold)* | Yellow *(bold)* | Yellow *(bold)* | Violet *(bold)* | Yellow *(bold)* |
| `markup.italic` | Cyan *(italic)* | Cyan *(italic)* | Violet *(italic)* | Cyan *(italic)* | Cyan *(italic)* |

### Aurora's italic emphasis

Aurora retains the existing "italic" character: `keyword`, `comment`, `storage.type`, and `storage.modifier` carry `fontStyle: italic`. All other Aurora token styles match Andromeda's structural shape — only the *color* of each token differs (green-signature instead of violet-signature) and the italic flag is added on those four token classes.

---

## Shared diagnostic colors

These four roles must remain visually consistent across variants — a warning is yellow whether you're in Andromeda or Polaris. Hex values:

| Role | Hex | Source key | Notes |
|---|---|---|---|
| Error | `#ff6188` | `editorError.foreground` | Saturated pink-red; clearly distinct from yellow |
| Warning | `#ffd866` | `editorWarning.foreground` | Reuses family yellow (Solstice signature) |
| Info | `#00d4ff` | `editorInfo.foreground` | Reuses family cyan (Eclipse signature) |
| Hint | `#7ce38b` | `editorHint.foreground` | Reuses family green (Aurora signature) |

Squiggly underlines (`editorError.border`, `editorWarning.border`, `editorInfo.border`, `editorHint.border`) match their foregrounds.

### Git decoration colors (shared)

| Role | Hex | Source key |
|---|---|---|
| Added | `#7ce38b` (green) | `gitDecoration.addedResourceForeground` |
| Modified | `#7aa2f7` (blue) | `gitDecoration.modifiedResourceForeground` |
| Deleted | `#ff6188` (pink-red) | `gitDecoration.deletedResourceForeground` |
| Renamed | `#a78bfa` (violet) | `gitDecoration.renamedResourceForeground` |
| Ignored | `#5a5d8a` (muted) | `gitDecoration.ignoredResourceForeground` |

---

## Shared terminal ANSI palette

All five variants ship the same 16-color terminal palette. Family hues drive 6–7 of these; brights are lifted ~15–20% in luminance.

| ANSI slot | Hex | Source key |
|---|---|---|
| black | `#0a0c14` | `terminal.ansiBlack` |
| red | `#ff6188` | `terminal.ansiRed` |
| green | `#7ce38b` | `terminal.ansiGreen` |
| yellow | `#ffd866` | `terminal.ansiYellow` |
| blue | `#7aa2f7` | `terminal.ansiBlue` |
| magenta | `#a78bfa` | `terminal.ansiMagenta` |
| cyan | `#00d4ff` | `terminal.ansiCyan` |
| white | `#c0caf5` | `terminal.ansiWhite` |
| bright black | `#3b4261` | `terminal.ansiBrightBlack` |
| bright red | `#ff85a1` | `terminal.ansiBrightRed` |
| bright green | `#9eff9b` | `terminal.ansiBrightGreen` |
| bright yellow | `#ffe98a` | `terminal.ansiBrightYellow` |
| bright blue | `#a4c0ff` | `terminal.ansiBrightBlue` |
| bright magenta | `#c4a8ff` | `terminal.ansiBrightMagenta` |
| bright cyan | `#5ff0ff` | `terminal.ansiBrightCyan` |
| bright white | `#ffffff` | `terminal.ansiBrightWhite` |

---

## Bracket pair highlight colors (shared)

`editorBracketHighlight.foreground1..6` cycles through the family hues so nested brackets get rainbow rendering. The same six colors apply to every variant; only the order rotates so the variant's signature appears at slot 1.

For Andromeda:
1. `#a78bfa` (violet — signature)
2. `#7aa2f7` (blue)
3. `#00d4ff` (cyan)
4. `#7ce38b` (green)
5. `#ffd866` (yellow)
6. `#ff6188` (pink — uses error color as the 6th to give 6 distinct hues)

For each other variant: rotate so the variant's signature is at slot 1; the order of the remaining hues stays the same (violet → blue → cyan → green → yellow → pink).

---

## Build/regeneration

After the source theme JSONs are updated:

1. Regenerate the Zed family file:
   ```bash
   cd /Users/paolo/Tools/tokyo-nebula
   node zed-extension/scripts/build.mjs
   ```
2. The existing test suite (`node --test zed-extension/scripts/build.test.mjs`) should still pass — no `UI_MAP` or `SYNTAX_MAP` changes are needed.
3. The end-to-end test that asserts the 5 variant names + author resolves correctly should keep passing (palette refresh doesn't touch names or metadata).

## Tests

Per-variant tests in `zed-extension/scripts/build.test.mjs` (added by the implementation plan):

- For each variant, assert `style['editor.background']` equals the new per-variant background value (table above).
- For Andromeda, Aurora, Eclipse, Solstice, Polaris: assert `style.syntax.keyword.color` equals the variant's signature hue.
- For all variants: assert `style.error === '#ff6188'`, `style.warning === '#ffd866'`, `style.info === '#00d4ff'`, `style.hint === '#7ce38b'`.
- For all variants: assert `style['terminal.ansi.magenta'] === '#a78bfa'` (and similar for the other 7 base ANSI colors).
- For Aurora specifically: assert `style.syntax.keyword.font_style === 'italic'` (preserves Aurora's italic character).

## Manual verification

After regeneration, install the Zed dev extension and cycle each variant. For each, confirm:
1. The editor background reads slightly darker than before.
2. Keywords visibly carry the variant's signature hue.
3. Comments are muted but distinct from the background.
4. Squiggly diagnostic underlines (intentional typo + unused variable in a test file) render in pink and yellow respectively.
5. Open a terminal panel; run a command with colored output (e.g., `git status`) and confirm the 16 ANSI colors render correctly.

## Open risks

- **Yellow signature visibility on warm Solstice background.** `#ffd866` on `#181611` resolves to ~9.2:1 contrast — easily passing AA. However, the warm-on-warm pairing may feel less "punchy" than the other variants. Acknowledged; if it reads weak after install we can darken Solstice's bg further in a follow-up.
- **Aurora vs. Andromeda differentiation.** Both share the same editor background. Differentiation relies entirely on the keyword color (violet vs. green) and Aurora's italic flag. Some users may need to peek at the title bar to know which variant they have active. Considered acceptable — the italic flag is decisive in real code.
- **Polaris foreground on its very dark bg.** `#d5ced9` on `#0a0c14` is ~12:1 — extremely high contrast. Could feel harsh after long reading sessions. If users complain, we'll soften the foreground slightly in a follow-up.

## Out of scope

- VS Code marketplace publishing.
- New variants beyond the five.
- Light-theme variants.
- Custom icon theme.
