// Creates placeholder images for every path used in /data, so the design can be previewed.
// It never overwrites a file that already exists, so your real photos are safe.
// Run: npm run placeholders   (add -- --force to regenerate everything)

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
const force = process.argv.includes("--force");

const { members } = await import("../data/members.ts");
const { teams } = await import("../data/teams.ts");
const { alumni } = await import("../data/alumni.ts");
const { sponsors } = await import("../data/sponsors.ts");
const { events } = await import("../data/events.ts");

const ACCENT = {
  teal: "#03828E", deep: "#03575F", yellow: "#FFC83D", coral: "#FF6F61",
  blue: "#3D7DD8", sea: "#5FB89A", violet: "#8E6CCF",
};
const teamColor = Object.fromEntries(teams.map((t) => [t.slug, ACCENT[t.accent]]));
let made = 0;

async function write(relPath, svg, format = "jpg") {
  const file = join(pub, relPath);
  if (!force && existsSync(file)) return;
  mkdirSync(dirname(file), { recursive: true });
  const img = sharp(Buffer.from(svg));
  await (format === "png" ? img.png() : img.jpeg({ quality: 82 })).toFile(file);
  made++;
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

function personSvg(_name, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000">
    <rect width="800" height="1000" fill="#EEF5F6"/>
    <rect width="800" height="1000" fill="${color}" opacity="0.18"/>
    <circle cx="400" cy="330" r="135" fill="${color}" opacity="0.45"/>
    <path d="M110 1000 C110 700 240 540 400 540 C560 540 690 700 690 1000 Z" fill="${color}" opacity="0.45"/>
  </svg>`;
}

// Soft blurred colour shapes on a dark base: reads like an out-of-focus event photo
function sceneSvg(w, h, _label, color, seed = 0) {
  const second = ["#03828E", "#3D7DD8", "#8E6CCF", "#5FB89A", "#FF6F61"][seed % 5];
  const r = (n) => Math.round(n);
  const dots = [];
  for (let y = 0; y < h; y += 28) for (let x = (y / 28) % 2 ? 14 : 0; x < w; x += 28) dots.push(`<circle cx="${x}" cy="${y}" r="1.6"/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${r(Math.min(w, h) / 9)}"/></filter></defs>
    <rect width="${w}" height="${h}" fill="#10262B"/>
    <g filter="url(#b)">
      <circle cx="${r(w * (0.22 + (seed % 3) * 0.08))}" cy="${r(h * 0.38)}" r="${r(Math.min(w, h) * 0.42)}" fill="${color}" opacity="0.95"/>
      <circle cx="${r(w * 0.82)}" cy="${r(h * (0.2 + (seed % 2) * 0.15))}" r="${r(Math.min(w, h) * 0.34)}" fill="${second}" opacity="0.8"/>
      <circle cx="${r(w * 0.62)}" cy="${r(h * 0.92)}" r="${r(Math.min(w, h) * 0.26)}" fill="#FFC83D" opacity="0.55"/>
      <circle cx="${r(w * 0.08)}" cy="${r(h * 0.95)}" r="${r(Math.min(w, h) * 0.2)}" fill="#FFFFFF" opacity="0.18"/>
    </g>
    <g fill="#FFFFFF" opacity="0.07">${dots.join("")}</g>
  </svg>`;
}

function heroSvg() {
  const w = 2400, h = 1350;
  const people = [];
  const rows = [
    { y: 820, n: 11, r: 70, o: 0.35 },
    { y: 960, n: 12, r: 78, o: 0.5 },
    { y: 1110, n: 10, r: 88, o: 0.7 },
  ];
  for (const row of rows) {
    const gap = w / row.n;
    for (let i = 0; i < row.n; i++) {
      const cx = gap / 2 + i * gap + (row.y % 3) * 20;
      people.push(`<g opacity="${row.o}" fill="#E6F1F2">
        <circle cx="${cx}" cy="${row.y - row.r * 1.6}" r="${row.r * 0.7}"/>
        <path d="M${cx - row.r * 1.3} ${h} C${cx - row.r * 1.3} ${row.y - row.r * 0.6} ${cx + row.r * 1.3} ${row.y - row.r * 0.6} ${cx + row.r * 1.3} ${h} Z"/>
      </g>`);
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#03575F"/>
    <rect y="0" width="${w}" height="600" fill="#03828E" opacity="0.35"/>
    ${people.join("")}
  </svg>`;
}

function logoSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
    <defs><path id="ring" d="M256 256 m-178 0 a178 178 0 1 1 356 0 a178 178 0 1 1 -356 0"/></defs>
    <circle cx="256" cy="256" r="250" fill="#03828E"/>
    <circle cx="256" cy="256" r="232" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <circle cx="256" cy="256" r="140" fill="#03575F"/>
    <text font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#FFFFFF" letter-spacing="4">
      <textPath href="#ring" startOffset="2%">NUML COMPUTER SCIENCE SOCIETY</textPath>
    </text>
    <text x="256" y="282" font-family="Arial, sans-serif" font-size="78" font-weight="800" text-anchor="middle" fill="#FFFFFF">NCSS</text>
  </svg>`;
}

function sponsorSvg(name, i) {
  const colors = ["#03575F", "#FF6F61", "#3D7DD8", "#8E6CCF"];
  const c = colors[i % colors.length];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="240">
    <rect x="30" y="70" width="100" height="100" rx="${i % 2 ? 50 : 16}" fill="${c}"/>
    <text x="155" y="140" font-family="Arial, sans-serif" font-size="44" font-weight="700" fill="#32434C">${esc(name)}</text>
  </svg>`;
}

// Brand + hero
await write("brand/logo.png", logoSvg(), "png");
await write("images/hero/team.jpg", heroSvg());

// Current members
for (const p of members) {
  if (p.photo) await write(p.photo, personSvg(p.name, teamColor[p.teamSlug] ?? ACCENT.teal));
}

// Alumni
for (const y of alumni) {
  for (const p of [y.president, y.vicePresident, ...y.leads]) {
    if (p.photo) await write(p.photo, personSvg(p.name, teamColor[p.teamSlug] ?? ACCENT.teal));
  }
}

// Sponsors
for (const [i, s] of sponsors.entries()) await write(s.logo, sponsorSvg(s.name, i), "png");

// Team tile backgrounds
for (const [i, t] of teams.entries()) {
  if (t.coverImage) await write(t.coverImage.src, sceneSvg(1400, 1000, t.name, ACCENT[t.accent], i));
}

// Events
const sceneColors = Object.values(ACCENT).filter((c) => c !== ACCENT.yellow);
for (const [i, e] of events.entries()) {
  const color = sceneColors[i % sceneColors.length];
  await write(e.coverImage.src, sceneSvg(1600, 1000, `${e.title}: cover`, color, i));
  for (const [k, g] of e.gallery.entries()) {
    const portrait = k % 3 === 2;
    await write(g.src, sceneSvg(portrait ? 900 : 1200, portrait ? 1200 : 800, `${e.title}: photo ${k + 1}`, sceneColors[(i + k + 1) % sceneColors.length], i + k));
  }
}

console.log(`Placeholders: ${made} image(s) created.`);
