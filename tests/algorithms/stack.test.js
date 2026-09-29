import { describe, it, expect } from 'vitest';
import { generateBalancedParensSteps } from '../../src/algorithms/stackBalancedParens';
import { generateNextGreaterSteps } from '../../src/algorithms/stackNextGreater';

describe('Stack Algorithm Engines', () => {
  describe('Balanced Parentheses Validator', () => {
    it('validates properly nested balanced brackets "{[()]}"', () => {
      const steps = generateBalancedParensSteps('{[()]}');
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(finalFrame.isValid).toBe(true);
      expect(finalFrame.stack.length).toBe(0);
    });

    it('validates adjacent balanced groups "()[]{}"', () => {
      const steps = generateBalancedParensSteps('()[]{}');
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(finalFrame.isValid).toBe(true);
    });

    it('detects bracket mismatch "(]"', () => {
      const steps = generateBalancedParensSteps('(]');
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(finalFrame.isValid).toBe(false);
    });

    it('detects unclosed leftover opening brackets "((("', () => {
      const steps = generateBalancedParensSteps('(((');
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(finalFrame.isValid).toBe(false);
      expect(finalFrame.stack.length).toBeGreaterThan(0);
    });

    it('detects premature closing bracket / stack underflow ")"', () => {
      const steps = generateBalancedParensSteps(')');
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.isTerminal).toBe(true);
      expect(finalFrame.isValid).toBe(false);
    });

    it('handles empty string vacuously', () => {
      const steps = generateBalancedParensSteps('');
      expect(steps.length).toBe(1);
      expect(steps[0].isValid).toBe(true);
    });
  });

  describe('Next Greater Element (Monotonic Stack)', () => {
    it('correctly calculates NGE for standard array [4, 5, 2, 25]', () => {
      const steps = generateNextGreaterSteps([4, 5, 2, 25]);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.result).toEqual([5, 25, 25, -1]);
    });

    it('returns all -1 for strictly decreasing sequence [5, 4, 3, 2, 1]', () => {
      const steps = generateNextGreaterSteps([5, 4, 3, 2, 1]);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.result).toEqual([-1, -1, -1, -1, -1]);
    });

    it('returns adjacent elements for strictly increasing sequence [1, 2, 3, 4, 5]', () => {
      const steps = generateNextGreaterSteps([1, 2, 3, 4, 5]);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.result).toEqual([2, 3, 4, 5, -1]);
    });

    it('handles duplicate values correctly [2, 2, 2]', () => {
      const steps = generateNextGreaterSteps([2, 2, 2]);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.result).toEqual([-1, -1, -1]);
    });

    it('handles complex benchmark [4, 5, 2, 25, 7, 18]', () => {
      const steps = generateNextGreaterSteps([4, 5, 2, 25, 7, 18]);
      const finalFrame = steps[steps.length - 1];
      expect(finalFrame.result).toEqual([5, 25, 25, -1, 18, -1]);
    });
  });
});
