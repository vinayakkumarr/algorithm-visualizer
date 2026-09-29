/**
 * singlyOperations.js — Step generators for Singly Linked List Insertions & Deletions.
 *
 * Implements:
 * 1. Insert Head: O(1)
 * 2. Insert Tail: O(1) (leveraging tailId)
 * 3. Insert Position: O(n) (traversing to position index before splicing)
 * 4. Delete Head: O(1)
 * 5. Delete Tail: O(n) (traversing to predecessor)
 * 6. Delete by Value: O(n) (search first occurrence from head + O(1) unlink)
 */

import {
  createNode,
  cloneList,
  getOrderedNodes,
} from "./linkedListEngine.js";

// PSEUDOCODE DEFINITIONS
export const PSEUDOCODE_INSERT_HEAD = [
  "procedure insertHead(val):",
  "  newNode = new Node(val)",
  "  newNode.next = head",
  "  head = newNode",
  "  if tail == null: tail = newNode",
  "  size = size + 1",
];

export const PSEUDOCODE_INSERT_TAIL = [
  "procedure insertTail(val):",
  "  newNode = new Node(val)",
  "  if head == null:",
  "    head = newNode; tail = newNode",
  "  else:",
  "    tail.next = newNode; tail = newNode",
  "  size = size + 1",
];

export const PSEUDOCODE_INSERT_POS = [
  "procedure insertAtPosition(index, val):",
  "  if index == 0: return insertHead(val)",
  "  newNode = new Node(val)",
  "  curr = head; for i = 0 to index - 2: curr = curr.next",
  "  newNode.next = curr.next",
  "  curr.next = newNode",
  "  if curr == tail: tail = newNode",
];

export const PSEUDOCODE_DELETE_HEAD = [
  "procedure deleteHead():",
  "  if head == null: return underflow",
  "  target = head",
  "  head = head.next",
  "  if head == null: tail = null",
  "  free(target); size = size - 1",
];

export const PSEUDOCODE_DELETE_TAIL = [
  "procedure deleteTail():",
  "  if head == null: return underflow",
  "  if head == tail: head = null; tail = null",
  "  curr = head; while curr.next != tail: curr = curr.next",
  "  curr.next = null; tail = curr",
  "  size = size - 1",
];

export const PSEUDOCODE_DELETE_VALUE = [
  "procedure deleteByValue(target):",
  "  if head.value == target: return deleteHead()",
  "  prev = head; curr = head.next",
  "  while curr != null and curr.value != target:",
  "    prev = curr; curr = curr.next",
  "  if curr != null: prev.next = curr.next",
  "  if curr == tail: tail = prev",
];

// INSERTION STEP GENERATORS
/**
 * 1. Insert Head (O(1))
 */
export function generateInsertHeadSteps(baseList, value) {
  const steps = [];
  const list = cloneList(baseList);
  const newNode = createNode(value);

  // Step 0: Allocate new node in memory
  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedNodes(list),
    floatingNode: newNode,
    pointers: { HEAD: list.headId, TAIL: list.tailId },
    highlightNodes: {},
    activeLine: 1,
    pseudocode: PSEUDOCODE_INSERT_HEAD,
    narrative: `Allocated new Node(${value}) in memory.`,
    isTerminal: false,
  });

  // Step 1: Connect newNode.next = head
  newNode.next = list.headId;
  const intermediateNodes = { ...list.nodes, [newNode.id]: newNode };

  steps.push({
    nodes: intermediateNodes,
    orderedNodes: [newNode, ...getOrderedNodes(list)],
    floatingNode: null,
    pointers: { HEAD: list.headId, NEW_NODE: newNode.id, TAIL: list.tailId },
    highlightNodes: { [newNode.id]: "new" },
    activeLine: 2,
    pseudocode: PSEUDOCODE_INSERT_HEAD,
    narrative: `Connected newNode.next → ${list.headId ? `current Head (${list.nodes[list.headId]?.value})` : "NULL"}.`,
    isTerminal: false,
  });

  // Step 2: Update head pointer = newNode
  const finalList = {
    nodes: intermediateNodes,
    headId: newNode.id,
    tailId: list.tailId || newNode.id,
    size: list.size + 1,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    floatingNode: null,
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId },
    highlightNodes: { [newNode.id]: "visited" },
    activeLine: 3,
    pseudocode: PSEUDOCODE_INSERT_HEAD,
    narrative: `Updated Head = newNode. Insert Head complete in O(1) time! New size: ${finalList.size}.`,
    isTerminal: true,
    finalList,
  });

  return steps;
}

