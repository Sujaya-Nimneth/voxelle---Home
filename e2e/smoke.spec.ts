import { test, expect } from '@playwright/test';

/**
 * End-to-end smoke suite against the production build (vite preview).
 * Selectors target Astryx component semantics, not legacy CSS classes.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  // Start every test from the pristine demo home (state persists in localStorage).
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('dashboard boots with house status, rooms, cameras and scenes', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'My Home', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'House status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Cameras' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Entry', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Backyard' })).toBeVisible();
  await expect(page.getByRole('img', { name: /Front Doorbell/ })).toBeVisible();
  await expect(page.getByRole('switch', { name: 'Sconces power' })).toBeVisible();
});

test('toggling a device switch updates its state', async ({ page }) => {
  const sconces = page.getByRole('switch', { name: 'Sconces power' });
  await expect(sconces).toBeVisible();

  await sconces.click();

  // The row description changes from 80% to Off, and the header count drops.
  await expect(page.getByText('11 of 20 devices on')).toBeVisible();
  await expect(page.getByRole('button', { name: /Sconces Off/ })).toBeVisible();
});

test('device detail dialog opens and closes with Escape', async ({ page }) => {
  await page.getByRole('button', { name: 'Open Sconces controls' }).click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText('Sconces');
  await expect(dialog.getByRole('slider', { name: /Brightness/i })).toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('AI assistant executes a built-in rule engine command', async ({ page }) => {
  await page.getByRole('button', { name: 'Ask Voxelle AI' }).first().click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();

  await dialog.getByPlaceholder(/Ask Voxelle/i).fill('lock the front door');
  await dialog.getByRole('button', { name: 'Send command' }).click();

  await expect(dialog.getByText(/Front Door has been securely locked/i)).toBeVisible();

  // The action actually mutated home state.
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /Front Door Locked/ })).toBeVisible();
});

test('generated automations survive navigation (regression)', async ({ page }) => {
  const automationNav = page.getByRole('button', { name: /^Automation/ }).first();
  await automationNav.click();
  await expect(page.getByRole('heading', { name: 'Automations', exact: true })).toBeVisible();

  await page.getByPlaceholder(/pool gate opens/i).fill('Turn on backyard lights after sunset');
  await page.getByRole('button', { name: 'Generate' }).click();
  await expect(page.getByText('Turn on backyard lights after sunset')).toBeVisible();

  // Navigate away and back — the generated automation must still be there.
  await page.getByRole('button', { name: 'Home', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Scenes' })).toBeVisible();
  await automationNav.click();

  await expect(page.getByText('Turn on backyard lights after sunset')).toBeVisible();
  // The sidebar count badge reflects the derived count (5 = 4 seeds + 1 generated).
  await expect(automationNav).toContainText('5');
});

test('phone width shows the mobile navigation drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.reload();

  await expect(page.getByRole('heading', { name: 'My Home', exact: true })).toBeVisible();
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await expect(toggle).toBeVisible();
  await toggle.click();

  const drawer = page.getByRole('dialog', { name: 'Navigation' });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByRole('button', { name: /^Automation/ })).toBeVisible();
});
