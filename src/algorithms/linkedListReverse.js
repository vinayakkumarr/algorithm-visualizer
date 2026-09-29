/**
 * linkedListReverse.js — Step generator for 3-pointer in-place linked list reversal.
 *
 * Implements the standard 3-pointer algorithm:
 *   prev = null
 *   curr = head
 *   while curr != null:
 *     next = curr.next
 *     curr.next = prev
 *     prev = curr
 *     curr = next
 *
 * Complexity: O(n) Time, O(1) Space.
 */

import {
  cloneList,
  getOrderedNodes,
} from "./linkedListEngine.js";

export const PSEUDOCODE_REVERSE = [
  "procedure reverse(head):",
  "  prev = null; curr = head",
  "  while curr != null:",
  "    next = curr.next",
  "    curr.next = prev",
  "    prev = curr; curr = next",
  "  head = prev; return head",
];

export function generateReverseSteps(baseList) {
  const list = cloneList(baseList);
  if (list.size === 0) return [];

  const steps = [];
  const initialOrdered = getOrderedNodes(list);
  const oldHeadId = list.headId;
  const oldTailId = list.tailId;

  // Frame 0: Initialization
  steps.push({
    nodes: list.nodes,
    orderedNodes: initialOrdered,
    pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: null, CURR: list.headId, NEXT: null },
    highlightNodes: { [list.headId]: "current" },
    activeLine: 1,
    pseudocode: PSEUDOCODE_REVERSE,
    narrative: `Initialized pointers: prev = NULL, curr = Head (node with value ${list.nodes[list.headId]?.value}).`,
    isTerminal: false,
  });

  let prevId = null;
  let currId = list.headId;

  while (currId) {
    const currNode = list.nodes[currId];
    const nextId = currNode.next;
    const nextNodeVal = nextId ? list.nodes[nextId]?.value : "NULL";

    // Sub-step 1: Save next = curr.next
    steps.push({
      nodes: list.nodes,
      orderedNodes: initialOrdered,
      pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: prevId, CURR: currId, NEXT: nextId },
      highlightNodes: { [currId]: "current", ...(prevId ? { [prevId]: "visited" } : {}) },
      activeLine: 3,
      pseudocode: PSEUDOCODE_REVERSE,
      narrative: `Saved pointer: next = curr.next (referencing node ${nextNodeVal}) to prevent losing the unreversed tail.`,
      isTerminal: false,
    });

    // Sub-step 2: Reverse pointer curr.next = prev
    currNode.next = prevId;

    steps.push({
      nodes: list.nodes,
      orderedNodes: initialOrdered,
      pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: prevId, CURR: currId, NEXT: nextId },
      highlightNodes: { [currId]: "new", ...(prevId ? { [prevId]: "visited" } : {}) },
      activeLine: 4,
      pseudocode: PSEUDOCODE_REVERSE,
      narrative: `Reversed pointer: curr.next → ${prevId ? `prev (${list.nodes[prevId]?.value})` : "NULL"}.`,
      isTerminal: false,
    });

    // Sub-step 3: Advance prev = curr, curr = next
    prevId = currId;
    currId = nextId;

    steps.push({
      nodes: list.nodes,
      orderedNodes: initialOrdered,
      pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: prevId, CURR: currId, NEXT: currId ? list.nodes[currId]?.next : null },
      highlightNodes: { [prevId]: "visited", ...(currId ? { [currId]: "current" } : {}) },
      activeLine: 5,
      pseudocode: PSEUDOCODE_REVERSE,
      narrative: `Advanced pointers: prev = node (${list.nodes[prevId]?.value}), curr = ${currId ? `node (${list.nodes[currId]?.value})` : "NULL"}.`,
      isTerminal: false,
    });
  }

  // Final Frame: New Head = prev (old tail), New Tail = oldHead
  const finalList = {
    nodes: list.nodes,
    headId: prevId,
    tailId: oldHeadId,
    size: list.size,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId },
    highlightNodes: {},
    activeLine: 6,
    pseudocode: PSEUDOCODE_REVERSE,
    narrative: `Reversal complete! Updated Head = node (${finalList.nodes[finalList.headId]?.value}), Tail = node (${finalList.nodes[finalList.tailId]?.value}) in O(n) time and O(1) auxiliary space.`,
    isTerminal: true,
    finalList,
  });

  return steps;
}