/**
 * 2. Insert Tail (O(1))
 */
export function generateInsertTailSteps(baseList, value) {
  const list = cloneList(baseList);
  if (list.size === 0) {
    return generateInsertHeadSteps(baseList, value);
  }

  const steps = [];
  const newNode = createNode(value);

  // Step 0: Allocate
  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedNodes(list),
    floatingNode: newNode,
    pointers: { HEAD: list.headId, TAIL: list.tailId },
    highlightNodes: { [list.tailId]: "current" },
    activeLine: 1,
    pseudocode: PSEUDOCODE_INSERT_TAIL,
    narrative: `Allocated new Node(${value}) in memory. Current tail is node with value ${list.nodes[list.tailId]?.value}.`,
    isTerminal: false,
  });

  // Step 1: Link tail.next = newNode
  const oldTailId = list.tailId;
  list.nodes[oldTailId].next = newNode.id;
  list.nodes[newNode.id] = newNode;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedNodes(list),
    floatingNode: null,
    pointers: { HEAD: list.headId, TAIL: oldTailId, NEW_NODE: newNode.id },
    highlightNodes: { [oldTailId]: "current", [newNode.id]: "new" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_INSERT_TAIL,
    narrative: `Linked current Tail (${list.nodes[oldTailId].value}).next → new node (${value}).`,
    isTerminal: false,
  });

  // Step 2: Update tailId = newNode.id
  const finalList = {
    nodes: list.nodes,
    headId: list.headId,
    tailId: newNode.id,
    size: list.size + 1,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    floatingNode: null,
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId },
    highlightNodes: { [newNode.id]: "visited" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_INSERT_TAIL,
    narrative: `Updated Tail pointer = newNode. Insert Tail complete in O(1) time! New size: ${finalList.size}.`,
    isTerminal: true,
    finalList,
  });

  return steps;
}

/**
 * 3. Insert at Position (O(n))
 */
export function generateInsertPositionSteps(baseList, position, value) {
  const list = cloneList(baseList);
  const pos = Math.max(0, Math.min(position, list.size));

  if (pos === 0 || list.size === 0) {
    return generateInsertHeadSteps(baseList, value);
  }
  if (pos === list.size) {
    return generateInsertTailSteps(baseList, value);
  }

  const steps = [];
  const newNode = createNode(value);
  const ordered = getOrderedNodes(list);

  // Step 0: Allocate
  steps.push({
    nodes: list.nodes,
    orderedNodes: ordered,
    floatingNode: newNode,
    pointers: { HEAD: list.headId, TAIL: list.tailId, CURR: list.headId },
    highlightNodes: { [list.headId]: "current" },
    activeLine: 2,
    pseudocode: PSEUDOCODE_INSERT_POS,
    narrative: `Target position index: ${pos}. Starting traversal at Head.`,
    isTerminal: false,
  });

  // Step 1..k: Traverse to predecessor (pos - 1)
  let currId = list.headId;
  for (let i = 0; i < pos - 1; i++) {
    currId = list.nodes[currId].next;
    steps.push({
      nodes: list.nodes,
      orderedNodes: ordered,
      floatingNode: newNode,
      pointers: { HEAD: list.headId, TAIL: list.tailId, CURR: currId },
      highlightNodes: { [currId]: "current" },
      activeLine: 3,
      pseudocode: PSEUDOCODE_INSERT_POS,
      narrative: `Traversing: step ${i + 1} of ${pos - 1}. Current predecessor is node [${i + 1}] (${list.nodes[currId]?.value}).`,
      isTerminal: false,
    });
  }

  const predNode = list.nodes[currId];
  const succNodeId = predNode.next;

  // Step: Splice newNode.next = pred.next
  newNode.next = succNodeId;
  list.nodes[newNode.id] = newNode;

  steps.push({
    nodes: list.nodes,
    orderedNodes: ordered,
    floatingNode: newNode,
    pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: predNode.id, NEW_NODE: newNode.id, NEXT: succNodeId },
    highlightNodes: { [predNode.id]: "current", [newNode.id]: "new" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_INSERT_POS,
    narrative: `Splicing: set newNode.next → node (${list.nodes[succNodeId]?.value}) to preserve remainder of list.`,
    isTerminal: false,
  });

  // Step: pred.next = newNode
  predNode.next = newNode.id;
  const finalList = {
    nodes: list.nodes,
    headId: list.headId,
    tailId: list.tailId,
    size: list.size + 1,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    floatingNode: null,
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId, CURR: newNode.id },
    highlightNodes: { [newNode.id]: "visited", [predNode.id]: "visited" },
    activeLine: 5,
    pseudocode: PSEUDOCODE_INSERT_POS,
    narrative: `Connected pred (${predNode.value}).next → newNode (${value}). Splicing complete in O(n) time!`,
    isTerminal: true,
    finalList,
  });

  return steps;
}

