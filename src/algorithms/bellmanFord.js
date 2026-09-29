/**
 * bellmanFord.js — Step generator for Bellman-Ford Shortest Path & Negative Cycle Detection.
 *
 * Computes shortest paths from a single source node to all other nodes in a weighted graph.
 * Capable of handling negative edge weights and detecting negative weight cycles.
 *
 * Time Complexity: O(V * E)
 * Space Complexity: O(V) auxiliary distance storage
 */

export const BF_GRAPH_EDGES = [
  { u: 0, v: 1, weight: 4 },
  { u: 0, v: 2, weight: 2 },
  { u: 1, v: 3, weight: -1 },
  { u: 2, v: 1, weight: 1 },
  { u: 2, v: 4, weight: 5 },
  { u: 3, v: 4, weight: 2 },
  { u: 3, v: 5, weight: 3 },
  { u: 4, v: 5, weight: -2 },
];

export const PSEUDOCODE_BELLMAN_FORD = [
  "procedure BellmanFord(V, E, start):",
  "  dist[v] = ∞ for all v in V; dist[start] = 0",
  "  for pass = 1 to |V| - 1:",
  "    for each edge (u, v, w) in E:",
  "      if dist[u] + w < dist[v]:",
  "        dist[v] = dist[u] + w; prev[v] = u",
  "  for each edge (u, v, w) in E (Pass |V|):",
  "    if dist[u] + w < dist[v]:",
  "      return 'Negative Weight Cycle Detected!'",
  "  return dist, prev",
];

export function generateBellmanFordSteps(edges = BF_GRAPH_EDGES, nodeCount = 6, start = 0) {
  const steps = [];
  const dist = {};
  const prev = {};

  for (let i = 0; i < nodeCount; i++) {
    dist[i] = Infinity;
    prev[i] = null;
  }
  dist[start] = 0;

  const makeSnapshot = (passNum, activeEdge = null, narrative = "", activeLine = 1, isCycle = false) => ({
    dist: { ...dist },
    prev: { ...prev },
    pass: passNum,
    activeEdge,
    hasNegativeCycle: isCycle,
    activeLine,
    pseudocode: PSEUDOCODE_BELLMAN_FORD,
    narrative,
    isTerminal: false,
  });

  // Frame 0: Init
  steps.push({
    ...makeSnapshot(0, null, `Initialized distances: dist[${start}] = 0, all others = ∞. Starting ${nodeCount - 1} relaxation passes.`, 1),
  });

  // |V| - 1 Passes
  for (let pass = 1; pass <= nodeCount - 1; pass++) {
    let anyUpdateInPass = false;

    steps.push({
      ...makeSnapshot(pass, null, `--- Starting Relaxation Pass ${pass} of ${nodeCount - 1} ---`, 2),
    });

    for (const edge of edges) {
      const { u, v, weight } = edge;

      if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
        const oldDist = dist[v];
        dist[v] = dist[u] + weight;
        prev[v] = u;
        anyUpdateInPass = true;

        steps.push({
          ...makeSnapshot(
            pass,
            edge,
            `Pass ${pass}: Relaxed edge (${u} → ${v}, w=${weight}): dist[${v}] updated from ${oldDist === Infinity ? "∞" : oldDist} → ${dist[v]}.`,
            5
          ),
        });
      }
    }

    if (!anyUpdateInPass) {
      steps.push({
        ...makeSnapshot(
          pass,
          null,
          `Pass ${pass}: No distances changed during this pass. Early termination: shortest paths converged!`,
          6
        ),
      });
      break;
    }
  }

  // Pass |V|: Negative Cycle Check
  let hasNegativeCycle = false;
  steps.push({
    ...makeSnapshot(nodeCount, null, `Running Pass ${nodeCount} to check for Negative Weight Cycles...`, 6),
  });

  for (const edge of edges) {
    const { u, v, weight } = edge;
    if (dist[u] !== Infinity && dist[u] + weight < dist[v]) {
      hasNegativeCycle = true;
      steps.push({
        ...makeSnapshot(
          nodeCount,
          edge,
          `⚠️ Negative Weight Cycle Detected! Edge (${u} → ${v}, w=${weight}) can still reduce dist[${v}] below ${dist[v]}.`,
          8,
          true
        ),
        isTerminal: true,
      });
      break;
    }
  }

  if (!hasNegativeCycle) {
    steps.push({
      ...makeSnapshot(
        nodeCount,
        null,
        `Bellman-Ford Complete! No negative cycles detected. All ${nodeCount} shortest paths are optimal.`,
        9
      ),
      isTerminal: true,
    });
  }

  return steps;
}
