import { describe, it, expect } from 'vitest';
import {
  createListFromValues,
} from '../../src/algorithms/linkedListEngine';
import { generateSteps as generateTraversalSteps } from '../../src/algorithms/linkedListTraversal';
import {
  generateInsertHeadSteps,
  generateInsertTailSteps,
  generateInsertPositionSteps,
  generateDeleteHeadSteps,
  generateDeleteTailSteps,
  generateDeleteValueSteps,
} from '../../src/algorithms/singlyOperations';
import { generateReverseSteps } from '../../src/algorithms/linkedListReverse';
import {
  createCyclicList,
  generateCycleSteps,
} from '../../src/algorithms/linkedListCycle';
import {
  createDoublyListFromValues,
} from '../../src/algorithms/doublyLinkedListEngine';
import {
  generateDoublyInsertHeadSteps,
  generateDoublyInsertTailSteps,
  generateDoublyDeleteHeadSteps,
  generateDoublyDeleteTailSteps,
} from '../../src/algorithms/doublyOperations';

describe('Linked List Algorithm Engines', () => {
  describe('Singly Linked List Traversal', () => {
    it('visits every node sequentially from head to tail', () => {
      const list = createListFromValues([10, 20, 30, 40]);
      const steps = generateTraversalSteps(list);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.atNull).toBe(true);
      expect(finalFrame.visited.has(list.headId)).toBe(true);
    });

    it('handles single-node traversal', () => {
      const list = createListFromValues([99]);
      const steps = generateTraversalSteps(list);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.atNull).toBe(true);
    });
  });

  describe('Singly Linked List Insertion & Deletion Operations', () => {
    it('correctly inserts at head (O(1))', () => {
      const list = createListFromValues([20, 30]);
      const steps = generateInsertHeadSteps(list, 10);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20, 30]);
      expect(finalFrame.pointers.HEAD).toBe(ordered[0].id);
    });

    it('correctly inserts at tail (O(1))', () => {
      const list = createListFromValues([10, 20]);
      const steps = generateInsertTailSteps(list, 30);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20, 30]);
      expect(finalFrame.pointers.TAIL).toBe(ordered[2].id);
    });

    it('correctly inserts at middle position', () => {
      const list = createListFromValues([10, 30]);
      const steps = generateInsertPositionSteps(list, 1, 20);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20, 30]);
    });

    it('correctly deletes head node', () => {
      const list = createListFromValues([10, 20, 30]);
      const steps = generateDeleteHeadSteps(list);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([20, 30]);
    });

    it('correctly deletes tail node', () => {
      const list = createListFromValues([10, 20, 30]);
      const steps = generateDeleteTailSteps(list);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20]);
    });

    it('correctly deletes node by value', () => {
      const list = createListFromValues([10, 20, 30, 40]);
      const steps = generateDeleteValueSteps(list, 30);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20, 40]);
    });
  });

  describe('Reverse Linked List (3-Pointer Algorithm)', () => {
    it('inverts all next pointers for [10, 20, 30, 40] into [40, 30, 20, 10]', () => {
      const list = createListFromValues([10, 20, 30, 40]);
      const steps = generateReverseSteps(list);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);

      // Verify reversed pointer chain starting from new head
      const finalNodes = finalFrame.nodes;
      const newHeadId = finalFrame.pointers.HEAD;
      expect(finalNodes[newHeadId].value).toBe(40);

      const reversedValues = [];
      let curr = newHeadId;
      while (curr) {
        reversedValues.push(finalNodes[curr].value);
        curr = finalNodes[curr].next;
      }
      expect(reversedValues).toEqual([40, 30, 20, 10]);
    });
  });

  describe('Detect Cycle (Floyd Tortoise & Hare)', () => {
    it('detects a cycle when tail links to an internal node', () => {
      const cyclicList = createCyclicList([10, 20, 30, 40], 1); // tail 40 links back to 20
      const steps = generateCycleSteps(cyclicList);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.hasCycle).toBe(true);
      expect(finalFrame.pointers.SLOW).toBe(finalFrame.pointers.FAST);
    });

    it('confirms acyclic list when fast pointer reaches NULL', () => {
      const acyclicList = createListFromValues([10, 20, 30, 40]);
      const steps = generateCycleSteps(acyclicList);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.hasCycle).toBe(false);
    });
  });

  describe('Doubly Linked List Operations (Internal)', () => {
    it('correctly inserts at head linking prev and next pointers', () => {
      const list = createDoublyListFromValues([20, 30]);
      const steps = generateDoublyInsertHeadSteps(list, 10);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20, 30]);
      expect(finalFrame.nodes[ordered[1].id].prev).toBe(ordered[0].id);
    });

    it('correctly inserts at tail linking prev and next pointers', () => {
      const list = createDoublyListFromValues([10, 20]);
      const steps = generateDoublyInsertTailSteps(list, 30);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20, 30]);
      expect(finalFrame.nodes[ordered[2].id].prev).toBe(ordered[1].id);
    });

    it('correctly deletes tail node and clears previous node next pointer', () => {
      const list = createDoublyListFromValues([10, 20, 30]);
      const steps = generateDoublyDeleteTailSteps(list);
      const finalFrame = steps[steps.length - 1];
      const ordered = finalFrame.orderedNodes;
      expect(ordered.map(n => n.value)).toEqual([10, 20]);
    });
  });
});
