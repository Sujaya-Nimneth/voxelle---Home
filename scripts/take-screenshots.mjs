/** Dev helper: captures chassis + AI modal screenshots from the preview server. */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:4173');
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForTimeout(800);

const outDir = '/tmp/voxelle-shots';
mkdirSync(outDir, { recursive: true });
await page.screenshot({ path: `${outDir}/mac-dashboard.png` });

await page.getByRole('button', { name: /Voxelle AI/i }).first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/ai-modal.png` });
await page.keyboard.press('Escape');

await page.getByRole('button', { name: 'iPhone' }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/iphone-chassis.png` });

await page.getByRole('button', { name: 'iPad' }).click();
await page.waitForTimeout(600);
await page.screenshot({ path: `${outDir}/ipad-chassis.png` });

await browser.close();
console.log('screenshots saved');
