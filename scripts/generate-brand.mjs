// Generates the "hsl." brand assets: public/favicon.svg, public/images/logo.png
// and public/images/og-default.png. Run with `node scripts/generate-brand.mjs`.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

// Pretendard ExtraBold outlines (2048 units per em, y axis up), so the
// assets render the same without the font installed.
const UPM = 2048;
const GLYPHS = {
  h: { adv: 1254, d: 'M446 622C446 748 522 824 634 824C748 824 814 750 812 628V0H1150V692C1150 940 1000 1100 772 1100C610 1100 496 1020 446 888H434V1448H108V0H446Z' },
  s: { adv: 1132, d: 'M734 750H1048C1034 966 856 1100 564 1100C270 1100 86 972 88 756C86 590 194 482 408 442L594 408C688 388 730 358 732 310C730 250 668 214 576 214C476 214 408 256 396 334H60C82 118 264 -20 574 -20C868 -20 1072 124 1074 346C1072 504 968 598 752 640L546 680C452 698 420 732 422 774C420 830 486 868 570 868C660 868 724 822 734 750Z' },
  l: { adv: 554, d: 'M446 1448H108V0H446Z' },
};
const INK_LEFT = 108;
const CAP_HEIGHT = 1448;
// Same proportions as the header wordmark in src/styles/global.css.
const TRACKING = -0.055 * UPM;
const DOT_GAP = 0.045 * UPM;
const DOT = 0.2 * UPM;

const COLORS = { bg: '#1b262b', ink: '#f6f5f1', accent: '#e66043', muted: '#8fa0a5' };
const round = (n) => Math.round(n * 100) / 100;

// Glyph paths and the dot for `text` followed by "." in font units, plus the right ink edge.
function layout(text, { tracking = TRACKING, dot = DOT } = {}) {
  let x = 0;
  const parts = [];
  for (const ch of text) {
    parts.push(`<path transform="translate(${round(x)} 0)" d="${GLYPHS[ch].d}"/>`);
    x += GLYPHS[ch].adv + tracking;
  }
  const dotX = x + DOT_GAP;
  return { paths: parts.join(''), dotX, dot, right: dotX + dot };
}

// Places a laid-out mark so its cap height is `capPx` and its left ink edge sits at `left`, baseline at `baseline`.
function mark(text, { left, baseline, capPx, ink, accent, ...options }) {
  const { paths, dotX, dot } = layout(text, options);
  const k = capPx / CAP_HEIGHT;
  return `<g transform="translate(${round(left - INK_LEFT * k)} ${round(baseline)}) scale(${round(k * 1e5) / 1e5} ${-round(k * 1e5) / 1e5})">
    <g fill="${ink}">${paths}</g>
    <circle fill="${accent}" cx="${round(dotX + dot / 2)}" cy="${round(dot / 2)}" r="${round(dot / 2)}"/>
  </g>`;
}

// "h." centred in a rounded square; `dot` is enlarged for the favicon so it survives 16 px.
function icon(size, dot) {
  const capPx = 0.51 * size;
  const k = capPx / CAP_HEIGHT;
  const width = (layout('h', { tracking: 0, dot }).right - INK_LEFT) * k;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${round(size * 0.22)}" fill="${COLORS.bg}"/>
  ${mark('h', { left: (size - width) / 2, baseline: (size + capPx) / 2, capPx, ink: COLORS.ink, accent: COLORS.accent, tracking: 0, dot })}
</svg>
`;
}

const fontDir = path.resolve('node_modules/pretendard/dist/public/static');
// Pango renders the text with the bundled Pretendard file, so the card does not depend on system fonts.
// `text` is Pango markup; `color` sets the default foreground.
async function textLayer(text, weight, sizePx, color) {
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${color}">${text}</span>`,
      font: `Pretendard ${weight} ${sizePx}px`,
      fontfile: path.join(fontDir, `Pretendard-${weight}.otf`),
      rgba: true,
    },
  }).png().toBuffer({ resolveWithObject: true });
  return { input: data, height: info.height };
}

async function ogDefault() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${COLORS.bg}"/>
  ${mark('hsl', { left: 80, baseline: 392, capPx: 250, ink: COLORS.ink, accent: COLORS.accent })}
  <line x1="80" y1="478" x2="1120" y2="478" stroke="${COLORS.muted}" stroke-opacity=".45" stroke-width="1.5"/>
</svg>`;
  // Tracking suits the Latin capitals but would space out the Hangul.
  const kicker = await textLayer(`<span letter_spacing="${Math.round(0.12 * 22 * 1024)}">HSL&#8217;S BLOG</span> · HSL의 블로그`, 'SemiBold', 22, COLORS.muted);
  const topics = await textLayer('AI · Mobility · IT Devices', 'SemiBold', 30, COLORS.ink);
  const domain = await textLayer('hslblog.com', 'Medium', 24, COLORS.muted);
  return sharp(Buffer.from(svg))
    .composite([
      { input: kicker.input, left: 82, top: 72 },
      { input: topics.input, left: 82, top: 518 },
      { input: domain.input, left: 1120 - (await sharp(domain.input).metadata()).width, top: 522 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.resolve('public/images/og-default.png'));
}

fs.writeFileSync(path.resolve('public/favicon.svg'), icon(64, 0.28 * UPM));
await sharp(Buffer.from(icon(512, DOT))).png({ compressionLevel: 9 }).toFile(path.resolve('public/images/logo.png'));
await ogDefault();
console.log('Generated public/favicon.svg, public/images/logo.png and public/images/og-default.png');
