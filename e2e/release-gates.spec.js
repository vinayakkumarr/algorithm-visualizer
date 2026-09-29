import { test, expect } from '@playwright/test';

const COMING_SOON_ROUTES = [
  { path: '/stack/balanced-parens', name: 'Balanced Parentheses' },
  { path: '/stack/next-greater', name: 'Next Greater Element' },
  { path: '/queue/circular', name: 'Circular Queue' },
  { path: '/queue/priority', name: 'Priority Queue' },
  { path: '/linked-list/doubly-insert-delete', name: 'Doubly Linked List' },
  { path: '/tree/min-heap', name: 'Min Heap' },
  { path: '/tree/max-heap', name: 'Max Heap' },
  { path: '/graph/dijkstra', name: "Dijkstra's Algorithm" },
  { path: '/graph/bellman-ford', name: 'Bellman-Ford Algorithm' },
];

test.describe('Coming Soon & Release-Gated Protection Invariants', () => {
  for (const item of COMING_SOON_ROUTES) {
    test(`should route ${item.name} to TheoryTopicPage and protect unreleased visualizer`, async ({ page }) => {
      await page.goto(item.path);

      // Default view is Theory
      await expect(page.getByText('Concept Guide')).toBeVisible();

      // Click "Visualizer (Soon)" tab
      const vizSoonTab = page.getByRole('tab', { name: /Visualizer \(Soon\)/i });
      await expect(vizSoonTab).toBeVisible();
      await vizSoonTab.click();

      // Should display "Canvas in Development" card
      await expect(page.locator('.ttp-coming-soon-card')).toBeVisible();
      await expect(page.getByText('Canvas in Development')).toBeVisible();
      await expect(page.getByText(/Coming Soon/i)).toBeVisible();

      // Critical: Ensure no interactive visualizer controls are exposed
      await expect(page.getByRole('button', { name: 'Start', exact: true })).not.toBeVisible();
      await expect(page.getByLabel('Step timeline')).not.toBeVisible();
    });
  }

  test('Doubly Linked List release gate constraint must remain strictly locked', async ({ page }) => {
    await page.goto('/linked-list/doubly-insert-delete');

    // Page title
    await expect(page).toHaveTitle(/Doubly Linked List/i);

    // Theory guide is presented
    await expect(page.getByText(/Doubly Linked List/i).first()).toBeVisible();

    // Visualizer tab stays locked behind Coming Soon card
    await page.getByRole('tab', { name: /Visualizer \(Soon\)/i }).click();
    await expect(page.getByText(/Interactive Animation for Doubly Linked List/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Read Complete.*Theory/i })).toBeVisible();

    // No interactive Doubly controls available
    await expect(page.getByRole('button', { name: /Insert at Head/i })).not.toBeVisible();
  });

  test('Home page catalog strictly marks all 9 unreleased features with SOON badges', async ({ page }) => {
    await page.goto('/');

    const soonCards = page.locator('.algo-card--soon');
    await expect(soonCards).toHaveCount(9);

    for (let i = 0; i < 9; i++) {
      await expect(soonCards.nth(i).locator('.algo-card__soon-badge')).toHaveText('SOON');
    }
  });
});
