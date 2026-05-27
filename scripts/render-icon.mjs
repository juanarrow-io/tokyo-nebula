import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const imagesDir = join(repoRoot, "images");

// Aurora streak colors — one per variant, ordered for visual flow (cool → warm → cool).
// Maps to the palette preference: purples, yellows, blues, cyans, greens; orange used sparingly.
const AURORA_STREAKS = [
  { color: "#a78bfa", variant: "Andromeda" }, // purple
  { color: "#00d4ff", variant: "Aurora" },    // cyan
  { color: "#7ce38b", variant: "Polaris-ish" },// green (we want yellow up top, so reordering below)
];

// Reordered for the actual SVG, top-to-bottom: purple, cyan, yellow, green, blue
const STREAKS = [
  { color: "#a78bfa", y: 130, opacity: 0.60 }, // Andromeda purple
  { color: "#00d4ff", y: 195, opacity: 0.55 }, // Aurora cyan
  { color: "#f7c97c", y: 250, opacity: 0.60 }, // Solstice warm gold (bumped so it doesn't wash out)
  { color: "#7ce38b", y: 300, opacity: 0.50 }, // Polaris green
  { color: "#7aa2f7", y: 350, opacity: 0.55 }, // Eclipse soft blue
];

// Starfield — fixed coordinates for reproducibility (no RNG).
const STARS = [
  { x: 80,  y: 90,  r: 1.2, a: 0.9 },
  { x: 170, y: 60,  r: 0.8, a: 0.6 },
  { x: 290, y: 110, r: 1.6, a: 0.95 },
  { x: 410, y: 70,  r: 1.0, a: 0.7 },
  { x: 540, y: 50,  r: 1.4, a: 0.85 },
  { x: 660, y: 95,  r: 0.9, a: 0.6 },
  { x: 780, y: 65,  r: 1.3, a: 0.8 },
  { x: 880, y: 110, r: 1.0, a: 0.7 },
  { x: 950, y: 75,  r: 0.7, a: 0.5 },
  { x: 60,  y: 220, r: 0.9, a: 0.55 },
  { x: 920, y: 245, r: 1.1, a: 0.7 },
  { x: 110, y: 380, r: 0.8, a: 0.5 },
  { x: 870, y: 400, r: 1.0, a: 0.6 },
];

