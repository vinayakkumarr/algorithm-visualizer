/**
 * doublyOperations.js — Step generators for Doubly Linked List operations.
 *
 * Implements:
 * 1. Insert Head: O(1)
 * 2. Insert Tail: O(1)
 * 3. Insert at Position: O(n)
 * 4. Delete Head: O(1)
 * 5. Delete Tail: O(1)
 * 6. Delete First Value: O(n)
 */

import {
  createDoublyNode,
  cloneDoublyList,
  getOrderedDoublyNodes,
} from "./doublyLinkedListEngine.js";

export const PSEUDOCODE_DOUBLY = {
  insertHead: [
    "procedure insertHead(val):",
    "  newNode = new Node(val, prev=null, next=null)",
    "  if head == null: head = tail = newNode; return",
    "  newNode.next = head",
    "  head.prev = newNode",
    "  head = newNode",
  ],
  insertTail: [
    "procedure insertTail(val):",
    "  newNode = new Node(val, prev=null, next=null)",
    "  if tail == null: head = tail = newNode; return",
    "  newNode.prev = tail",
    "  tail.next = newNode",
    "  tail = newNode",
  ],
  insertPosition: [
    "procedure insertAtPosition(val, pos):",
    "  if pos == 0: insertHead(val); return",
    "  curr = head; for i from 0 to pos - 2: curr = curr.next",
    "  newNode = new Node(val)",
    "  newNode.next = curr.next; newNode.prev = curr",
    "  if curr.next != null: curr.next.prev = newNode",
    "  curr.next = newNode",
  ],
  deleteHead: [
    "procedure deleteHead():",
    "  if head == null: throw UnderflowError",
    "  if head == tail: head = tail = null; return",
    "  head = head.next",
    "  head.prev = null",
  ],
  deleteTail: [
    "procedure deleteTail():",
    "  if tail == null: throw UnderflowError",
    "  if head == tail: head = tail = null; return",
    "  tail = tail.prev",
    "  tail.next = null",
  ],
  deleteValue: [
    "procedure deleteValue(val):",
    "  curr = head",
    "  while curr != null and curr.val != val: curr = curr.next",
    "  if curr == null: return (Not found)",
    "  if curr.prev != null: curr.prev.next = curr.next",
    "  else: head = curr.next",
    "  if curr.next != null: curr.next.prev = curr.prev",
    "  else: tail = curr.prev",
  ],
};

// 1. Insert Head
export function generateDoublyInsertHeadSteps(baseList, value) {
  const list = cloneDoublyList(baseList);
  const steps = [];
  const newNode = createDoublyNode(value);

  // Step 1: Allocate
  steps.push({
    nodes: { ...list.nodes, [newNode.id]: newNode },
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: { ...newNode },
    pointers: { HEAD: list.headId, TAIL: list.tailId, NEW: newNode.id },
    highlightNodes: { [newNode.id]: "new" },
    activeLine: 1,
    pseudocode: PSEUDOCODE_DOUBLY.insertHead,
    narrative: `Allocated new Doubly Node (${value}) in memory shelf with prev = NULL and next = NULL.`,
    isTerminal: false,
  });

  if (list.size === 0) {
    list.nodes[newNode.id] = newNode;
    list.headId = newNode.id;
    list.tailId = newNode.id;
    list.size = 1;

    steps.push({
      nodes: list.nodes,
      orderedNodes: [newNode],
      shelfNode: null,
      pointers: { HEAD: newNode.id, TAIL: newNode.id },
      highlightNodes: { [newNode.id]: "new" },
      activeLine: 2,
      pseudocode: PSEUDOCODE_DOUBLY.insertHead,
      narrative: `List was empty: Set both HEAD and TAIL to point to node (${value}).`,
      isTerminal: true,
      finalList: list,
    });
    return steps;
  }

  const oldHeadId = list.headId;

  // Step 2: newNode.next = head
  newNode.next = oldHeadId;
  list.nodes[newNode.id] = newNode;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: { ...newNode },
    pointers: { HEAD: oldHeadId, TAIL: list.tailId, NEW: newNode.id },
    highlightNodes: { [newNode.id]: "new", [oldHeadId]: "current" },
    activeLine: 3,
    pseudocode: PSEUDOCODE_DOUBLY.insertHead,
    narrative: `Linked newNode.next → old HEAD (node ${list.nodes[oldHeadId].value}).`,
    isTerminal: false,
  });

  // Step 3: head.prev = newNode
  list.nodes[oldHeadId].prev = newNode.id;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: { ...newNode },
    pointers: { HEAD: oldHeadId, TAIL: list.tailId, NEW: newNode.id },
    highlightNodes: { [newNode.id]: "new", [oldHeadId]: "current" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_DOUBLY.insertHead,
    narrative: `Linked old HEAD.prev ← newNode (node ${value}) to establish backward pointer.`,
    isTerminal: false,
  });

  // Step 4: head = newNode
  list.headId = newNode.id;
  list.size++;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: null,
    pointers: { HEAD: newNode.id, TAIL: list.tailId },
    highlightNodes: { [newNode.id]: "new" },
    activeLine: 5,
    pseudocode: PSEUDOCODE_DOUBLY.insertHead,
    narrative: `Updated HEAD pointer to node (${value}). Insertion at Head complete in O(1) time.`,
    isTerminal: true,
    finalList: list,
  });

  return steps;
}

