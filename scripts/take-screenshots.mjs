/** Dev helper: captures the Astryx-native views and AI modal from the preview server. */
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
await page.screenshot({ path: `${outDir}/home-desktop.png` });

for (const view of ['Automation', 'Discover']) {
  await page
    .getByRole('button', { name: new RegExp(`^${view}`) })
    .first()
    .click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/${view.toLowerCase()}-desktop.png` });
}

await page.getByRole('button', { name: 'Home', exact: true }).first().click();
await page.getByRole('button', { name: 'Ask Voxelle AI' }).first().click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/ai-modal.png` });
await page.keyboard.press('Escape');

await page.setViewportSize({ width: 375, height: 812 });
await page.reload();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/home-phone.png` });

await browser.close();
console.log('screenshots saved');
