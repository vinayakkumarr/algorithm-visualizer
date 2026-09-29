/**
 * theoryManifest.js — Metadata registry for algorithm theory discovery.
 * Enables lightweight route lookup without loading full theory datasets upfront.
 */

export const THEORY_MANIFEST = {
  bubbleSort: "Bubble Sort",
  selectionSort: "Selection Sort",
  insertionSort: "Insertion Sort",
  mergeSort: "Merge Sort",
  quickSort: "Quick Sort",
  linearSearch: "Linear Search",
  binarySearch: "Binary Search",
  stack: "Stack (Push & Pop)",
  linkedList: "Linked List (Traversal)",
  bstInsertion: "Binary Search Tree (BST)",
  bfs: "Breadth-First Search (BFS)",
  dfs: "Depth-First Search (DFS)",
  balancedParens: "Balanced Parentheses",
  nextGreaterElement: "Next Greater Element",
  enqueueDequeue: "Queue (Enqueue & Dequeue)",
  circularQueue: "Circular Queue (Ring Buffer)",
  priorityQueue: "Priority Queue (Binary Heap)",
  singlyInsertDelete: "Singly Linked List (Insert & Delete)",
  reverseList: "Reverse Linked List",
  detectCycle: "Detect Cycle in Linked List",
  doublyInsertDelete: "Doubly Linked List (Insert & Delete)",
  inorderTraversal: "Inorder Traversal (LNR)",
  preorderTraversal: "Preorder Traversal (NLR)",
  postorderTraversal: "Postorder Traversal (LRN)",
  minHeap: "Min Heap",
  maxHeap: "Max Heap",
  dijkstra: "Dijkstra's Algorithm",
  bellmanFord: "Bellman-Ford Algorithm",
};

/**
 * Resolves the matching theory key from an explicit key or algorithm page title.
 * @param {string} [title] - Algorithm page title
 * @param {string} [theoryKey] - Explicit theory key
 * @returns {string|null} The resolved theory key, or null if no match.
 */
export function resolveTheoryKey(title, theoryKey) {
  if (theoryKey && THEORY_MANIFEST[theoryKey]) return theoryKey;
  if (!title) return null;
  const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (const [key, manifestTitle] of Object.entries(THEORY_MANIFEST)) {
    const normKey = key.toLowerCase();
    const normTitle = manifestTitle.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (
      normalized.includes(normKey) ||
      normTitle.includes(normalized) ||
      normalized.includes(normTitle)
    ) {
      return key;
    }
  }
  return null;
}