// DELETION STEP GENERATORS
/**
 * 4. Delete Head (O(1))
 */
export function generateDeleteHeadSteps(baseList) {
  const list = cloneList(baseList);
  if (list.size === 0) return [];

  const steps = [];
  const oldHeadNode = list.nodes[list.headId];
  const nextHeadId = oldHeadNode.next;

  // Step 0: Identify Head to delete
  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedNodes(list),
    pointers: { HEAD: list.headId, TAIL: list.tailId, CURR: list.headId },
    highlightNodes: { [list.headId]: "target" },
    activeLine: 2,
    pseudocode: PSEUDOCODE_DELETE_HEAD,
    narrative: `Identified Head node (${oldHeadNode.value}) for deletion.`,
    isTerminal: false,
  });

  // Step 1: Advance head pointer to next
  delete list.nodes[oldHeadNode.id];
  const finalList = {
    nodes: list.nodes,
    headId: nextHeadId,
    tailId: nextHeadId === null ? null : list.tailId,
    size: list.size - 1,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId },
    highlightNodes: {},
    activeLine: 3,
    pseudocode: PSEUDOCODE_DELETE_HEAD,
    narrative: `Advanced Head = Head.next. Node (${oldHeadNode.value}) unlinked & deallocated in O(1) time! New size: ${finalList.size}.`,
    isTerminal: true,
    finalList,
  });

  return steps;
}

/**
 * 5. Delete Tail (O(n))
 */
export function generateDeleteTailSteps(baseList) {
  const list = cloneList(baseList);
  if (list.size === 0) return [];
  if (list.size === 1) return generateDeleteHeadSteps(baseList);

  const steps = [];
  const ordered = getOrderedNodes(list);
  const tailNode = list.nodes[list.tailId];

  // Step 0: Start traversal from head to find predecessor of tail
  steps.push({
    nodes: list.nodes,
    orderedNodes: ordered,
    pointers: { HEAD: list.headId, TAIL: list.tailId, CURR: list.headId },
    highlightNodes: { [list.tailId]: "target", [list.headId]: "current" },
    activeLine: 3,
    pseudocode: PSEUDOCODE_DELETE_TAIL,
    narrative: `Deleting tail node (${tailNode.value}). Traversing from Head to locate second-to-last node.`,
    isTerminal: false,
  });

  let currId = list.headId;
  while (list.nodes[currId].next !== list.tailId) {
    currId = list.nodes[currId].next;
    steps.push({
      nodes: list.nodes,
      orderedNodes: ordered,
      pointers: { HEAD: list.headId, TAIL: list.tailId, CURR: currId },
      highlightNodes: { [list.tailId]: "target", [currId]: "current" },
      activeLine: 3,
      pseudocode: PSEUDOCODE_DELETE_TAIL,
      narrative: `Advancing search pointer: currently at node (${list.nodes[currId].value}).`,
      isTerminal: false,
    });
  }

  // Predecessor found
  const predNode = list.nodes[currId];
  predNode.next = null;
  delete list.nodes[tailNode.id];

  const finalList = {
    nodes: list.nodes,
    headId: list.headId,
    tailId: predNode.id,
    size: list.size - 1,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId },
    highlightNodes: { [predNode.id]: "visited" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_DELETE_TAIL,
    narrative: `Set pred (${predNode.value}).next = NULL and updated Tail = pred. Delete Tail complete in O(n) time! New size: ${finalList.size}.`,
    isTerminal: true,
    finalList,
  });

  return steps;
}

