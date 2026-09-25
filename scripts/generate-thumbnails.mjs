import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const fontStack = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const images = [
  {
    filename: 'agi.png',
    alias: 'ai-evaluation.png',
    bg: '#1e2b30',
    ink: '#e8f1ec',
    accent: '#e66043',
    lineColor: '#526970',
    kicker: 'HSL   NOTES',
    title: 'AGI',
    titleSize: 130,
    subtitle: 'GENERAL INTELLIGENCE &amp; REASONING',
    circles: [
      { r: 100, stroke: '#e8f1ec', width: 8, fill: 'none' },
      { r: 200, stroke: '#526970', width: 2, fill: 'none' },
      { r: 320, stroke: '#526970', width: 2, fill: 'none' },
      { r: 460, stroke: '#526970', width: 2, fill: 'none' },
      { r: 600, stroke: '#526970', width: 2, fill: 'none' },
    ],
    decorations: `
      <!-- Crosshairs -->
      <line x1="680" y1="350" x2="950" y2="350" stroke="#e66043" stroke-width="2.5" />
      <line x1="1050" y1="350" x2="1200" y2="350" stroke="#e66043" stroke-width="2.5" />
      <line x1="1000" y1="60" x2="1000" y2="300" stroke="#e66043" stroke-width="2.5" />
      <line x1="1000" y1="400" x2="1000" y2="630" stroke="#e66043" stroke-width="2.5" />
      <!-- Focus center dot -->
      <circle cx="1000" cy="350" r="16" fill="#e66043" />
    `
  },
  {
    filename: 'physical-ai.png',
    alias: 'regenerative-braking.png',
    bg: '#ddc4a8',
    ink: '#312720',
    accent: '#d9583b',
    lineColor: '#5c4b3f',
    kicker: 'HSL   NOTES',
    title: 'PHYSICAL AI',
    titleSize: 96,
    subtitle: 'EMBODIED ROBOTICS &amp; SPATIAL SYSTEMS',
    circles: [
      { r: 120, stroke: '#312720', width: 9, fill: 'none' },
      { r: 230, stroke: '#5c4b3f', width: 2, fill: 'none' },
      { r: 350, stroke: '#5c4b3f', width: 2, fill: 'none' },
      { r: 490, stroke: '#5c4b3f', width: 2, fill: 'none' },
      { r: 640, stroke: '#5c4b3f', width: 2, fill: 'none' },
    ],
    decorations: `
      <!-- Kinematic Vector Line -->
      <line x1="720" y1="450" x2="1140" y2="250" stroke="#312720" stroke-width="5" />
      <!-- Articulation nodes -->
      <circle cx="720" cy="450" r="8" fill="#d9583b" />
      <circle cx="1140" cy="250" r="10" fill="#d9583b" />
      <line x1="930" y1="350" x2="1000" y2="170" stroke="#5c4b3f" stroke-width="2" stroke-dasharray="6,6" />
      <circle cx="1000" cy="170" r="6" fill="#312720" />
    `
  },
  {
    filename: 'other-ai.png',
    alias: 'soil-moisture.png',
    bg: '#a8c5a2',
    ink: '#1d4133',
    accent: '#d8593a',
    lineColor: '#2b5a47',
    kicker: 'HSL   NOTES',
    title: 'OTHER AI',
    titleSize: 110,
    subtitle: 'ON-DEVICE, MULTIMODAL &amp; APPLIED SYSTEMS',
    circles: [
      { r: 110, stroke: '#1d4133', width: 8, fill: 'none' },
      { r: 220, stroke: '#2b5a47', width: 2, fill: 'none' },
      { r: 340, stroke: '#2b5a47', width: 2, fill: 'none' },
      { r: 480, stroke: '#2b5a47', width: 2, fill: 'none' },
      { r: 630, stroke: '#2b5a47', width: 2, fill: 'none' },
    ],
    decorations: `
      <!-- Sensor Mesh Triangle -->
      <polygon points="1090,170 990,390 1130,400" stroke="#1d4133" stroke-width="3" fill="none" />
      <circle cx="1090" cy="170" r="7" fill="#d8593a" />
      <circle cx="990" cy="390" r="7" fill="#d8593a" />
      <circle cx="1130" cy="400" r="7" fill="#d8593a" />
    `
  },
  {
    filename: 'og-default.png',
    alias: null,
    bg: '#233238',
    ink: '#ffffff',
    accent: '#e66043',
    lineColor: '#4f6870',
    kicker: "HSL'S BLOG",
    title: "HSL's Blog",
    titleSize: 110,
    subtitle: 'AI / CARS / DEVICES',
    footerText: 'AGI / PHYSICAL AI / OTHER AI',
    circles: [
      { r: 90, stroke: '#4f6870', width: 2.5, fill: 'none' },
      { r: 180, stroke: '#4f6870', width: 2.5, fill: 'none' },
      { r: 290, stroke: '#4f6870', width: 2.5, fill: 'none' },
      { r: 420, stroke: '#4f6870', width: 2.5, fill: 'none' },
      { r: 560, stroke: '#4f6870', width: 2.5, fill: 'none' },
    ],
    decorations: `
      <!-- Radar Crosshairs -->
      <line x1="680" y1="315" x2="920" y2="315" stroke="#e66043" stroke-width="2.5" />
      <line x1="1080" y1="315" x2="1200" y2="315" stroke="#e66043" stroke-width="2.5" />
      <line x1="1000" y1="0" x2="1000" y2="235" stroke="#e66043" stroke-width="2.5" />
      <line x1="1000" y1="395" x2="1000" y2="630" stroke="#e66043" stroke-width="2.5" />
      <!-- Center Dot -->
      <circle cx="1000" cy="315" r="18" fill="#e66043" />
    `
  }
];