// 2. Insert Tail
export function generateDoublyInsertTailSteps(baseList, value) {
  const list = cloneDoublyList(baseList);
  const steps = [];
  const newNode = createDoublyNode(value);

  // Step 1: Allocate
  steps.push({
    nodes: { ...list.nodes, [newNode.id]: newNode },
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: { ...newNode },
    pointers: { HEAD: list.headId, TAIL: list.tailId, NEW: newNode.id },
    highlightNodes: { [newNode.id]: "new" },
    activeLine: 1,
    pseudocode: PSEUDOCODE_DOUBLY.insertTail,
    narrative: `Allocated new Doubly Node (${value}) in memory shelf.`,
    isTerminal: false,
  });

  if (list.size === 0) {
    list.nodes[newNode.id] = newNode;
    list.headId = newNode.id;
    list.tailId = newNode.id;
    list.size = 1;

    steps.push({
      nodes: list.nodes,
      orderedNodes: [newNode],
      shelfNode: null,
      pointers: { HEAD: newNode.id, TAIL: newNode.id },
      highlightNodes: { [newNode.id]: "new" },
      activeLine: 2,
      pseudocode: PSEUDOCODE_DOUBLY.insertTail,
      narrative: `List was empty: Set HEAD and TAIL to node (${value}).`,
      isTerminal: true,
      finalList: list,
    });
    return steps;
  }

  const oldTailId = list.tailId;

  // Step 2: newNode.prev = tail
  newNode.prev = oldTailId;
  list.nodes[newNode.id] = newNode;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: { ...newNode },
    pointers: { HEAD: list.headId, TAIL: oldTailId, NEW: newNode.id },
    highlightNodes: { [newNode.id]: "new", [oldTailId]: "current" },
    activeLine: 3,
    pseudocode: PSEUDOCODE_DOUBLY.insertTail,
    narrative: `Linked newNode.prev ← old TAIL (node ${list.nodes[oldTailId].value}).`,
    isTerminal: false,
  });

  // Step 3: tail.next = newNode
  list.nodes[oldTailId].next = newNode.id;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: { ...newNode },
    pointers: { HEAD: list.headId, TAIL: oldTailId, NEW: newNode.id },
    highlightNodes: { [newNode.id]: "new", [oldTailId]: "current" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_DOUBLY.insertTail,
    narrative: `Linked old TAIL.next → newNode (node ${value}).`,
    isTerminal: false,
  });

  // Step 4: tail = newNode
  list.tailId = newNode.id;
  list.size++;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    shelfNode: null,
    pointers: { HEAD: list.headId, TAIL: newNode.id },
    highlightNodes: { [newNode.id]: "new" },
    activeLine: 5,
    pseudocode: PSEUDOCODE_DOUBLY.insertTail,
    narrative: `Updated TAIL pointer to node (${value}). Insertion at Tail complete in O(1) time.`,
    isTerminal: true,
    finalList: list,
  });

  return steps;
}

