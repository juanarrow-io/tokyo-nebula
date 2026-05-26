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
  'element.background':                        ['button.background'],
  'element.hover':                             ['list.hoverBackground'],
  'element.active':                            ['list.activeSelectionBackground'],
  'element.selected':                          ['list.inactiveSelectionBackground'],
  'element.disabled':                          ['disabledForeground'],
  'drop_target.background':                    ['list.dropBackground'],
  'ghost_element.background':                  ['editor.background'],
  'ghost_element.hover':                       ['list.hoverBackground'],
  'ghost_element.active':                      ['list.activeSelectionBackground'],
  'ghost_element.selected':                    ['list.inactiveSelectionBackground'],
  'ghost_element.disabled':                    ['disabledForeground'],
  'text':                                      ['foreground'],
  'text.muted':                                ['descriptionForeground'],
  'text.placeholder':                          ['input.placeholderForeground'],
  'text.disabled':                             ['disabledForeground'],
  'text.accent':                               ['textLink.foreground', 'button.background'],
  'icon':                                      ['icon.foreground', 'foreground'],
  'icon.muted':                                ['descriptionForeground'],
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

function findScopeMatch(tokenColors, prefix) {
  // Match by exact equality or dotted-prefix (prefix + '.').
  // Longest matching tokenColors scope wins.
  let best = null;
  let bestLen = -1;
  for (const entry of tokenColors) {
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
    let match = null;
    for (const prefix of priorities) {
      match = findScopeMatch(tokenColors, prefix);
      if (match) break;
    }
    if (!match) continue;
    const settings = match.settings || {};
    const color = normalizeHex(settings.foreground);
    if (!color) continue;
    const styles = String(settings.fontStyle || '').toLowerCase().split(/\s+/);
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

export function buildFamily(sources) {
  return {
    $schema: 'https://zed.dev/schema/themes/v0.2.0.json',
    name: 'Tokyo Nebula',
    author: 'ni3rav (port: Paolo Arroyo)',
    themes: sources.map(buildVariant),
  };
}
