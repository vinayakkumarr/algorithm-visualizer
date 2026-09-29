/**
 * insertionSort.js — Pure algorithm step recorder.
 *
 * generateSteps(inputArray)
 *   Returns an array of snapshot frames:
 *   {
 *     array:     number[]     — full array state at this moment
 *     comparing: number[]     — indices being compared (amber)
 *     swapped:   number[]     — element being shifted / placed (red)
 *     done:      Set<number>  — indices in the sorted prefix (green)
 *   }
 *
 * Frame types emitted per outer pass i (inserting arr[i] into sorted prefix):
 *   PICK      — swapped = [i]           element picked up for insertion
 *   COMPARE   — comparing = [j, j+1]    key vs arr[j]
 *   SHIFT     — swapped  = [j+1]        arr[j] shifted one slot right
 *   PLACE     — swapped  = [insertPos]  key dropped into its correct slot
 *   PASS_END  — done grows              sorted prefix now includes index i
 *   FINAL     — done = all indices
 */

export const PSEUDOCODE = [
  "procedure insertionSort(A):",
  "  for i = 1 to n-1:",
  "    key = A[i]",
  "    j = i - 1",
  "    while j >= 0 and A[j] > key:",
  "      A[j+1] = A[j]",
  "      j = j - 1",
  "    A[j+1] = key",
  "    mark prefix A[0..i] as sorted",
];

export function generateSteps(inputArray) {
  if (!Array.isArray(inputArray) || inputArray.length === 0) return [];

  const arr   = [...inputArray];
  const steps = [];
  const done  = new Set([0]); // index 0 is trivially sorted from the start
  const n     = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    // PICK: highlight the element about to be inserted
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [i],
      done:       new Set(done),
      activeLine: 2,
      narrative:  `Picked key = arr[${i}] (${key}) at index ${i} to insert into sorted prefix.`,
    });

    let j = i - 1;

    while (j >= 0 && arr[j] > key) {
      // COMPARE: key vs arr[j]
      steps.push({
        array:      [...arr],
        comparing:  [j, j + 1],
        swapped:    [],
        done:       new Set(done),
        activeLine: 4,
        narrative:  `Comparing arr[${j}] (${arr[j]}) with key (${key}): arr[${j}] > key, shifting right.`,
      });

      // Shift arr[j] one position to the right
      arr[j + 1] = arr[j];

      // SHIFT: show the shifted element
      steps.push({
        array:      [...arr],
        comparing:  [],
        swapped:    [j + 1],
        done:       new Set(done),
        activeLine: 5,
        narrative:  `Shifted element ${arr[j + 1]} right to index ${j + 1}.`,
      });

      j--;
    }

    // PLACE: drop key into the correct slot
    arr[j + 1] = key;
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [j + 1],
      done:       new Set(done),
      activeLine: 7,
      narrative:  `Placed key (${key}) into its correct sorted slot at index ${j + 1}.`,
    });

    // PASS_END: everything up to and including i is sorted
    done.add(i);
    steps.push({
      array:      [...arr],
      comparing:  [],
      swapped:    [],
      done:       new Set(done),
      activeLine: 8,
      narrative:  `Pass complete. Subarray arr[0..${i}] is now sorted.`,
    });
  }

  // FINAL: explicitly mark every index done
  const allDone = new Set(Array.from({ length: n }, (_, k) => k));
  steps.push({
    array:      [...arr],
    comparing:  [],
    swapped:    [],
    done:       allDone,
    activeLine: 8,
    narrative:  `Insertion sort complete! All ${n} elements are sorted.`,
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
