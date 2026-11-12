/**
 * Dev helper: captures screenshots of the Astryx-native UI into docs/screenshots
 * as optimized WebP files referenced by README.md.
 *
 * Requires the preview server to be running (`npm run build && npm run preview`).
 * Run with: npm run screenshots
 */
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const BASE_URL = process.env.SCREENSHOT_BASE_URL ?? 'http://localhost:4173';
const OUT_DIR = new URL('../docs/screenshots/', import.meta.url);
const WEBP_QUALITY = 82;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });

const shot = async (name) => {
  const png = await page.screenshot({ type: 'png' });
  const webp = await sharp(png).webp({ quality: WEBP_QUALITY }).toBuffer();
  await writeFile(new URL(`${name}.webp`, OUT_DIR), webp);
  console.log(`✓ ${name}.webp (${(webp.byteLength / 1024).toFixed(0)} kB)`);
};

await mkdir(OUT_DIR, { recursive: true });
await page.goto(BASE_URL);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForTimeout(800);

// 1. Home dashboard (desktop)
await shot('home-desktop');

// 2. Device detail dialog (Astryx Dialog + Slider + Switch)
await page.getByRole('button', { name: 'Open Sconces controls' }).click();
await page.waitForTimeout(300);
await shot('device-detail');
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

// 3. Automation view
await page
  .getByRole('button', { name: /^Automation/ })
  .first()
  .click();
await page.waitForTimeout(300);
await shot('automations-desktop');

// 4. Discover view
await page
  .getByRole('button', { name: /^Discover/ })
  .first()
  .click();
await page.waitForTimeout(300);
await shot('discover-desktop');

// 5. AI assistant dialog (over the Home dashboard)
await page.getByRole('button', { name: 'Home', exact: true }).first().click();
await page.waitForTimeout(300);
await page.getByRole('button', { name: 'Ask Voxelle AI' }).first().click();
await page.waitForTimeout(400);
await shot('ai-assistant');
await page.keyboard.press('Escape');
await page.waitForTimeout(200);

// 6. Home dashboard (phone)
await page.setViewportSize({ width: 375, height: 812 });
await page.goto(BASE_URL);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForTimeout(500);
await shot('home-phone');

await browser.close();
console.log('screenshots saved to docs/screenshots/');
