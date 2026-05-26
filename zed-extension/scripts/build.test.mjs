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
