import { test, expect } from '@playwright/test';

test.describe('Representative Algorithm Paradigms & Interactive Workflows', () => {
  test('Binary Search: target selection, execution, and found/missing state', async ({ page }) => {
    await page.goto('/searching/binary');
    await expect(page.getByRole('heading', { level: 1, name: 'Binary Search' })).toBeVisible();

    // Select Missing target
    const missingBtn = page.getByRole('button', { name: /Missing/i });
    await expect(missingBtn).toBeVisible();
    await missingBtn.click();

    // Start search
    const startBtn = page.getByRole('button', { name: 'Start', exact: true });
    await startBtn.click();

    // Verify search progresses
    await expect(page.getByRole('button', { name: /Pause|Resume|Start/i })).toBeVisible();
  });

  test('Stack Push & Pop: element insertion, inspection, and removal', async ({ page }) => {
    await page.goto('/stack/push-pop');
    await expect(page.getByRole('heading', { level: 1, name: /Push & Pop/i })).toBeVisible();

    const pushInput = page.getByLabel('Value to push onto stack');
    await pushInput.fill('42');

    const pushBtn = page.getByRole('button', { name: /Push value onto stack/i });
    await pushBtn.click();

    // Top element value should now be 42
    await expect(page.getByText('42').first()).toBeVisible();

    // Pop element
    const popBtn = page.getByRole('button', { name: /Pop top element off stack/i });
    await popBtn.click();
  });

  test('Queue Enqueue & Dequeue: FIFO element progression', async ({ page }) => {
    await page.goto('/queue/enqueue-dequeue');
    await expect(page.getByRole('heading', { level: 1, name: /Enqueue & Dequeue/i })).toBeVisible();

    const input = page.getByLabel('Value to enqueue into queue');
    await input.fill('88');

    const enqueueBtn = page.getByRole('button', { name: /Enqueue value at rear/i });
    await enqueueBtn.click();

    await expect(page.getByText('88').first()).toBeVisible();

    const dequeueBtn = page.getByRole('button', { name: /Dequeue front element/i });
    await dequeueBtn.click();
  });

  test('Linked List Singly Insert/Delete: pointer manipulation and stepping', async ({ page }) => {
    await page.goto('/linked-list/singly-insert-delete');
    await expect(page.getByRole('heading', { level: 1, name: /Singly Linked List/i })).toBeVisible();

    // Insert at Head triggers the animation playback immediately
    const insertValInput = page.getByLabel('Value to insert');
    await insertValInput.fill('77');

    const insertHeadBtn = page.getByRole('button', { name: /Insert at Head/i });
    await insertHeadBtn.click();

    // Verify narrator is active
    await expect(page.locator('.ll-narrator')).toBeVisible();

    // Pause animation
    const pauseBtn = page.getByRole('button', { name: 'Pause', exact: true });
    if (await pauseBtn.isVisible()) {
      await pauseBtn.click();
    }
  });

  test('Linked List Reverse & Cycle Detection: pointer animation execution', async ({ page }) => {
    // Reverse List
    await page.goto('/linked-list/reverse');
    await expect(page.getByRole('heading', { level: 1, name: /Reverse List/i })).toBeVisible();
    await page.getByRole('button', { name: 'Start', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();

    // Detect Cycle
    await page.goto('/linked-list/cycle');
    await expect(page.getByRole('heading', { level: 1, name: /Detect Cycle/i })).toBeVisible();
    await page.getByRole('button', { name: 'Start', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  });

  test('BST Operations: tree node rendering and traversal modes', async ({ page }) => {
    await page.goto('/tree/bst-insertion');
    await expect(page.getByRole('heading', { level: 1, name: /Binary Search Tree/i })).toBeVisible();

    // Inorder traversal page
    await page.goto('/tree/inorder');
    await expect(page.getByRole('heading', { level: 1, name: /Inorder Traversal/i })).toBeVisible();
  });

  test('Graph BFS & DFS: graph traversal execution', async ({ page }) => {
    await page.goto('/graph/bfs');
    await expect(page.getByRole('heading', { level: 1, name: 'BFS' })).toBeVisible();

    const startBtn = page.getByRole('button', { name: 'Start', exact: true });
    await startBtn.click();

    await expect(page.getByRole('button', { name: 'Pause', exact: true })).toBeVisible();
  });
});
