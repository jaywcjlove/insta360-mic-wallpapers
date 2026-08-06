/**
 * Generate 240×208 Insta360 Mic Pro wallpapers using only 6 e-ink colors.
 * Colors: black, white, red, yellow, blue, green
 * Safe zone: keep important content out of the bottom ~20% (button icons).
 */
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../public/wallpapers')
const W = 240
const H = 208
const R = 104 // circular display radius (half of short side)

// Spectra-6-like palette (device can only render these)
const C = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#E53935',
  yellow: '#FDD835',
  blue: '#1E88E5',
  green: '#43A047',
}

const wallpapers = []

function svgToPng(name, svg, meta) {
  wallpapers.push({ name, svg, meta })
}

function circleClip(inner) {
  return `
    <defs>
      <clipPath id="c"><circle cx="120" cy="104" r="${R}"/></clipPath>
    </defs>
    <g clip-path="url(#c)">${inner}</g>
    <!-- soft guide: bottom dead zone for physical buttons (not in final art) -->
  `
}

// ── Designs ──────────────────────────────────────────────

// 1. Solid color badges with initial / icon
const solids = [
  { name: 'solid-black', bg: C.black, fg: C.white, label: 'MIC' },
  { name: 'solid-red', bg: C.red, fg: C.white, label: 'REC' },
  { name: 'solid-blue', bg: C.blue, fg: C.white, label: 'LIVE' },
  { name: 'solid-green', bg: C.green, fg: C.white, label: 'ON' },
  { name: 'solid-yellow', bg: C.yellow, fg: C.black, label: 'TX' },
  { name: 'solid-white', bg: C.white, fg: C.black, label: 'PRO' },
]
for (const s of solids) {
  svgToPng(
    s.name,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${circleClip(`
        <rect width="${W}" height="${H}" fill="${s.bg}"/>
        <text x="120" y="100" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif"
          font-size="42" font-weight="900" fill="${s.fg}" letter-spacing="2">${s.label}</text>
      `)}
    </svg>`,
    { title: s.label, category: 'solid', colors: [s.bg, s.fg] }
  )
}

// 2. Geometric patterns
svgToPng(
  'geo-stripes',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      ${[0,1,2,3,4,5,6].map((i) =>
        `<rect x="${i * 36}" y="0" width="18" height="${H}" fill="${i % 2 ? C.yellow : C.red}"/>`
      ).join('')}
    `)}
  </svg>`,
  { title: 'Red Yellow Stripes', category: 'pattern', colors: [C.black, C.red, C.yellow] }
)

svgToPng(
  'geo-checker',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.white}"/>
      ${Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) =>
          (row + col) % 2 === 0
            ? `<rect x="${col * 30}" y="${row * 26}" width="30" height="26" fill="${C.black}"/>`
            : ''
        ).join('')
      ).join('')}
    `)}
  </svg>`,
  { title: 'Checkerboard', category: 'pattern', colors: [C.black, C.white] }
)

svgToPng(
  'geo-dots',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      ${Array.from({ length: 7 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const colors = [C.red, C.yellow, C.blue, C.green, C.white]
          const c = colors[(row + col) % colors.length]
          return `<circle cx="${20 + col * 28}" cy="${18 + row * 28}" r="8" fill="${c}"/>`
        }).join('')
      ).join('')}
    `)}
  </svg>`,
  { title: 'Color Dots', category: 'pattern', colors: [C.black, C.red, C.yellow, C.blue, C.green, C.white] }
)

svgToPng(
  'geo-rings',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <circle cx="120" cy="96" r="80" fill="none" stroke="${C.red}" stroke-width="10"/>
      <circle cx="120" cy="96" r="60" fill="none" stroke="${C.yellow}" stroke-width="10"/>
      <circle cx="120" cy="96" r="40" fill="none" stroke="${C.blue}" stroke-width="10"/>
      <circle cx="120" cy="96" r="20" fill="${C.green}"/>
    `)}
  </svg>`,
  { title: 'Concentric Rings', category: 'pattern', colors: [C.black, C.red, C.yellow, C.blue, C.green] }
)

svgToPng(
  'geo-triangles',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <polygon points="120,20 220,180 20,180" fill="${C.red}"/>
      <polygon points="120,50 190,160 50,160" fill="${C.yellow}"/>
      <polygon points="120,80 160,140 80,140" fill="${C.blue}"/>
      <polygon points="120,105 140,130 100,130" fill="${C.green}"/>
    `)}
  </svg>`,
  { title: 'Nested Triangles', category: 'pattern', colors: [C.black, C.red, C.yellow, C.blue, C.green] }
)

svgToPng(
  'geo-quarters',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect x="0" y="0" width="120" height="104" fill="${C.red}"/>
      <rect x="120" y="0" width="120" height="104" fill="${C.yellow}"/>
      <rect x="0" y="104" width="120" height="104" fill="${C.blue}"/>
      <rect x="120" y="104" width="120" height="104" fill="${C.green}"/>
      <circle cx="120" cy="104" r="36" fill="${C.white}"/>
      <circle cx="120" cy="104" r="18" fill="${C.black}"/>
    `)}
  </svg>`,
  { title: 'Four Quarters', category: 'pattern', colors: [C.red, C.yellow, C.blue, C.green, C.white, C.black] }
)

// 3. Icons / symbols
svgToPng(
  'icon-mic',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <!-- mic body -->
      <rect x="100" y="36" width="40" height="70" rx="20" fill="${C.white}"/>
      <rect x="108" y="44" width="24" height="50" rx="12" fill="${C.red}"/>
      <!-- stand -->
      <path d="M80 100 Q80 145 120 145 Q160 145 160 100" fill="none" stroke="${C.white}" stroke-width="8" stroke-linecap="round"/>
      <line x1="120" y1="145" x2="120" y2="168" stroke="${C.white}" stroke-width="8" stroke-linecap="round"/>
      <line x1="95" y1="168" x2="145" y2="168" stroke="${C.white}" stroke-width="8" stroke-linecap="round"/>
    `)}
  </svg>`,
  { title: 'Microphone', category: 'icon', colors: [C.black, C.white, C.red] }
)

svgToPng(
  'icon-waveform',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      ${[12, 28, 48, 72, 90, 72, 48, 28, 12, 36, 60, 80, 60, 36, 20, 44, 68, 44, 20]
        .map((h, i) => {
          const colors = [C.red, C.yellow, C.blue, C.green, C.white]
          const x = 28 + i * 10
          const y = 96 - h / 2
          return `<rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${colors[i % 5]}"/>`
        }).join('')}
    `)}
  </svg>`,
  { title: 'Waveform', category: 'icon', colors: [C.black, C.red, C.yellow, C.blue, C.green, C.white] }
)

