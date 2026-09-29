import { describe, it, expect } from 'vitest';
import { generateSteps as generateLinearSteps } from '../../src/algorithms/linearSearch';
import { generateSteps as generateBinarySteps } from '../../src/algorithms/binarySearch';

describe('Searching Algorithm Step Recorders', () => {
  describe('Linear Search', () => {
    const array = [12, 45, 78, 23, 56, 89, 34];

    it('finds target at the beginning of array', () => {
      const steps = generateLinearSteps(array, 12);
      expect(steps.length).toBeGreaterThan(0);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(0);
    });

    it('finds target in the middle of array', () => {
      const steps = generateLinearSteps(array, 23);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(3);
    });

    it('finds target at the end of array', () => {
      const steps = generateLinearSteps(array, 34);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(6);
    });

    it('correctly reports target not found', () => {
      const steps = generateLinearSteps(array, 999);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBeNull();
      expect(finalFrame.eliminated.size).toBe(array.length);
    });

    it('handles empty input gracefully', () => {
      const steps = generateLinearSteps([], 10);
      expect(steps).toEqual([]);
    });

    it('handles single-element array', () => {
      const matchSteps = generateLinearSteps([50], 50);
      expect(matchSteps[matchSteps.length - 1].found).toBe(0);

      const missSteps = generateLinearSteps([50], 99);
      expect(missSteps[missSteps.length - 1].found).toBeNull();
    });
  });

  describe('Binary Search', () => {
    const sortedArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];

    it('finds target at exact initial midpoint', () => {
      const steps = generateBinarySteps(sortedArray, 50);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(4);
    });

    it('finds target on left boundary', () => {
      const steps = generateBinarySteps(sortedArray, 10);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(0);
    });

    it('finds target on right boundary', () => {
      const steps = generateBinarySteps(sortedArray, 90);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(8);
    });

    it('finds target in left partition', () => {
      const steps = generateBinarySteps(sortedArray, 20);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(1);
    });

    it('finds target in right partition', () => {
      const steps = generateBinarySteps(sortedArray, 80);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(7);
    });

    it('reports target not found when smaller than minimum', () => {
      const steps = generateBinarySteps(sortedArray, 5);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBeNull();
    });

    it('reports target not found when greater than maximum', () => {
      const steps = generateBinarySteps(sortedArray, 100);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBeNull();
    });

    it('reports target not found between existing elements', () => {
      const steps = generateBinarySteps(sortedArray, 35);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBeNull();
    });

    it('handles even-length arrays correctly', () => {
      const evenArr = [2, 4, 6, 8, 10, 12];
      const steps = generateBinarySteps(evenArr, 8);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.found).toBe(3);
    });

    it('handles empty input array', () => {
      const steps = generateBinarySteps([], 42);
      expect(steps).toEqual([]);
    });
  });
});
