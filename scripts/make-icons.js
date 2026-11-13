// Перерисовывает все иконки из icons/icon.svg: PWA (icons/*.png) и Android (иконки + заставка).
// Нужен Playwright с Chromium: node scripts/make-icons.js
const ROOT = require('path').join(__dirname, '..') + '/';
const { chromium } = require('playwright');
const fs = require('fs');
const pwa = (async () => {
  const svg = fs.readFileSync(ROOT + 'icons/icon.svg', 'utf8');
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [name, size, pad] of [['icon-192.png',192,0],['icon-512.png',512,0],['apple-touch-icon.png',180,0],['icon-maskable-512.png',512,0.12]]) {
    await p.setViewportSize({ width: size, height: size });
    const inner = Math.round(size * (1 - pad * 2));
    await p.setContent(`<html><body style="margin:0;background:linear-gradient(135deg,#fce7f3,#f3e8ff,#dbeafe);display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px">${svg.replace('<svg ', `<svg width="${inner}" height="${inner}" `)}</body></html>`);
    await p.screenshot({ path: ROOT + 'icons/' + name, omitBackground: false });
  }
  await b.close();
})();



const R = ROOT + 'android/app/src/main/res/';
const svg = fs.readFileSync(ROOT + 'icons/icon.svg', 'utf8');
const noBg = svg.replace(/<rect[^>]*\/>/, '');
const BG = 'linear-gradient(135deg,#fce7f3,#ede9fe,#dbeafe)';
pwa.then(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  async function shot(file, w, h, html, transparent) {
    await p.setViewportSize({ width: w, height: h });
    await p.setContent(`<html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;${transparent ? 'background:transparent' : ''}">${html}</body></html>`);
    await p.screenshot({ path: R + file, omitBackground: !!transparent });
  }
  const sized = (s, n) => s.replace('<svg ', `<svg width="${n}" height="${n}" `);
  const dens = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
  for (const [d, k] of Object.entries(dens)) {
    const L = Math.round(48 * k), F = Math.round(108 * k);
    await shot(`mipmap-${d}/ic_launcher.png`, L, L, `<div style="width:${L}px;height:${L}px;border-radius:${L * 0.18}px;background:${BG};display:flex;align-items:center;justify-content:center">${sized(noBg, Math.round(L * 0.86))}</div>`, true);
    await shot(`mipmap-${d}/ic_launcher_round.png`, L, L, `<div style="width:${L}px;height:${L}px;border-radius:50%;background:${BG};display:flex;align-items:center;justify-content:center">${sized(noBg, Math.round(L * 0.8))}</div>`, true);
    await shot(`mipmap-${d}/ic_launcher_foreground.png`, F, F, `<div style="width:${F}px;height:${F}px;display:flex;align-items:center;justify-content:center">${sized(noBg, Math.round(F * 0.62))}</div>`, true);
  }
  const splashes = fs.readdirSync(R).filter(x => x.startsWith('drawable')).filter(x => fs.existsSync(R + x + '/splash.png'));
  const { execSync } = require('child_process');
  for (const dir of splashes) {
    const [w, h] = execSync(`python3 -c "from PIL import Image;print(*Image.open('${R}${dir}/splash.png').size)"`).toString().trim().split(' ').map(Number);
    const n = Math.round(Math.min(w, h) * 0.45);
    await shot(`${dir}/splash.png`, w, h, `<div style="width:${w}px;height:${h}px;background:${BG};display:flex;align-items:center;justify-content:center">${sized(noBg, n)}</div>`);
  }
  await b.close();
  console.log('ok', splashes.length);
});
