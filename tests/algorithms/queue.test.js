import { describe, it, expect } from 'vitest';
import {
  createCircularQueue,
  generateEnqueueSteps as generateCQEnqueue,
  generateDequeueSteps as generateCQDequeue,
} from '../../src/algorithms/queueCircular';
import {
  createPriorityQueue,
  generatePQInsertSteps,
  generatePQExtractMinSteps,
} from '../../src/algorithms/queuePriority';

describe('Queue Algorithm Engines', () => {
  describe('Circular Queue (Ring Buffer)', () => {
    it('initializes circular queue with specified capacity and initial elements', () => {
      const cq = createCircularQueue(5, [10, 20]);
      expect(cq.capacity).toBe(5);
      expect(cq.count).toBe(2);
      expect(cq.buffer[0]).toBe(10);
      expect(cq.buffer[1]).toBe(20);
    });

    it('successfully enqueues an element', () => {
      const cq = createCircularQueue(4, [10, 20]);
      const steps = generateCQEnqueue(cq, 30);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.count).toBe(3);
      expect(finalFrame.buffer[2].value).toBe(30);
      expect(finalFrame.isFull).toBe(false);
    });

    it('detects overflow when attempting to enqueue to full buffer', () => {
      const cq = createCircularQueue(3, [10, 20, 30]);
      const steps = generateCQEnqueue(cq, 40);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.action).toContain('Overflow');
    });

    it('successfully dequeues from front and updates front index', () => {
      const cq = createCircularQueue(4, [10, 20, 30]);
      const steps = generateCQDequeue(cq);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.count).toBe(2);
      expect(finalFrame.dequeuedValue).toBe(10);
      expect(finalFrame.front).toBe(1);
    });

    it('correctly wraps around buffer with modular arithmetic', () => {
      let cq = createCircularQueue(3, [10, 20, 30]);
      const deqSteps = generateCQDequeue(cq);
      const afterDeq = deqSteps[deqSteps.length - 1];
      const nextCqState = {
        buffer: afterDeq.buffer.map(b => b.value),
        capacity: afterDeq.capacity,
        front: afterDeq.front,
        rear: afterDeq.rear,
        count: afterDeq.count,
      };

      const enqSteps = generateCQEnqueue(nextCqState, 40);
      const finalFrame = enqSteps[enqSteps.length - 1];
      expect(finalFrame.rear).toBe(0);
      expect(finalFrame.buffer[0].value).toBe(40);
      expect(finalFrame.count).toBe(3);
      expect(finalFrame.isFull).toBe(true);
    });
  });

  describe('Priority Queue (Min-Heap Backed)', () => {
    it('serves items in order of priority (lowest number first)', () => {
      const pq = createPriorityQueue([
        { value: 'Medium Task', priority: 3 },
        { value: 'Urgent Task', priority: 1 },
        { value: 'Low Task', priority: 5 },
      ]);

      expect(pq.heap[0].priority).toBe(1);
      expect(pq.heap[0].value).toBe('Urgent Task');
    });

    it('inserts a new highest-priority item and sifts it to the root', () => {
      const pq = createPriorityQueue([
        { value: 'Task B', priority: 5 },
        { value: 'Task C', priority: 8 },
      ]);

      const steps = generatePQInsertSteps(pq, 'Critical Task', 1);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.heap[0].value).toBe('Critical Task');
      expect(finalFrame.heap[0].priority).toBe(1);
    });

    it('extracts the minimum element and maintains heap invariant', () => {
      const pq = createPriorityQueue([
        { value: 'Task A', priority: 1 },
        { value: 'Task B', priority: 4 },
        { value: 'Task C', priority: 2 },
      ]);

      const steps = generatePQExtractMinSteps(pq);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(finalFrame.finalState.heap[0].priority).toBe(2);
    });
  });
});
