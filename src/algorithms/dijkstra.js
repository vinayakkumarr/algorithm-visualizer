/**
 * dijkstra.js — Step generator for Dijkstra's Shortest Path Algorithm on Weighted Graphs.
 *
 * Finds the shortest path from a starting node to all other nodes in a non-negative weighted graph.
 * Time Complexity: O((V + E) log V) with Priority Queue (or O(V^2) with array)
 * Space Complexity: O(V) auxiliary distance and predecessor storage
 */

export const WEIGHTED_GRAPH = {
  0: [{ node: 1, weight: 4 }, { node: 2, weight: 2 }],
  1: [{ node: 0, weight: 4 }, { node: 3, weight: 5 }, { node: 4, weight: 10 }],
  2: [{ node: 0, weight: 2 }, { node: 4, weight: 3 }, { node: 5, weight: 8 }],
  3: [{ node: 1, weight: 5 }, { node: 4, weight: 2 }, { node: 5, weight: 6 }],
  4: [{ node: 1, weight: 10 }, { node: 2, weight: 3 }, { node: 3, weight: 2 }, { node: 5, weight: 1 }],
  5: [{ node: 2, weight: 8 }, { node: 3, weight: 6 }, { node: 4, weight: 1 }],
};

export const WEIGHTED_EDGES = [
  { u: 0, v: 1, weight: 4 },
  { u: 0, v: 2, weight: 2 },
  { u: 1, v: 3, weight: 5 },
  { u: 1, v: 4, weight: 10 },
  { u: 2, v: 4, weight: 3 },
  { u: 2, v: 5, weight: 8 },
  { u: 3, v: 4, weight: 2 },
  { u: 3, v: 5, weight: 6 },
  { u: 4, v: 5, weight: 1 },
];

export const PSEUDOCODE_DIJKSTRA = [
  "procedure Dijkstra(G, start):",
  "  dist[v] = ∞ for all v; dist[start] = 0",
  "  PQ = new MinPriorityQueue(); PQ.insert(start, 0)",
  "  while not PQ.isEmpty():",
  "    u = PQ.extractMin()",
  "    if visited[u]: continue",
  "    visited[u] = true",
  "    for each neighbour (v, weight) of u:",
  "      if dist[u] + weight < dist[v]:",
  "        dist[v] = dist[u] + weight; prev[v] = u",
  "        PQ.insert(v, dist[v])",
];

export function generateDijkstraSteps(graph = WEIGHTED_GRAPH, start = 0) {
  const steps = [];
  const nodes = Object.keys(graph).map(Number);
  const dist = {};
  const prev = {};
  const visited = new Set();
  const pq = [{ node: start, dist: 0 }];

  nodes.forEach((n) => {
    dist[n] = Infinity;
    prev[n] = null;
  });
  dist[start] = 0;

  const makeSnapshot = (current = null, activeEdge = null, narrative = "", activeLine = 1) => ({
    dist: { ...dist },
    prev: { ...prev },
    visited: new Set(visited),
    pq: pq.map((item) => ({ ...item })),
    current,
    activeEdge,
    activeLine,
    pseudocode: PSEUDOCODE_DIJKSTRA,
    narrative,
    isTerminal: false,
  });

  // Frame 0: Initialization
  steps.push({
    ...makeSnapshot(null, null, `Initialized distances: dist[${start}] = 0, all others = ∞. Enqueued start node ${start}.`, 1),
  });

  while (pq.length > 0) {
    // Sort to extract min
    pq.sort((a, b) => a.dist - b.dist);
    const { node: u, dist: uDist } = pq.shift();

    if (visited.has(u)) {
      continue;
    }

    steps.push({
      ...makeSnapshot(u, null, `Extracted node ${u} with minimum tentative distance ${uDist}.`, 4),
    });

    visited.add(u);

    steps.push({
      ...makeSnapshot(u, null, `Marked node ${u} as settled (visited). Exploring outgoing edges.`, 6),
    });

    const neighbours = graph[u] || [];

    for (const { node: v, weight } of neighbours) {
      if (visited.has(v)) continue;

      const alt = dist[u] + weight;
      const oldDist = dist[v];
      const activeEdge = { u, v, weight };

      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
        pq.push({ node: v, dist: alt });

        steps.push({
          ...makeSnapshot(
            u,
            activeEdge,
            `Relaxed edge (${u} → ${v}, w=${weight}): Found shorter path! dist[${v}] updated from ${oldDist === Infinity ? "∞" : oldDist} → ${alt}.`,
            9
          ),
        });
      } else {
        steps.push({
          ...makeSnapshot(
            u,
            activeEdge,
            `Inspected edge (${u} → ${v}, w=${weight}): Path via ${u} (${alt}) is not shorter than existing dist[${v}] (${dist[v]}). No update.`,
            8
          ),
        });
      }
    }
  }

  // Final Terminal Frame
  steps.push({
    ...makeSnapshot(null, null, `Dijkstra's Algorithm Complete! All reachable nodes settled with optimal shortest paths.`, 10),
    isTerminal: true,
  });

  return steps;
}
