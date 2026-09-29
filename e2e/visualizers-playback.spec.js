import { test, expect } from '@playwright/test';

test.describe('Visualizer Playback & Transport Controls', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/sorting/bubble');
  });

  test('should display visualizer shell, initial state, and active Start button', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Bubble Sort' })).toBeVisible();

    // Step counter shows Step 0 / total
    await expect(page.locator('.vl__step-counter')).toContainText(/Step 0/i);

    // Start button is available and enabled
    const startBtn = page.getByRole('button', { name: 'Start' });
    await expect(startBtn).toBeVisible();
    await expect(startBtn).toBeEnabled();

    // Reset button is visible
    await expect(page.getByRole('button', { name: 'Reset' })).toBeVisible();

    // Nav buttons are disabled at step 0
    await expect(page.getByRole('button', { name: /Jump to first step/i })).toBeDisabled();
    await expect(page.getByRole('button', { name: /Previous step/i })).toBeDisabled();
  });

  test('should control playback: Start, Pause, Resume, and Step Forward/Back', async ({ page }) => {
    const startBtn = page.getByRole('button', { name: 'Start' });
    await startBtn.click();

    // Becomes Pause button
    const pauseBtn = page.getByRole('button', { name: 'Pause' });
    await expect(pauseBtn).toBeVisible();

    // Pause animation
    await pauseBtn.click();

    // Step Forward
    const nextBtn = page.getByRole('button', { name: /Next step/i });
    await nextBtn.click();

    // After stepping forward, resume button is active
    const resumeBtn = page.getByRole('button', { name: 'Resume' });
    await expect(resumeBtn).toBeVisible();

    // Previous button should now be enabled
    const prevBtn = page.getByRole('button', { name: /Previous step/i });
    await expect(prevBtn).toBeEnabled();
    await prevBtn.click();

    // Jump to First step
    const firstBtn = page.getByRole('button', { name: /Jump to first step/i });
    if (await firstBtn.isEnabled()) {
      await firstBtn.click();
      await expect(firstBtn).toBeDisabled();
    }
  });

  test('should scrub timeline slider and update step counter', async ({ page }) => {
    // Start playback to generate steps
    const startBtn = page.getByRole('button', { name: 'Start' });
    await startBtn.click();

    // Pause
    const pauseBtn = page.getByRole('button', { name: 'Pause' });
    await pauseBtn.click();

    // Locate timeline scrubber
    const scrubber = page.getByLabel('Step timeline');
    await expect(scrubber).toBeVisible();

    // Read max steps
    const maxStr = await scrubber.getAttribute('max');
    const maxVal = Number(maxStr) || 10;

    // Set scrubber to mid-range
    const targetVal = Math.floor(maxVal / 2);
    await scrubber.fill(String(targetVal));

    // Counter should display updated step
    await expect(page.locator('.vl__step-counter')).toContainText(`Step ${targetVal}`);
  });

  test('should reset visualization state cleanly when Reset is clicked', async ({ page }) => {
    // Jump to last step or step forward
    const jumpEndBtn = page.getByRole('button', { name: /Jump to last step/i });
    if (await jumpEndBtn.isEnabled()) {
      await jumpEndBtn.click();
    } else {
      // Start and pause
      await page.getByRole('button', { name: 'Start' }).click();
      await page.getByRole('button', { name: 'Pause' }).click();
    }

    // Click Reset
    const resetBtn = page.getByRole('button', { name: 'Reset' });
    await resetBtn.click();

    // Should return to initial step state
    await expect(page.locator('.vl__step-counter')).toContainText(/Step 0/i);
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('should open Custom Array modal, select preset, and apply to visualizer', async ({ page }) => {
    const customArrBtn = page.getByRole('button', { name: 'Custom Array' }).first();
    await expect(customArrBtn).toBeVisible();
    await customArrBtn.click();

    // Modal dialog appears
    const modal = page.getByRole('dialog');
    await expect(modal).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Custom Array Builder' })).toBeVisible();

    // Select "Reversed" preset
    await page.getByRole('button', { name: 'Reversed' }).click();

    // Apply to visualizer
    const applyBtn = page.getByRole('button', { name: /Apply to Visualizer/i });
    await expect(applyBtn).toBeEnabled();
    await applyBtn.click();

    // Modal should close
    await expect(modal).not.toBeVisible();

    // Visualizer remains in valid state and can start
    const startBtn = page.getByRole('button', { name: 'Start' });
    await expect(startBtn).toBeEnabled();
  });

  test('should adjust Speed and Array Size sliders', async ({ page }) => {
    const speedSlider = page.getByLabel('Speed');
    await expect(speedSlider).toBeVisible();
    await speedSlider.fill('8');
    await expect(speedSlider).toHaveValue('8');

    const sizeSlider = page.getByLabel('Array Size');
    await expect(sizeSlider).toBeVisible();
    await sizeSlider.fill('15');
    await expect(sizeSlider).toHaveValue('15');
  });
});
