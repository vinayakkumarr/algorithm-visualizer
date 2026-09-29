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
  "procedure DFS(G, startNode):",
  "  create stack S, push startNode",
  "  while S is not empty:",
  "    current = S.pop()",
  "    if current is not visited:",
  "      mark current as visited",
  "      for each unvisited neighbour of current:",
  "        S.push(neighbour)",
];

/**
 * generateSteps(graph, start)
 * Iterative DFS from `start`.  Returns frames:
 * { visited: Set<nodeId>, stack: nodeId[], current: nodeId|null, activeLine: number, narrative: string }
 *
 * Neighbours are pushed in reverse order so the first neighbour is
 * on top of the stack (natural left-to-right exploration).
 * The displayed `stack` is filtered to exclude already-visited nodes.
 */
export function generateSteps(graph = GRAPH, start = 0) {
  const steps   = [];
  const visited  = new Set();
  const stack    = [start];
  const onStack  = new Set([start]);

  // INIT
  steps.push({
    visited:    new Set(),
    stack:      [start],
    current:    null,
    activeLine: 1,
    narrative:  `Pushed start node ${start} onto the DFS stack.`,
  });

  while (stack.length > 0) {
    const current = stack.pop();

    // Skip if already visited (can happen with undirected graphs)
    if (visited.has(current)) continue;

    visited.add(current);

    // Push unvisited, not-on-stack neighbours in reverse order
    const neighbours = [...(graph[current] ?? [])].reverse();
    for (const neighbour of neighbours) {
      if (!visited.has(neighbour) && !onStack.has(neighbour)) {
        stack.push(neighbour);
        onStack.add(neighbour);
      }
    }

    const currentStack = [...stack].filter(n => !visited.has(n));

    // VISIT step
    steps.push({
      visited:    new Set(visited),
      // Filter stack display: only show nodes not yet fully visited
      stack:      currentStack,
      current,
      activeLine: 5,
      narrative:  `Popped and visited node ${current}. Stack top: ${currentStack.length > 0 ? currentStack[currentStack.length - 1] : "empty"}.`,
    });
  }

  // DONE
  steps.push({
    visited:    new Set(visited),
    stack:      [],
    current:    null,
    activeLine: 2,
    narrative:  `Stack is empty. DFS traversal complete! Visited ${visited.size} reachable nodes.`,
  });

  return steps;
}

/** Map speed level (1–10) → animation delay in ms. */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
