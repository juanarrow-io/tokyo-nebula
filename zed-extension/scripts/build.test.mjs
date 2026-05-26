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
