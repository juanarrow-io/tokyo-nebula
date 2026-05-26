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
