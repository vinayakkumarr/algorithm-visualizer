/**
 * bstAlgorithms.js — Comprehensive, Pure Binary Search Tree (BST) Operations & Traversals Engine
 *
 * Implements:
 * 1. BST Invariant-preserving Insertion (with duplicate rejection & search path tracing)
 * 2. BST Search (with branch elimination and $<, >, =$ comparison steps)
 * 3. BST Deletion (with full 3-case visualization: Leaf, 1 Child, 2 Children with In-order Successor)
 * 4. Genuine DFS Traversals: Inorder (LNR), Preorder (NLR), Postorder (LRN) with call stack tracking
 * 5. Genuine BFS Level-Order Traversal with explicit FIFO Queue visualization
 * 6. Tree statistics & Educational Presets using identical BST construction logic
 */

// Node & Helper Constructors
export function createNode(id, value) {
  return {
    id,
    value: Number(value),
    left: null,
    right: null,
  };
}

export function cloneTree(node) {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

export function getBSTHeight(node) {
  if (!node) return 0;
  return 1 + Math.max(getBSTHeight(node.left), getBSTHeight(node.right));
}

export function countNodes(node) {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

export function isBSTBalanced(node) {
  function check(n) {
    if (!n) return 0;
    const l = check(n.left);
    if (l === -1) return -1;
    const r = check(n.right);
    if (r === -1) return -1;
    if (Math.abs(l - r) > 1) return -1;
    return 1 + Math.max(l, r);
  }
  return check(node) !== -1;
}

// Presets Generation
export const PRESETS = [
  { id: "balanced", label: "Balanced BST (7 nodes)", values: [50, 25, 75, 12, 37, 62, 87] },
  { id: "small", label: "Small Tree (7 nodes)", values: [40, 20, 60, 10, 30, 50, 70] },
  { id: "leftSkewed", label: "Left Skewed (Degenerate)", values: [50, 40, 30, 20, 10] },
  { id: "rightSkewed", label: "Right Skewed (Degenerate)", values: [10, 20, 30, 40, 50] },
  { id: "random", label: "Random BST (6 unique)", values: [] },
];

export function buildTreeFromValues(values, nextIdRef) {
  let root = null;
  for (const val of values) {
    const id = nextIdRef.current++;
    root = pureInsert(root, val, id);
  }
  return root;
}

function pureInsert(node, value, id) {
  if (!node) return { id, value, left: null, right: null };
  if (value < node.value) {
    return { ...node, left: pureInsert(node.left, value, id) };
  } else if (value > node.value) {
    return { ...node, right: pureInsert(node.right, value, id) };
  }
  return node; // Duplicate ignored
}

export function generateRandomValues(count = 6) {
  const set = new Set();
  while (set.size < count) {
    const r = Math.floor(Math.random() * 89) + 10; // 10..98
    set.add(r);
  }
  return Array.from(set);
}

// 1. BST INSERTION STEP GENERATOR
export function generateInsertSteps(root, value, newId) {
  const steps = [];

  if (!root) {
    const newRoot = { id: newId, value, left: null, right: null };
    steps.push({
      tree: null,
      currentId: null,
      newNodeId: null,
      pathNodeIds: [],
      pathEdges: [],
      description: `Tree is empty. Creating new root node with value ${value}.`,
      status: "running",
    });
    steps.push({
      tree: newRoot,
      currentId: newId,
      newNodeId: newId,
      pathNodeIds: [newId],
      pathEdges: [],
      description: `✅ Inserted ${value} as the root node.`,
      status: "done",
    });
    return { steps, newRoot, isDuplicate: false };
  }

  const traversed = [];
  const edges = [];
  let curr = root;
  let prev = null;
  let isDuplicate = false;

  while (curr) {
    traversed.push(curr.id);
    if (prev) {
      edges.push(`${prev.id}-${curr.id}`);
    }

    if (value === curr.value) {
      isDuplicate = true;
      steps.push({
        tree: root,
        currentId: curr.id,
        newNodeId: null,
        pathNodeIds: [...traversed],
        pathEdges: [...edges],
        description: `Value ${value} already exists in the BST! Duplicates are not inserted.`,
        status: "error",
      });
      return { steps, newRoot: root, isDuplicate: true };
    }

    if (value < curr.value) {
      if (!curr.left) {
        steps.push({
          tree: root,
          currentId: curr.id,
          newNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Comparing ${value} < ${curr.value}. Left child is empty — inserting ${value} here.`,
          status: "running",
        });

        // Insert new node into a cloned tree
        const newRoot = cloneTree(root);
        function attachLeft(n) {
          if (n.id === curr.id) {
            n.left = { id: newId, value, left: null, right: null };
            return;
          }
          if (n.left) attachLeft(n.left);
          if (n.right) attachLeft(n.right);
        }
        attachLeft(newRoot);

        edges.push(`${curr.id}-${newId}`);
        traversed.push(newId);

        steps.push({
          tree: newRoot,
          currentId: newId,
          newNodeId: newId,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `✅ Inserted ${value} as left child of ${curr.value}. BST invariants preserved.`,
          status: "done",
        });

        return { steps, newRoot, isDuplicate: false };
      } else {
        steps.push({
          tree: root,
          currentId: curr.id,
          newNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Comparing ${value} < ${curr.value}. Eliminating right subtree — traversing to left child (${curr.left.value}).`,
          status: "running",
        });
        prev = curr;
        curr = curr.left;
      }
    } else {
      // value > curr.value
      if (!curr.right) {
        steps.push({
          tree: root,
          currentId: curr.id,
          newNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Comparing ${value} > ${curr.value}. Right child is empty — inserting ${value} here.`,
          status: "running",
        });

        const newRoot = cloneTree(root);
        function attachRight(n) {
          if (n.id === curr.id) {
            n.right = { id: newId, value, left: null, right: null };
            return;
          }
          if (n.left) attachRight(n.left);
          if (n.right) attachRight(n.right);
        }
        attachRight(newRoot);

        edges.push(`${curr.id}-${newId}`);
        traversed.push(newId);

        steps.push({
          tree: newRoot,
          currentId: newId,
          newNodeId: newId,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `✅ Inserted ${value} as right child of ${curr.value}. BST invariants preserved.`,
          status: "done",
        });

        return { steps, newRoot, isDuplicate: false };
      } else {
        steps.push({
          tree: root,
          currentId: curr.id,
          newNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Comparing ${value} > ${curr.value}. Eliminating left subtree — traversing to right child (${curr.right.value}).`,
          status: "running",
        });
        prev = curr;
        curr = curr.right;
      }
    }
  }

  return { steps, newRoot: root, isDuplicate: false };
}

// 2. BST SEARCH STEP GENERATOR
export function generateSearchSteps(root, target) {
  const steps = [];

  if (!root) {
    steps.push({
      tree: null,
      currentId: null,
      foundNodeId: null,
      pathNodeIds: [],
      pathEdges: [],
      description: `Tree is empty. Target ${target} cannot be found.`,
      status: "error",
    });
    return { steps, found: false };
  }

  let curr = root;
  let prev = null;
  const traversed = [];
  const edges = [];

  while (curr) {
    traversed.push(curr.id);
    if (prev) {
      edges.push(`${prev.id}-${curr.id}`);
    }

    if (target === curr.value) {
      steps.push({
        tree: root,
        currentId: curr.id,
        foundNodeId: curr.id,
        pathNodeIds: [...traversed],
        pathEdges: [...edges],
        description: `✅ Target ${target} = ${curr.value}! Found in ${traversed.length} comparison(s).`,
        status: "done",
      });
      return { steps, found: true, foundId: curr.id };
    }

    if (target < curr.value) {
      if (!curr.left) {
        steps.push({
          tree: root,
          currentId: curr.id,
          foundNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Target ${target} < ${curr.value}, but left child is null. ✕ Target ${target} does not exist in the BST.`,
          status: "error",
        });
        return { steps, found: false };
      } else {
        steps.push({
          tree: root,
          currentId: curr.id,
          foundNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Target ${target} < ${curr.value}. Eliminating right subtree — moving to left child (${curr.left.value}).`,
          status: "running",
        });
        prev = curr;
        curr = curr.left;
      }
    } else {
      // target > curr.value
      if (!curr.right) {
        steps.push({
          tree: root,
          currentId: curr.id,
          foundNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Target ${target} > ${curr.value}, but right child is null. ✕ Target ${target} does not exist in the BST.`,
          status: "error",
        });
        return { steps, found: false };
      } else {
        steps.push({
          tree: root,
          currentId: curr.id,
          foundNodeId: null,
          pathNodeIds: [...traversed],
          pathEdges: [...edges],
          description: `Target ${target} > ${curr.value}. Eliminating left subtree — moving to right child (${curr.right.value}).`,
          status: "running",
        });
        prev = curr;
        curr = curr.right;
      }
    }
  }

  return { steps, found: false };
}

// 3. BST DELETION STEP GENERATOR
export function generateDeleteSteps(root, target) {
  const steps = [];

  if (!root) {
    steps.push({
      tree: null,
      currentId: null,
      deleteNodeId: null,
      pathNodeIds: [],
      pathEdges: [],
      description: `Tree is empty. Cannot delete ${target}.`,
      status: "error",
    });
    return { steps, newRoot: null, deleted: false };
  }

  // First step: trace search path to target
  let curr = root;
  let prev = null;
  const traversed = [];
  const edges = [];

  while (curr && curr.value !== target) {
    traversed.push(curr.id);
    if (prev) edges.push(`${prev.id}-${curr.id}`);

    if (target < curr.value) {
      if (!curr.left) break;
      steps.push({
        tree: root,
        currentId: curr.id,
        deleteNodeId: null,
        pathNodeIds: [...traversed],
        pathEdges: [...edges],
        description: `Searching for node to delete: ${target} < ${curr.value} → moving left.`,
        status: "running",
      });
      prev = curr;
      curr = curr.left;
    } else {
      if (!curr.right) break;
      steps.push({
        tree: root,
        currentId: curr.id,
        deleteNodeId: null,
        pathNodeIds: [...traversed],
        pathEdges: [...edges],
        description: `Searching for node to delete: ${target} > ${curr.value} → moving right.`,
        status: "running",
      });
      prev = curr;
      curr = curr.right;
    }
  }

  if (!curr || curr.value !== target) {
    if (curr) traversed.push(curr.id);
    steps.push({
      tree: root,
      currentId: curr ? curr.id : null,
      deleteNodeId: null,
      pathNodeIds: [...traversed],
      pathEdges: [...edges],
      description: `✕ Node with value ${target} not found in the BST. No deletion performed.`,
      status: "error",
    });
    return { steps, newRoot: root, deleted: false };
  }

  // Node found
  traversed.push(curr.id);
  if (prev) edges.push(`${prev.id}-${curr.id}`);

  const targetNode = curr;

  // Case 1: Leaf node (0 children)
  if (!targetNode.left && !targetNode.right) {
    steps.push({
      tree: root,
      currentId: targetNode.id,
      deleteNodeId: targetNode.id,
      pathNodeIds: [...traversed],
      pathEdges: [...edges],
      description: `Located node ${target}. Case 1 (Leaf Node): Node has no children. Detaching and deleting leaf.`,
      status: "running",
    });

    const newRoot = deleteNodeById(root, targetNode.id);

    steps.push({
      tree: newRoot,
      currentId: null,
      deleteNodeId: null,
      pathNodeIds: [],
      pathEdges: [],
      description: `✅ Leaf node ${target} deleted successfully. BST ordering intact.`,
      status: "done",
    });

    return { steps, newRoot, deleted: true };
  }

  // Case 2: One child
  if (!targetNode.left || !targetNode.right) {
    const child = targetNode.left || targetNode.right;
    steps.push({
      tree: root,
      currentId: targetNode.id,
      deleteNodeId: targetNode.id,
      pathNodeIds: [...traversed],
      pathEdges: [...edges],
      description: `Located node ${target}. Case 2 (One Child): Node has only 1 child (${child.value}). Re-linking parent directly to child ${child.value}.`,
      status: "running",
    });

    const newRoot = deleteNodeById(root, targetNode.id);

    steps.push({
      tree: newRoot,
      currentId: child.id,
      deleteNodeId: null,
      pathNodeIds: [child.id],
      pathEdges: [],
      description: `✅ Node ${target} deleted. Child (${child.value}) adopted by parent. BST invariants preserved.`,
      status: "done",
    });

    return { steps, newRoot, deleted: true };
  }

  // Case 3: Two children
  steps.push({
    tree: root,
    currentId: targetNode.id,
    deleteNodeId: targetNode.id,
    pathNodeIds: [...traversed],
    pathEdges: [...edges],
    description: `Located node ${target}. Case 3 (Two Children): Node has 2 children. Searching right subtree for In-order Successor (minimum value in right subtree)...`,
    status: "running",
  });

  // Find in-order successor (leftmost node in right subtree)
  let succ = targetNode.right;
  let succPrev = targetNode;
  const succTraversed = [targetNode.id];
  const succEdges = [];

  steps.push({
    tree: root,
    currentId: succ.id,
    deleteNodeId: targetNode.id,
    successorNodeId: succ.id,
    pathNodeIds: [...succTraversed, succ.id],
    pathEdges: [`${targetNode.id}-${succ.id}`],
    description: `Entering right subtree at node ${succ.value}. Moving left to locate smallest element...`,
    status: "running",
  });

  while (succ.left) {
    succPrev = succ;
    succEdges.push(`${succPrev.id}-${succ.left.id}`);
    succ = succ.left;
    succTraversed.push(succ.id);

    steps.push({
      tree: root,
      currentId: succ.id,
      deleteNodeId: targetNode.id,
      successorNodeId: succ.id,
      pathNodeIds: [...succTraversed],
      pathEdges: [...succEdges],
      description: `Moving left to smaller value (${succ.value})...`,
      status: "running",
    });
  }

  // Successor found
  const succValue = succ.value;
  const succId = succ.id;

  steps.push({
    tree: root,
    currentId: targetNode.id,
    deleteNodeId: targetNode.id,
    successorNodeId: succId,
    pathNodeIds: [targetNode.id, succId],
    pathEdges: [],
    description: `In-order Successor is ${succValue}. Copying successor value (${succValue}) into target node (${target}).`,
    status: "running",
  });

  // Intermediate tree snapshot where targetNode value is replaced with successor value
  const intermediateTree = cloneTree(root);
  function replaceVal(n) {
    if (!n) return;
    if (n.id === targetNode.id) {
      n.value = succValue;
      return;
    }
    replaceVal(n.left);
    replaceVal(n.right);
  }
  replaceVal(intermediateTree);

  steps.push({
    tree: intermediateTree,
    currentId: targetNode.id,
    deleteNodeId: null,
    successorNodeId: succId,
    pathNodeIds: [targetNode.id],
    pathEdges: [],
    description: `Target node updated with ${succValue}. Now deleting the duplicate successor node (${succValue}) from the right subtree...`,
    status: "running",
  });

  // Delete successor node from right subtree
  const finalRoot = deleteNodeById(intermediateTree, succId);

  steps.push({
    tree: finalRoot,
    currentId: targetNode.id,
    deleteNodeId: null,
    successorNodeId: null,
    pathNodeIds: [targetNode.id],
    pathEdges: [],
    description: `✅ Deletion complete! Successor node spliced out. BST ordering invariant fully preserved.`,
    status: "done",
  });

  return { steps, newRoot: finalRoot, deleted: true };
}

/** Pure helper to delete a node by ID from a BST */
function deleteNodeById(root, idToDelete) {
  function remove(node) {
    if (!node) return null;
    if (node.id === idToDelete) {
      // 0 children
      if (!node.left && !node.right) return null;
      // 1 child
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      // 2 children
      let s = node.right;
      while (s.left) s = s.left;
      const copied = { ...node, value: s.value, id: node.id };
      copied.right = removeSuccessor(node.right, s.id);
      return copied;
    }
    return {
      ...node,
      left: remove(node.left),
      right: remove(node.right),
    };
  }

  function removeSuccessor(node, sId) {
    if (!node) return null;
    if (node.id === sId) return node.right;
    return {
      ...node,
      left: removeSuccessor(node.left, sId),
      right: removeSuccessor(node.right, sId),
    };
  }

  return remove(cloneTree(root));
}

// 4. TRAVERSAL STEP GENERATORS (GENUINE ALGORITHMS)
export function generateInorderSteps(root) {
  if (!root) {
    return [{
      tree: null,
      currentId: null,
      visitedIds: [],
      callStack: [],
      output: [],
      description: "Tree is empty. Inorder traversal (LNR) output is [].",
      status: "done",
    }];
  }

  const steps = [];
  const visited = [];
  const output = [];
  const callStack = [];

  function traverse(node) {
    if (!node) return;

    callStack.push(node.value);
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Entering node ${node.value} (Call stack: [${callStack.join(", ")}]). Traversing left subtree...`,
      action: "enter",
    });

    if (node.left) {
      traverse(node.left);
    }

    // Visit current node (LNR)
    visited.push(node.id);
    output.push(node.value);
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Visited node ${node.value} (LNR: Left subtree completed). Appended ${node.value} to sorted output.`,
      action: "visit",
    });

    if (node.right) {
      steps.push({
        tree: root,
        currentId: node.id,
        visitedIds: [...visited],
        callStack: [...callStack],
        output: [...output],
        description: `Node ${node.value} visited. Now traversing right subtree...`,
        action: "right",
      });
      traverse(node.right);
    }

    callStack.pop();
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Subtree at node ${node.value} complete. Returning up call stack.`,
      action: "return",
    });
  }

  traverse(root);

  steps.push({
    tree: root,
    currentId: null,
    visitedIds: [...visited],
    callStack: [],
    output: [...output],
    description: `✅ Inorder Traversal (LNR) Complete! Sorted output: [${output.join(", ")}]`,
    status: "done",
  });

  return steps;
}

export function generatePreorderSteps(root) {
  if (!root) {
    return [{
      tree: null,
      currentId: null,
      visitedIds: [],
      callStack: [],
      output: [],
      description: "Tree is empty. Preorder traversal (NLR) output is [].",
      status: "done",
    }];
  }

  const steps = [];
  const visited = [];
  const output = [];
  const callStack = [];

  function traverse(node) {
    if (!node) return;

    callStack.push(node.value);
    // Visit Root first (NLR)
    visited.push(node.id);
    output.push(node.value);

    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Visited Root node ${node.value} immediately (NLR: Root first). Appended ${node.value} to output.`,
      action: "visit",
    });

    if (node.left) {
      steps.push({
        tree: root,
        currentId: node.id,
        visitedIds: [...visited],
        callStack: [...callStack],
        output: [...output],
        description: `Exploring left child of node ${node.value}...`,
        action: "dive_left",
      });
      traverse(node.left);
    }

    if (node.right) {
      steps.push({
        tree: root,
        currentId: node.id,
        visitedIds: [...visited],
        callStack: [...callStack],
        output: [...output],
        description: `Left subtree finished for ${node.value}. Now exploring right child...`,
        action: "dive_right",
      });
      traverse(node.right);
    }

    callStack.pop();
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Completed node ${node.value} and subtrees. Returning up call stack.`,
      action: "return",
    });
  }

  traverse(root);

  steps.push({
    tree: root,
    currentId: null,
    visitedIds: [...visited],
    callStack: [],
    output: [...output],
    description: `✅ Preorder Traversal (NLR) Complete! Output: [${output.join(", ")}]`,
    status: "done",
  });

  return steps;
}

