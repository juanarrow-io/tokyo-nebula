export function normalizeHex(value) {
  if (value == null) return null;
  const v = String(value).trim();
  if (v === '') return null;
  if (!v.startsWith('#')) return null;
  const hex = v.slice(1).toLowerCase();
  if (hex.length === 3) {
    return '#' + hex.split('').map((c) => c + c).join('');
  }
  if (hex.length === 4) {
    return '#' + hex.split('').map((c) => c + c).join('');
  }
  if (hex.length === 6 || hex.length === 8) {
    return '#' + hex;
  }
  return null;
}

// VS Code colors.* key -> Zed style key.
// Value is an array: the source key plus fallback keys, in order.
// First non-null match wins.
export const UI_MAP = {
  'background':                                ['editor.background'],
  'foreground':                                ['foreground'],
  'border':                                    ['panel.border', 'sideBar.border'],
  'border.variant':                            ['editorGroup.border'],
  'border.focused':                            ['focusBorder'],
  'border.selected':                           ['list.activeSelectionBackground'],
  'border.transparent':                        [],
  'border.disabled':                           ['disabledForeground'],
  'elevated_surface.background':               ['editorWidget.background', 'sideBar.background'],
  'surface.background':                        ['sideBar.background'],
  'element.background':                        ['list.inactiveSelectionBackground', 'editorWidget.background'],
  'element.hover':                             ['list.hoverBackground'],
  'element.active':                            ['list.activeSelectionBackground'],
  'element.selected':                          ['list.inactiveSelectionBackground'],
  'element.disabled':                          ['disabledForeground'],
  'drop_target.background':                    ['list.dropBackground'],
  'ghost_element.hover':                       ['list.hoverBackground'],
  'ghost_element.active':                      ['list.activeSelectionBackground'],
  'ghost_element.selected':                    ['list.inactiveSelectionBackground'],
  'ghost_element.disabled':                    ['disabledForeground'],
  'text':                                      ['editor.foreground', 'input.foreground', 'sideBarSectionHeader.foreground', 'foreground'],
  'text.muted':                                ['foreground', 'descriptionForeground'],
  'text.placeholder':                          ['input.placeholderForeground', 'descriptionForeground'],
  'text.disabled':                             ['disabledForeground', 'descriptionForeground'],
  'text.accent':                               ['textLink.foreground', 'button.background'],
  'icon':                                      ['icon.foreground', 'editor.foreground', 'foreground'],
  'icon.muted':                                ['descriptionForeground', 'foreground'],
  'icon.disabled':                             ['disabledForeground'],
  'icon.placeholder':                          ['input.placeholderForeground'],
  'icon.accent':                               ['textLink.foreground', 'button.background'],
  'status_bar.background':                     ['statusBar.background'],
  'title_bar.background':                      ['titleBar.activeBackground'],
  'title_bar.inactive_background':             ['titleBar.inactiveBackground'],
  'toolbar.background':                        ['editorGroupHeader.tabsBackground'],
  'tab_bar.background':                        ['editorGroupHeader.tabsBackground'],
  'tab.active_background':                     ['tab.activeBackground'],
  'tab.inactive_background':                   ['tab.inactiveBackground'],
  'search.match_background':                   ['editor.findMatchHighlightBackground'],
  'search.active_match_background':            ['editor.findMatchBackground', 'editor.findMatchHighlightBackground'],
  'panel.background':                          ['panel.background', 'sideBar.background'],
  'panel.focused_border':                      ['focusBorder'],
  'pane.focused_border':                       ['focusBorder'],
  'pane_group.border':                         ['editorGroup.border'],
  'scrollbar.thumb.background':                ['scrollbarSlider.background'],
  'scrollbar.thumb.hover_background':          ['scrollbarSlider.hoverBackground'],
  'scrollbar.thumb.border':                    [],
  'scrollbar.track.background':                ['editor.background'],
  'scrollbar.track.border':                    [],
  'editor.foreground':                         ['editor.foreground'],
  'editor.background':                         ['editor.background'],
  'editor.gutter.background':                  ['editorGutter.background', 'editor.background'],
  'editor.subheader.background':               ['editor.background'],
  'editor.active_line.background':             ['editor.lineHighlightBackground'],
  'editor.highlighted_line.background':        ['editor.rangeHighlightBackground'],
  'editor.line_number':                        ['editorLineNumber.foreground'],
  'editor.active_line_number':                 ['editorLineNumber.activeForeground'],
  'editor.hover_line_number':                  ['editorLineNumber.activeForeground', 'editorLineNumber.foreground'],
  'editor.invisible':                          ['editorWhitespace.foreground'],
  'editor.wrap_guide':                         ['editorIndentGuide.background'],
  'editor.active_wrap_guide':                  ['editorIndentGuide.activeBackground'],
  'editor.document_highlight.read_background': ['editor.wordHighlightBackground'],
  'editor.document_highlight.write_background':['editor.wordHighlightStrongBackground'],
  'terminal.background':                       ['terminal.background', 'panel.background'],
  'terminal.foreground':                       ['terminal.foreground', 'foreground'],
  'terminal.bright_foreground':                ['terminal.foreground', 'foreground'],
  'terminal.dim_foreground':                   ['descriptionForeground'],
  'terminal.ansi.black':                       ['terminal.ansiBlack'],
  'terminal.ansi.red':                         ['terminal.ansiRed'],
  'terminal.ansi.green':                       ['terminal.ansiGreen'],
  'terminal.ansi.yellow':                      ['terminal.ansiYellow'],
  'terminal.ansi.blue':                        ['terminal.ansiBlue'],
  'terminal.ansi.magenta':                     ['terminal.ansiMagenta'],
  'terminal.ansi.cyan':                        ['terminal.ansiCyan'],
  'terminal.ansi.white':                       ['terminal.ansiWhite'],
  'terminal.ansi.bright_black':                ['terminal.ansiBrightBlack'],
  'terminal.ansi.bright_red':                  ['terminal.ansiBrightRed'],
  'terminal.ansi.bright_green':                ['terminal.ansiBrightGreen'],
  'terminal.ansi.bright_yellow':               ['terminal.ansiBrightYellow'],
  'terminal.ansi.bright_blue':                 ['terminal.ansiBrightBlue'],
  'terminal.ansi.bright_magenta':              ['terminal.ansiBrightMagenta'],
  'terminal.ansi.bright_cyan':                 ['terminal.ansiBrightCyan'],
  'terminal.ansi.bright_white':                ['terminal.ansiBrightWhite'],
  'terminal.ansi.dim_black':                   ['terminal.ansiBrightBlack', 'terminal.ansiBlack'],
  'terminal.ansi.dim_red':                     ['terminal.ansiRed'],
  'terminal.ansi.dim_green':                   ['terminal.ansiGreen'],
  'terminal.ansi.dim_yellow':                  ['terminal.ansiYellow'],
  'terminal.ansi.dim_blue':                    ['terminal.ansiBlue'],
  'terminal.ansi.dim_magenta':                 ['terminal.ansiMagenta'],
  'terminal.ansi.dim_cyan':                    ['terminal.ansiCyan'],
  'terminal.ansi.dim_white':                   ['terminal.ansiBrightWhite', 'terminal.ansiWhite'],
  'created':                                   ['gitDecoration.addedResourceForeground'],
  'modified':                                  ['gitDecoration.modifiedResourceForeground'],
  'deleted':                                   ['gitDecoration.deletedResourceForeground'],
  'conflict':                                  ['editorWarning.foreground'],
  'conflict.background':                       ['editorWarning.foreground'],
  'conflict.border':                           ['editorWarning.foreground'],
  'created.background':                        ['gitDecoration.addedResourceForeground'],
  'created.border':                            ['gitDecoration.addedResourceForeground'],
  'modified.background':                       ['gitDecoration.modifiedResourceForeground'],
  'modified.border':                           ['gitDecoration.modifiedResourceForeground'],
  'deleted.background':                        ['gitDecoration.deletedResourceForeground'],
  'deleted.border':                            ['gitDecoration.deletedResourceForeground'],
  'success':                                   ['notebookStatusSuccessIcon.foreground', 'editorInfo.foreground'],
  'success.background':                        ['notebookStatusSuccessIcon.foreground', 'editorInfo.foreground'],
  'success.border':                            ['notebookStatusSuccessIcon.foreground', 'editorInfo.foreground'],
  'warning':                                   ['editorWarning.foreground'],
  'warning.background':                        ['editorWarning.foreground'],
  'warning.border':                            ['editorWarning.foreground'],
  'error':                                     ['editorError.foreground'],
  'error.background':                          ['editorError.foreground'],
  'error.border':                              ['editorError.foreground'],
  'info':                                      ['editorInfo.foreground'],
  'info.background':                           ['editorInfo.foreground'],
  'info.border':                               ['editorInfo.foreground'],
  'hint':                                      ['editorHint.foreground'],
  'hint.background':                           ['editorHint.foreground'],
  'hint.border':                               ['editorHint.foreground'],
  'predictive':                                ['editorGhostText.foreground', 'descriptionForeground'],
  'predictive.background':                     ['editorGhostText.foreground', 'descriptionForeground'],
  'predictive.border':                         ['editorGhostText.foreground', 'descriptionForeground'],
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
  'version_control.added':                     ['gitDecoration.addedResourceForeground'],
  'version_control.modified':                  ['gitDecoration.modifiedResourceForeground'],
  'version_control.deleted':                   ['gitDecoration.deletedResourceForeground'],
  'version_control.word_added':                ['diffEditor.insertedTextBackground'],
  'version_control.word_deleted':              ['diffEditor.removedTextBackground'],
  'version_control.conflict_marker.ours':      ['merge.currentHeaderBackground', 'editorWarning.foreground'],
  'version_control.conflict_marker.theirs':    ['merge.incomingHeaderBackground', 'editorInfo.foreground'],
  'link_text.hover':                           ['textLink.activeForeground', 'textLink.foreground'],
};

