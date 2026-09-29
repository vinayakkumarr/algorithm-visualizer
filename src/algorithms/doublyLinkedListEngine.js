/**
 * doublyLinkedListEngine.js — Normalized Pointer Graph Model & Invariant Engine for Doubly Linked Lists.
 *
 * State schema:
 * {
 *   nodes: { [id]: { id: string, value: number, prev: string|null, next: string|null } },
 *   headId: string|null,
 *   tailId: string|null,
 *   size: number
 * }
 */

let nextDoublyId = 1;

export function createDoublyNode(value, prev = null, next = null) {
  return {
    id: `dnode_${nextDoublyId++}`,
    value: Number(value),
    prev,
    next,
  };
}

export function createDoublyListFromValues(values = []) {
  const nodes = {};
  let headId = null;
  let tailId = null;
  let prevNodeId = null;

  values.forEach((val) => {
    const node = createDoublyNode(val, prevNodeId, null);
    nodes[node.id] = node;

    if (!headId) {
      headId = node.id;
    }

    if (prevNodeId && nodes[prevNodeId]) {
      nodes[prevNodeId].next = node.id;
    }

    prevNodeId = node.id;
    tailId = node.id;
  });

  return {
    nodes,
    headId,
    tailId,
    size: values.length,
  };
}

export function cloneDoublyList(listState) {
  if (!listState) return createDoublyListFromValues([]);
  const clonedNodes = {};
  Object.keys(listState.nodes).forEach((id) => {
    const n = listState.nodes[id];
    clonedNodes[id] = { id: n.id, value: n.value, prev: n.prev, next: n.next };
  });

  return {
    nodes: clonedNodes,
    headId: listState.headId,
    tailId: listState.tailId,
    size: listState.size,
  };
}

export function getOrderedDoublyNodes(listState) {
  if (!listState || !listState.headId) return [];

  const result = [];
  const visited = new Set();
  let currId = listState.headId;

  while (currId && listState.nodes[currId] && !visited.has(currId)) {
    visited.add(currId);
    const node = listState.nodes[currId];
    result.push({
      id: node.id,
      value: node.value,
      prev: node.prev,
      next: node.next,
    });
    currId = node.next;
  }

  return result;
}

export function validateDoublyInvariants(listState) {
  if (!listState) return { valid: false, error: "List state is null" };

  if (listState.size === 0) {
    if (listState.headId !== null || listState.tailId !== null) {
      return { valid: false, error: "Empty list must have headId = null and tailId = null" };
    }
    return { valid: true };
  }

  if (!listState.headId || !listState.nodes[listState.headId]) {
    return { valid: false, error: "Non-empty list must have valid head node" };
  }

  if (!listState.tailId || !listState.nodes[listState.tailId]) {
    return { valid: false, error: "Non-empty list must have valid tail node" };
  }

  if (listState.nodes[listState.headId].prev !== null) {
    return { valid: false, error: "Head node prev pointer must be null" };
  }

  if (listState.nodes[listState.tailId].next !== null) {
    return { valid: false, error: "Tail node next pointer must be null" };
  }

  // Check bidirectional consistency: A.next = B <=> B.prev = A
  let currId = listState.headId;
  let count = 0;
  const visited = new Set();

  while (currId && listState.nodes[currId]) {
    if (visited.has(currId)) {
      return { valid: false, error: "Unexpected cycle in acyclic DLL" };
    }
    visited.add(currId);
    count++;

    const node = listState.nodes[currId];
    if (node.next && listState.nodes[node.next]) {
      const nextNode = listState.nodes[node.next];
      if (nextNode.prev !== currId) {
        return {
          valid: false,
          error: `Broken linkage: node [${node.value}].next = [${nextNode.value}], but next.prev is not pointing back!`,
        };
      }
    }

    currId = node.next;
  }

  if (count !== listState.size) {
    return { valid: false, error: `Size mismatch: expected ${listState.size}, found ${count}` };
  }

  return { valid: true };
}
