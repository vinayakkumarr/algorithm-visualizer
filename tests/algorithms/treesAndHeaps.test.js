import { describe, it, expect } from 'vitest';
import {
  buildTreeFromValues,
  generateInsertSteps as generateBSTInsert,
  generateSearchSteps as generateBSTSearch,
  generateDeleteSteps as generateBSTDelete,
  generateInorderSteps,
  generatePreorderSteps,
  generatePostorderSteps,
  generateBFSSteps,
} from '../../src/algorithms/bstAlgorithms';
import {
  createInitialHeap,
  generateHeapInsertSteps,
  generateHeapExtractSteps,
} from '../../src/algorithms/heapAlgorithms';

function isMinHeap(heap) {
  for (let i = 0; i < heap.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < heap.length && heap[i] > heap[left]) return false;
    if (right < heap.length && heap[i] > heap[right]) return false;
  }
  return true;
}

function isMaxHeap(heap) {
  for (let i = 0; i < heap.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    if (left < heap.length && heap[i] < heap[left]) return false;
    if (right < heap.length && heap[i] < heap[right]) return false;
  }
  return true;
}

describe('Tree and Heap Algorithm Engines', () => {
  describe('Binary Search Tree (BST)', () => {
    const nextIdRef = { current: 1 };
    const initialValues = [50, 25, 75, 12, 37, 62, 87];

    it('searches existing and non-existing keys correctly', () => {
      const tree = buildTreeFromValues(initialValues, nextIdRef);
      const foundSteps = generateBSTSearch(tree, 37);
      expect(foundSteps.found).toBe(true);

      const missSteps = generateBSTSearch(tree, 99);
      expect(missSteps.found).toBe(false);
    });

    it('inserts a new leaf preserving BST ordering invariants', () => {
      const tree = buildTreeFromValues(initialValues, nextIdRef);
      const { newRoot } = generateBSTInsert(tree, 65, nextIdRef.current++);
      const inorder = generateInorderSteps(newRoot);
      const finalOutput = inorder[inorder.length - 1].output;
      expect(finalOutput).toEqual([12, 25, 37, 50, 62, 65, 75, 87]);
    });

    it('deletes a leaf node (Case 1)', () => {
      const tree = buildTreeFromValues(initialValues, nextIdRef);
      const { newRoot, deleted } = generateBSTDelete(tree, 12);
      expect(deleted).toBe(true);
      const inorder = generateInorderSteps(newRoot);
      const finalOutput = inorder[inorder.length - 1].output;
      expect(finalOutput).toEqual([25, 37, 50, 62, 75, 87]);
    });

    it('deletes a node with 2 children using in-order successor (Case 3)', () => {
      const tree = buildTreeFromValues(initialValues, nextIdRef);
      // Delete root 50: successor is 62
      const { newRoot, deleted } = generateBSTDelete(tree, 50);
      expect(deleted).toBe(true);
      expect(newRoot.value).toBe(62);
      const inorder = generateInorderSteps(newRoot);
      const finalOutput = inorder[inorder.length - 1].output;
      expect(finalOutput).toEqual([12, 25, 37, 62, 75, 87]);
    });

    it('computes exact traversal order for Inorder, Preorder, Postorder, and BFS', () => {
      const tree = buildTreeFromValues(initialValues, nextIdRef);

      const inSteps = generateInorderSteps(tree);
      expect(inSteps[inSteps.length - 1].output).toEqual([12, 25, 37, 50, 62, 75, 87]);

      const preSteps = generatePreorderSteps(tree);
      expect(preSteps[preSteps.length - 1].output).toEqual([50, 25, 12, 37, 75, 62, 87]);

      const postSteps = generatePostorderSteps(tree);
      expect(postSteps[postSteps.length - 1].output).toEqual([12, 37, 25, 62, 87, 75, 50]);

      const bfsSteps = generateBFSSteps(tree);
      expect(bfsSteps[bfsSteps.length - 1].output).toEqual([50, 25, 75, 12, 37, 62, 87]);
    });
  });

  describe('Binary Heaps (Min-Heap & Max-Heap)', () => {
    it('constructs a valid Min-Heap from arbitrary array', () => {
      const heap = createInitialHeap([45, 20, 14, 12, 31, 7, 11], 'min');
      expect(isMinHeap(heap)).toBe(true);
    });

    it('constructs a valid Max-Heap from arbitrary array', () => {
      const heap = createInitialHeap([45, 20, 14, 12, 31, 7, 11], 'max');
      expect(isMaxHeap(heap)).toBe(true);
    });

    it('inserts into Min-Heap and preserves invariant', () => {
      const heap = createInitialHeap([10, 20, 30], 'min');
      const steps = generateHeapInsertSteps(heap, 5, 'min');
      const finalHeap = steps[steps.length - 1].finalHeap;
      expect(isMinHeap(finalHeap)).toBe(true);
      expect(finalHeap[0]).toBe(5);
    });

    it('extracts maximum from Max-Heap and reheapifies', () => {
      const heap = createInitialHeap([50, 30, 40, 10, 20], 'max');
      const steps = generateHeapExtractSteps(heap, 'max');
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(isMaxHeap(finalFrame.finalHeap)).toBe(true);
    });
  });
});
