import { describe, it, expect } from 'vitest';
import { THEORY_DATA, PATH_TO_THEORY_KEY } from '../../src/data/theoryData';

describe('Theory Data Registry Validation', () => {
  const allTopicKeys = Object.keys(THEORY_DATA);

  it('contains exactly 28 documented algorithm topics', () => {
    expect(allTopicKeys.length).toBe(28);
  });

  allTopicKeys.forEach((key) => {
    describe(`Topic: ${key}`, () => {
      const topic = THEORY_DATA[key];

      it('has required top-level metadata', () => {
        expect(topic.title).toBeTypeOf('string');
        expect(topic.title.length).toBeGreaterThan(0);
        expect(topic.category).toBeTypeOf('string');
        expect(topic.whatIsIt).toBeTypeOf('string');
      });

      it('has complete complexity analysis', () => {
        expect(topic.complexity).toBeDefined();
        expect(topic.complexity.worst).toBeDefined();
        expect(topic.complexity.space).toBeDefined();
      });

      it('has worked numerical execution trace', () => {
        expect(topic.workedExample).toBeDefined();
        expect(topic.workedExample.input).toBeDefined();
        expect(Array.isArray(topic.workedExample.steps)).toBe(true);
        expect(topic.workedExample.steps.length).toBeGreaterThan(0);
      });
    });
  });

  it('maps all 28 URL route paths to valid topic keys', () => {
    const routeEntries = Object.entries(PATH_TO_THEORY_KEY);
    expect(routeEntries.length).toBe(28);

    routeEntries.forEach(([routePath, topicKey]) => {
      expect(routePath.startsWith('/')).toBe(true);
      expect(THEORY_DATA[topicKey]).toBeDefined();
    });
  });
});
