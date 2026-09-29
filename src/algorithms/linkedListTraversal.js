/**
 * linkedListTraversal.js — Step recorder for linked list traversal using normalized engine.
 *
 * Each frame provides:
 * {
 *   nodes: Array<ListNode>,
 *   currentIdx: number | null,
 *   pointers: { HEAD, CURR },
 *   visited: Set<number | string>,
 *   atNull: boolean,
 *   activeLine: number,
 *   narrative: string
 * }
 */

import {
  createListFromValues,
  getOrderedNodes,
  generateRandomList as engineGenerateRandomList,
  speedToMs as engineSpeedToMs,
} from "./linkedListEngine.js";

export const PSEUDOCODE = [
  "procedure traverse(head):",
  "  current = head",
  "  while current != null:",
  "    visit(current.value)",
  "    current = current.next",
  "  reached null (end of list)",
];

export function generateSteps(inputList) {
  // Support either raw array of nodes or normalized listState
  const orderedNodes = Array.isArray(inputList)
    ? inputList
    : getOrderedNodes(inputList);

  if (!orderedNodes || orderedNodes.length === 0) return [];

  const steps = [];
  const visited = new Set();
  const headId = orderedNodes[0]?.id;

  // Frame 0: INIT (current = head)
  steps.push({
    nodes: orderedNodes,
    currentIdx: null,
    pointers: { HEAD: headId, CURR: null },
    visited: new Set(),
    atNull: false,
    activeLine: 1,
    narrative: `Initialized traversal pointer: current = head (node with value ${orderedNodes[0]?.value}).`,
  });

  for (let i = 0; i < orderedNodes.length; i++) {
    const node = orderedNodes[i];
    const nextNode = orderedNodes[i + 1];

    // Frame: VISIT node i
    steps.push({
      nodes: orderedNodes,
      currentIdx: i,
      pointers: { HEAD: headId, CURR: node.id },
      visited: new Set(visited),
      atNull: false,
      activeLine: 3,
      narrative: `Visiting current node [${i}] with value ${node.value}. Processed payload.`,
    });

    visited.add(node.id);
    visited.add(i); // backward compatibility

    // Frame: ADVANCE POINTER
    if (i < orderedNodes.length - 1) {
      steps.push({
        nodes: orderedNodes,
        currentIdx: i,
        pointers: { HEAD: headId, CURR: node.id, NEXT: nextNode.id },
        visited: new Set(visited),
        atNull: false,
        activeLine: 4,
        narrative: `Advancing pointer: current = current.next (moving from ${node.value} to ${nextNode.value}).`,
      });
    }
  }

  // Frame: AT NULL
  steps.push({
    nodes: orderedNodes,
    currentIdx: null,
    pointers: { HEAD: headId, CURR: null },
    visited: new Set(visited),
    atNull: true,
    activeLine: 5,
    narrative: `Pointer reached NULL. Traversal complete! All ${orderedNodes.length} nodes visited in O(n) time.`,
  });

  return steps;
}

/** Generate a list of `size` nodes with random values in [10, 99]. */
export function generateRandomList(size) {
  const normalized = engineGenerateRandomList(size);
  return getOrderedNodes(normalized);
}

/** Map speed level (1–10) → animation delay in ms. */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
