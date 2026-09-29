/**
 * stackBalancedParens.js — Step generator for Balanced Parentheses matching using a Stack.
 *
 * Checks if brackets '()', '{}', '[]' in a given string are properly nested and closed.
 * Time Complexity: O(n)
 * Space Complexity: O(n) auxiliary stack space
 */

export const PSEUDOCODE_BALANCED_PARENS = [
  "procedure isBalanced(expression):",
  "  stack = new Stack()",
  "  for each char at index i in expression:",
  "    if char in ['(', '{', '[']:",
  "      stack.push(char)",
  "    else if char in [')', '}', ']']:",
  "      if stack.isEmpty(): return false (Underflow)",
  "      top = stack.pop()",
  "      if not isMatching(top, char): return false (Mismatch)",
  "  return stack.isEmpty() (Valid if empty, invalid if leftovers)",
];

const MATCHING_PAIRS = {
  ")": "(",
  "}": "{",
  "]": "[",
};

const OPENING_BRACKETS = new Set(["(", "{", "["]);
const CLOSING_BRACKETS = new Set([")", "}", "]"]);

/**
 * Generates frame-by-frame execution trace for balanced parentheses validation.
 * @param {string} input - Expression string to validate
 * @returns {Array<Object>} Array of StepFrames
 */
export function generateBalancedParensSteps(input) {
  const chars = typeof input === "string" ? input.split("") : [];
  if (chars.length === 0) {
    return [
      {
        tape: [],
        stack: [],
        currentIndex: -1,
        activeLine: 1,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: "Empty string provided — vacuously balanced.",
        isTerminal: true,
        isValid: true,
      },
    ];
  }

  const steps = [];
  const stack = []; // array of { char, index, id }
  let nextStackId = 1;

  // Helper to create immutable tape snapshot
  const makeTapeSnapshot = (currIdx, statusMap = {}) => {
    return chars.map((ch, idx) => ({
      char: ch,
      index: idx,
      isCurrent: idx === currIdx,
      status: statusMap[idx] || (idx < currIdx ? "processed" : "pending"),
    }));
  };

  const tapeStatus = {};

  // Frame 0: Initialization
  steps.push({
    tape: makeTapeSnapshot(-1),
    stack: [],
    currentIndex: -1,
    activeLine: 1,
    pseudocode: PSEUDOCODE_BALANCED_PARENS,
    narrative: `Initialized Stack for expression "${chars.join("")}". Ready to evaluate ${chars.length} characters.`,
    isTerminal: false,
    isValid: null,
  });

  let hasFailed = false;

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];

    if (OPENING_BRACKETS.has(ch)) {
      // Step: Inspect opening bracket
      tapeStatus[i] = "active";
      steps.push({
        tape: makeTapeSnapshot(i, tapeStatus),
        stack: [...stack],
        currentIndex: i,
        activeLine: 3,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Found opening bracket '${ch}' at index ${i}. Pushing onto stack.`,
        isTerminal: false,
        isValid: null,
      });

      // Push to stack
      const stackItem = { char: ch, index: i, id: nextStackId++ };
      stack.push(stackItem);
      tapeStatus[i] = "pushed";

      steps.push({
        tape: makeTapeSnapshot(i, tapeStatus),
        stack: [...stack],
        currentIndex: i,
        activeLine: 4,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Pushed '${ch}' (from index ${i}) onto Stack. Stack size is now ${stack.length}.`,
        isTerminal: false,
        isValid: null,
      });
    } else if (CLOSING_BRACKETS.has(ch)) {
      // Step: Inspect closing bracket
      tapeStatus[i] = "active";
      steps.push({
        tape: makeTapeSnapshot(i, tapeStatus),
        stack: [...stack],
        currentIndex: i,
        activeLine: 5,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Found closing bracket '${ch}' at index ${i}. Checking stack for matching opening bracket.`,
        isTerminal: false,
        isValid: null,
      });

      // Check underflow
      if (stack.length === 0) {
        tapeStatus[i] = "error";
        steps.push({
          tape: makeTapeSnapshot(i, tapeStatus),
          stack: [],
          currentIndex: i,
          activeLine: 6,
          pseudocode: PSEUDOCODE_BALANCED_PARENS,
          narrative: `Syntax Error: Closing bracket '${ch}' at index ${i} has no matching opening bracket (Stack Underflow). Expression is INVALID.`,
          isTerminal: true,
          isValid: false,
        });
        hasFailed = true;
        break;
      }

      const top = stack.pop();
      const expectedOpening = MATCHING_PAIRS[ch];

      if (top.char !== expectedOpening) {
        tapeStatus[i] = "error";
        tapeStatus[top.index] = "error";
        steps.push({
          tape: makeTapeSnapshot(i, tapeStatus),
          stack: [...stack],
          currentIndex: i,
          activeLine: 8,
          pseudocode: PSEUDOCODE_BALANCED_PARENS,
          narrative: `Mismatch Error: Closing bracket '${ch}' at index ${i} does not match top of stack '${top.char}' from index ${top.index}. Expression is INVALID.`,
          isTerminal: true,
          isValid: false,
        });
        hasFailed = true;
        break;
      }

      // Valid match
      tapeStatus[i] = "matched";
      tapeStatus[top.index] = "matched";
      steps.push({
        tape: makeTapeSnapshot(i, tapeStatus),
        stack: [...stack],
        currentIndex: i,
        activeLine: 7,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Match Confirmed! Popped '${top.char}' (index ${top.index}) to pair with closing '${ch}' (index ${i}). Stack size is now ${stack.length}.`,
        isTerminal: false,
        isValid: null,
      });
    } else {
      // Non-bracket character (e.g. whitespace or operand) - skip
      tapeStatus[i] = "skipped";
      steps.push({
        tape: makeTapeSnapshot(i, tapeStatus),
        stack: [...stack],
        currentIndex: i,
        activeLine: 2,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Character '${ch}' is not a bracket. Skipping index ${i}.`,
        isTerminal: false,
        isValid: null,
      });
    }
  }

  if (!hasFailed) {
    if (stack.length === 0) {
      steps.push({
        tape: makeTapeSnapshot(chars.length, tapeStatus),
        stack: [],
        currentIndex: chars.length,
        activeLine: 9,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Evaluation Complete! All brackets matched and stack is empty. Expression is 100% BALANCED.`,
        isTerminal: true,
        isValid: true,
      });
    } else {
      stack.forEach((item) => {
        tapeStatus[item.index] = "error";
      });
      steps.push({
        tape: makeTapeSnapshot(chars.length, tapeStatus),
        stack: [...stack],
        currentIndex: chars.length,
        activeLine: 9,
        pseudocode: PSEUDOCODE_BALANCED_PARENS,
        narrative: `Unclosed Brackets Error: End of expression reached, but ${stack.length} opening bracket(s) remain unclosed on stack (e.g. '${stack[stack.length - 1].char}'). Expression is INVALID.`,
        isTerminal: true,
        isValid: false,
      });
    }
  }

  return steps;
}