svgToPng(
  'icon-play',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <circle cx="120" cy="96" r="56" fill="${C.red}"/>
      <polygon points="105,66 105,126 155,96" fill="${C.white}"/>
    `)}
  </svg>`,
  { title: 'Play Button', category: 'icon', colors: [C.black, C.red, C.white] }
)

svgToPng(
  'icon-rec',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <circle cx="120" cy="88" r="40" fill="none" stroke="${C.white}" stroke-width="8"/>
      <circle cx="120" cy="88" r="24" fill="${C.red}"/>
      <text x="120" y="155" text-anchor="middle" font-family="Arial Black, sans-serif"
        font-size="22" font-weight="900" fill="${C.white}" letter-spacing="3">REC</text>
    `)}
  </svg>`,
  { title: 'Recording', category: 'icon', colors: [C.black, C.red, C.white] }
)

svgToPng(
  'icon-heart',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.white}"/>
      <path d="M120 155 C120 155 40 105 40 70 C40 45 60 35 80 35 C95 35 110 45 120 60 C130 45 145 35 160 35 C180 35 200 45 200 70 C200 105 120 155 120 155Z" fill="${C.red}"/>
    `)}
  </svg>`,
  { title: 'Heart', category: 'icon', colors: [C.white, C.red] }
)

svgToPng(
  'icon-star',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.blue}"/>
      <polygon points="120,30 138,80 192,80 148,112 164,164 120,132 76,164 92,112 48,80 102,80" fill="${C.yellow}"/>
    `)}
  </svg>`,
  { title: 'Star', category: 'icon', colors: [C.blue, C.yellow] }
)

