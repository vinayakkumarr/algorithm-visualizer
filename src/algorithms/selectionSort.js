/**
 * selectionSort.js — Pure algorithm step recorder.
 *
 * generateSteps(inputArray)
 *   Returns an array of snapshot frames:
 *   {
 *     array:     number[]     — full array state at this moment
 *     comparing: number[]     — indices currently being scanned (amber)
 *     swapped:   number[]     — indices being swapped / newly settled (red)
 *     done:      Set<number>  — indices permanently in final position (green)
 *   }
 *
 * Frame types emitted per pass i (placing minimum into slot i):
 *   SCAN      — comparing = [j, minIdx]  scanning for a new minimum
 *   NEW_MIN   — comparing = [j]          a new minimum was found at j
 *   SWAP      — swapped   = [i, minIdx]  minimum swapped to slot i
 *   PASS_END  — done grows by 1          slot i is settled; no comparing/swapped
 *   FINAL     — done = all indices
 */

export const PSEUDOCODE = [
  "procedure selectionSort(A):",
  "  for i = 0 to n-2:",
  "    minIdx = i",
  "    for j = i+1 to n-1:",
  "      if A[j] < A[minIdx]: minIdx = j",
  "    if minIdx != i: swap(A[i], A[minIdx])",
  "    mark A[i] as sorted",
  "  mark A[n-1] as sorted",
];

export function generateSteps(inputArray) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) return [];

  const arr   = [...inputArray];
  const steps = [];
  const done  = new Set();
  const n     = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      // SCAN: compare current j against current known minimum
      steps.push({
        array:      [...arr],
        comparing:  [j, minIdx],
        swapped:    [],
        done:       new Set(done),
        activeLine: 3,
        narrative:  `Scanning: comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}).`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        // NEW_MIN: highlight the newly discovered minimum
        steps.push({
          array:      [...arr],
          comparing:  [minIdx],
          swapped:    [],
          done:       new Set(done),
          activeLine: 4,
          narrative:  `New minimum found: arr[${minIdx}] (${arr[minIdx]}) at index ${minIdx}.`,
        });
      }
    }

    // SWAP: place minimum into its final slot
    if (minIdx !== i) {
      const tmp    = arr[i];
      arr[i]       = arr[minIdx];
      arr[minIdx]  = tmp;

      steps.push({
        array:      [...arr],
        comparing:  [],
        swapped:    [i, minIdx],
        done:       new Set(done),
        activeLine: 5,
        narrative:  `Swapping minimum element (${arr[i]}) into sorted slot ${i}.`,
      });
    }

    // PASS_END: slot i is now permanently correct
    done.add(i);
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [],
      done:       new Set(done),
      activeLine: 6,
      narrative:  `Slot ${i} is now sorted with element ${arr[i]}.`,
    });
  }

  // Last element is trivially sorted
  done.add(n - 1);

  // FINAL
  steps.push({
    array:      [...arr],
    comparing:  [],
    swapped:    [],
    done:       new Set(done),
    activeLine: 7,
    narrative:  `Selection sort complete! All ${n} elements are sorted in ascending order.`,
  });

  return steps;
}

export function randomArray(size) {
  return Array.from(
    { length: size },
    () => Math.floor(Math.random() * 90) + 10
  );
}

export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
