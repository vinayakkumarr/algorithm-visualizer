import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Release Gates & Coming Soon Isolation', () => {
  const homePath = path.resolve(__dirname, '../../src/pages/Home.jsx');
  const appPath = path.resolve(__dirname, '../../src/App.jsx');

  const homeContent = fs.readFileSync(homePath, 'utf8');
  const appContent = fs.readFileSync(appPath, 'utf8');

  const COMING_SOON_TOPICS = [
    { name: 'Balanced Parentheses', path: '/stack/balanced-parens' },
    { name: 'Next Greater Element', path: '/stack/next-greater' },
    { name: 'Circular Queue', path: '/queue/circular' },
    { name: 'Priority Queue', path: '/queue/priority' },
    { name: 'Doubly Linked List — Insertion & Deletion', path: '/linked-list/doubly-insert-delete' },
    { name: 'Min Heap', path: '/tree/min-heap' },
    { name: 'Max Heap', path: '/tree/max-heap' },
    { name: "Dijkstra's", path: '/graph/dijkstra' },
    { name: 'Bellman-Ford', path: '/graph/bellman-ford' },
  ];

  it('preserves Coming Soon / built: false status for all 9 unreleased features in Home.jsx', () => {
    COMING_SOON_TOPICS.forEach(({ path }) => {
      // Find the card definition in Home.jsx
      const regex = new RegExp(`path:\\s*"${path}"[^}]*`, 'g');
      const match = homeContent.match(regex);
      expect(match, `Could not find route ${path} in Home.jsx`).not.toBeNull();

      const cardDef = match[0];
      // Must NOT contain `built: true`
      expect(cardDef.includes('built: true'), `Topic ${path} was unexpectedly marked built: true`).toBe(false);
    });
  });

  it('routes all 9 Coming Soon paths to TheoryTopicPage in App.jsx', () => {
    COMING_SOON_TOPICS.forEach(({ path }) => {
      const regex = new RegExp(`<Route\\s+path="${path}"\\s+element={<TheoryTopicPage\\s*/>}\\s*/>`);
      expect(regex.test(appContent), `Route ${path} is not mapped to TheoryTopicPage in App.jsx`).toBe(true);
    });
  });

  it('strictly protects Doubly Linked List as Coming Soon', () => {
    const doublyRoute = '/linked-list/doubly-insert-delete';
    expect(homeContent.includes(`path: "${doublyRoute}", built: true`)).toBe(false);
    expect(appContent.includes(`path="${doublyRoute}" element={<TheoryTopicPage />}`)).toBe(true);
  });
});
