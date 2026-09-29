import { test, expect } from '@playwright/test';

test.describe('Error Handling & State Recovery Workflows', () => {
  test('should recover cleanly when resetting after rapid playback actions', async ({ page }) => {
    await page.goto('/sorting/bubble');

    const startBtn = page.getByRole('button', { name: 'Start' });
    await startBtn.click();

    // Fast pause and resume
    const pauseBtn = page.getByRole('button', { name: 'Pause' });
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
    }

    const resetBtn = page.getByRole('button', { name: 'Reset' });
    await resetBtn.click();

    await expect(page.locator('.vl__step-counter')).toContainText(/Step 0/i);
    await expect(page.getByRole('button', { name: 'Start' })).toBeEnabled();
  });

  test('should gracefully handle rapid route switching while playback is active', async ({ page }) => {
    await page.goto('/sorting/bubble');

    // Start playback
    await page.getByRole('button', { name: 'Start' }).click();

    // Navigate to Home immediately
    await page.getByLabel('Algorithm Visualizer home').click();
    await expect(page).toHaveURL('/');

    // Navigate to another algorithm
    await page.getByRole('link', { name: 'Quick Sort', exact: true }).click();
    await expect(page).toHaveURL(/\/sorting\/quick/);
    await expect(page.getByRole('heading', { level: 1, name: 'Quick Sort' })).toBeVisible();

    // Can start new visualizer cleanly
    const startBtn = page.getByRole('button', { name: 'Start' });
    await expect(startBtn).toBeEnabled();
  });

  test('should handle invalid custom array input gracefully with error feedback', async ({ page }) => {
    await page.goto('/sorting/bubble');

    await page.getByRole('button', { name: 'Custom Array' }).first().click();

    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();

    const textarea = page.getByPlaceholder(/45, 12, 85/i);
    await textarea.fill('invalid, text, input, xyz');

    // Error alert pill should be displayed
    await expect(page.getByRole('alert')).toBeVisible();

    // Apply button is disabled
    const applyBtn = page.getByRole('button', { name: /Apply to Visualizer/i });
    await expect(applyBtn).toBeDisabled();

    // Close modal
    await page.getByRole('button', { name: /Cancel/i }).click();
    await expect(modal).not.toBeVisible();

    // Visualizer remains operable
    await expect(page.getByRole('button', { name: 'Start' })).toBeEnabled();
  });
});
