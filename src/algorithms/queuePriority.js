/**
 * queuePriority.js — Step generator and state machine for Priority Queue using a Binary Min-Heap.
 *
 * Each element possesses a value and a priority number (lower number = higher urgency).
 * Always serves the element with lowest priority value in O(log n) time.
 *
 * Time Complexity:
 *   - Insert / Enqueue: O(log n)
 *   - Extract Min / Dequeue: O(log n)
 *   - Peek: O(1)
 * Auxiliary Space: O(n) heap array storage.
 */

export const PSEUDOCODE_PRIORITY_QUEUE = {
  insert: [
    "procedure insert(value, priority):",
    "  heap.push({ value, priority })",
    "  i = heap.length - 1",
    "  while i > 0 and heap[i].priority < heap[parent(i)].priority:",
    "    swap(heap[i], heap[parent(i)])",
    "    i = parent(i)",
  ],
  extractMin: [
    "procedure extractMin():",
    "  if heap.isEmpty(): throw UnderflowError",
    "  minItem = heap[0]",
    "  heap[0] = heap.popLast()",
    "  siftDown(0):",
    "    smallest = argmin(self, left, right)",
    "    if smallest != i: swap & continue",
    "  return minItem",
  ],
};

let nextItemId = 1;

export function createPriorityQueue(initialItems = []) {
  const defaultItems = initialItems.length > 0
    ? initialItems
    : [
        { value: "Task C", priority: 3 },
        { value: "Task A", priority: 1 },
        { value: "Task B", priority: 2 },
        { value: "Task D", priority: 5 },
      ];

  const heap = [];

  for (const item of defaultItems) {
    const node = { id: nextItemId++, value: item.value, priority: Number(item.priority) };
    heap.push(node);
    // Sift up
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (heap[i].priority < heap[p].priority) {
        const tmp = heap[i];
        heap[i] = heap[p];
        heap[p] = tmp;
        i = p;
      } else {
        break;
      }
    }
  }

  return { heap };
}

export function generatePQInsertSteps(pqState, value, priority) {
  const heap = pqState.heap.map((item) => ({ ...item }));
  const steps = [];
  const newItem = { id: nextItemId++, value: String(value), priority: Number(priority) };

  const makeSnapshot = (activeIdx = null, swapIdx = null, action = "") => ({
    heap: heap.map((item, idx) => ({
      ...item,
      index: idx,
      isActive: idx === activeIdx,
      isSwap: idx === swapIdx,
    })),
    action,
    operationType: "insert",
  });

  // Step 1: Append to end of heap
  heap.push(newItem);
  let currIdx = heap.length - 1;

  steps.push({
    ...makeSnapshot(currIdx, null, "Append to Heap End"),
    activeLine: 1,
    pseudocode: PSEUDOCODE_PRIORITY_QUEUE.insert,
    narrative: `Appended new item "${value}" (priority ${priority}) at index [${currIdx}] of binary heap.`,
    isTerminal: false,
  });

  // Sift Up
  while (currIdx > 0) {
    const parentIdx = Math.floor((currIdx - 1) / 2);

    steps.push({
      ...makeSnapshot(currIdx, parentIdx, "Compare with Parent"),
      activeLine: 3,
      pseudocode: PSEUDOCODE_PRIORITY_QUEUE.insert,
      narrative: `Comparing item [${currIdx}] (priority ${heap[currIdx].priority}) with parent [${parentIdx}] (priority ${heap[parentIdx].priority}).`,
      isTerminal: false,
    });

    if (heap[currIdx].priority < heap[parentIdx].priority) {
      // Swap with parent
      const tmp = heap[currIdx];
      heap[currIdx] = heap[parentIdx];
      heap[parentIdx] = tmp;

      steps.push({
        ...makeSnapshot(parentIdx, currIdx, "Sift Up Swap"),
        activeLine: 4,
        pseudocode: PSEUDOCODE_PRIORITY_QUEUE.insert,
        narrative: `Priority ${tmp.priority} < ${heap[currIdx].priority}: Swapped item up to index [${parentIdx}].`,
        isTerminal: false,
      });

      currIdx = parentIdx;
    } else {
      steps.push({
        ...makeSnapshot(currIdx, parentIdx, "Heap Order Restored"),
        activeLine: 3,
        pseudocode: PSEUDOCODE_PRIORITY_QUEUE.insert,
        narrative: `Priority ${heap[currIdx].priority} ≥ Parent's priority ${heap[parentIdx].priority}. Min-Heap invariant satisfied!`,
        isTerminal: false,
      });
      break;
    }
  }

  // Final Terminal Frame
  steps.push({
    ...makeSnapshot(currIdx, null, "Insert Complete"),
    activeLine: 5,
    pseudocode: PSEUDOCODE_PRIORITY_QUEUE.insert,
    narrative: `Insertion complete! Item "${value}" settled at index [${currIdx}]. Heap size is now ${heap.length}.`,
    isTerminal: true,
    finalState: { heap },
  });

  return steps;
}