async function generateAll() {
  for (const item of images) {
    const isOg = item.filename === 'og-default.png';
    const titleSvg = isOg 
      ? `<text x="75" y="325" fill="${item.ink}" font-family="${fontStack}" font-size="${item.titleSize}" font-weight="850" letter-spacing="-3">HSL<tspan fill="${item.accent}">'s Blog</tspan></text>`
      : `<text x="75" y="360" fill="${item.ink}" font-family="${fontStack}" font-size="${item.titleSize}" font-weight="850" letter-spacing="-2">${item.title}</text>`;

    const bottomSection = isOg
      ? `
        <text x="75" y="515" fill="${item.ink}" font-family="${fontStack}" font-size="22" font-weight="800" letter-spacing="2">${item.subtitle}</text>
        <line x1="75" y1="550" x2="1125" y2="550" stroke="${item.ink}" stroke-width="1.5" />
        <text x="75" y="590" fill="${item.ink}" font-family="${fontStack}" font-size="16" font-weight="700" letter-spacing="3">${item.footerText}</text>
      `
      : `
        <text x="75" y="515" fill="${item.ink}" font-family="${fontStack}" font-size="22" font-weight="800" letter-spacing="2">${item.subtitle}</text>
        <line x1="75" y1="550" x2="1125" y2="550" stroke="${item.ink}" stroke-width="1.5" />
      `;

    const circlesSvg = item.circles.map(c => 
      `<circle cx="1000" cy="${isOg ? 315 : 350}" r="${c.r}" stroke="${c.stroke}" stroke-width="${c.width}" fill="${c.fill}" />`
    ).join('\n');

    const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="${item.bg}" />
      
      <!-- Top Kicker & Divider -->
      <text x="75" y="85" fill="${item.ink}" font-family="${fontStack}" font-size="20" font-weight="800" letter-spacing="3">${item.kicker}</text>
      <line x1="75" y1="115" x2="1125" y2="115" stroke="${item.ink}" stroke-width="1.5" />

      <!-- Center Title -->
      ${titleSvg}

      <!-- Bottom Meta -->
      ${bottomSection}

      <!-- Right Graphic Scope -->
      <g>
        ${circlesSvg}
        ${item.decorations || ''}
      </g>
    </svg>
    `;

    const outPath = path.join(outDir, item.filename);
    await sharp(Buffer.from(svg)).png().toFile(outPath);
    console.log(`Generated: ${outPath}`);

    if (item.alias) {
      const aliasPath = path.join(outDir, item.alias);
      await sharp(Buffer.from(svg)).png().toFile(aliasPath);
      console.log(`Updated alias: ${aliasPath}`);
    }
  }
}

generateAll().catch(err => {
  console.error(err);
  process.exit(1);
});
