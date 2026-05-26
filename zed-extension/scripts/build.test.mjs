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