// 3. Delete Head
export function generateDoublyDeleteHeadSteps(baseList) {
  const list = cloneDoublyList(baseList);
  const steps = [];

  if (list.size === 0) {
    steps.push({
      nodes: list.nodes,
      orderedNodes: [],
      pointers: { HEAD: null, TAIL: null },
      highlightNodes: {},
      activeLine: 1,
      pseudocode: PSEUDOCODE_DOUBLY.deleteHead,
      narrative: "List Underflow! Cannot delete from an empty doubly linked list.",
      isTerminal: true,
      finalList: list,
    });
    return steps;
  }

  const oldHead = list.nodes[list.headId];

  if (list.size === 1) {
    steps.push({
      nodes: list.nodes,
      orderedNodes: getOrderedDoublyNodes(list),
      pointers: { HEAD: oldHead.id, TAIL: oldHead.id },
      highlightNodes: { [oldHead.id]: "delete" },
      activeLine: 2,
      pseudocode: PSEUDOCODE_DOUBLY.deleteHead,
      narrative: `Only 1 node (${oldHead.value}) remains. Deleting it and setting HEAD = TAIL = NULL.`,
      isTerminal: false,
    });

    const emptyList = { nodes: {}, headId: null, tailId: null, size: 0 };
    steps.push({
      nodes: {},
      orderedNodes: [],
      pointers: { HEAD: null, TAIL: null },
      highlightNodes: {},
      activeLine: 2,
      pseudocode: PSEUDOCODE_DOUBLY.deleteHead,
      narrative: `Deleted sole node (${oldHead.value}). List is now empty.`,
      isTerminal: true,
      finalList: emptyList,
    });
    return steps;
  }

  const nextId = oldHead.next;

  // Step 1: Advance HEAD = next
  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    pointers: { HEAD: oldHead.id, TAIL: list.tailId, CURR: nextId },
    highlightNodes: { [oldHead.id]: "delete", [nextId]: "current" },
    activeLine: 3,
    pseudocode: PSEUDOCODE_DOUBLY.deleteHead,
    narrative: `Advancing HEAD pointer to next node (${list.nodes[nextId].value}).`,
    isTerminal: false,
  });

  list.headId = nextId;
  list.nodes[nextId].prev = null;
  delete list.nodes[oldHead.id];
  list.size--;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    pointers: { HEAD: nextId, TAIL: list.tailId },
    highlightNodes: { [nextId]: "current" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_DOUBLY.deleteHead,
    narrative: `Severed old HEAD. Unlinked new HEAD.prev = NULL. Delete Head complete in O(1) time.`,
    isTerminal: true,
    finalList: list,
  });

  return steps;
}

// 4. Delete Tail
export function generateDoublyDeleteTailSteps(baseList) {
  const list = cloneDoublyList(baseList);
  const steps = [];

  if (list.size === 0) {
    steps.push({
      nodes: list.nodes,
      orderedNodes: [],
      pointers: { HEAD: null, TAIL: null },
      highlightNodes: {},
      activeLine: 1,
      pseudocode: PSEUDOCODE_DOUBLY.deleteTail,
      narrative: "List Underflow! Cannot delete tail from an empty list.",
      isTerminal: true,
      finalList: list,
    });
    return steps;
  }

  const oldTail = list.nodes[list.tailId];

  if (list.size === 1) {
    return generateDoublyDeleteHeadSteps(baseList);
  }

  const prevId = oldTail.prev;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    pointers: { HEAD: list.headId, TAIL: oldTail.id, CURR: prevId },
    highlightNodes: { [oldTail.id]: "delete", [prevId]: "current" },
    activeLine: 3,
    pseudocode: PSEUDOCODE_DOUBLY.deleteTail,
    narrative: `Moving TAIL pointer back to node (${list.nodes[prevId].value}) via old TAIL.prev link in O(1) time!`,
    isTerminal: false,
  });

  list.tailId = prevId;
  list.nodes[prevId].next = null;
  delete list.nodes[oldTail.id];
  list.size--;

  steps.push({
    nodes: list.nodes,
    orderedNodes: getOrderedDoublyNodes(list),
    pointers: { HEAD: list.headId, TAIL: prevId },
    highlightNodes: { [prevId]: "current" },
    activeLine: 4,
    pseudocode: PSEUDOCODE_DOUBLY.deleteTail,
    narrative: `Set new TAIL.next = NULL and deleted node (${oldTail.value}). Delete Tail complete in O(1) time.`,
    isTerminal: true,
    finalList: list,
  });

  return steps;
}
