/** Shared fixed graph used by both BFS and DFS visualizers. */
export const GRAPH = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 5],
  5: [2, 4],
};

export const PSEUDOCODE = [
  "procedure BFS(G, startNode):",
  "  create queue Q, enqueue startNode",
  "  mark startNode as visited",
  "  while Q is not empty:",
  "    current = Q.dequeue()",
  "    for each unvisited neighbour of current:",
  "      mark neighbour as visited",
  "      Q.enqueue(neighbour)",
];

/**
 * generateSteps(graph, start)
 * BFS from `start`.  Returns frames:
 * { visited: Set<nodeId>, queue: nodeId[], current: nodeId|null, activeLine: number, narrative: string }
 *
 * Frame timing: recorded AFTER dequeuing the node and enqueuing its neighbours.
 * So `visited` already includes `current`.
 */
export function generateSteps(graph = GRAPH, start = 0) {
  const steps  = [];
  const visited  = new Set();
  const queue    = [];
  const enqueued = new Set();

  // INIT
  queue.push(start);
  enqueued.add(start);
  steps.push({
    visited:    new Set(),
    queue:      [start],
    current:    null,
    activeLine: 1,
    narrative:  `Enqueued starting node ${start} into the BFS queue.`,
  });

  while (queue.length > 0) {
    const current = queue.shift();
    visited.add(current);

    const newlyEnqueued = [];
    // Enqueue unvisited, not-yet-enqueued neighbours
    for (const neighbour of (graph[current] ?? [])) {
      if (!enqueued.has(neighbour)) {
        enqueued.add(neighbour);
        queue.push(neighbour);
        newlyEnqueued.push(neighbour);
      }
    }

    const neighbourText = newlyEnqueued.length > 0
      ? `Enqueued unvisited neighbours: [${newlyEnqueued.join(", ")}].`
      : "No new unvisited neighbours.";

    // VISIT step
    steps.push({
      visited:    new Set(visited),
      queue:      [...queue],
      current,
      activeLine: 4,
      narrative:  `Dequeued node ${current}. ${neighbourText} Queue: [${queue.join(", ") || "empty"}].`,
    });
  }

  // DONE
  steps.push({
    visited:    new Set(visited),
    queue:      [],
    current:    null,
    activeLine: 3,
    narrative:  `Queue is empty. BFS traversal complete! Visited ${visited.size} reachable nodes.`,
  });

  return steps;
}

/** Map speed level (1–10) → animation delay in ms. */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
