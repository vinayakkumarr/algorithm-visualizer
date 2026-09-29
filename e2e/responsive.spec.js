import { test, expect } from '@playwright/test';

test.describe('Responsive Viewport Usability', () => {
  test('Desktop Viewport (1280x800): full visualizer canvas and transport bar', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/sorting/bubble');

    await expect(page.getByRole('heading', { level: 1, name: 'Bubble Sort' })).toBeVisible();
    await expect(page.locator('.vl__canvas')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('Tablet Viewport (768x1024): responsive grid and accessible controls', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.getByPlaceholder('Search for algorithms…')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Array' })).toBeVisible();

    // Navigate to visualizer
    await page.getByRole('link', { name: 'Bubble Sort', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('Mobile Viewport (375x667): single-column layout and reachable transport buttons', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Hero and search bar
    await expect(page.getByPlaceholder('Search for algorithms…')).toBeVisible();

    // Open visualizer on mobile
    await page.goto('/sorting/bubble');
    await expect(page.getByRole('heading', { level: 1, name: 'Bubble Sort' })).toBeVisible();

    // Transport buttons are rendered and clickable
    const startBtn = page.getByRole('button', { name: 'Start' });
    await expect(startBtn).toBeVisible();
    await startBtn.click();

    const pauseBtn = page.getByRole('button', { name: 'Pause' });
    await expect(pauseBtn).toBeVisible();
    await pauseBtn.click();

    // Reset works on mobile
    const resetBtn = page.getByRole('button', { name: 'Reset' });
    await expect(resetBtn).toBeVisible();
    await resetBtn.click();
  });
});
