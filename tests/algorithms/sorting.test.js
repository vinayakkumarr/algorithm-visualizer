import { describe, it, expect } from 'vitest';
import { generateSteps as generateBubbleSteps } from '../../src/algorithms/bubbleSort';
import { generateSteps as generateSelectionSteps } from '../../src/algorithms/selectionSort';
import { generateSteps as generateInsertionSteps } from '../../src/algorithms/insertionSort';
import { generateSteps as generateMergeSteps } from '../../src/algorithms/mergeSort';
import { generateSteps as generateQuickSteps } from '../../src/algorithms/quickSort';

function isSortedAscending(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] > arr[i + 1]) return false;
  }
  return true;
}

function hasSameElements(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  const count = (arr) => arr.reduce((acc, x) => ({ ...acc, [x]: (acc[x] || 0) + 1 }), {});
  const c1 = count(arr1);
  const c2 = count(arr2);
  return Object.keys(c1).every((k) => c1[k] === c2[k]);
}

describe('Sorting Algorithm Step Recorders', () => {
  const testCases = [
    { name: 'standard unsorted array', input: [5, 1, 4, 2, 8] },
    { name: 'already sorted array', input: [1, 2, 3, 4, 5] },
    { name: 'reverse sorted array', input: [9, 7, 5, 3, 1] },
    { name: 'array with duplicate elements', input: [4, 2, 2, 8, 4, 1] },
    { name: 'single-element array', input: [42] },
    { name: 'two-element inverted array', input: [10, 3] },
    { name: 'two-element sorted array', input: [3, 10] },
    { name: 'empty array', input: [] },
  ];

  describe('Bubble Sort', () => {
    testCases.forEach(({ name, input }) => {
      it(`correctly sorts ${name}`, () => {
        const steps = generateBubbleSteps(input);
        if (input.length === 0) {
          expect(steps).toEqual([]);
          return;
        }
        expect(steps.length).toBeGreaterThan(0);
        const finalFrame = steps[steps.length - 1];
        expect(isSortedAscending(finalFrame.array)).toBe(true);
        expect(hasSameElements(input, finalFrame.array)).toBe(true);
        expect(finalFrame.done.size).toBe(input.length);
      });
    });

    it('generates immutable snapshot frames', () => {
      const input = [5, 2, 8, 1];
      const steps = generateBubbleSteps(input);
      const initialFrameArray = [...steps[0].array];

      // Mutating later frames must not alter earlier frames
      expect(steps[0].array).toEqual(initialFrameArray);
      expect(steps[0].array).toEqual([5, 2, 8, 1]);
    });
  });

  describe('Selection Sort', () => {
    testCases.forEach(({ name, input }) => {
      it(`correctly sorts ${name}`, () => {
        const steps = generateSelectionSteps(input);
        if (input.length === 0) {
          expect(steps).toEqual([]);
          return;
        }
        expect(steps.length).toBeGreaterThan(0);
        const finalFrame = steps[steps.length - 1];
        expect(isSortedAscending(finalFrame.array)).toBe(true);
        expect(hasSameElements(input, finalFrame.array)).toBe(true);
        expect(finalFrame.done.size).toBe(input.length);
      });
    });
  });

  describe('Insertion Sort', () => {
    testCases.forEach(({ name, input }) => {
      it(`correctly sorts ${name}`, () => {
        const steps = generateInsertionSteps(input);
        if (input.length === 0) {
          expect(steps).toEqual([]);
          return;
        }
        expect(steps.length).toBeGreaterThan(0);
        const finalFrame = steps[steps.length - 1];
        expect(isSortedAscending(finalFrame.array)).toBe(true);
        expect(hasSameElements(input, finalFrame.array)).toBe(true);
        expect(finalFrame.done.size).toBe(input.length);
      });
    });
  });

  describe('Merge Sort', () => {
    testCases.forEach(({ name, input }) => {
      it(`correctly sorts ${name}`, () => {
        const steps = generateMergeSteps(input);
        if (input.length === 0) {
          expect(steps).toEqual([]);
          return;
        }
        expect(steps.length).toBeGreaterThan(0);
        const finalFrame = steps[steps.length - 1];
        expect(isSortedAscending(finalFrame.array)).toBe(true);
        expect(hasSameElements(input, finalFrame.array)).toBe(true);
        expect(finalFrame.done.size).toBe(input.length);
      });
    });
  });

  describe('Quick Sort (Lomuto Partition)', () => {
    testCases.forEach(({ name, input }) => {
      it(`correctly sorts ${name}`, () => {
        const steps = generateQuickSteps(input);
        if (input.length === 0) {
          expect(steps).toEqual([]);
          return;
        }
        expect(steps.length).toBeGreaterThan(0);
        const finalFrame = steps[steps.length - 1];
        expect(isSortedAscending(finalFrame.array)).toBe(true);
        expect(hasSameElements(input, finalFrame.array)).toBe(true);
        expect(finalFrame.done.size).toBe(input.length);
      });
    });
  });
});