export function generatePostorderSteps(root) {
  if (!root) {
    return [{
      tree: null,
      currentId: null,
      visitedIds: [],
      callStack: [],
      output: [],
      description: "Tree is empty. Postorder traversal (LRN) output is [].",
      status: "done",
    }];
  }

  const steps = [];
  const visited = [];
  const output = [];
  const callStack = [];

  function traverse(node) {
    if (!node) return;

    callStack.push(node.value);
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Entering node ${node.value}. Traversing left subtree first (LRN)...`,
      action: "dive_left",
    });

    if (node.left) {
      traverse(node.left);
    }

    if (node.right) {
      steps.push({
        tree: root,
        currentId: node.id,
        visitedIds: [...visited],
        callStack: [...callStack],
        output: [...output],
        description: `Left subtree done for ${node.value}. Traversing right subtree...`,
        action: "dive_right",
      });
      traverse(node.right);
    }

    // Visit Root last (LRN)
    visited.push(node.id);
    output.push(node.value);
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Both subtrees processed. Visited node ${node.value} (LRN: Root last). Appended ${node.value} to output.`,
      action: "visit",
    });

    callStack.pop();
    steps.push({
      tree: root,
      currentId: node.id,
      visitedIds: [...visited],
      callStack: [...callStack],
      output: [...output],
      description: `Returning from node ${node.value}.`,
      action: "return",
    });
  }

  traverse(root);

  steps.push({
    tree: root,
    currentId: null,
    visitedIds: [...visited],
    callStack: [],
    output: [...output],
    description: `✅ Postorder Traversal (LRN) Complete! Output: [${output.join(", ")}]`,
    status: "done",
  });

  return steps;
}