export function resolveUi(source) {
  const colors = (source && source.colors) || {};
  const out = {};
  for (const [zedKey, chain] of Object.entries(UI_MAP)) {
    let value = null;
    for (const sourceKey of chain) {
      if (colors[sourceKey]) {
        value = normalizeHex(colors[sourceKey]);
        if (value) break;
      }
    }
    out[zedKey] = value;
  }
  return out;
}

export function buildPlayers(source) {
  const colors = (source && source.colors) || {};
  const accent = normalizeHex(colors['button.background']) || '#7e83b2';
  const warn = normalizeHex(colors['editorWarning.foreground']) || accent;
  const bracket = (i) =>
    normalizeHex(colors[`editorBracketHighlight.foreground${i}`]) || accent;

  const cursors = [
    accent,
    bracket(1),
    bracket(2),
    bracket(3),
    bracket(4),
    bracket(5),
    bracket(6),
    warn,
  ];

  return cursors.map((c) => ({ cursor: c, selection: c, background: c }));
}

export function buildAccents(source) {
  const colors = (source && source.colors) || {};
  const accent = normalizeHex(colors['button.background']) || '#7e83b2';
  const bracket = (i) =>
    normalizeHex(colors[`editorBracketHighlight.foreground${i}`]) || accent;

  return [bracket(1), bracket(2), bracket(3), bracket(4), bracket(5)];
}