function svgIcon() {
  // Canvas is 1024x1024. Coordinates are in this space.
  const W = 1024, H = 1024;

  // Mt Fuji — gentle concave slopes via quadratic Béziers.
  // Apex around (512, 360), base ends around y=820, base width ~720.
  // Concave control points sit slightly *outside* the line from apex to base corner
  // to produce the classic Fuji curve.
  const fujiPath = [
    "M 152 820",                          // left base
    "Q 380 760, 512 360",                 // left slope curving up to apex
    "Q 644 760, 872 820",                 // right slope curving down to right base
    "Z",
  ].join(" ");

  // Snow cap — zigzag drip pattern as the BOTTOM edge of the snow region.
  // The TOP edge runs above the canvas (y=0) so the SVG clipPath trims it to
  // the mountain silhouette. Net effect: snow fills the upper portion of Fuji,
  // bounded below by the jagged drips.
  // Drips span y=480-580 — placed where the Bézier-curved mountain is wide
  // enough for the zigzag to register at icon scale.
  const snowPath = [
    "M 320 600",                          // left foothold (clipped to slope)
    "L 360 535",
    "L 390 575",
    "L 420 510",
    "L 450 555",
    "L 478 500",
    "L 500 540",
    "L 512 490",                          // mini-peak
    "L 528 535",
    "L 550 495",
    "L 575 545",
    "L 605 505",
    "L 635 555",
    "L 665 510",
    "L 700 600",                          // right foothold (clipped to slope)
    // top boundary — clipped away by the mountain silhouette
    "L 700 0",
    "L 320 0",
    "Z",
  ].join(" ");

  return `
<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
  <defs>
    <radialGradient id="sky" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#1d1838" />
      <stop offset="55%" stop-color="#10111e" />
      <stop offset="100%" stop-color="#070810" />
    </radialGradient>

    <radialGradient id="haze-purple" cx="20%" cy="25%" r="40%">
      <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="haze-cyan" cx="80%" cy="30%" r="45%">
      <stop offset="0%" stop-color="#00d4ff" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#00d4ff" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="haze-green" cx="50%" cy="92%" r="55%">
      <stop offset="0%" stop-color="#7ce38b" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#7ce38b" stop-opacity="0" />
    </radialGradient>

    <filter id="auroraBlur" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="12" />
    </filter>

    <linearGradient id="fujiFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1d2e" />
      <stop offset="100%" stop-color="#0a0c14" />
    </linearGradient>

    <linearGradient id="snowFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f0f3ff" />
      <stop offset="100%" stop-color="#cfd5f0" />
    </linearGradient>

    <clipPath id="fujiClip">
      <path d="${fujiPath}" />
    </clipPath>

    <!-- Subtle inner border / vignette -->
    <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
      <stop offset="70%" stop-color="#000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000" stop-opacity="0.35" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#sky)" />
  <rect width="${W}" height="${H}" fill="url(#haze-purple)" />
  <rect width="${W}" height="${H}" fill="url(#haze-cyan)" />
  <rect width="${W}" height="${H}" fill="url(#haze-green)" />

  <!-- Stars -->
  <g fill="#ffffff">
    ${STARS.map(s => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" opacity="${s.a}" />`).join("\n    ")}
  </g>

  <!-- Aurora streaks (behind mountain) -->
  <g filter="url(#auroraBlur)">
    ${STREAKS.map(s => `
    <path d="M -20 ${s.y} Q 256 ${s.y - 50} 512 ${s.y - 10} T 1044 ${s.y + 30}"
          stroke="${s.color}" stroke-width="38" fill="none"
          opacity="${s.opacity}" stroke-linecap="round" />`).join("")}
  </g>

  <!-- Sharper aurora highlights (no blur) for punch -->
  <g>
    ${STREAKS.map(s => `
    <path d="M -20 ${s.y} Q 256 ${s.y - 50} 512 ${s.y - 10} T 1044 ${s.y + 30}"
          stroke="${s.color}" stroke-width="3" fill="none"
          opacity="${Math.min(0.9, s.opacity + 0.25)}" stroke-linecap="round" />`).join("")}
  </g>

  <!-- Mt Fuji silhouette -->
  <path d="${fujiPath}" fill="url(#fujiFill)" />

  <!-- Snow cap, clipped to mountain shape -->
  <g clip-path="url(#fujiClip)">
    <path d="${snowPath}" fill="url(#snowFill)" />
  </g>

  <!-- Subtle ridge highlight along the left slope -->
  <path d="M 380 760 Q 446 560 512 360"
        stroke="#2a2f4a" stroke-width="2" fill="none" opacity="0.6" />

  <!-- Vignette -->
  <rect width="${W}" height="${H}" fill="url(#vignette)" />
</svg>
  `;
}

function pageHtml(svgMarkup) {
  return `<!doctype html>
<html><head><meta charset="utf-8" />
<style>
  html, body { margin: 0; padding: 0; background: transparent; }
  body { width: 1024px; height: 1024px; }
  svg { display: block; width: 1024px; height: 1024px; }
</style>
</head><body>${svgMarkup}</body></html>`;
}

async function main() {
  await mkdir(imagesDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({ deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.setViewportSize({ width: 1024, height: 1024 });
  await page.setContent(pageHtml(svgIcon()), { waitUntil: "domcontentloaded" });

  const outPath = join(imagesDir, "icon.png");
  await page.screenshot({ path: outPath, omitBackground: false, clip: { x: 0, y: 0, width: 1024, height: 1024 } });
  console.log(`wrote ${outPath}`);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
