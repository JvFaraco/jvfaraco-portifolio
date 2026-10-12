const { chromium } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
(async () => {
  const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });
  const folder = path.resolve(__dirname, '../.preview'); fs.mkdirSync(folder, { recursive: true });
  for (const [name, width, height] of [['desktop', 1440, 1000], ['mobile', 390, 844]]) {
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    await page.goto('http://127.0.0.1:4173/jvfaraco-portifolio/');
    await page.screenshot({ path: path.join(folder, name + '-hero.png') });
    await page.screenshot({ path: path.join(folder, name + '-dark.png'), fullPage: true });
    await page.getByRole('button', { name: 'Ativar tema claro' }).click();
    await page.screenshot({ path: path.join(folder, name + '-light.png'), fullPage: true });
    await page.locator('#processo').screenshot({ path: path.join(folder, name + '-process.png') });
    await page.getByRole('button', { name: 'Explorar caso: Validador de O.S. com IA' }).click();
    await page.screenshot({ path: path.join(folder, name + '-case.png') });
    await page.close();
  }
  await browser.close(); console.log('Captured desktop/mobile: dark, light and case study.');
})();
