import { test, expect } from '@playwright/test';

test.describe('Theory & Pseudocode Interactive Reader', () => {
  test('should render complete academic theory layout, complexity, and worked examples', async ({ page }) => {
    await page.goto('/sorting/bubble?tab=theory');

    // Hero & Title
    await expect(page.getByRole('heading', { level: 1, name: 'Bubble Sort' })).toBeVisible();
    await expect(page.getByText('What is Bubble Sort?')).toBeVisible();

    // Mental Model
    await expect(page.getByText('Mental Model & Visual Representation')).toBeVisible();

    // Core Invariants
    await expect(page.getByText('Core Invariants & Principles')).toBeVisible();

    // Step-by-Step Mechanics
    await expect(page.getByText('Step-by-Step Execution Mechanics')).toBeVisible();

    // Worked Trace
    await expect(page.getByText('Worked Execution Trace')).toBeVisible();

    // Complexity Grid
    await expect(page.getByText('Complexity & Mathematical Analysis')).toBeVisible();
    await expect(page.getByText('Best Case', { exact: true })).toBeVisible();
    await expect(page.getByText('Worst Case', { exact: true })).toBeVisible();
  });

  test('should toggle seamlessly between Visualizer canvas and Theory mode', async ({ page }) => {
    await page.goto('/sorting/bubble');

    // Switch to Theory
    const theoryTab = page.getByRole('tab', { name: /Theory & Notes/i });
    await theoryTab.click();

    await expect(page).toHaveURL(/tab=theory/);
    await expect(page.getByText('What is Bubble Sort?')).toBeVisible();

    // Switch back to Visualizer
    const openVizBtn = page.getByRole('button', { name: /Open Visualizer/i });
    if (await openVizBtn.isVisible()) {
      await openVizBtn.click();
    } else {
      await page.getByRole('tab', { name: /Visualizer/i }).click();
    }

    await expect(page).toHaveURL(/\/sorting\/bubble$/);
    await expect(page.locator('.vl__step-counter')).toContainText(/Step 0/i);
  });

  test('should switch operations in multi-operation Pseudocode Viewer', async ({ page }) => {
    await page.goto('/linked-list/singly-insert-delete?tab=theory');

    const pseudoHeading = page.getByText(/Pseudocode & Algorithmic Specification/i);
    await expect(pseudoHeading).toBeVisible();

    // Locate operation tabs
    const pseudoTabs = page.locator('.ts-pseudo-tab');
    const tabCount = await pseudoTabs.count();
    expect(tabCount).toBeGreaterThan(1);

    // Initial operation text
    const initialCode = await page.locator('.ts-pseudo-code').innerText();

    // Click second operation tab
    await pseudoTabs.nth(1).click();
    const updatedCode = await page.locator('.ts-pseudo-code').innerText();

    expect(updatedCode).not.toEqual(initialCode);
  });

  test('should copy pseudocode and display copied confirmation feedback', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});

    await page.goto('/sorting/quick?tab=theory');

    const copyBtn = page.getByRole('button', { name: /Copy/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    await expect(page.getByText('Copied')).toBeVisible();
  });
});
