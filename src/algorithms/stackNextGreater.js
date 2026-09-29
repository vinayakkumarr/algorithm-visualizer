/**
 * stackNextGreater.js — Step generator for Next Greater Element (NGE) using Monotonic Stack.
 *
 * For each element in array A, finds the first element to its right that is strictly greater.
 * If none exists, records -1.
 *
 * Time Complexity: O(n) — each element is pushed and popped at most once.
 * Space Complexity: O(n) auxiliary stack space.
 */

export const PSEUDOCODE_NEXT_GREATER = [
  "procedure nextGreaterElement(A):",
  "  n = length(A); result = array of size n filled with -1",
  "  stack = new Stack()",
  "  for i from n - 1 down to 0:",
  "    while not stack.isEmpty() and stack.top() <= A[i]:",
  "      stack.pop() (Remove smaller elements that cannot be NGE)",
  "    if not stack.isEmpty():",
  "      result[i] = stack.top() (First greater element found)",
  "    stack.push(A[i]) (Candidate NGE for elements to the left)",
  "  return result",
];

/**
 * Generates frame-by-frame execution trace for Next Greater Element algorithm.
 * @param {Array<number>} inputArray - Array of integers
 * @returns {Array<Object>} Array of StepFrames
 */
export function generateNextGreaterSteps(inputArray) {
  const arr = Array.isArray(inputArray) && inputArray.length > 0
    ? [...inputArray]
    : [4, 5, 2, 25, 7, 18];

  const n = arr.length;
  const result = new Array(n).fill(null); // null represents unresolved, -1 represents no greater
  const stack = []; // array of { val, index, id }
  let nextStackId = 1;
  const steps = [];

  const makeSnapshot = (currI, poppedVal = null, statusMsg = "") => {
    return {
      array: arr.map((val, idx) => ({
        val,
        index: idx,
        isCurrent: idx === currI,
        isResolved: result[idx] !== null,
        nge: result[idx],
      })),
      result: [...result],
      stack: [...stack],
      currentIndex: currI,
      poppedVal,
      statusMsg,
    };
  };

  // Frame 0: Init
  steps.push({
    ...makeSnapshot(-1, null, "Ready"),
    activeLine: 1,
    pseudocode: PSEUDOCODE_NEXT_GREATER,
    narrative: `Initialized NGE algorithm for array [${arr.join(", ")}]. Scanning right-to-left from index ${n - 1}.`,
    isTerminal: false,
  });

  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];

    // Inspect current element
    steps.push({
      ...makeSnapshot(i, null, `Evaluating A[${i}] = ${val}`),
      activeLine: 3,
      pseudocode: PSEUDOCODE_NEXT_GREATER,
      narrative: `Inspecting element A[${i}] = ${val}. Checking top of monotonic stack for elements <= ${val}.`,
      isTerminal: false,
    });

    // Pop smaller or equal elements
    while (stack.length > 0 && stack[stack.length - 1].val <= val) {
      const popped = stack.pop();
      steps.push({
        ...makeSnapshot(i, popped.val, `Popped ${popped.val} <= ${val}`),
        activeLine: 5,
        pseudocode: PSEUDOCODE_NEXT_GREATER,
        narrative: `Popped ${popped.val} from stack because ${popped.val} ≤ ${val} (it will never be the next greater element for elements to the left).`,
        isTerminal: false,
      });
    }

    // Determine NGE
    if (stack.length > 0) {
      result[i] = stack[stack.length - 1].val;
      steps.push({
        ...makeSnapshot(i, null, `NGE[${i}] = ${result[i]}`),
        activeLine: 7,
        pseudocode: PSEUDOCODE_NEXT_GREATER,
        narrative: `Stack top is ${result[i]} (> ${val}). Found Next Greater Element: NGE[${i}] = ${result[i]}.`,
        isTerminal: false,
      });
    } else {
      result[i] = -1;
      steps.push({
        ...makeSnapshot(i, null, `NGE[${i}] = -1 (None)`),
        activeLine: 6,
        pseudocode: PSEUDOCODE_NEXT_GREATER,
        narrative: `Stack is empty! No element to the right of A[${i}] is greater than ${val}. Recorded NGE[${i}] = -1.`,
        isTerminal: false,
      });
    }

    // Push current element onto stack
    stack.push({ val, index: i, id: nextStackId++ });
    steps.push({
      ...makeSnapshot(i, null, `Pushed ${val} to stack`),
      activeLine: 8,
      pseudocode: PSEUDOCODE_NEXT_GREATER,
      narrative: `Pushed A[${i}] = ${val} onto monotonic stack as candidate NGE for remaining leftward elements.`,
      isTerminal: false,
    });
  }

  // Final Terminal Frame
  steps.push({
    ...makeSnapshot(-1, null, "Complete"),
    activeLine: 9,
    pseudocode: PSEUDOCODE_NEXT_GREATER,
    narrative: `Execution Complete! Final Next Greater Element array: [${result.join(", ")}]. Total time: O(n).`,
    isTerminal: true,
  });

  return steps;
}
