/**
 * linkedListCycle.js — Step generator for Floyd's Tortoise & Hare Cycle Detection.
 *
 * Implements 2-pointer relative-speed collision algorithm:
 *   slow = head
 *   fast = head
 *   while fast != null and fast.next != null:
 *     slow = slow.next
 *     fast = fast.next.next
 *     if slow == fast:
 *       return true (Cycle detected!)
 *   return false (Acyclic / NULL reached)
 *
 * Complexity: O(n) Time, O(1) Auxiliary Memory.
 */

import {
  createListFromValues,
  cloneList,
  getOrderedNodes,
  getCycleInfo,
} from "./linkedListEngine.js";

export const PSEUDOCODE_CYCLE = [
  "procedure detectCycle(head):",
  "  slow = head; fast = head",
  "  while fast != null and fast.next != null:",
  "    slow = slow.next",
  "    fast = fast.next.next",
  "    if slow == fast:",
  "      return true (Cycle detected!)",
  "  return false (No cycle — reached NULL)",
];

/**
 * Construct a list with a cycle pointing from tail to a specific target index.
 */
export function createCyclicList(values, targetIndex) {
  const list = createListFromValues(values);
  const ordered = getOrderedNodes(list);
  const clampedIdx = Math.max(0, Math.min(targetIndex, ordered.length - 1));
  const targetNode = ordered[clampedIdx];

  if (list.tailId && targetNode) {
    list.nodes[list.tailId].next = targetNode.id;
  }

  return list;
}

export function generateCycleSteps(baseList) {
  const list = cloneList(baseList);
  if (list.size === 0) return [];

  const steps = [];
  const ordered = getOrderedNodes(list);
  const cycleInfo = getCycleInfo(list);
  const cycleEdge = cycleInfo.hasCycle
    ? {
        fromId: cycleInfo.cycleTailId,
        toId: cycleInfo.cycleEntryId,
        toValue: list.nodes[cycleInfo.cycleEntryId]?.value,
      }
    : null;

  let slowId = list.headId;
  let fastId = list.headId;
  let iteration = 0;

  // Frame 0: Init
  steps.push({
    nodes: list.nodes,
    orderedNodes: ordered,
    pointers: { HEAD: list.headId, SLOW: slowId, FAST: fastId },
    highlightNodes: { [slowId]: "slow" },
    cycleEdge,
    activeLine: 1,
    pseudocode: PSEUDOCODE_CYCLE,
    narrative: `Initialized Floyd's 2-pointer race: slow 🐢 = Head (${list.nodes[slowId]?.value}), fast 🐇 = Head (${list.nodes[fastId]?.value}).`,
    isTerminal: false,
    hasCycle: false,
  });

  const MAX_STEPS = 30; // safety ceiling
  let cycleFound = false;

  while (iteration < MAX_STEPS) {
    iteration++;

    // Check fast bounds
    const fastNode = fastId ? list.nodes[fastId] : null;
    if (!fastNode || !fastNode.next) {
      // Reached NULL -> No cycle
      steps.push({
        nodes: list.nodes,
        orderedNodes: ordered,
        pointers: { HEAD: list.headId, SLOW: slowId, FAST: fastId },
        highlightNodes: slowId ? { [slowId]: "visited" } : {},
        cycleEdge,
        activeLine: 7,
        pseudocode: PSEUDOCODE_CYCLE,
        narrative: `Fast pointer reached NULL terminal after ${iteration} iterations. No cycle exists in this list!`,
        isTerminal: true,
        hasCycle: false,
      });
      return steps;
    }

    // Step 1: Advance slow by 1 step
    const nextSlowId = slowNodeNext(list, slowId);

    // Step 2: Advance fast by 2 steps
    const fastMidId = fastNode.next;
    const fastMidNode = fastMidId ? list.nodes[fastMidId] : null;
    const nextFastId = fastMidNode ? fastMidNode.next : null;

    slowId = nextSlowId;
    fastId = nextFastId;

    const slowVal = slowId ? list.nodes[slowId]?.value : "NULL";
    const fastVal = fastId ? list.nodes[fastId]?.value : "NULL";

    // Frame: Pointers advanced
    const collision = slowId && fastId && slowId === fastId;

    steps.push({
      nodes: list.nodes,
      orderedNodes: ordered,
      pointers: { HEAD: list.headId, SLOW: slowId, FAST: fastId },
      highlightNodes: collision
        ? { [slowId]: "target" }
        : { ...(slowId ? { [slowId]: "slow" } : {}), ...(fastId ? { [fastId]: "fast" } : {}) },
      cycleEdge,
      activeLine: collision ? 5 : 3,
      pseudocode: PSEUDOCODE_CYCLE,
      narrative: collision
        ? `🚨 COLLISION DETECTED! Both slow 🐢 and fast 🐇 landed on node (${slowVal}) at iteration ${iteration}. Cycle existence mathematically proven!`
        : `Iteration ${iteration}: slow advanced 1 node → (${slowVal}), fast advanced 2 nodes → (${fastVal}).`,
      isTerminal: collision,
      hasCycle: collision,
    });

    if (collision) {
      cycleFound = true;
      break;
    }
  }

  return steps;
}

function slowNodeNext(list, nodeId) {
  if (!nodeId || !list.nodes[nodeId]) return null;
  return list.nodes[nodeId].next;
}
