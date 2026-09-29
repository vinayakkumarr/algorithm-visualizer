/**
 * mergeSort.js — Pure algorithm step recorder (iterative bottom-up merge sort).
 *
 * generateSteps(inputArray)
 *   Returns an array of snapshot frames:
 *   {
 *     array:     number[]     — full array state at this moment
 *     comparing: number[]     — two indices being compared across subarrays (amber)
 *     swapped:   number[]     — single index being written back to array (red)
 *     done:      Set<number>  — indices in their final global position (green)
 *   }
 *
 * Bottom-up strategy: start with sub-arrays of size 1 and double each pass.
 * This avoids recursion and emits steps in a clean, predictable order.
 *
 * Frame types emitted per merge window [left..mid] ∪ [mid+1..right]:
 *   COMPARE   — comparing=[leftIdx, rightIdx]   picking the smaller of the two pointers
 *   PLACE     — swapped=[writeIdx]              element written back into arr
 *   DRAIN     — swapped=[writeIdx]              leftover elements copied with no comparison
 *   FINAL     — done = all indices              emitted once after all passes complete
 */

export const PSEUDOCODE = [
  "procedure mergeSort(A):",
  "  for subSize = 1, 2, 4... < n:",
  "    for left = 0 to n-1 by 2*subSize:",
  "      mid = min(left+subSize-1, n-1)",
  "      right = min(left+2*subSize-1, n-1)",
  "      merge(A, left, mid, right)",
  "  all subarrays merged into sorted array",
];

export function generateSteps(inputArray) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) return [];

  const arr   = [...inputArray];   // mutable working copy
  const n     = arr.length;
  const steps = [];

  // Bottom-up passes: subSize 1, 2, 4, 8, …
  for (let subSize = 1; subSize < n; subSize *= 2) {
    for (let leftStart = 0; leftStart < n - 1; leftStart += 2 * subSize) {
      const mid      = Math.min(leftStart + subSize - 1,     n - 1);
      const rightEnd = Math.min(leftStart + 2 * subSize - 1, n - 1);

      // Only merge if there is actually a right partition
      if (mid < rightEnd) {
        _merge(arr, steps, leftStart, mid, rightEnd);
      }
    }
  }

  // FINAL: every element is in its correct global position
  const allDone = new Set(Array.from({ length: n }, (_, k) => k));
  steps.push({
    array:      [...arr],
    comparing:  [],
    swapped:    [],
    done:       allDone,
    activeLine: 6,
    narrative:  `Merge sort complete! All ${n} elements are merged in sorted order.`,
  });

  return steps;
}

/**
 * Merge arr[left..mid] with arr[mid+1..right] in-place,
 * recording a COMPARE step before each decision and a PLACE step after each write.
 */
function _merge(arr, steps, left, mid, right) {
  // Snapshot both halves into temporaries so we can replay indices correctly
  const L = arr.slice(left, mid + 1);
  const R = arr.slice(mid + 1, right + 1);

  // Empty done set: merge sort elements don't reach a "final" slot
  // until the very last pass — we show green only at FINAL.
  const emptyDone = new Set();

  let i = 0;            // pointer into L
  let j = 0;            // pointer into R
  let k = left;         // write position in arr

  while (i < L.length && j < R.length) {
    const leftIdx  = left    + i;   // original array index for L[i]
    const rightIdx = mid + 1 + j;   // original array index for R[j]

    // COMPARE
    steps.push({
      array:      [...arr],
      comparing:  [leftIdx, rightIdx],
      swapped:    [],
      done:       emptyDone,
      range:      [left, right],
      mid,
      activeLine: 5,
      narrative:  `Comparing left [${leftIdx}]=${L[i]} and right [${rightIdx}]=${R[j]}.`,
    });

    if (L[i] <= R[j]) {
      arr[k] = L[i++];
    } else {
      arr[k] = R[j++];
    }

    // PLACE
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [k],
      done:       emptyDone,
      range:      [left, right],
      mid,
      activeLine: 5,
      narrative:  `Placed smaller element ${arr[k]} into merged position ${k}.`,
    });

    k++;
  }

  // DRAIN remaining L elements
  while (i < L.length) {
    arr[k] = L[i++];
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [k],
      done:       emptyDone,
      range:      [left, right],
      mid,
      activeLine: 5,
      narrative:  `Copying remaining left partition element ${arr[k]} to index ${k}.`,
    });
    k++;
  }

  // DRAIN remaining R elements
  while (j < R.length) {
    arr[k] = R[j++];
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [k],
      done:       emptyDone,
      range:      [left, right],
      mid,
      activeLine: 5,
      narrative:  `Copying remaining right partition element ${arr[k]} to index ${k}.`,
    });
    k++;
  }
}

/** Generate a random array of `size` integers in [10, 99]. */
export function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

/** Map speed level (1–10) → animation delay in ms (600 ms → 10 ms). */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
