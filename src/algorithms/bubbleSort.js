/**
 * bubbleSort.js — Pure algorithm step recorder.
 *
 * generateSteps(inputArray)
 *   Returns an array of snapshot frames. Each frame:
 *   {
 *     array:     number[]      — full array state at this moment
 *     comparing: number[]      — indices currently being compared  (max 2)
 *     swapped:   number[]      — indices that were just swapped     (max 2)
 *     done:      Set<number>   — indices permanently in final position
 *   }
 *
 * Frame types emitted (in order):
 *   1. COMPARE  — before deciding whether to swap
 *   2. SWAP     — immediately after a swap occurs (array already mutated)
 *   3. PASS_END — one pass done; rightmost unsorted element is now sorted
 *   4. FINAL    — all elements sorted; every index is in `done`
 *
 * No side-effects. Safe to call with any numeric array.
 */

export const PSEUDOCODE = [
  "procedure bubbleSort(A):",
  "  for i = 0 to n-2:",
  "    for j = 0 to n-2-i:",
  "      if A[j] > A[j+1]:",
  "        swap(A[j], A[j+1])",
  "    mark A[n-1-i] as sorted",
  "  mark A[0] as sorted",
];

export function generateSteps(inputArray) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) return [];

  const arr   = [...inputArray];   // working copy — never mutate the input
  const steps = [];
  const done  = new Set();         // grows as passes complete
  const n     = arr.length;

  for (let pass = 0; pass < n - 1; pass++) {
    const unsortedEnd = n - 1 - pass; // last index still being bubbled

    for (let j = 0; j < unsortedEnd; j++) {
      // Step 1: COMPARE
      steps.push({
        array:      [...arr],
        comparing:  [j, j + 1],
        swapped:    [],
        done:       new Set(done),
        activeLine: 3,
        narrative:  `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
      });

      // Step 2: SWAP (only if out of order)
      if (arr[j] > arr[j + 1]) {
        const oldLeft  = arr[j];
        const oldRight = arr[j + 1];
        // Perform the swap on the working copy
        arr[j]     = oldRight;
        arr[j + 1] = oldLeft;

        steps.push({
          array:      [...arr],
          comparing:  [],
          swapped:    [j, j + 1],
          done:       new Set(done),
          activeLine: 4,
          narrative:  `${oldLeft} > ${oldRight}: out of order. Swapping indices ${j} and ${j + 1}.`,
        });
      }
    }

    // Step 3: PASS_END — the element that bubbled to its slot
    done.add(unsortedEnd);
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [],
      done:       new Set(done),
      activeLine: 5,
      narrative:  `Pass complete. Element ${arr[unsortedEnd]} is now in its final position at index ${unsortedEnd}.`,
    });
  }

  // The very first element is also sorted after n-1 passes
  done.add(0);

  // Step 4: FINAL
  steps.push({
    array:      [...arr],
    comparing:  [],
    swapped:    [],
    done:       new Set(done),
    activeLine: 6,
    narrative:  `Sort complete! All ${n} elements are in ascending order.`,
  });

  return steps;
}

/** Convenience: generate a random array of `size` integers in [10, 99] */
export function randomArray(size) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
}

/** Map a speed level (1–10) to an animation delay in ms (600ms → 10ms) */
export function speedToMs(level) {
  // level 1  → 600 ms  (slowest)
  // level 10 → 10  ms  (fastest)
  return Math.round(600 - (level - 1) * (590 / 9));
}
