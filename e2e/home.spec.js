import { test, expect } from '@playwright/test';

test.describe('Home Page & Algorithm Catalog', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should render hero section, branding, and application title', async ({ page }) => {
    await expect(page).toHaveTitle(/Algorithm Visualizer/i);

    const heroHeading = page.getByRole('heading', { level: 1 });
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).toContainText('Algorithm');
    await expect(heroHeading).toContainText('Visualizer');

    await expect(
      page.getByText('Where algorithmic logic meets visual intuition.')
    ).toBeVisible();
  });

  test('should render all primary algorithm category cards', async ({ page }) => {
    const categoryNames = ['Array', 'Stack', 'Queue', 'Linked List', 'Tree', 'Graph'];

    for (const cat of categoryNames) {
      const catHeading = page.getByRole('heading', { level: 2, name: cat });
      await expect(catHeading).toBeVisible();
    }

    // Verify key algorithms are displayed
    await expect(page.getByRole('link', { name: 'Bubble Sort', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Binary Search', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Push & Pop', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Enqueue & Dequeue', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'BST Operations', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'BFS', exact: true })).toBeVisible();
  });

  test('should filter algorithms dynamically in real-time and clear search', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search for algorithms…');
    await expect(searchInput).toBeVisible();

    // Type search query
    await searchInput.fill('Quick');

    // Quick Sort should be visible
    await expect(page.getByRole('link', { name: 'Quick Sort', exact: true })).toBeVisible();

    // Unrelated algorithms should be filtered out
    await expect(page.getByRole('link', { name: 'Bubble Sort', exact: true })).not.toBeVisible();
    await expect(page.getByRole('link', { name: 'BFS', exact: true })).not.toBeVisible();

    // Live search count summary
    await expect(page.getByText(/Showing results for/i)).toBeVisible();

    // Clear search
    const clearButton = page.getByLabel('Clear search');
    await clearButton.click();

    await expect(searchInput).toHaveValue('');
    await expect(page.getByRole('link', { name: 'Bubble Sort', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'BFS', exact: true })).toBeVisible();
  });

  test('should display empty search feedback when query has no matches', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search for algorithms…');
    await searchInput.fill('nonexistent-query-404');

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByText(/No results for/i)).toBeVisible();
    await expect(page.getByText(/Try “sort”, “search”, “bfs”, or “tree”/i)).toBeVisible();
  });

  test('should display SOON badges on all 9 unreleased features', async ({ page }) => {
    const soonBadges = page.locator('.algo-card__soon-badge');
    await expect(soonBadges).toHaveCount(9);

    // Verify representative coming soon items are flagged
    await expect(page.getByText('Balanced Parentheses')).toBeVisible();
    await expect(page.getByText('Circular Queue')).toBeVisible();
    await expect(page.getByText('Dijkstra\'s')).toBeVisible();
  });

  test('should toggle theme between dark and light mode', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: 'Toggle theme' });
    await expect(themeBtn).toBeVisible();

    // Get initial theme attribute
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));

    // Toggle theme
    await themeBtn.click();

    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(newTheme).not.toBe(initialTheme);
  });
});
