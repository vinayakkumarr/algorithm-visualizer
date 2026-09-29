/**
 * binarySearch.js — Pure step recorder for Binary Search.
 *
 * generateSteps(sortedArray, target)
 *   Array MUST already be sorted ascending.
 *   Returns frames:
 *   {
 *     array:      number[]     — the sorted array (unchanged)
 *     low:        number       — left search boundary
 *     mid:        number|null  — current midpoint
 *     high:       number       — right search boundary
 *     found:      number|null  — index where target lives (green)
 *     eliminated: Set<number>  — indices outside [low, high]  (gray)
 *   }
 *
 * Frame types:
 *   INIT        — starting boundaries (no mid yet)
 *   MID_CHECK   — mid computed, comparing arr[mid] vs target
 *   FOUND       — arr[mid] === target
 *   ELIMINATE   — boundaries tightened after comparison
 *   NOT_FOUND   — low > high, search exhausted
 */
export const PSEUDOCODE = [
  "procedure binarySearch(A, target):",
  "  low = 0, high = n - 1",
  "  while low <= high:",
  "    mid = floor((low + high) / 2)",
  "    if A[mid] == target: return mid",
  "    else if A[mid] < target: low = mid + 1",
  "    else: high = mid - 1",
  "  return not found",
];

export function generateSteps(sortedArray, target) {
  if (!Array.isArray(sortedArray) || sortedArray.length === 0) return [];

  const arr        = [...sortedArray];
  const n          = arr.length;
  const steps      = [];
  const eliminated = new Set();

  let low  = 0;
  let high = n - 1;

  // INIT
  steps.push({
    array:      arr,
    low, mid: null, high,
    found:      null,
    eliminated: new Set(),
    activeLine: 1,
    narrative:  `Initializing search boundaries: low = 0, high = ${n - 1}. Target = ${target}.`,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // Recalculate eliminated: everything outside current [low, high]
    for (let k = 0;        k < low;  k++) eliminated.add(k);
    for (let k = high + 1; k < n;    k++) eliminated.add(k);

    // MID_CHECK
    steps.push({
      array:      arr,
      low, mid, high,
      found:      null,
      eliminated: new Set(eliminated),
      activeLine: 3,
      narrative:  `Checking midpoint index ${mid} (value = ${arr[mid]}). Target is ${target}.`,
    });

    if (arr[mid] === target) {
      // FOUND
      steps.push({
        array:      arr,
        low, mid, high,
        found:      mid,
        eliminated: new Set(eliminated),
        activeLine: 4,
        narrative:  `Target ${target} found at index ${mid}!`,
      });
      return steps;

    } else if (arr[mid] < target) {
      // Eliminate left half [low..mid]
      for (let k = low; k <= mid; k++) eliminated.add(k);
      const prevLow = low;
      low = mid + 1;

      // ELIMINATE: show updated boundaries
      if (low <= high) {
        steps.push({
          array:      arr,
          low, mid, high,
          found:      null,
          eliminated: new Set(eliminated),
          activeLine: 5,
          narrative:  `arr[${mid}] (${arr[mid]}) < ${target}. Discarding left half [${prevLow}..${mid}], new low = ${low}.`,
        });
      }

    } else {
      // Eliminate right half [mid..high]
      for (let k = mid; k <= high; k++) eliminated.add(k);
      const prevHigh = high;
      high = mid - 1;

      // ELIMINATE: show updated boundaries
      if (low <= high) {
        steps.push({
          array:      arr,
          low, mid, high,
          found:      null,
          eliminated: new Set(eliminated),
          activeLine: 6,
          narrative:  `arr[${mid}] (${arr[mid]}) > ${target}. Discarding right half [${mid}..${prevHigh}], new high = ${high}.`,
        });
      }
    }
  }

  // NOT_FOUND
  // Mark every remaining index as eliminated
  for (let k = 0; k < n; k++) eliminated.add(k);

  steps.push({
    array:      arr,
    low, mid: null, high,
    found:      null,
    eliminated: new Set(eliminated),
    activeLine: 7,
    narrative:  `low (${low}) > high (${high}): search space exhausted. Target ${target} not found.`,
  });

  return steps;
}

/** Sorted random array of `size` integers in [10, 99]. */
export function sortedArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10)
              .sort((a, b) => a - b);
}

/** Map speed level (1–10) → animation delay in ms (600 ms → 10 ms). */
export function speedToMs(level) {
  return Math.round(600 - (level - 1) * (590 / 9));
}
