import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createHighlighter } from "shiki";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const themesDir = join(repoRoot, "themes");
const snippetsDir = join(__dirname, "preview-snippets");
const imagesDir = join(repoRoot, "images");

const VARIANTS = [
  { id: "andromeda", file: "andromeda.tsx", lang: "tsx",    label: "Andromeda" },
  { id: "aurora",    file: "aurora.py",     lang: "python", label: "Aurora"    },
  { id: "eclipse",   file: "eclipse.go",    lang: "go",     label: "Eclipse"   },
  { id: "solstice",  file: "solstice.rs",   lang: "rust",   label: "Solstice"  },
  { id: "polaris",   file: "polaris.sql",   lang: "sql",    label: "Polaris"   },
];

async function loadTheme(id) {
  const raw = await readFile(join(themesDir, `${id}.json`), "utf8");
  return JSON.parse(raw);
}

async function loadSnippet(file) {
  return (await readFile(join(snippetsDir, file), "utf8")).trimEnd();
}

function pickColors(theme) {
  const c = theme.colors ?? {};
  return {
    editorBg:    c["editor.background"]            ?? "#15161f",
    editorFg:    c["editor.foreground"]            ?? "#a9b1d6",
    titleBg:     c["titleBar.activeBackground"]    ?? c["editor.background"] ?? "#11121a",
    titleFg:     c["titleBar.activeForeground"]    ?? "#787c99",
    sidebarBg:   c["sideBar.background"]           ?? c["editor.background"] ?? "#15161f",
    border:      c["panel.border"]                 ?? "#1f2233",
    accent:      c["focusBorder"]                  ?? "#a78bfa",
    lineNumber:  c["editorLineNumber.foreground"]  ?? "#3b4261",
  };
}

const FONT_STACK = `'Cascadia Code', 'JetBrains Mono', 'Fira Code', 'SF Mono', Menlo, Consolas, monospace`;

function editorWindow({ title, codeHtml, colors, lines, fontSize, padding }) {
  const lineNumbers = Array.from({ length: lines }, (_, i) => i + 1)
    .map((n) => `<span>${n}</span>`)
    .join("");
  return `
    <div class="window" style="
      background: ${colors.editorBg};
      border: 1px solid ${colors.border};
      box-shadow: 0 30px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02);
    ">
      <div class="titlebar" style="background: ${colors.titleBg}; color: ${colors.titleFg};">
        <span class="dot" style="background:#ff5f57"></span>
        <span class="dot" style="background:#febc2e"></span>
        <span class="dot" style="background:#28c840"></span>
        <span class="title">${title}</span>
      </div>
      <div class="codearea" style="font-size: ${fontSize}px; padding: ${padding}px;">
        <div class="gutter" style="color: ${colors.lineNumber};">${lineNumbers}</div>
        <div class="code">${codeHtml}</div>
      </div>
    </div>
  `;
}

const BASE_CSS = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: ${FONT_STACK}; -webkit-font-smoothing: antialiased; }
  .window { border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; }
  .titlebar {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 14px; font-size: 12px; letter-spacing: 0.02em;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .titlebar .dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
  .titlebar .title { margin-left: 10px; opacity: 0.85; }
  .codearea { display: flex; gap: 18px; flex: 1; line-height: 1.55; }
  .gutter {
    display: flex; flex-direction: column; align-items: flex-end;
    user-select: none; opacity: 0.7;
    font-variant-numeric: tabular-nums;
    min-width: 1.5em;
  }
  /* shiki output */
  .code pre { margin: 0; background: transparent !important; }
  .code pre code { background: transparent !important; }
`;

function pageHtml({ width, height, body, extraCss = "" }) {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  body { width: ${width}px; height: ${height}px; }
  ${BASE_CSS}
  ${extraCss}
</style>
</head><body>${body}</body></html>`;
}

const NEBULA_BG = `
  background:
    radial-gradient(ellipse 60% 50% at 15% 20%, rgba(167, 139, 250, 0.28), transparent 70%),
    radial-gradient(ellipse 70% 60% at 85% 30%, rgba(0, 212, 255, 0.20), transparent 70%),
    radial-gradient(ellipse 50% 50% at 50% 95%, rgba(124, 227, 139, 0.14), transparent 70%),
    linear-gradient(180deg, #0a0c14 0%, #0d0f1a 100%);
`;

