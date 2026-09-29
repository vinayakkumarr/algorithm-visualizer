import { describe, it, expect } from 'vitest';
import { generateSteps as generateBFSSteps } from '../../src/algorithms/bfs';
import { generateSteps as generateDFSSteps } from '../../src/algorithms/dfs';
import {
  generateDijkstraSteps,
  WEIGHTED_GRAPH,
} from '../../src/algorithms/dijkstra';
import {
  generateBellmanFordSteps,
  BF_GRAPH_EDGES,
} from '../../src/algorithms/bellmanFord';

describe('Graph Algorithm Engines', () => {
  describe('Breadth-First Search (BFS)', () => {
    it('traverses all reachable nodes layer-by-layer', () => {
      const steps = generateBFSSteps(undefined, 0);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.visited.size).toBe(6);
      expect(finalFrame.queue.length).toBe(0);
    });
  });

  describe('Depth-First Search (DFS)', () => {
    it('traverses all reachable nodes using stack-based exploration', () => {
      const steps = generateDFSSteps(undefined, 0);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.visited.size).toBe(6);
      expect(finalFrame.stack.length).toBe(0);
    });
  });

  describe("Dijkstra's Shortest Path Algorithm", () => {
    it('computes shortest path distances from source node 0', () => {
      const steps = generateDijkstraSteps(WEIGHTED_GRAPH, 0);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      const { dist } = finalFrame;

      expect(dist[0]).toBe(0);
      expect(dist[1]).toBe(4);
      expect(dist[2]).toBe(2);
      expect(dist[4]).toBe(5); // 0 -> 2 -> 4 (2 + 3 = 5)
      expect(dist[3]).toBe(7); // 0 -> 2 -> 4 -> 3 (2 + 3 + 2 = 7)
      expect(dist[5]).toBe(6); // 0 -> 2 -> 4 -> 5 (2 + 3 + 1 = 6)
    });
  });

  describe('Bellman-Ford Shortest Path & Negative Cycle Detection', () => {
    it('computes shortest path distances with negative edge weights', () => {
      const steps = generateBellmanFordSteps(BF_GRAPH_EDGES, 6, 0);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      const { dist, hasNegativeCycle } = finalFrame;

      expect(hasNegativeCycle).toBe(false);
      expect(dist[0]).toBe(0);
      expect(dist[1]).toBe(3);  // 0 -> 2 -> 1 (2 + 1 = 3)
      expect(dist[2]).toBe(2);
      expect(dist[3]).toBe(2);  // 0 -> 2 -> 1 -> 3 (2 + 1 - 1 = 2)
      expect(dist[4]).toBe(4);  // 0 -> 2 -> 1 -> 3 -> 4 (2 + 1 - 1 + 2 = 4)
      expect(dist[5]).toBe(2);  // 0 -> 2 -> 1 -> 3 -> 4 -> 5 (4 - 2 = 2)
    });

    it('detects negative-weight cycles', () => {
      const negativeCycleEdges = [
        { u: 0, v: 1, weight: 1 },
        { u: 1, v: 2, weight: -2 },
        { u: 2, v: 0, weight: -1 }, // Cycle 0 -> 1 -> 2 -> 0 has cost -2
      ];

      const steps = generateBellmanFordSteps(negativeCycleEdges, 3, 0);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.hasNegativeCycle).toBe(true);
    });
  });
});
