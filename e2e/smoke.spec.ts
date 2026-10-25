import { test, expect } from '@playwright/test';

/**
 * End-to-end smoke suite against the production build (vite preview).
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Start every test from the pristine demo home (state persists in localStorage).
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('dashboard boots with rooms, tiles, cameras, and scenes', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Cameras' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Entry', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Backyard' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Front Doorbell/ })).toBeVisible();
  expect(await page.getByRole('button', { name: /Sconces/ }).count()).toBeGreaterThan(0);
});

test('toggling a light tile updates its state', async ({ page }) => {
  const sconces = page.getByRole('button', { name: /Sconces, Entry: 80%/ });
  await expect(sconces).toBeVisible();

  await sconces.click();

  await expect(page.getByRole('button', { name: /Sconces, Entry: Off/ })).toBeVisible();
});

test('device detail modal opens and closes with Escape', async ({ page }) => {
  const detailTrigger = page.getByTitle(/fine-grained controls/i).first();
  await detailTrigger.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(/Entry • LIGHTS/i);

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('AI assistant executes a built-in rule engine command', async ({ page }) => {
  await page.getByRole('button', { name: /Voxelle AI/i }).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder(/Ask Voxelle/i).fill('lock the front door');
  await dialog.getByRole('button', { name: 'Send command' }).click();

  await expect(dialog.getByText(/Front Door has been securely locked/i)).toBeVisible();

  // The action actually mutated home state
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /Front Door, Entry: Locked/ })).toBeVisible();
});

test('generated automations survive navigation (regression)', async ({ page }) => {
  // Accessible name includes the count badge ("Automation 4"), so match by prefix
  const automationNav = page.getByRole('button', { name: /^Automation/ }).first();
  await automationNav.click();
  await expect(page.getByRole('heading', { name: 'Automations' })).toBeVisible();

  await page.getByPlaceholder(/pool gate opens/i).fill('Turn on backyard lights after sunset');
  await page.getByRole('button', { name: 'Generate' }).click();
  await expect(page.getByText('Turn on backyard lights after sunset')).toBeVisible();

  // Navigate away and back — the generated automation must still be there
  await page.getByRole('button', { name: 'Home', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();
  await automationNav.click();

  await expect(page.getByText('Turn on backyard lights after sunset')).toBeVisible();
  // Sidebar badge reflects the derived count (5 = 4 seeds + 1 generated)
  await expect(page.locator('.sidebar-count-badge').first()).toHaveText('5');
});

test('chassis switcher renders the iPhone frame with tab bar', async ({ page }) => {
  await page.getByRole('button', { name: 'iPhone' }).click();

  await expect(page.locator('.device-frame-iphone')).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
});