/**
 * 6. Delete First Occurrence by Value (O(n))
 */
export function generateDeleteValueSteps(baseList, targetValue) {
  const list = cloneList(baseList);
  const target = Number(targetValue);
  if (list.size === 0) return [];

  if (list.nodes[list.headId].value === target) {
    return generateDeleteHeadSteps(baseList);
  }

  const steps = [];
  const ordered = getOrderedNodes(list);

  // Step 0: Init search
  steps.push({
    nodes: list.nodes,
    orderedNodes: ordered,
    pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: list.headId, CURR: list.nodes[list.headId].next },
    highlightNodes: { [list.headId]: "visited" },
    activeLine: 2,
    pseudocode: PSEUDOCODE_DELETE_VALUE,
    narrative: `Searching for first node with value = ${target}. Initialized prev = Head, curr = Head.next.`,
    isTerminal: false,
  });

  let prevId = list.headId;
  let currId = list.nodes[list.headId].next;
  let found = false;

  while (currId) {
    const currNode = list.nodes[currId];
    if (currNode.value === target) {
      found = true;
      steps.push({
        nodes: list.nodes,
        orderedNodes: ordered,
        pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: prevId, CURR: currId },
        highlightNodes: { [currId]: "target", [prevId]: "current" },
        activeLine: 3,
        pseudocode: PSEUDOCODE_DELETE_VALUE,
        narrative: `Target found! Node (${currNode.value}) matches search value ${target}.`,
        isTerminal: false,
      });
      break;
    }

    steps.push({
      nodes: list.nodes,
      orderedNodes: ordered,
      pointers: { HEAD: list.headId, TAIL: list.tailId, PREV: prevId, CURR: currId },
      highlightNodes: { [currId]: "current", [prevId]: "visited" },
      activeLine: 4,
      pseudocode: PSEUDOCODE_DELETE_VALUE,
      narrative: `Node value ${currNode.value} != ${target}. Advancing prev and curr pointers.`,
      isTerminal: false,
    });

    prevId = currId;
    currId = currNode.next;
  }

  if (!found) {
    // Value not found
    steps.push({
      nodes: list.nodes,
      orderedNodes: ordered,
      pointers: { HEAD: list.headId, TAIL: list.tailId },
      highlightNodes: {},
      activeLine: 5,
      pseudocode: PSEUDOCODE_DELETE_VALUE,
      narrative: `Reached NULL without match. Value ${target} was not found in the list. Structure unmodified.`,
      isTerminal: true,
      finalList: list,
    });
    return steps;
  }

  // Bypass target node
  const targetNode = list.nodes[currId];
  const prevNode = list.nodes[prevId];
  prevNode.next = targetNode.next;
  const isTailDeleted = currId === list.tailId;
  delete list.nodes[currId];

  const finalList = {
    nodes: list.nodes,
    headId: list.headId,
    tailId: isTailDeleted ? prevId : list.tailId,
    size: list.size - 1,
  };

  steps.push({
    nodes: finalList.nodes,
    orderedNodes: getOrderedNodes(finalList),
    pointers: { HEAD: finalList.headId, TAIL: finalList.tailId, PREV: prevId },
    highlightNodes: { [prevId]: "visited" },
    activeLine: 5,
    pseudocode: PSEUDOCODE_DELETE_VALUE,
    narrative: `Bypassed target node: set prev (${prevNode.value}).next → ${targetNode.next ? list.nodes[targetNode.next]?.value : "NULL"}. Node (${target}) deleted! New size: ${finalList.size}.`,
    isTerminal: true,
    finalList,
  });

  return steps;
}
