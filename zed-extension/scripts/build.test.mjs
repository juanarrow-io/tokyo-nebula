import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeHex } from './build.mjs';

test('normalizeHex: 3-digit hex expands to 6-digit', () => {
  assert.equal(normalizeHex('#abc'), '#aabbcc');
  assert.equal(normalizeHex('#ABC'), '#aabbcc');
});

test('normalizeHex: 6-digit hex is lowercased', () => {
  assert.equal(normalizeHex('#FF00AA'), '#ff00aa');
  assert.equal(normalizeHex('#1A1B26'), '#1a1b26');
});

test('normalizeHex: 8-digit hex with alpha is preserved and lowercased', () => {
  assert.equal(normalizeHex('#FF00AABB'), '#ff00aabb');
});

test('normalizeHex: 4-digit hex expands to 8-digit', () => {
  assert.equal(normalizeHex('#abcd'), '#aabbccdd');
});

test('normalizeHex: null/undefined returns null', () => {
  assert.equal(normalizeHex(null), null);
  assert.equal(normalizeHex(undefined), null);
  assert.equal(normalizeHex(''), null);
});

test('normalizeHex: strips whitespace', () => {
  assert.equal(normalizeHex('  #abc  '), '#aabbcc');
});

import { resolveUi, UI_MAP } from './build.mjs';

test('resolveUi: maps a single key', () => {
  const source = { colors: { 'editor.background': '#1a1b26' } };
  const ui = resolveUi(source);
  assert.equal(ui.background, '#1a1b26');
  assert.equal(ui['editor.background'], '#1a1b26');
});

test('resolveUi: walks the fallback chain', () => {
  // panel.border absent, sideBar.border present
  const source = { colors: { 'sideBar.border': '#101014' } };
  const ui = resolveUi(source);
  assert.equal(ui.border, '#101014');
});

test('resolveUi: missing source key yields null (omitted)', () => {
  const source = { colors: {} };
  const ui = resolveUi(source);
  // background has no fallback; if editor.background is missing it should be null
  assert.equal(ui.background, null);
});

test('resolveUi: normalizes hex values', () => {
  const source = { colors: { 'editor.background': '#ABC' } };
  const ui = resolveUi(source);
  assert.equal(ui.background, '#aabbcc');
});

test('UI_MAP: includes the core Zed keys', () => {
  const required = [
    'background', 'foreground', 'border', 'surface.background',
    'editor.background', 'editor.foreground', 'editor.gutter.background',
    'editor.line_number', 'editor.active_line.background',
    'terminal.background', 'tab.active_background', 'tab.inactive_background',
    'status_bar.background', 'title_bar.background',
    'scrollbar.thumb.background', 'created', 'modified', 'deleted',
    'error', 'warning', 'info',
  ];
  for (const key of required) {
    assert.ok(key in UI_MAP, `UI_MAP missing ${key}`);
  }
});

import { buildPlayers } from './build.mjs';

test('buildPlayers: returns 8 entries', () => {
  const source = {
    colors: {
      'button.background': '#3d59a1',
      'editorBracketHighlight.foreground1': '#698cd6',
      'editorBracketHighlight.foreground2': '#68b3de',
      'editorBracketHighlight.foreground3': '#9a7ecc',
      'editorBracketHighlight.foreground4': '#25aac2',
      'editorBracketHighlight.foreground5': '#80a856',
      'editorBracketHighlight.foreground6': '#c49a5a',
      'editorWarning.foreground': '#e0af68',
    },
  };
  const players = buildPlayers(source);
  assert.equal(players.length, 8);
});

test('buildPlayers: first player uses accent (button.background)', () => {
  const source = { colors: { 'button.background': '#3d59a1' } };
  const players = buildPlayers(source);
  assert.equal(players[0].cursor, '#3d59a1');
  assert.equal(players[0].selection, '#3d59a1');
});

test('buildPlayers: bracket colors map to players 1..6', () => {
  const source = {
    colors: {
      'button.background': '#3d59a1',
      'editorBracketHighlight.foreground1': '#698cd6',
      'editorBracketHighlight.foreground2': '#68b3de',
    },
  };
  const players = buildPlayers(source);
  assert.equal(players[1].cursor, '#698cd6');
  assert.equal(players[2].cursor, '#68b3de');
});

test('buildPlayers: falls back to accent when bracket colors missing', () => {
  const source = { colors: { 'button.background': '#3d59a1' } };
  const players = buildPlayers(source);
  assert.equal(players[3].cursor, '#3d59a1');
});

import { resolveSyntax, SYNTAX_MAP } from './build.mjs';

test('resolveSyntax: maps a single direct scope', () => {
  const source = {
    tokenColors: [
      { scope: 'comment', settings: { foreground: '#515670' } },
    ],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.comment.color, '#515670');
});

test('resolveSyntax: matches by dotted-prefix when exact missing', () => {
  const source = {
    tokenColors: [
      { scope: 'string.quoted.double', settings: { foreground: '#9ece6a' } },
    ],
  };
  const syntax = resolveSyntax(source);
  // resolver should match 'string.quoted.double' for the 'string' / 'string.quoted' Zed key
  assert.equal(syntax.string.color, '#9ece6a');
});

test('resolveSyntax: scope array entries are searched', () => {
  const source = {
    tokenColors: [
      { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: '#515670' } },
    ],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.comment.color, '#515670');
});

