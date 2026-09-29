/**
 * heapAlgorithms.js — Step generators for Binary Min-Heap and Max-Heap data structures.
 *
 * Implements Complete Binary Tree stored as a contiguous 1D array:
 *   - Parent(i) = floor((i - 1) / 2)
 *   - LeftChild(i) = 2 * i + 1
 *   - RightChild(i) = 2 * i + 2
 *
 * Operations:
 *   - Insert: O(log n)
 *   - Extract (Min / Max): O(log n)
 *   - Build Heap (Heapify): O(n)
 *   - Peek: O(1)
 */

export const PSEUDOCODE_MIN_HEAP = {
  insert: [
    "procedure insert(val):",
    "  heap.append(val); i = heap.length - 1",
    "  while i > 0 and heap[i] < heap[parent(i)]:",
    "    swap(heap[i], heap[parent(i)])",
    "    i = parent(i)",
  ],
  extract: [
    "procedure extractMin():",
    "  if heap.isEmpty(): throw Underflow",
    "  minVal = heap[0]; heap[0] = heap.popLast()",
    "  siftDown(0):",
    "    smallest = min(self, left, right)",
    "    if smallest != i: swap & continue",
    "  return minVal",
  ],
};

export const PSEUDOCODE_MAX_HEAP = {
  insert: [
    "procedure insert(val):",
    "  heap.append(val); i = heap.length - 1",
    "  while i > 0 and heap[i] > heap[parent(i)]:",
    "    swap(heap[i], heap[parent(i)])",
    "    i = parent(i)",
  ],
  extract: [
    "procedure extractMax():",
    "  if heap.isEmpty(): throw Underflow",
    "  maxVal = heap[0]; heap[0] = heap.popLast()",
    "  siftDown(0):",
    "    largest = max(self, left, right)",
    "    if largest != i: swap & continue",
    "  return maxVal",
  ],
};

export function createInitialHeap(values = [], type = "min") {
  const heap = [];
  for (const val of values) {
    heap.push(Number(val));
    let i = heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      const condition = type === "min" ? heap[i] < heap[p] : heap[i] > heap[p];
      if (condition) {
        const tmp = heap[i];
        heap[i] = heap[p];
        heap[p] = tmp;
        i = p;
      } else {
        break;
      }
    }
  }
  return heap;
}

export function generateHeapInsertSteps(baseHeap, value, type = "min") {
  const heap = [...baseHeap];
  const steps = [];
  const val = Number(value);
  const isMin = type === "min";
  const pseudocode = isMin ? PSEUDOCODE_MIN_HEAP.insert : PSEUDOCODE_MAX_HEAP.insert;

  const makeSnapshot = (activeIdx = null, swapIdx = null, action = "") => ({
    heap: heap.map((v, idx) => ({
      index: idx,
      value: v,
      isActive: idx === activeIdx,
      isSwap: idx === swapIdx,
    })),
    action,
    operationType: "insert",
  });

  heap.push(val);
  let curr = heap.length - 1;

  steps.push({
    ...makeSnapshot(curr, null, "Append to End"),
    activeLine: 1,
    pseudocode,
    narrative: `Appended ${val} at the end of the heap (index [${curr}]).`,
    isTerminal: false,
  });

  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2);
    const shouldSwap = isMin ? heap[curr] < heap[parent] : heap[curr] > heap[parent];

    steps.push({
      ...makeSnapshot(curr, parent, "Compare with Parent"),
      activeLine: 2,
      pseudocode,
      narrative: `Comparing child [${curr}] (${heap[curr]}) with parent [${parent}] (${heap[parent]}).`,
      isTerminal: false,
    });

    if (shouldSwap) {
      const tmp = heap[curr];
      heap[curr] = heap[parent];
      heap[parent] = tmp;

      steps.push({
        ...makeSnapshot(parent, curr, "Sift Up Swap"),
        activeLine: 3,
        pseudocode,
        narrative: `Sift-Up: Swapped ${tmp} with parent ${heap[curr]} up to index [${parent}].`,
        isTerminal: false,
      });

      curr = parent;
    } else {
      steps.push({
        ...makeSnapshot(curr, parent, "Heap Invariant Satisfied"),
        activeLine: 2,
        pseudocode,
        narrative: `Heap order invariant satisfied (${isMin ? "Child ≥ Parent" : "Child ≤ Parent"}).`,
        isTerminal: false,
      });
      break;
    }
  }

  steps.push({
    ...makeSnapshot(curr, null, "Insert Complete"),
    activeLine: 4,
    pseudocode,
    narrative: `Insertion complete! ${val} settled at index [${curr}]. Heap size is now ${heap.length}.`,
    isTerminal: true,
    finalHeap: heap,
  });

  return steps;
}

