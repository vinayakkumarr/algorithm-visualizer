/**
 * quickSort.js — Pure algorithm step recorder (Lomuto partition scheme).
 *
 * generateSteps(inputArray)
 *   Returns an array of snapshot frames:
 *   {
 *     array:     number[]     — full array state at this moment
 *     comparing: number[]     — indices being compared against pivot (amber)
 *     swapped:   number[]     — indices being swapped, or pivot being placed (red)
 *     done:      Set<number>  — indices permanently in final position (green)
 *   }
 *
 * Lomuto partition:
 *   pivot = arr[high]
 *   i     = low - 1   (boundary of elements ≤ pivot)
 *   scan j from low to high-1:
 *     if arr[j] ≤ pivot → i++, swap arr[i] ↔ arr[j]
 *   swap arr[i+1] ↔ arr[high]  → pivot is now at its final index i+1
 *
 * Frame types emitted:
 *   PIVOT_HIGHLIGHT — comparing=[high]        pivot is chosen
 *   COMPARE         — comparing=[j, high]     arr[j] vs pivot
 *   SWAP            — swapped=[i, j]          arr[i] and arr[j] exchanged
 *   PIVOT_PLACED    — swapped=[pivotFinalIdx] pivot dropped at final slot; done grows
 *   SINGLETON       — done grows by 1         sub-array of length 1 is trivially sorted
 *   FINAL           — done = all indices
 */

export const PSEUDOCODE = [
  "procedure quickSort(A, low, high):",
  "  pivot = A[high]",
  "  i = low - 1",
  "  for j = low to high - 1:",
  "    if A[j] <= pivot: i++, swap(A[i], A[j])",
  "  swap(A[i+1], A[high])",
  "  quickSort(A, low, i)",
  "  quickSort(A, i+2, high)",
];

export function generateSteps(inputArray) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) return [];

  const arr   = [...inputArray];
  const n     = arr.length;
  const steps = [];
  const done  = new Set();   // grows as each pivot reaches its final slot

  _quickSort(arr, steps, 0, n - 1, done);

  // FINAL
  const allDone = new Set(Array.from({ length: n }, (_, k) => k));
  steps.push({
    array:      [...arr],
    comparing:  [],
    swapped:    [],
    done:       allDone,
    activeLine: 0,
    narrative:  `Quick sort complete! All ${n} elements are sorted.`,
  });

  return steps;
}

function _quickSort(arr, steps, low, high, done) {
  if (low > high) return;

  // A sub-array of one element is already in its final position
  if (low === high) {
    done.add(low);
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [],
      done:       new Set(done),
      range:      [low, high],
      pivot:      low,
      activeLine: 0,
      narrative:  `Subarray [${low}..${high}] has only 1 element (${arr[low]}), locked in place.`,
    });
    return;
  }

  const pivotFinalIdx = _partition(arr, steps, low, high, done);

  // Recurse on left and right partitions (pivot is excluded — it's settled)
  _quickSort(arr, steps, low,               pivotFinalIdx - 1, done);
  _quickSort(arr, steps, pivotFinalIdx + 1, high,              done);
}

function _partition(arr, steps, low, high, done) {
  const pivotVal = arr[high];
  let i = low - 1;   // tracks the boundary of the "≤ pivot" region

  // PIVOT_HIGHLIGHT
  steps.push({
    array:      [...arr],
    comparing:  [high],
    swapped:    [],
    done:       new Set(done),
    range:      [low, high],
    pivot:      high,
    activeLine: 1,
    narrative:  `Selected pivot = arr[${high}] (${pivotVal}). Partitioning subarray [${low}..${high}].`,
  });

  for (let j = low; j < high; j++) {
    // COMPARE: arr[j] vs pivot (arr[high])
    steps.push({
      array:      [...arr],
      comparing:  [j, high],
      swapped:    [],
      done:       new Set(done),
      range:      [low, high],
      pivot:      high,
      activeLine: 4,
      narrative:  `Comparing arr[${j}] (${arr[j]}) with pivot (${pivotVal}).`,
    });

    if (arr[j] <= pivotVal) {
      i++;

      if (i !== j) {
        // SWAP
        [arr[i], arr[j]] = [arr[j], arr[i]];
        steps.push({
          array:      [...arr],
          comparing:  [],
          swapped:    [i, j],
          done:       new Set(done),
          range:      [low, high],
          pivot:      high,
          activeLine: 4,
          narrative:  `arr[${j}] (${arr[i]}) <= pivot: swapped into left partition at index ${i}.`,
        });
      }
    }
  }

  // PIVOT_PLACED: move pivot to its final sorted position
  const finalIdx = i + 1;
  if (finalIdx !== high) {
    [arr[finalIdx], arr[high]] = [arr[high], arr[finalIdx]];
  }

  done.add(finalIdx);
  steps.push({
    array:      [...arr],
    comparing:  [],
    swapped:    [finalIdx],
    done:       new Set(done),
    range:      [low, high],
    pivot:      finalIdx,
    activeLine: 5,
    narrative:  `Pivot (${arr[finalIdx]}) placed into its final sorted position at index ${finalIdx}.`,
  });

  return finalIdx;
}

/** Generate a random array of `size` integers in [10, 99]. */
export function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

/** Map speed level (1–10) → animation delay in ms (600 ms → 10 ms). */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