export function generateBFSSteps(root) {
  if (!root) {
    return [{
      tree: null,
      currentId: null,
      inQueueIds: [],
      visitedIds: [],
      queue: [],
      output: [],
      description: "Tree is empty. Level-order (BFS) output is [].",
      status: "done",
    }];
  }

  const steps = [];
  const visited = [];
  const output = [];
  const queue = [{ id: root.id, value: root.value, node: root }];

  steps.push({
    tree: root,
    currentId: null,
    inQueueIds: [root.id],
    visitedIds: [],
    queue: [root.value],
    output: [],
    description: `Initialized FIFO Queue with root node [${root.value}].`,
    action: "init",
  });

  while (queue.length > 0) {
    const { id, value, node } = queue.shift();
    visited.push(id);
    output.push(value);

    const inQueueIds = queue.map((q) => q.id);

    steps.push({
      tree: root,
      currentId: id,
      inQueueIds: [...inQueueIds],
      visitedIds: [...visited],
      queue: queue.map((q) => q.value),
      output: [...output],
      description: `Dequeued node ${value} from front of queue. Visited ${value} and appended to level-order output.`,
      action: "dequeue",
    });

    if (node.left) {
      queue.push({ id: node.left.id, value: node.left.value, node: node.left });
      steps.push({
        tree: root,
        currentId: id,
        inQueueIds: queue.map((q) => q.id),
        visitedIds: [...visited],
        queue: queue.map((q) => q.value),
        output: [...output],
        description: `Enqueued left child (${node.left.value}) into queue.`,
        action: "enqueue_left",
      });
    }

    if (node.right) {
      queue.push({ id: node.right.id, value: node.right.value, node: node.right });
      steps.push({
        tree: root,
        currentId: id,
        inQueueIds: queue.map((q) => q.id),
        visitedIds: [...visited],
        queue: queue.map((q) => q.value),
        output: [...output],
        description: `Enqueued right child (${node.right.value}) into queue.`,
        action: "enqueue_right",
      });
    }
  }

  steps.push({
    tree: root,
    currentId: null,
    inQueueIds: [],
    visitedIds: [...visited],
    queue: [],
    output: [...output],
    description: `✅ Level-Order (BFS) Traversal Complete! Queue is empty. Output: [${output.join(", ")}]`,
    status: "done",
  });

  return steps;
}