export function generateHeapExtractSteps(baseHeap, type = "min") {
  const heap = [...baseHeap];
  const steps = [];
  const isMin = type === "min";
  const pseudocode = isMin ? PSEUDOCODE_MIN_HEAP.extract : PSEUDOCODE_MAX_HEAP.extract;

  const makeSnapshot = (activeIdx = null, swapIdx = null, action = "") => ({
    heap: heap.map((v, idx) => ({
      index: idx,
      value: v,
      isActive: idx === activeIdx,
      isSwap: idx === swapIdx,
    })),
    action,
    operationType: "extract",
  });

  if (heap.length === 0) {
    steps.push({
      ...makeSnapshot(null, null, "Underflow"),
      activeLine: 1,
      pseudocode,
      narrative: "Heap Underflow! The heap is empty. Cannot extract root.",
      isTerminal: true,
      finalHeap: heap,
    });
    return steps;
  }

  const rootVal = heap[0];

  if (heap.length === 1) {
    heap.pop();
    steps.push({
      ...makeSnapshot(null, null, "Extract Last Element"),
      activeLine: 2,
      pseudocode,
      narrative: `Extracted root ${rootVal}. Heap is now empty.`,
      isTerminal: true,
      finalHeap: heap,
    });
    return steps;
  }

  const lastVal = heap.pop();
  heap[0] = lastVal;

  steps.push({
    ...makeSnapshot(0, null, "Move Last to Root"),
    activeLine: 2,
    pseudocode,
    narrative: `Extracted root ${rootVal}. Moved last leaf element ${lastVal} to root index [0].`,
    isTerminal: false,
  });

  // Sift Down
  let i = 0;
  const n = heap.length;

  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let target = i;

    if (isMin) {
      if (left < n && heap[left] < heap[target]) target = left;
      if (right < n && heap[right] < heap[target]) target = right;
    } else {
      if (left < n && heap[left] > heap[target]) target = left;
      if (right < n && heap[right] > heap[target]) target = right;
    }

    if (target !== i) {
      steps.push({
        ...makeSnapshot(i, target, "Compare with Children"),
        activeLine: 4,
        pseudocode,
        narrative: `Comparing parent [${i}] (${heap[i]}) with child [${target}] (${heap[target]}).`,
        isTerminal: false,
      });

      const tmp = heap[i];
      heap[i] = heap[target];
      heap[target] = tmp;

      steps.push({
        ...makeSnapshot(target, i, "Sift Down Swap"),
        activeLine: 5,
        pseudocode,
        narrative: `Sift-Down: Swapped ${tmp} down to index [${target}].`,
        isTerminal: false,
      });

      i = target;
    } else {
      steps.push({
        ...makeSnapshot(i, null, "Sift Down Complete"),
        activeLine: 5,
        pseudocode,
        narrative: `Heap order invariant satisfied for all children at index [${i}].`,
        isTerminal: false,
      });
      break;
    }
  }

  steps.push({
    ...makeSnapshot(i, null, "Extract Complete"),
    activeLine: 6,
    pseudocode,
    narrative: `Extraction complete! Extracted ${rootVal}. Heap size is now ${heap.length}.`,
    isTerminal: true,
    finalHeap: heap,
  });

  return steps;
}