export function generatePQExtractMinSteps(pqState) {
  const heap = pqState.heap.map((item) => ({ ...item }));
  const steps = [];

  const makeSnapshot = (activeIdx = null, swapIdx = null, action = "") => ({
    heap: heap.map((item, idx) => ({
      ...item,
      index: idx,
      isActive: idx === activeIdx,
      isSwap: idx === swapIdx,
    })),
    action,
    operationType: "extractMin",
  });

  if (heap.length === 0) {
    steps.push({
      ...makeSnapshot(null, null, "Empty Underflow"),
      activeLine: 1,
      pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
      narrative: "Priority Queue Underflow! Heap is empty. Cannot extract minimum.",
      isTerminal: true,
      error: "Queue Empty",
      finalState: { heap },
    });
    return steps;
  }

  const minItem = heap[0];

  if (heap.length === 1) {
    heap.pop();
    steps.push({
      ...makeSnapshot(null, null, "Extract Last Element"),
      activeLine: 2,
      pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
      narrative: `Extracted highest priority item "${minItem.value}" (priority ${minItem.priority}). Priority queue is now empty.`,
      isTerminal: true,
      extractedItem: minItem,
      finalState: { heap },
    });
    return steps;
  }

  // Step 1: Move last element to root
  const lastItem = heap.pop();
  heap[0] = lastItem;

  steps.push({
    ...makeSnapshot(0, null, "Move Last to Root"),
    activeLine: 3,
    pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
    narrative: `Extracted root "${minItem.value}" (priority ${minItem.priority}). Moved last element "${lastItem.value}" (priority ${lastItem.priority}) to root index [0].`,
    isTerminal: false,
  });

  // Sift Down
  let i = 0;
  const n = heap.length;

  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let smallest = i;

    if (left < n && heap[left].priority < heap[smallest].priority) {
      smallest = left;
    }
    if (right < n && heap[right].priority < heap[smallest].priority) {
      smallest = right;
    }

    if (smallest !== i) {
      steps.push({
        ...makeSnapshot(i, smallest, "Compare Children"),
        activeLine: 5,
        pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
        narrative: `Child index [${smallest}] (priority ${heap[smallest].priority}) is smaller than current [${i}] (priority ${heap[i].priority}). Swapping...`,
        isTerminal: false,
      });

      const tmp = heap[i];
      heap[i] = heap[smallest];
      heap[smallest] = tmp;

      steps.push({
        ...makeSnapshot(smallest, i, "Sift Down Swap"),
        activeLine: 6,
        pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
        narrative: `Swapped root item down to index [${smallest}]. Continuing sift-down.`,
        isTerminal: false,
      });

      i = smallest;
    } else {
      steps.push({
        ...makeSnapshot(i, null, "Sift Down Complete"),
        activeLine: 6,
        pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
        narrative: `Min-Heap order restored! Element "${heap[i].value}" is smaller than both children.`,
        isTerminal: false,
      });
      break;
    }
  }

  steps.push({
    ...makeSnapshot(i, null, "Extract Min Complete"),
    activeLine: 7,
    pseudocode: PSEUDOCODE_PRIORITY_QUEUE.extractMin,
    narrative: `ExtractMin complete! Served item "${minItem.value}" (priority ${minItem.priority}). Heap size is now ${heap.length}.`,
    isTerminal: true,
    extractedItem: minItem,
    finalState: { heap },
  });

  return steps;
}
