import { describe, it, expect } from 'vitest';
import { THEORY_DATA } from '../../src/data/theoryData';

describe('Pseudocode Architecture Integrity', () => {
  const allTopicKeys = Object.keys(THEORY_DATA);

  it('verifies that every topic contains a valid pseudocode specification', () => {
    allTopicKeys.forEach((key) => {
      const topic = THEORY_DATA[key];
      expect(topic.pseudocode).toBeDefined();

      const { pseudocode } = topic;
      const hasSingleCode = typeof pseudocode.code === 'string' && pseudocode.code.trim().length > 0;
      const hasMultiOperations = Array.isArray(pseudocode.operations) && pseudocode.operations.length > 0;

      expect(hasSingleCode || hasMultiOperations).toBe(true);

      if (hasMultiOperations) {
        pseudocode.operations.forEach((op) => {
          expect(op.name).toBeTypeOf('string');
          expect(op.code).toBeTypeOf('string');
          expect(op.code.trim().length).toBeGreaterThan(0);
          expect(op.complexity).toBeTypeOf('string');
          expect(op.description).toBeTypeOf('string');
        });
      }
    });
  });

  it('verifies multi-operation coverage for multi-action data structures', () => {
    const multiOpTopics = [
      'singlyInsertDelete',
      'doublyInsertDelete',
      'bstInsertion',
      'minHeap',
      'maxHeap',
      'stack',
      'enqueueDequeue',
      'circularQueue',
      'priorityQueue',
    ];

    multiOpTopics.forEach((topicKey) => {
      const topic = THEORY_DATA[topicKey];
      expect(Array.isArray(topic.pseudocode.operations)).toBe(true);
      expect(topic.pseudocode.operations.length).toBeGreaterThanOrEqual(3);
    });
  });
});
