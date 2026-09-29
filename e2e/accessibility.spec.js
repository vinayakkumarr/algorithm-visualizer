import { test, expect } from '@playwright/test';

test.describe('Accessibility & Keyboard Interaction Invariants', () => {
  test('should support keyboard navigation across Home search and algorithm links', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.getByPlaceholder('Search for algorithms…');
    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    // Type via keyboard
    await page.keyboard.type('Merge');
    await expect(page.getByRole('link', { name: 'Merge Sort', exact: true })).toBeVisible();

    // Tab to clear button or result link
    await page.keyboard.press('Tab');
    const focusedEl = page.locator(':focus');
    await expect(focusedEl).toBeVisible();
  });

  test('should operate visualizer playback controls using keyboard Enter/Space', async ({ page }) => {
    await page.goto('/sorting/bubble');

    const startBtn = page.getByRole('button', { name: 'Start', exact: true });
    await startBtn.focus();
    await expect(startBtn).toBeFocused();

    // Press Enter to start
    await page.keyboard.press('Enter');

    const pauseBtn = page.getByRole('button', { name: 'Pause', exact: true });
    await expect(pauseBtn).toBeVisible();

    // Focus pause button and press Space/Enter
    await pauseBtn.focus();
    await page.keyboard.press('Space');
    await expect(page.getByRole('button', { name: /Resume|Start/i })).toBeVisible();

    // Focus Reset and press Enter
    const resetBtn = page.getByRole('button', { name: 'Reset', exact: true });
    await resetBtn.focus();
    await page.keyboard.press('Enter');

    await expect(page.locator('.vl__step-counter')).toContainText(/Step 0/i);
  });

  test('should possess accessible ARIA roles, labels, and live region announcements', async ({ page }) => {
    await page.goto('/sorting/bubble');

    // Navigation and tablist ARIA
    await expect(page.getByRole('tablist', { name: /view mode/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /Visualizer/i })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tab', { name: /Theory & Notes/i })).toHaveAttribute('aria-selected', 'false');

    // Slider ARIA labels
    await expect(page.getByRole('slider', { name: 'Speed' })).toBeVisible();
    await expect(page.getByRole('slider', { name: 'Array Size' })).toBeVisible();
    await expect(page.getByRole('slider', { name: 'Step timeline' })).toBeVisible();

    // Live counter ARIA
    const stepCounter = page.locator('.vl__step-counter');
    await expect(stepCounter).toHaveAttribute('aria-live', 'polite');
  });
});