async function renderVariantPreview(page, variant, theme, snippet, highlighter, outPath) {
  const colors = pickColors(theme);
  const codeHtml = highlighter.codeToHtml(snippet, {
    lang: variant.lang,
    theme: theme.name,
  });
  const lines = snippet.split("\n").length;

  const width = 1200, height = 720;
  const body = `
    <div class="frame" style="${NEBULA_BG} width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 56px;">
      <div style="width: 100%; max-width: 1040px;">
        <div class="brand" style="display: flex; align-items: baseline; gap: 12px; margin-bottom: 18px;">
          <span style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 700; color: #e8ecff; font-size: 22px; letter-spacing: 0.02em;">Tokyo Nebula</span>
          <span style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; color: ${colors.accent}; font-size: 16px; font-weight: 500;">· ${variant.label}</span>
        </div>
        ${editorWindow({
          title: variant.file,
          codeHtml,
          colors,
          lines,
          fontSize: 15,
          padding: 22,
        })}
      </div>
    </div>
  `;
  await page.setViewportSize({ width, height });
  await page.setContent(pageHtml({ width, height, body }), { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: outPath, omitBackground: false });
  console.log(`  wrote ${outPath}`);
}

async function renderBanner(page, themes, snippets, highlighter, outPath) {
  const width = 1600, height = 560;
  const cards = VARIANTS.map((variant, i) => {
    const theme = themes[i];
    const snippet = snippets[i];
    const colors = pickColors(theme);
    const codeHtml = highlighter.codeToHtml(snippet, {
      lang: variant.lang,
      theme: theme.name,
    });
    const lines = snippet.split("\n").length;
    return `
      <div class="card-wrap">
        <div class="card">${editorWindow({
          title: variant.file,
          codeHtml,
          colors,
          lines,
          fontSize: 9,
          padding: 12,
        })}</div>
        <div class="card-label" style="color: ${colors.accent};">${variant.label}</div>
      </div>
    `;
  }).join("");

  const body = `
    <div class="frame" style="${NEBULA_BG} width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 48px;">
      <div class="wordmark">
        <span class="title">Tokyo Nebula</span>
        <span class="tag">five-variant dark theme family · Andromeda · Aurora · Eclipse · Solstice · Polaris</span>
      </div>
      <div class="strip">${cards}</div>
    </div>
  `;
  const extraCss = `
    .wordmark { text-align: center; margin-bottom: 24px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    .wordmark .title {
      display: block; font-size: 42px; font-weight: 800; letter-spacing: 0.02em;
      background: linear-gradient(90deg, #a78bfa 0%, #00d4ff 50%, #7ce38b 100%);
      -webkit-background-clip: text; background-clip: text; color: transparent;
    }
    .wordmark .tag { display: block; margin-top: 6px; color: #9aa3c7; font-size: 13px; font-weight: 500; letter-spacing: 0.04em; }
    .strip { display: flex; gap: 16px; align-items: stretch; }
    .card-wrap { display: flex; flex-direction: column; gap: 8px; }
    .card { width: 280px; height: 290px; overflow: hidden; }
    .card .window { height: 100%; }
    .card .codearea { font-size: 9px !important; line-height: 1.5; padding: 10px !important; gap: 10px !important; }
    .card .titlebar { padding: 6px 10px; font-size: 9px; }
    .card .titlebar .dot { width: 7px; height: 7px; }
    .card-label {
      text-align: center; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 14px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
    }
  `;
  await page.setViewportSize({ width, height });
  await page.setContent(pageHtml({ width, height, body, extraCss }), { waitUntil: "domcontentloaded" });
  await page.screenshot({ path: outPath, omitBackground: false });
  console.log(`  wrote ${outPath}`);
}

async function main() {
  await mkdir(imagesDir, { recursive: true });

  console.log("Loading themes + snippets...");
  const themes = await Promise.all(VARIANTS.map((v) => loadTheme(v.id)));
  const snippets = await Promise.all(VARIANTS.map((v) => loadSnippet(v.file)));

  console.log("Booting Shiki...");
  const highlighter = await createHighlighter({
    themes,
    langs: VARIANTS.map((v) => v.lang),
  });

  console.log("Launching Chromium...");
  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();

  console.log("Rendering per-variant previews...");
  for (let i = 0; i < VARIANTS.length; i++) {
    const v = VARIANTS[i];
    await renderVariantPreview(
      page,
      v,
      themes[i],
      snippets[i],
      highlighter,
      join(imagesDir, `${v.id}.png`)
    );
  }

  console.log("Rendering banner...");
  await renderBanner(page, themes, snippets, highlighter, join(imagesDir, "banner.png"));

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
