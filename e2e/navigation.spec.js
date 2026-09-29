import { test, expect } from '@playwright/test';

test.describe('Navigation & Direct Deep Linking', () => {
  test('should navigate from home to visualizer and return via navbar logo', async ({ page }) => {
    await page.goto('/');

    // Click on Bubble Sort card
    await page.getByRole('link', { name: 'Bubble Sort', exact: true }).click();
    await expect(page).toHaveURL(/\/sorting\/bubble/);
    await expect(page.getByRole('heading', { level: 1, name: 'Bubble Sort' })).toBeVisible();

    // Click navbar brand logo to return home
    await page.getByLabel('Algorithm Visualizer home').click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Algorithm');
  });

  test('should navigate to visualizer and return home using the topbar Back button', async ({ page }) => {
    await page.goto('/searching/binary');
    await expect(page.getByRole('heading', { level: 1, name: 'Binary Search' })).toBeVisible();

    const backButton = page.getByRole('button', { name: /Back to home/i });
    await expect(backButton).toBeVisible();
    await backButton.click();

    await expect(page).toHaveURL('/');
  });

  test('should support direct URL deep linking and page refresh', async ({ page }) => {
    await page.goto('/linked-list/reverse');
    await expect(page.getByRole('heading', { level: 1, name: /Reverse/i })).toBeVisible();

    // Reload page
    await page.reload();
    await expect(page.getByRole('heading', { level: 1, name: /Reverse/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();
  });

  test('should support browser Back and Forward history navigation', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Linear Search', exact: true }).click();
    await expect(page).toHaveURL(/\/searching\/linear/);

    await page.getByRole('button', { name: /Back to home/i }).click();
    await expect(page).toHaveURL('/');

    // Browser back
    await page.goBack();
    await expect(page).toHaveURL(/\/searching\/linear/);
    await expect(page.getByRole('heading', { level: 1, name: 'Linear Search' })).toBeVisible();

    // Browser forward
    await page.goForward();
    await expect(page).toHaveURL('/');
  });

  test('should directly open Theory tab when navigating with ?tab=theory', async ({ page }) => {
    await page.goto('/sorting/merge?tab=theory');

    // Theory mode button should be active
    const theoryTabBtn = page.getByRole('tab', { name: /Theory & Notes/i });
    await expect(theoryTabBtn).toHaveAttribute('aria-selected', 'true');

    // Theory section should be visible
    await expect(page.getByText('What is Merge Sort?')).toBeVisible();
    await expect(page.getByText('Complexity & Mathematical Analysis')).toBeVisible();
  });

  test('should render 404 Not Found page on invalid route and recover via Go Home action', async ({ page }) => {
    await page.goto('/invalid-nonexistent-algorithm-route');
    await expect(page.getByRole('heading', { level: 1, name: /Page Not Found/i })).toBeVisible();
    await expect(page.getByText('404 Error')).toBeVisible();

    // Click Go Home action
    await page.getByRole('link', { name: /Go to Home/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Algorithm');
  });
});