// Zed syntax scope -> ordered list of TextMate scope priorities.
// The resolver searches each priority in order; first match wins.
// Within a priority, a tokenColors entry matches if it exactly equals the
// priority OR if the tokenColors scope (or any entry of the array) starts
// with the priority + '.'. Longest match wins inside one priority slot.
export const SYNTAX_MAP = {
  'attribute':                     ['entity.other.attribute-name'],
  'boolean':                       ['constant.language.boolean', 'constant.language'],
  'comment':                       ['comment.line', 'comment.block', 'comment'],
  'comment.doc':                   ['comment.block.documentation', 'comment.documentation'],
  'constant':                      ['variable.other.constant', 'constant.character', 'constant'],
  'constructor':                   ['entity.name.class', 'entity.name.type.class'],
  'embedded':                      ['meta.embedded', 'source'],
  'emphasis':                      ['markup.italic'],
  'emphasis.strong':               ['markup.bold'],
  'enum':                          ['entity.name.type.enum', 'variable.other.enummember'],
  'function':                      ['entity.name.function', 'meta.function-call', 'support.function'],
  'function.builtin':              ['support.function.builtin', 'support.function'],
  'function.definition':           ['meta.definition.function', 'entity.name.function'],
  'function.method':               ['entity.name.function.member', 'meta.function-call.method'],
  'function.method.builtin':       ['support.function.method', 'support.function.builtin'],
  'function.special.definition':   ['entity.name.function.preprocessor', 'meta.function.preprocessor'],
  'keyword':                       ['keyword', 'storage.type', 'storage.modifier'],
  'keyword.control':               ['keyword.control'],
  'label':                         ['entity.name.label'],
  'link_text':                     ['markup.underline.link'],
  'link_uri':                      ['string.other.link', 'markup.underline.link'],
  'number':                        ['constant.numeric'],
  'operator':                      ['keyword.operator'],
  'preproc':                       ['meta.preprocessor', 'keyword.control.directive'],
  'property':                      ['variable.other.property', 'meta.object-literal.key', 'support.type.property-name'],
  'punctuation':                   ['punctuation'],
  'punctuation.bracket':           ['punctuation.section.brackets', 'meta.brace'],
  'punctuation.delimiter':         ['punctuation.separator', 'punctuation.terminator'],
  'punctuation.list_marker':       ['punctuation.definition.list', 'markup.list'],
  'punctuation.special':           ['punctuation.definition.template-expression'],
  'string':                        ['string.quoted', 'string'],
  'string.escape':                 ['constant.character.escape', 'string.escape'],
  'string.regex':                  ['string.regexp'],
  'string.special':                ['string.template', 'string.interpolated'],
  'string.special.symbol':         ['constant.other.symbol'],
  'tag':                           ['entity.name.tag'],
  'text.literal':                  ['markup.inline.raw', 'markup.raw'],
  'title':                         ['markup.heading', 'entity.name.section'],
  'type':                          ['entity.name.type', 'support.type', 'storage.type'],
  'type.builtin':                  ['support.type.builtin', 'support.type.primitive'],
  'variable':                      ['variable.other', 'variable'],
  'variable.special':              ['variable.language'],
  'variant':                       ['variable.other.enummember'],
};

