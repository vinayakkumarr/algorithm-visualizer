/**
 * linkedListEngine.js — Normalized Singly Linked List Data Model & Core Utilities.
 *
 * Authoritative pointer representation:
 * {
 *   nodes: {
 *     "node_1": { id: "node_1", value: 10, next: "node_2" },
 *     "node_2": { id: "node_2", value: 20, next: null }
 *   },
 *   headId: "node_1",
 *   tailId: "node_2",
 *   size: 2
 * }
 */

let nextIdCounter = 1;

/**
 * Reset unique ID counter (useful in testing or full resets).
 */
export function resetIdCounter() {
  nextIdCounter = 1;
}

/**
 * Generate a unique node ID.
 */
export function generateNodeId() {
  return `node_${nextIdCounter++}`;
}

/**
 * Create an empty list structure.
 */
export function createEmptyList() {
  return {
    nodes: {},
    headId: null,
    tailId: null,
    size: 0,
  };
}

/**
 * Create a single node object.
 */
export function createNode(value, id = null) {
  return {
    id: id || generateNodeId(),
    value: Number(value),
    next: null,
  };
}

/**
 * Create a valid normalized Linked List from an array of values.
 */
export function createListFromValues(values) {
  if (!values || values.length === 0) {
    return createEmptyList();
  }

  const nodes = {};
  let headId = null;
  let prevNode = null;

  for (let i = 0; i < values.length; i++) {
    const node = createNode(values[i]);
    nodes[node.id] = node;

    if (i === 0) {
      headId = node.id;
    } else if (prevNode) {
      prevNode.next = node.id;
    }
    prevNode = node;
  }

  const tailId = prevNode ? prevNode.id : null;

  return {
    nodes,
    headId,
    tailId,
    size: values.length,
  };
}

/**
 * Generate a list with random values.
 */
export function generateRandomList(size, min = 10, max = 99) {
  const count = Math.max(0, Math.min(size, 20));
  const values = Array.from({ length: count }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
  return createListFromValues(values);
}

/**
 * Deep-clone a list state immutably.
 */
export function cloneList(listState) {
  if (!listState) return createEmptyList();

  const clonedNodes = {};
  for (const [id, node] of Object.entries(listState.nodes)) {
    clonedNodes[id] = { ...node };
  }

  return {
    nodes: clonedNodes,
    headId: listState.headId,
    tailId: listState.tailId,
    size: listState.size,
  };
}

/**
 * Derive an ordered array of nodes starting from headId by chasing .next pointers.
 * Defensively tracks visited node IDs to safely prevent infinite loops on cyclic lists.
 */
export function getOrderedNodes(listState) {
  if (!listState || !listState.headId || !listState.nodes[listState.headId]) {
    return [];
  }

  const result = [];
  const visited = new Set();
  let currId = listState.headId;

  while (currId && listState.nodes[currId]) {
    if (visited.has(currId)) {
      // Loop detected — terminate ordered linear list traversal
      break;
    }
    visited.add(currId);
    const node = listState.nodes[currId];
    result.push(node);
    currId = node.next;
  }

  return result;
}

/**
 * Check if the list contains a cycle and return cycle details.
 */
export function getCycleInfo(listState) {
  if (!listState || !listState.headId) {
    return { hasCycle: false, cycleEntryId: null, cycleTailId: null };
  }

  const visited = new Set();
  let currId = listState.headId;
  let prevId = null;

  while (currId && listState.nodes[currId]) {
    if (visited.has(currId)) {
      return {
        hasCycle: true,
        cycleEntryId: currId,
        cycleTailId: prevId,
      };
    }
    visited.add(currId);
    prevId = currId;
    currId = listState.nodes[currId].next;
  }

  return { hasCycle: false, cycleEntryId: null, cycleTailId: null };
}

/**
 * Validate Singly Linked List structural invariants.
 */
export function validateInvariants(listState) {
  if (!listState) return { valid: false, error: "List state is null or undefined" };

  if (listState.size === 0) {
    if (listState.headId !== null || listState.tailId !== null) {
      return { valid: false, error: "Empty list must have headId = null and tailId = null" };
    }
    return { valid: true };
  }

  if (!listState.headId || !listState.nodes[listState.headId]) {
    return { valid: false, error: "Non-empty list must have a valid head node" };
  }

  if (!listState.tailId || !listState.nodes[listState.tailId]) {
    return { valid: false, error: "Non-empty list must have a valid tail node" };
  }

  const { hasCycle } = getCycleInfo(listState);
  if (!hasCycle) {
    if (listState.nodes[listState.tailId].next !== null) {
      return { valid: false, error: "Tail node next pointer must be null in acyclic list" };
    }
  }

  return { valid: true };
}

/**
 * Speed mapper (level 1-5 or 1-10 -> ms).
 */
export function speedToMs(speedLevel) {
  // Speed 1: 1000ms, Speed 3: 500ms, Speed 5: 150ms
  const clamped = Math.max(1, Math.min(speedLevel, 5));
  const speeds = { 1: 1000, 2: 700, 3: 450, 4: 250, 5: 120 };
  return speeds[clamped] || 450;
}