svgToPng(
  'icon-music',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <circle cx="80" cy="130" r="22" fill="${C.yellow}"/>
      <circle cx="160" cy="115" r="22" fill="${C.red}"/>
      <rect x="96" y="50" width="10" height="82" fill="${C.white}"/>
      <rect x="176" y="35" width="10" height="82" fill="${C.white}"/>
      <path d="M106 50 L186 35 L186 55 L106 70 Z" fill="${C.green}"/>
    `)}
  </svg>`,
  { title: 'Music Notes', category: 'icon', colors: [C.black, C.yellow, C.red, C.white, C.green] }
)

svgToPng(
  'icon-podcast',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <circle cx="120" cy="90" r="28" fill="${C.white}"/>
      <circle cx="120" cy="90" r="14" fill="${C.red}"/>
      <path d="M70 90 A50 50 0 0 1 170 90" fill="none" stroke="${C.blue}" stroke-width="8" stroke-linecap="round"/>
      <path d="M55 90 A65 65 0 0 1 185 90" fill="none" stroke="${C.green}" stroke-width="8" stroke-linecap="round"/>
      <line x1="120" y1="118" x2="120" y2="150" stroke="${C.white}" stroke-width="8" stroke-linecap="round"/>
      <line x1="100" y1="150" x2="140" y2="150" stroke="${C.white}" stroke-width="8" stroke-linecap="round"/>
    `)}
  </svg>`,
  { title: 'Podcast', category: 'icon', colors: [C.black, C.white, C.red, C.blue, C.green] }
)

// 4. Numbers / channel IDs
for (const n of [1, 2, 3, 4]) {
  const colors = [
    { bg: C.black, fg: C.yellow },
    { bg: C.blue, fg: C.white },
    { bg: C.red, fg: C.white },
    { bg: C.green, fg: C.white },
  ][n - 1]
  svgToPng(
    `channel-${n}`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${circleClip(`
        <rect width="${W}" height="${H}" fill="${colors.bg}"/>
        <text x="120" y="75" text-anchor="middle" font-family="Arial, sans-serif"
          font-size="16" font-weight="700" fill="${colors.fg}" opacity="0.85">CH</text>
        <text x="120" y="130" text-anchor="middle" font-family="Arial Black, sans-serif"
          font-size="72" font-weight="900" fill="${colors.fg}">${n}</text>
      `)}
    </svg>`,
    { title: `Channel ${n}`, category: 'label', colors: [colors.bg, colors.fg] }
  )
}

// 5. Role labels
const roles = [
  { name: 'label-host', text: 'HOST', bg: C.red, fg: C.white },
  { name: 'label-guest', text: 'GUEST', bg: C.blue, fg: C.white },
  { name: 'label-cam', text: 'CAM', bg: C.black, fg: C.yellow },
  { name: 'label-boom', text: 'BOOM', bg: C.green, fg: C.white },
]
for (const r of roles) {
  svgToPng(
    r.name,
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      ${circleClip(`
        <rect width="${W}" height="${H}" fill="${r.bg}"/>
        <rect x="30" y="70" width="180" height="56" rx="12" fill="${r.fg}"/>
        <text x="120" y="110" text-anchor="middle" font-family="Arial Black, sans-serif"
          font-size="28" font-weight="900" fill="${r.bg}" letter-spacing="3">${r.text}</text>
      `)}
    </svg>`,
    { title: r.text, category: 'label', colors: [r.bg, r.fg] }
  )
}

// 6. Minimal / abstract
svgToPng(
  'minimal-yin-yang',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.white}"/>
      <path d="M120 20 A84 84 0 0 1 120 188 A42 42 0 0 1 120 104 A42 42 0 0 0 120 20" fill="${C.black}"/>
      <circle cx="120" cy="62" r="14" fill="${C.white}"/>
      <circle cx="120" cy="146" r="14" fill="${C.black}"/>
    `)}
  </svg>`,
  { title: 'Yin Yang', category: 'minimal', colors: [C.black, C.white] }
)

svgToPng(
  'minimal-smile',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.yellow}"/>
      <circle cx="85" cy="80" r="12" fill="${C.black}"/>
      <circle cx="155" cy="80" r="12" fill="${C.black}"/>
      <path d="M70 115 Q120 155 170 115" fill="none" stroke="${C.black}" stroke-width="10" stroke-linecap="round"/>
    `)}
  </svg>`,
  { title: 'Smile', category: 'minimal', colors: [C.yellow, C.black] }
)