function flattenScopes(entry) {
  const s = entry.scope;
  if (!s) return [];
  if (Array.isArray(s)) return s.map((x) => String(x).trim()).filter(Boolean);
  // VS Code allows comma-separated scopes in a single string
  return String(s).split(',').map((x) => x.trim()).filter(Boolean);
}

function findScopeMatchWhere(tokenColors, prefix, predicate) {
  let best = null;
  let bestLen = -1;
  for (const entry of tokenColors) {
    if (!predicate(entry)) continue;
    const scopes = flattenScopes(entry);
    for (const scope of scopes) {
      if (scope === prefix || scope.startsWith(prefix + '.')) {
        if (scope.length > bestLen) {
          best = entry;
          bestLen = scope.length;
        }
      }
    }
  }
  return best;
}

export function resolveSyntax(source) {
  const tokenColors = (source && source.tokenColors) || [];
  const out = {};
  for (const [zedScope, priorities] of Object.entries(SYNTAX_MAP)) {
    let colorMatch = null;
    let styleMatch = null;
    for (const prefix of priorities) {
      if (!colorMatch) {
        colorMatch = findScopeMatchWhere(tokenColors, prefix,
          (e) => !!normalizeHex((e.settings || {}).foreground));
      }
      if (!styleMatch) {
        styleMatch = findScopeMatchWhere(tokenColors, prefix,
          (e) => !!((e.settings || {}).fontStyle));
      }
      if (colorMatch && styleMatch) break;
    }
    if (!colorMatch) continue;
    const colorSettings = colorMatch.settings || {};
    const color = normalizeHex(colorSettings.foreground);
    // Merge fontStyle: prefer the color entry's own fontStyle, fall back to
    // a separate style-only entry that matches the same scope priorities.
    const rawStyle = colorSettings.fontStyle ||
      ((styleMatch && styleMatch.settings) ? styleMatch.settings.fontStyle : '');
    const styles = String(rawStyle || '').toLowerCase().split(/\s+/);
    const entry = { color };
    if (styles.includes('italic')) entry.font_style = 'italic';
    if (styles.includes('bold')) entry.font_weight = 700;
    out[zedScope] = entry;
  }
  return out;
}

function stripNullKeys(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== null && v !== undefined) out[k] = v;
  }
  return out;
}

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

export function buildFamily(sources) {
  return {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: 'Tokyo Nebula',
    author: 'Paolo Arroyo',
    themes: sources.map(buildVariant),
  };
}

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const SOURCE_FILES = [
  'andromeda.json',
  'aurora.json',
  'eclipse.json',
  'solstice.json',
  'polaris.json',
];

export async function loadSources(themesDir) {
  const sources = [];
  for (const file of SOURCE_FILES) {
    const path = join(themesDir, file);
    const raw = await readFile(path, 'utf8');
    sources.push(JSON.parse(raw));
  }
  return sources;
}

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

// Run main() only when this file is executed directly, not when imported.
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    process.stderr.write(`build failed: ${err.message}\n`);
    process.exit(1);
  });
}
