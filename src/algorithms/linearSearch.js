/**
 * linearSearch.js — Pure step recorder for Linear Search.
 *
 * generateSteps(inputArray, target)
 *   Walks the array from left to right and returns frames:
 *   {
 *     array:      number[]     — (unchanged) original array
 *     checking:   number|null  — index currently being examined  (amber)
 *     found:      number|null  — index where target lives         (green)
 *     eliminated: Set<number>  — indices already ruled out        (gray)
 *   }
 *
 * Frame types:
 *   INIT       — baseline, nothing active yet
 *   CHECK      — checking=i, eliminated=all indices before i
 *   FOUND      — found=i (checking cleared)
 *   NOT_FOUND  — found=null, eliminated=all indices
 */
export const PSEUDOCODE = [
  "procedure linearSearch(A, target):",
  "  for i = 0 to n - 1:",
  "    if A[i] == target:",
  "      return i",
  "  return not found",
];

export function generateSteps(inputArray, target) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) return [];

  const arr        = [...inputArray];
  const steps      = [];
  const eliminated = new Set();

  // INIT
  steps.push({
    array:      arr,
    checking:   null,
    found:      null,
    eliminated: new Set(),
    activeLine: 0,
    narrative:  `Starting linear search for target ${target} across ${arr.length} elements.`,
  });

  for (let i = 0; i < arr.length; i++) {
    // CHECK
    steps.push({
      array:      arr,
      checking:   i,
      found:      null,
      eliminated: new Set(eliminated),
      activeLine: 2,
      narrative:  `Checking index ${i}: arr[${i}] = ${arr[i]} vs target ${target}.`,
    });

    if (arr[i] === target) {
      // FOUND
      steps.push({
        array:      arr,
        checking:   null,
        found:      i,
        eliminated: new Set(eliminated),
        activeLine: 3,
        narrative:  `Match found! arr[${i}] == ${target} at index ${i}.`,
      });
      return steps;
    }

    // Element was not a match — mark as eliminated
    eliminated.add(i);
  }

  // NOT_FOUND
  steps.push({
    array:      arr,
    checking:   null,
    found:      null,
    eliminated: new Set(eliminated),
    activeLine: 4,
    narrative:  `Reached end of array. Target ${target} was not found.`,
  });

  return steps;
}

/** Unsorted random array of `size` integers in [10, 99]. */
export function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

/** Map speed level (1–10) → animation delay in ms (600 ms → 10 ms). */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