svgToPng(
  'minimal-target',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.white}"/>
      <circle cx="120" cy="96" r="72" fill="${C.red}"/>
      <circle cx="120" cy="96" r="52" fill="${C.white}"/>
      <circle cx="120" cy="96" r="32" fill="${C.red}"/>
      <circle cx="120" cy="96" r="12" fill="${C.white}"/>
    `)}
  </svg>`,
  { title: 'Target', category: 'minimal', colors: [C.white, C.red] }
)

svgToPng(
  'minimal-cross',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <rect x="100" y="30" width="40" height="140" rx="6" fill="${C.white}"/>
      <rect x="50" y="76" width="140" height="40" rx="6" fill="${C.white}"/>
      <rect x="108" y="38" width="24" height="124" rx="4" fill="${C.red}"/>
      <rect x="58" y="84" width="124" height="24" rx="4" fill="${C.red}"/>
    `)}
  </svg>`,
  { title: 'Cross Mark', category: 'minimal', colors: [C.black, C.white, C.red] }
)

svgToPng(
  'minimal-signal',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <rect x="55" y="120" width="22" height="40" rx="4" fill="${C.green}"/>
      <rect x="90" y="95" width="22" height="65" rx="4" fill="${C.green}"/>
      <rect x="125" y="70" width="22" height="90" rx="4" fill="${C.yellow}"/>
      <rect x="160" y="45" width="22" height="115" rx="4" fill="${C.red}"/>
    `)}
  </svg>`,
  { title: 'Signal Bars', category: 'icon', colors: [C.black, C.green, C.yellow, C.red] }
)

// Bauhaus-style
svgToPng(
  'bauhaus-1',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.white}"/>
      <circle cx="80" cy="70" r="50" fill="${C.red}"/>
      <rect x="120" y="40" width="90" height="90" fill="${C.blue}"/>
      <polygon points="40,160 120,100 200,160" fill="${C.yellow}"/>
      <circle cx="160" cy="150" r="28" fill="${C.black}"/>
    `)}
  </svg>`,
  { title: 'Bauhaus A', category: 'pattern', colors: [C.white, C.red, C.blue, C.yellow, C.black] }
)

svgToPng(
  'bauhaus-2',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <circle cx="120" cy="104" r="70" fill="${C.yellow}"/>
      <rect x="50" y="34" width="70" height="140" fill="${C.red}"/>
      <circle cx="150" cy="80" r="40" fill="${C.blue}"/>
      <rect x="130" y="120" width="70" height="50" fill="${C.green}"/>
    `)}
  </svg>`,
  { title: 'Bauhaus B', category: 'pattern', colors: [C.black, C.yellow, C.red, C.blue, C.green] }
)

// Pixel style
svgToPng(
  'pixel-face',
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    ${circleClip(`
      <rect width="${W}" height="${H}" fill="${C.black}"/>
      <!-- face -->
      <rect x="60" y="40" width="120" height="100" fill="${C.yellow}"/>
      <rect x="80" y="65" width="20" height="20" fill="${C.black}"/>
      <rect x="140" y="65" width="20" height="20" fill="${C.black}"/>
      <rect x="90" y="105" width="60" height="15" fill="${C.black}"/>
      <rect x="85" y="100" width="10" height="10" fill="${C.black}"/>
      <rect x="145" y="100" width="10" height="10" fill="${C.black}"/>
    `)}
  </svg>`,
  { title: 'Pixel Face', category: 'minimal', colors: [C.black, C.yellow] }
)

async function main() {
  await mkdir(OUT, { recursive: true })
  const catalog = []

  for (const wp of wallpapers) {
    const pngPath = join(OUT, `${wp.name}.png`)
    await sharp(Buffer.from(wp.svg)).png().toFile(pngPath)

    catalog.push({
      id: wp.name,
      title: wp.meta.title,
      category: wp.meta.category,
      colors: wp.meta.colors,
      file: `wallpapers/${wp.name}.png`,
      width: W,
      height: H,
    })
    console.log('✓', wp.name)
  }

  await writeFile(
    join(__dirname, '../src/data/wallpapers.json'),
    JSON.stringify(catalog, null, 2)
  )
  console.log(`\nGenerated ${catalog.length} wallpapers → public/wallpapers/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
