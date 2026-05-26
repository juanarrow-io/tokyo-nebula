# Tokyo Nebula for Zed

A 5-variant dark theme family ported from the [Tokyo Nebula VS Code theme](../README.md).

## Variants

- Tokyo Nebula
- Tokyo Nebula Italic
- Tokyo Nebula Equalizer
- Tokyo Nebula Dusk
- Tokyo Nebula Operator

## Install (from source)

1. Clone this repo.
2. In Zed: open the command palette (`cmd-shift-p`), run `zed: install dev extension`.
3. Pick the `zed-extension/` directory.
4. Open the theme picker (`cmd-k cmd-t`) and choose a Tokyo Nebula variant.

## Regenerating the theme

The Zed family file is generated from the VS Code source themes by a small Node script:

```bash
cd zed-extension
node scripts/build.mjs
```

This reads `../themes/*.json` and writes `themes/tokyo-nebula.json`.

## License

[MIT](../LICENSE)