test('resolveSyntax: propagates fontStyle italic', () => {
  const source = {
    tokenColors: [
      { scope: 'comment', settings: { foreground: '#515670', fontStyle: 'italic' } },
    ],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.comment.font_style, 'italic');
});

test('resolveSyntax: propagates fontStyle bold as font_weight 700', () => {
  const source = {
    tokenColors: [
      { scope: 'keyword', settings: { foreground: '#bb9af7', fontStyle: 'bold' } },
    ],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.keyword.font_weight, 700);
});

test('resolveSyntax: omits Zed scope when no source match found', () => {
  const source = { tokenColors: [] };
  const syntax = resolveSyntax(source);
  assert.ok(!('comment' in syntax));
  assert.ok(!('keyword' in syntax));
});

test('resolveSyntax: normalizes hex values', () => {
  const source = {
    tokenColors: [{ scope: 'comment', settings: { foreground: '#ABC' } }],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.comment.color, '#aabbcc');
});

test('SYNTAX_MAP: includes core Zed syntax scopes', () => {
  const required = [
    'comment', 'string', 'number', 'boolean', 'constant',
    'keyword', 'keyword.control', 'operator',
    'function', 'function.method', 'function.builtin',
    'type', 'type.builtin', 'variable', 'variable.special',
    'property', 'attribute', 'tag', 'punctuation',
    'string.escape', 'string.regex', 'comment.doc',
  ];
  for (const key of required) {
    assert.ok(key in SYNTAX_MAP, `SYNTAX_MAP missing ${key}`);
  }
});

import { buildVariant, buildFamily } from './build.mjs';

test('buildVariant: produces a Zed theme object with name, appearance, style', () => {
  const source = {
    name: 'Tokyo Nebula',
    colors: { 'editor.background': '#1a1b26', 'foreground': '#a9b1d6' },
    tokenColors: [{ scope: 'comment', settings: { foreground: '#515670' } }],
  };
  const variant = buildVariant(source);
  assert.equal(variant.name, 'Tokyo Nebula');
  assert.equal(variant.appearance, 'dark');
  assert.equal(variant.style['editor.background'], '#1a1b26');
  assert.equal(variant.style.background, '#1a1b26');
  assert.equal(variant.style.syntax.comment.color, '#515670');
  assert.equal(variant.style.players.length, 8);
});

test('buildVariant: omits null UI keys', () => {
  const source = { name: 'X', colors: { 'foreground': '#a9b1d6' }, tokenColors: [] };
  const variant = buildVariant(source);
  // editor.background not provided -> 'background' should be omitted, not null
  assert.ok(!('background' in variant.style));
});

test('buildFamily: wraps variants into a family object', () => {
  const source = {
    name: 'Tokyo Nebula',
    colors: { 'editor.background': '#1a1b26', 'foreground': '#a9b1d6' },
    tokenColors: [],
  };
  const family = buildFamily([source]);
  assert.equal(family['$schema'], 'https://zed.dev/schema/themes/v0.2.0.json');
  assert.equal(family.name, 'Tokyo Nebula');
  assert.equal(family.author, 'Paolo Arroyo');
  assert.equal(family.themes.length, 1);
  assert.equal(family.themes[0].name, 'Tokyo Nebula');
});

test('resolveSyntax: merges color and fontStyle from separate tokenColors entries', () => {
  // The Italic VS Code variant uses two entries for the same scope:
  // one carries the color, the other carries fontStyle: italic.
  // The resolver must merge them.
  const source = {
    tokenColors: [
      { scope: 'comment', settings: { foreground: '#515670' } },
      { scope: 'comment', settings: { fontStyle: 'italic' } },
    ],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.comment.color, '#515670');
  assert.equal(syntax.comment.font_style, 'italic');
});

test('resolveSyntax: color-entry fontStyle wins over a separate style-only entry', () => {
  // If the color-bearing entry has its own fontStyle, that takes precedence.
  const source = {
    tokenColors: [
      { scope: 'comment', settings: { foreground: '#515670', fontStyle: 'bold' } },
      { scope: 'comment', settings: { fontStyle: 'italic' } },
    ],
  };
  const syntax = resolveSyntax(source);
  assert.equal(syntax.comment.font_weight, 700);
  assert.ok(!('font_style' in syntax.comment));
});

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

test('UI_MAP: icon.muted prefers descriptionForeground over foreground (regression: avoid icon/icon.muted collapse)', () => {
  const source = {
    colors: {
      'foreground': '#787c99',
      'descriptionForeground': '#515670',
    },
  };
  const ui = resolveUi(source);
  assert.equal(ui['icon.muted'], '#515670');
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

test('Solstice: search.active_match_background is visible (not equal to sideBar.background)', async () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const solsticePath = resolve(here, '..', '..', 'themes', 'solstice.json');
  const { createRequire } = await import('node:module');
  const req = createRequire(import.meta.url);
  const source = req(solsticePath);
  const sidebarBg = (source.colors['sideBar.background'] || '').toLowerCase();
  const ui = resolveUi(source);
  const activeMatchBg = ui['search.active_match_background'];
  assert.ok(activeMatchBg !== null, 'search.active_match_background must not be null');
  assert.notEqual(activeMatchBg, sidebarBg, `search.active_match_background (${activeMatchBg}) must differ from sideBar.background (${sidebarBg})`);
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
