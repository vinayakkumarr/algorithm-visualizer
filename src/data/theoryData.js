/**
 * theoryData.js — Comprehensive theory and reference guide for algorithms and data structures.
 */

export const THEORY_DATA = {
  // Sorting Algorithms

  bubbleSort: {
    title: "Bubble Sort",
    category: "Comparison Sorting",
    tagline: "The foundational adjacent-comparison algorithm demonstrating loop invariants and early-termination optimization.",
    whatIsIt:
      "Bubble Sort is a comparison-based sorting algorithm that systematically walks through an array, compares adjacent elements, and swaps them if they are in the wrong order. With each complete pass, the largest remaining unsorted element 'bubbles up' to its final settled position at the end of the array.",
    whyItMatters:
      "While rarely used in large production databases due to quadratic O(n²) scaling, Bubble Sort is the quintessential computer science teaching tool. It introduces foundational algorithmic concepts: iterative invariant proofs, adjacent element comparison windows, stability preservation, and dynamic early-exit optimizations.",
    mentalModel: {
      analogy:
        "Think of bubbles rising through a carbonated beverage: larger, more buoyant bubbles rise to the surface first, one by one, until every bubble is settled in proper equilibrium.",
      diagram: `[ Pass 1 ]  Compare adjacent pairs (i, i+1) & swap if left > right:
  Initial:    [ 5  |  1  |  4  |  2  |  8 ]
  Step 1:     ( 5 > 1 ) -> Swap   -> [ 1  |  5  |  4  |  2  |  8 ]
  Step 2:     ( 5 > 4 ) -> Swap   -> [ 1  |  4  |  5  |  2  |  8 ]
  Step 3:     ( 5 > 2 ) -> Swap   -> [ 1  |  4  |  2  |  5  |  8 ]
  Step 4:     ( 5 < 8 ) -> No swap-> [ 1  |  4  |  2  |  5  | [8] ]  <- 8 locked at end!`,
    },
    coreConcepts: [
      {
        title: "1. Adjacent Pair Comparison Window",
        explanation:
          "Unlike algorithms that search across long distances, Bubble Sort strictly observes an adjacent two-element window (indices i and i+1). If array[i] > array[i+1], an inversion exists and the elements are swapped.",
      },
      {
        title: "2. The Settling Invariant",
        explanation:
          "After pass k, the k largest elements in the array are guaranteed to be in their final sorted positions at the rightmost k indices. The active unsorted partition shrinks by 1 after each pass.",
      },
      {
        title: "3. Early-Exit Optimization (Adaptive Flag)",
        explanation:
          "If an entire pass completes without a single swap occurring, the array is already sorted. A boolean `swapped = false` flag enables the algorithm to terminate immediately in O(n) linear time.",
      },
    ],
    howItWorks: [
      "Initialize an outer loop running from pass = 0 up to n - 1.",
      "Set a boolean flag `swapped = false` at the start of the pass.",
      "Iterate through the unsorted portion from index 0 up to (n - 1 - pass).",
      "Compare adjacent elements array[j] and array[j+1].",
      "If array[j] > array[j+1], swap them and mark `swapped = true`.",
      "If `swapped` remains false at the end of the pass, break early — the array is sorted.",
      "Repeat until all n-1 passes complete or early exit fires.",
    ],
    pseudocode: {
      intro: "Standard adaptive adjacent-swap Bubble Sort with early-exit flag.",
      code: `procedure bubbleSort(A: List of Sortable Items)
    n ← length(A)
    repeat
        swapped ← false
        for i ← 0 to n - 2 do
            if A[i] > A[i + 1] then
                swap(A[i], A[i + 1])
                swapped ← true
            end if
        end for
        n ← n - 1
    until not swapped
end procedure`,
    },
    workedExample: {
      input: "[ 5, 1, 4, 2, 8 ]",
      goal: "Sort in ascending order",
      steps: [
        {
          step: "Pass 1",
          state: "[ 1, 4, 2, 5, (8) ]",
          explanation: "Compares (5,1)->swap, (5,4)->swap, (5,2)->swap, (5,8)->no swap. Element 8 settles at index 4.",
        },
        {
          step: "Pass 2",
          state: "[ 1, 2, 4, (5), (8) ]",
          explanation: "Compares (1,4)->ok, (4,2)->swap, (4,5)->ok. Element 5 settles at index 3.",
        },
        {
          step: "Pass 3",
          state: "[ 1, 2, (4), (5), (8) ]",
          explanation: "Compares (1,2)->ok, (2,4)->ok. Zero swaps made during this pass!",
        },
        {
          step: "Early Termination",
          state: "[ 1, 2, 4, 5, 8 ]",
          explanation: "Swap flag remained false — algorithm halts early, saving remaining pass iterations.",
        },
      ],
      result: "[ 1, 2, 4, 5, 8 ] (Sorted in 3 passes)",
    },
    complexity: {
      best: {
        time: "O(n)",
        condition: "Already sorted array with early-exit flag (1 pass, n-1 comparisons, 0 swaps).",
      },
      average: {
        time: "O(n²)",
        condition: "Randomly distributed input requiring ~(n²/4) comparisons and shifts.",
      },
      worst: {
        time: "O(n²)",
        condition: "Reverse sorted array requiring exactly n(n-1)/2 comparisons and swaps.",
      },
      space: {
        memory: "O(1)",
        explanation: "In-place algorithm requiring only a single auxiliary swap variable.",
      },
      stable: {
        isStable: true,
        reason: "Adjacent identical elements (A[i] == A[i+1]) are never swapped, preserving original relative order.",
      },
      mathematicalIntuition:
        "For an array of size n, worst-case comparisons follow the arithmetic series: (n-1) + (n-2) + ... + 1 = n(n-1)/2 = (n² - n)/2, which is Θ(n²).",
    },
    pitfalls: [
      {
        myth: "Bubble Sort and Insertion Sort have identical real-world performance because both are O(n²).",
        reality:
          "In real-world benchmarks, Insertion Sort is consistently 2x to 4x faster because it performs single assignments (shifts) rather than full 3-instruction swaps on every comparison.",
      },
      {
        myth: "Bubble Sort is always O(n²) regardless of input.",
        reality:
          "With the boolean `swapped` flag optimization, Bubble Sort detects pre-sorted data and terminates in strictly O(n) linear time.",
      },
    ],
    prosAndCons: {
      pros: [
        "Extremely intuitive and easy to implement correctly.",
        "In-place sorting with O(1) auxiliary memory.",
        "Stable sort: preserves relative order of duplicate values.",
        "Adaptive: achieves linear O(n) time on already sorted inputs.",
      ],
      cons: [
        "Quadratic O(n²) time complexity makes it unusable for large datasets (n > 1,000).",
        "High memory bus overhead due to continuous swapping instead of shifting.",
        "Never selected for real-world standard library implementations.",
      ],
      edgeCases: [
        { name: "Already Sorted", behavior: "Completes in 1 single pass with n-1 comparisons and 0 swaps -> O(n) best case." },
        { name: "Reverse Sorted", behavior: "Worst case: maximum swaps n(n-1)/2 and n-1 passes." },
        { name: "All Identical Elements", behavior: "Completes in 1 pass with 0 swaps in O(n) time." },
        { name: "Single Element / Empty", behavior: "Terminates immediately in O(1) time." },
      ],
    },
    realWorldApplications: [
      {
        title: "Computer Science Education",
        description: "Standard introductory algorithm for teaching algorithm analysis, invariants, and worst vs best case behavior.",
      },
      {
        title: "Ultra-Constrained Microcontrollers",
        description: "Embedded systems with sub-kilobyte ROM where binary code footprint is under 30 bytes and n <= 10.",
      },
      {
        title: "Nearly Sorted Sensor Data",
        description: "Periodic data streams where only a single element is periodically out of place at the end of a list.",
      },
    ],
    keyTakeaways: [
      "Bubble Sort repeatedly compares adjacent elements and bubbles the largest to the end.",
      "The outer loop shrinks the unsorted partition by 1 after each complete pass.",
      "The boolean swap flag is mandatory to achieve O(n) best-case performance.",
      "It is a stable, in-place sort with O(1) space and O(n²) worst-case time.",
    ],
    nextTopics: [
      { name: "Selection Sort", path: "/sorting/selection", reason: "Learn how finding the minimum reduces write operations to O(n)." },
      { name: "Insertion Sort", path: "/sorting/insertion", reason: "Discover the faster O(n²) adaptive sorting standard used in production." },
    ],
  },

  selectionSort: {
    title: "Selection Sort",
    category: "Comparison Sorting",
    tagline: "The write-minimizing algorithm that divides the array into sorted and unsorted partitions.",
    whatIsIt:
      "Selection Sort is an in-place comparison sort that divides the list into a sorted prefix on the left and an unsorted suffix on the right. In each pass, it scans the entire unsorted partition to identify the absolute minimum element and swaps it into the first unsorted slot, advancing the sorted boundary.",
    whyItMatters:
      "Selection Sort's defining property is that it executes at most O(n) memory write operations (exactly n-1 swaps). When writing to memory is physically costly or degrades hardware lifespan (such as Flash memory or EEPROMs), Selection Sort provides a distinct advantage over algorithms that swap constantly.",
    mentalModel: {
      analogy:
        "Imagine organizing books on a shelf: you scan the entire unsorted shelf to find the alphabetically first title, place it at the far left, and repeat for the remaining unsorted books.",
      diagram: `[ Array Partitioning Structure ]
  [  Sorted Partition (Left)  |  Unsorted Partition (Right)  ]
  [  1   |   2   |   4        |   13   |   37   |   29   ]
                              ^
                          min_idx scans right partition for global minimum`,
    },
    coreConcepts: [
      {
        title: "1. Explicit Boundary Division",
        explanation:
          "The array is partitioned at index i. Everything from index 0 to i-1 is strictly sorted and in its final position. Everything from i to n-1 is unsorted.",
      },
      {
        title: "2. Global Minimum Search",
        explanation:
          "Rather than swapping immediately when an inversion is found, Selection Sort remembers the index `min_idx` and only performs a single swap at the end of the pass.",
      },
      {
        title: "3. Non-Adaptive Comparison Behavior",
        explanation:
          "Because Selection Sort must always scan the entire unsorted partition to prove an element is the minimum, it performs the exact same number of comparisons regardless of initial array order.",
      },
    ],
    howItWorks: [
      "Set an outer pointer i from 0 up to n - 2.",
      "Assume the element at index i is the current minimum: set `min_idx = i`.",
      "Iterate an inner pointer j from i + 1 up to n - 1.",
      "Compare array[j] < array[min_idx]. If true, update `min_idx = j`.",
      "After the inner loop completes, if `min_idx != i`, swap array[i] with array[min_idx].",
      "Increment i and repeat until the entire array is sorted.",
    ],
    pseudocode: {
      intro: "Selection Sort iteratively finds the minimum element in the unsorted suffix and swaps it into place.",
      code: `procedure selectionSort(A: List of Sortable Items)
    n ← length(A)
    for i ← 0 to n - 2 do
        minIndex ← i
        for j ← i + 1 to n - 1 do
            if A[j] < A[minIndex] then
                minIndex ← j
            end if
        end for
        if minIndex ≠ i then
            swap(A[i], A[minIndex])
        end if
    end for
end procedure`,
    },
    workedExample: {
      input: "[ 29, 10, 14, 37, 13 ]",
      goal: "Sort in ascending order",
      steps: [
        {
          step: "Pass 1 (i = 0)",
          state: "[ (10) | 29, 14, 37, 13 ]",
          explanation: "Scans [29..13], finds global min 10 at index 1. Swaps 29 with 10.",
        },
        {
          step: "Pass 2 (i = 1)",
          state: "[ 10, (13) | 14, 37, 29 ]",
          explanation: "Scans [29, 14, 37, 13], finds min 13 at index 4. Swaps 29 with 13.",
        },
        {
          step: "Pass 3 (i = 2)",
          state: "[ 10, 13, (14) | 37, 29 ]",
          explanation: "Scans [14, 37, 29], min 14 is already at index 2 (0 swaps needed).",
        },
        {
          step: "Pass 4 (i = 3)",
          state: "[ 10, 13, 14, (29) | 37 ]",
          explanation: "Scans [37, 29], finds min 29 at index 4. Swaps 37 with 29.",
        },
      ],
      result: "[ 10, 13, 14, 29, 37 ] (Sorted in 4 passes, exactly 3 swaps)",
    },
    complexity: {
      best: {
        time: "O(n²)",
        condition: "Even if already sorted, it still scans the unsorted partition to confirm minimums.",
      },
      average: {
        time: "O(n²)",
        condition: "Requires n(n-1)/2 comparisons on any arbitrary input distribution.",
      },
      worst: {
        time: "O(n²)",
        condition: "Consistent comparison count across all permutations.",
      },
      space: {
        memory: "O(1)",
        explanation: "Strictly in-place; uses only a couple of index pointers.",
      },
      stable: {
        isStable: false,
        reason: "Long-distance swaps can jump over identical elements (e.g., [4a, 4b, 2] swaps 4a with 2, disrupting order).",
      },
      mathematicalIntuition:
        "Comparisons are always fixed: (n-1) + (n-2) + ... + 1 = n(n-1)/2 comparisons. Total swaps are at most n-1.",
    },
    pitfalls: [
      {
        myth: "Selection Sort is stable because it finds the smallest element first.",
        reality:
          "Selection Sort is inherently UNSTABLE. When swapping the minimum element across a long distance, it can displace an earlier duplicate behind a later duplicate.",
      },
      {
        myth: "Selection Sort runs in O(n) on already sorted arrays.",
        reality:
          "It has no early-exit mechanism; it still executes all n(n-1)/2 comparisons, making Best Case strictly O(n²).",
      },
    ],
    prosAndCons: {
      pros: [
        "Guarantees at most O(n) writes (exactly n-1 swaps) — ideal for write-sensitive memory.",
        "Simple implementation with O(1) auxiliary space.",
        "Completely predictable performance regardless of initial data order.",
      ],
      cons: [
        "Does not adapt to pre-sorted arrays (always O(n²) comparisons).",
        "Unstable sorting algorithm by default.",
        "Significantly outperformed by O(n log n) divide-and-conquer sorts on large inputs.",
      ],
      edgeCases: [
        { name: "Already Sorted", behavior: "Performs n(n-1)/2 comparisons and 0 swaps (O(n²) time)." },
        { name: "Reverse Sorted", behavior: "Performs n(n-1)/2 comparisons and n/2 swaps." },
        { name: "Duplicate Elements", behavior: "May reorder identical elements, breaking stability." },
      ],
    },
    realWorldApplications: [
      {
        title: "Flash Memory / EEPROM Systems",
        description: "Used in embedded microcontrollers where memory write cycles physically degrade hardware cells.",
      },
      {
        title: "Costly Write Operations",
        description: "Scenarios where moving or writing records is computationally or network-expensive relative to reading.",
      },
    ],
    keyTakeaways: [
      "Selection Sort finds the minimum unsorted item and swaps it to the front.",
      "It minimizes memory write operations to at most n-1 swaps.",
      "It is not adaptive (always O(n²) time) and is not stable.",
    ],
    nextTopics: [
      { name: "Insertion Sort", path: "/sorting/insertion", reason: "See how adaptive insertion outperforms Selection Sort in practice." },
      { name: "Merge Sort", path: "/sorting/merge", reason: "Explore how O(n log n) divide-and-conquer scales to large datasets." },
    ],
  },

  insertionSort: {
    title: "Insertion Sort",
    category: "Comparison Sorting",
    tagline: "The adaptive sorting standard that builds the final sorted array one item at a time.",
    whatIsIt:
      "Insertion Sort is an intuitive, adaptive comparison sorting algorithm that iterates through the array, picks each element as a 'key', and shifts larger sorted elements to the right to insert the key into its correct relative position.",
    whyItMatters:
      "Insertion Sort is the fastest general comparison sort for small datasets (n <= 16-32) due to its minimal constant factor, low instruction count, and exceptional CPU cache locality. For this reason, world-class hybrid algorithms like Python's Timsort and C++ std::sort (Introsort) switch to Insertion Sort for small subarrays.",
    mentalModel: {
      analogy:
        "Sorting playing cards in your hands: as you pick up cards from a dealer one by one, you scan your sorted hand from right to left, shift higher cards over, and slide the new card into place.",
      diagram: `[ Key Extraction and Right-Shift Mechanics ]
  Sorted Hand:   [ 1   |   4   |   7 ]  <- Next key to insert is 3
  Step 1: Extract Key = 3
  Step 2: Compare with 7 -> (7 > 3) -> Shift 7 right -> [ 1 | 4 | _ | 7 ]
  Step 3: Compare with 4 -> (4 > 3) -> Shift 4 right -> [ 1 | _ | 4 | 7 ]
  Step 4: Compare with 1 -> (1 < 3) -> Insert 3 here  -> [ 1 | 3 | 4 | 7 ]`,
    },
    coreConcepts: [
      {
        title: "1. Incremental Construction",
        explanation:
          "At iteration i, the subarray array[0...i-1] is sorted. The algorithm expands this sorted prefix by inserting array[i] into its proper slot.",
      },
      {
        title: "2. Inversion Sensitivity",
        explanation:
          "The runtime of Insertion Sort is directly proportional to the number of inversions (pairs of elements out of order) in the array: O(n + k), where k is the inversion count.",
      },
      {
        title: "3. Online Processing Capability",
        explanation:
          "Insertion Sort is an 'online' algorithm: it can sort a list as it receives incoming data stream items in real time without needing the complete array upfront.",
      },
    ],
    howItWorks: [
      "Assume the first element (index 0) is already sorted.",
      "Iterate an outer index i from 1 to n - 1.",
      "Store the current element as `key = array[i]`.",
      "Set an inner pointer j = i - 1.",
      "While j >= 0 and array[j] > key, shift array[j] to array[j + 1] and decrement j.",
      "Place `key` into the newly vacated position `array[j + 1]`.",
      "Repeat until all elements have been inserted into the sorted prefix.",
    ],
    pseudocode: {
      intro: "Insertion Sort builds a sorted prefix by repeatedly shifting larger elements right to insert the current key.",
      code: `procedure insertionSort(A: List of Sortable Items)
    n ← length(A)
    for i ← 1 to n - 1 do
        key ← A[i]
        j ← i - 1
        while j ≥ 0 and A[j] > key do
            A[j + 1] ← A[j]
            j ← j - 1
        end while
        A[j + 1] ← key
    end for
end procedure`,
    },
    workedExample: {
      input: "[ 8, 3, 5, 1, 4 ]",
      goal: "Sort in ascending order",
      steps: [
        {
          step: "Insert 3 (i = 1)",
          state: "[ 3, 8, 5, 1, 4 ]",
          explanation: "Key = 3. Shift 8 right. Insert 3 at index 0.",
        },
        {
          step: "Insert 5 (i = 2)",
          state: "[ 3, 5, 8, 1, 4 ]",
          explanation: "Key = 5. Shift 8 right. Insert 5 at index 1.",
        },
        {
          step: "Insert 1 (i = 3)",
          state: "[ 1, 3, 5, 8, 4 ]",
          explanation: "Key = 1. Shift 8, 5, 3 right. Insert 1 at index 0.",
        },
        {
          step: "Insert 4 (i = 4)",
          state: "[ 1, 3, 4, 5, 8 ]",
          explanation: "Key = 4. Shift 8, 5 right. Insert 4 at index 2.",
        },
      ],
      result: "[ 1, 3, 4, 5, 8 ] (Sorted with minimal shift operations)",
    },
    complexity: {
      best: {
        time: "O(n)",
        condition: "Already sorted array (1 comparison per element, 0 shifts).",
      },
      average: {
        time: "O(n²)",
        condition: "Random arrays requiring ~n²/4 comparisons and shifts.",
      },
      worst: {
        time: "O(n²)",
        condition: "Reverse sorted array where every element shifts the entire sorted prefix.",
      },
      space: {
        memory: "O(1)",
        explanation: "Strictly in-place; requires only a temporary key holder variable.",
      },
      stable: {
        isStable: true,
        reason: "Elements equal to key are never shifted past it (stops at array[j] <= key).",
      },
      mathematicalIntuition:
        "Total shifts equal the exact number of inversions in the permutation. If the array has k inversions, time complexity is exactly O(n + k).",
    },
    pitfalls: [
      {
        myth: "Insertion Sort should never be used in production software.",
        reality:
          "Modern standard libraries in Java, Python, and C++ actively use Insertion Sort as the base case for QuickSort and MergeSort when partition sizes drop below 16-32 elements.",
      },
      {
        myth: "Binary Insertion Sort (using binary search to find the insert slot) reduces total runtime to O(n log n).",
        reality:
          "While Binary Search reduces comparisons to O(n log n), shifting elements in memory still requires O(n²) operations, keeping overall runtime O(n²).",
      },
    ],
    prosAndCons: {
      pros: [
        "Highly adaptive: Runs in near-linear O(n) time on almost-sorted data.",
        "Fastest comparison sort for small array sizes (n <= 16-32).",
        "Stable, in-place, and online.",
        "Minimal overhead and excellent hardware cache locality.",
      ],
      cons: [
        "Quadratic O(n²) time on reverse-ordered or random large datasets.",
        "Inefficient for large arrays compared to Merge Sort and Quick Sort.",
      ],
      edgeCases: [
        { name: "Nearly Sorted", behavior: "Runs in near O(n) time — only displaced items incur small shifts." },
        { name: "Reverse Sorted", behavior: "Worst case: maximum shifts for every element." },
        { name: "Online Streaming", behavior: "Inserts new elements into sorted lists in O(n) without full re-sort." },
      ],
    },
    realWorldApplications: [
      {
        title: "Timsort (Python / Java)",
        description: "Python's standard `sorted()` and Java's `Arrays.sort(Object[])` use Insertion Sort for chunks <= 32 elements.",
      },
      {
        title: "C++ std::sort (Introsort)",
        description: "Switches to Insertion Sort when recursion partitions reach 16 elements to maximize CPU cache performance.",
      },
      {
        title: "Real-Time Telemetry Streams",
        description: "Inserting time-stamped incoming events into an active log window.",
      },
    ],
    keyTakeaways: [
      "Insertion Sort builds a sorted array left-to-right by shifting larger elements over.",
      "Its runtime is O(n + k) where k is the number of inversions.",
      "It is the fastest sort for small datasets and the engine behind production hybrid sorts.",
    ],
    nextTopics: [
      { name: "Merge Sort", path: "/sorting/merge", reason: "Master the divide-and-conquer O(n log n) sorting standard." },
      { name: "Quick Sort", path: "/sorting/quick", reason: "Explore in-place partitioning with blazing fast cache performance." },
    ],
  },

  mergeSort: {
    title: "Merge Sort",
    category: "Divide and Conquer Sorting",
    tagline: "The definitive divide-and-conquer algorithm offering guaranteed O(n log n) time and rock-solid stability.",
    whatIsIt:
      "Merge Sort is a classic divide-and-conquer algorithm that recursively splits an array into two equal halves until single-element base cases are reached, and then systematically merges the sorted halves back together in linear time.",
    whyItMatters:
      "Merge Sort guarantees O(n log n) runtime across all inputs (best, average, and worst cases) with zero risk of quadratic degradation. It is the premier sorting algorithm for Linked Lists (which can be merged with O(1) extra space) and External Sorting (processing massive multi-terabyte datasets stored on disk that exceed available RAM).",
    mentalModel: {
      analogy:
        "Dividing a huge stack of unsorted papers among team members: you keep splitting the pile in half until individuals hold single papers, sort pairs, and zip the sorted stacks back together.",
      diagram: `[ Divide and Conquer Recursion Tree ]
             [ 38, 27, 43, 3 ]
             /               \\
      [ 38, 27 ]           [ 43, 3 ]
       /      \\             /     \\
    [ 38 ]   [ 27 ]      [ 43 ]   [ 3 ]      <- Base cases (size <= 1)
       \\      /             \\     /
      [ 27, 38 ]           [ 3, 43 ]         <- Merge step (2 pointers)
             \\               /
             [ 3, 27, 38, 43 ]               <- Final merged array`,
    },
    coreConcepts: [
      {
        title: "1. The Divide Phase",
        explanation:
          "Find the midpoint `mid = floor((left + right) / 2)` and divide the problem into two subproblems of size n/2. This splits the tree to depth log₂(n).",
      },
      {
        title: "2. The Conquer Phase",
        explanation:
          "Recursively sort the left and right halves. Base case: a subarray of length 0 or 1 is inherently sorted.",
      },
      {
        title: "3. The Combine (Merge) Phase",
        explanation:
          "Using two pointers tracking the heads of the left and right sorted subarrays, compare elements and copy the smaller item into an auxiliary buffer. Merging takes linear O(n) work.",
      },
    ],
    howItWorks: [
      "If left index >= right index, return (base case).",
      "Calculate `mid = left + Math.floor((right - left) / 2)`.",
      "Recursively call `mergeSort(array, left, mid)` on left half.",
      "Recursively call `mergeSort(array, mid + 1, right)` on right half.",
      "Allocate an auxiliary array buffer to hold the merged elements.",
      "Use two pointers (p1 in left, p2 in right) to compare elements and copy the smaller value to the buffer.",
      "Copy any remaining elements from either half, then copy the buffer back into the original array.",
    ],
    pseudocode: {
      intro: "Merge Sort recursively divides the array into halves, sorts each half, and merges them in linear time.",
      operations: [
        {
          name: "mergeSort(A, left, right)",
          complexity: "O(n log n) time, O(n) space",
          description: "Recursive divide-and-conquer coordinator.",
          code: `procedure mergeSort(A: List, left: Integer, right: Integer)
    if left < right then
        mid ← left + ⌊(right - left) / 2⌋
        mergeSort(A, left, mid)
        mergeSort(A, mid + 1, right)
        merge(A, left, mid, right)
    end if
end procedure`,
        },
        {
          name: "merge(A, left, mid, right)",
          complexity: "O(n) time, O(n) space",
          description: "Two-pointer linear merger of two sorted subarrays.",
          code: `procedure merge(A: List, left: Integer, mid: Integer, right: Integer)
    L ← A[left ... mid]
    R ← A[mid + 1 ... right]
    
    i ← 0, j ← 0, k ← left
    while i < length(L) and j < length(R) do
        if L[i] ≤ R[j] then
            A[k] ← L[i]
            i ← i + 1
        else
            A[k] ← R[j]
            j ← j + 1
        end if
        k ← k + 1
    end while
    
    while i < length(L) do
        A[k] ← L[i]; i ← i + 1; k ← k + 1
    end while
    while j < length(R) do
        A[k] ← R[j]; j ← j + 1; k ← k + 1
    end while
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "[ 38, 27, 43, 3, 9, 82, 10 ]",
      goal: "Sort in ascending order",
      steps: [
        {
          step: "Divide to Base Cases",
          state: "[38] [27] [43] [3] [9] [82] [10]",
          explanation: "Recursively splits array in halves until all subarrays are singletons.",
        },
        {
          step: "Level 1 Merge",
          state: "[27, 38]  [3, 43]  [9, 82]  [10]",
          explanation: "Merges pairs: (38,27)->[27,38], (43,3)->[3,43], (9,82)->[9,82], [10] carried.",
        },
        {
          step: "Level 2 Merge",
          state: "[3, 27, 38, 43]   [9, 10, 82]",
          explanation: "Merges sorted halves of 4 and 3 elements.",
        },
        {
          step: "Final Level Merge",
          state: "[ 3, 9, 10, 27, 38, 43, 82 ]",
          explanation: "Zips [3, 27, 38, 43] and [9, 10, 82] using two pointers into final sorted array.",
        },
      ],
      result: "[ 3, 9, 10, 27, 38, 43, 82 ] (Guaranteed O(n log n))",
    },
    complexity: {
      best: {
        time: "O(n log n)",
        condition: "Always divides into equal halves and performs n operations per tree level.",
      },
      average: {
        time: "O(n log n)",
        condition: "Standard recurrence relation T(n) = 2T(n/2) + O(n).",
      },
      worst: {
        time: "O(n log n)",
        condition: "Guaranteed O(n log n) even on reverse or adversarial inputs.",
      },
      space: {
        memory: "O(n)",
        explanation: "Requires an auxiliary buffer array of size n to merge sorted subarrays.",
      },
      stable: {
        isStable: true,
        reason: "When left and right elements are equal, the left element is always chosen first.",
      },
      mathematicalIntuition:
        "The recursion tree has depth log₂(n). At each level k, exactly 2^k subproblems do n/2^k work = O(n) total work per level. Total time = depth * work = O(n log n).",
    },
    pitfalls: [
      {
        myth: "Merge Sort can be easily made in-place for arrays with O(1) space while keeping O(n log n) time.",
        reality:
          "In-place merging without auxiliary memory requires complex block shifting that degrades time complexity to O(n²) or adds massive constant factor overhead.",
      },
      {
        myth: "QuickSort is always better than MergeSort.",
        reality:
          "MergeSort is strictly superior when sorting Linked Lists, when stability is mandatory, and when dataset size exceeds available RAM (External Sorting).",
      },
    ],
    prosAndCons: {
      pros: [
        "Guaranteed O(n log n) worst-case time with zero pathological degradation.",
        "Stable sorting algorithm.",
        "Optimal for Linked Lists (O(1) auxiliary space without random access required).",
        "The industry standard for External Sorting on multi-terabyte datasets.",
      ],
      cons: [
        "Requires O(n) auxiliary memory for array implementations.",
        "Higher constant factor overhead compared to QuickSort on in-memory arrays.",
      ],
      edgeCases: [
        { name: "Power of 2 Lengths", behavior: "Creates perfectly balanced binary subtrees with zero remainder." },
        { name: "Odd Lengths", behavior: "Handles uneven partitions (e.g. 7 splits into 4 and 3) seamlessly." },
        { name: "Already Sorted", behavior: "Can be optimized to O(n) with a single check: if A[mid] <= A[mid+1], skip merge." },
      ],
    },
    realWorldApplications: [
      {
        title: "External Sorting & Big Data",
        description: "Sorting database tables and MapReduce logs that are far too large to fit into RAM.",
      },
      {
        title: "Standard Linked List Sorting",
        description: "Default algorithm for sorting node-based data structures in standard libraries.",
      },
      {
        title: "Java Object Sorting",
        description: "Base framework for Java's `Arrays.sort(Object[])` where sorting stability is required.",
      },
    ],
    keyTakeaways: [
      "Merge Sort splits arrays to single elements and merges them in sorted order.",
      "It guarantees O(n log n) time in all cases and is fully stable.",
      "It requires O(n) auxiliary memory for array implementations.",
    ],
    nextTopics: [
      { name: "Quick Sort", path: "/sorting/quick", reason: "Compare with in-place partition sorting and CPU cache locality." },
      { name: "Binary Search", path: "/searching/binary", reason: "Apply divide-and-conquer principles to logarithmic searching." },
    ],
  },

  quickSort: {
    title: "Quick Sort",
    category: "Divide and Conquer Sorting",
    tagline: "The fastest in-memory general-purpose sorting algorithm powered by pivot partitioning.",
    whatIsIt:
      "Quick Sort is a highly efficient divide-and-conquer algorithm that selects a 'pivot' element and partitions the array such that all elements smaller than the pivot are placed to its left, and all elements larger are placed to its right. It then recursively sorts the resulting subarrays in-place.",
    whyItMatters:
      "Quick Sort is the workhorse of real-world computing. Its sequential memory access patterns make it exceptionally CPU cache-friendly, allowing it to outperform Merge Sort and Heap Sort by 2x to 3x on in-memory arrays while requiring zero auxiliary buffer arrays.",
    mentalModel: {
      analogy:
        "Organizing people by height: you pick one benchmark person (pivot), have everyone shorter move to their left and everyone taller to their right, and repeat the process for each subgroup.",
      diagram: `[ Partitioning Around Pivot ]
  Initial:     [ 7  |  2  |  1  |  6  |  8  |  5  | [4] ]  <- Pivot = 4
  Partition:   [ 2  |  1  | [4] |  6  |  8  |  5  |  7  ]
               | < Pivot  | PIVOT |     > Pivot         |
  Recursive:   Sort Left Subarray     Sort Right Subarray`,
    },
    coreConcepts: [
      {
        title: "1. Pivot Selection Strategy",
        explanation:
          "The choice of pivot determines efficiency. Naive choices (first/last element) risk O(n²) worst-case on sorted data. Modern implementations use Median-of-Three or Randomized Pivots.",
      },
      {
        title: "2. In-Place Partitioning (Lomuto vs Hoare)",
        explanation:
          "Lomuto uses a single tracking index and scans left-to-right. Hoare uses two pointers converging from both ends and does 3x fewer swaps on average.",
      },
      {
        title: "3. Tail-Call Recursion & Stack Optimization",
        explanation:
          "By recursing on the smaller partition first and using a loop for the larger partition, call stack space is strictly capped at O(log n).",
      },
    ],
    howItWorks: [
      "Choose a pivot element from the subarray (e.g., last element).",
      "Partitioning: Reorder array so elements <= pivot are before it, and elements > pivot are after it.",
      "Place the pivot into its final sorted index.",
      "Recursively apply `quickSort` to the left subarray (before pivot).",
      "Recursively apply `quickSort` to the right subarray (after pivot).",
      "Base case: Stop when subarray length <= 1.",
    ],
    pseudocode: {
      intro: "Quick Sort partitions the array around a pivot element and recursively sorts the partitions.",
      operations: [
        {
          name: "quickSort(A, low, high)",
          complexity: "O(n log n) avg, O(n²) worst",
          description: "Recursive divide-and-conquer partition coordinator.",
          code: `procedure quickSort(A: List, low: Integer, high: Integer)
    if low < high then
        pIndex ← partition(A, low, high)
        quickSort(A, low, pIndex - 1)
        quickSort(A, pIndex + 1, high)
    end if
end procedure`,
        },
        {
          name: "partition(A, low, high)",
          complexity: "O(n) time, O(1) space",
          description: "Lomuto partition placing pivot at its final sorted index.",
          code: `procedure partition(A: List, low: Integer, high: Integer) -> Integer
    pivot ← A[high]
    i ← low - 1
    
    for j ← low to high - 1 do
        if A[j] ≤ pivot then
            i ← i + 1
            swap(A[i], A[j])
        end if
    end for
    
    swap(A[i + 1], A[high])
    return i + 1
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "[ 7, 2, 1, 6, 8, 5, 3, 4 ]",
      goal: "Sort in ascending order",
      steps: [
        {
          step: "Choose Pivot",
          state: "[ 7, 2, 1, 6, 8, 5, 3, (4) ]",
          explanation: "Pivot = 4. Initialize partition index i = -1.",
        },
        {
          step: "Partition Scan",
          state: "[ 2, 1, 3, (4), 8, 5, 7, 6 ]",
          explanation: "Elements <= 4 (2, 1, 3) moved to left. 4 placed at index 3.",
        },
        {
          step: "Recurse Left Subarray",
          state: "[ (1, 2, 3), 4, 8, 5, 7, 6 ]",
          explanation: "QuickSort on [2, 1, 3] sorts left side into [1, 2, 3].",
        },
        {
          step: "Recurse Right Subarray",
          state: "[ 1, 2, 3, 4, (5, 6, 7, 8) ]",
          explanation: "QuickSort on [8, 5, 7, 6] sorts right side into [5, 6, 7, 8].",
        },
      ],
      result: "[ 1, 2, 3, 4, 5, 6, 7, 8 ] (Sorted in-place)",
    },
    complexity: {
      best: {
        time: "O(n log n)",
        condition: "Pivot divides the array into two equal halves at every recursion level.",
      },
      average: {
        time: "O(n log n)",
        condition: "Random or median pivot selection ensures balanced partitioning.",
      },
      worst: {
        time: "O(n²)",
        condition: "Pathological pivot choice (smallest/largest element) on already sorted inputs.",
      },
      space: {
        memory: "O(log n)",
        explanation: "Call stack memory for recursion frames (capped at O(log n) with tail-call optimization).",
      },
      stable: {
        isStable: false,
        reason: "Partitioning swaps over long distances, disrupting the relative order of duplicate keys.",
      },
      mathematicalIntuition:
        "Average case recurrence T(n) = 2T(n/2) + O(n) yields Θ(n log n). Worst case recurrence T(n) = T(n-1) + O(n) yields Θ(n²).",
    },
    pitfalls: [
      {
        myth: "Quick Sort is always faster than Merge Sort.",
        reality:
          "Quick Sort is unstable, has an O(n²) worst case, and performs poorly on Linked Lists. Merge Sort is superior when stability or guaranteed O(n log n) is required.",
      },
      {
        myth: "Standard 2-way QuickSort handles duplicate elements efficiently.",
        reality:
          "Arrays with many identical elements can degrade standard 2-way partition to O(n²). Production engines use 3-Way Partitioning (Dutch National Flag) to solve this.",
      },
    ],
    prosAndCons: {
      pros: [
        "Fastest in-memory sorting algorithm in practice due to CPU cache locality.",
        "In-place: requires no auxiliary buffer array like Merge Sort.",
        "Easily parallelized on multi-core processors.",
      ],
      cons: [
        "Unstable sort.",
        "Worst-case O(n²) runtime if pivot selection is naive.",
        "Recursive call stack overhead.",
      ],
      edgeCases: [
        { name: "Already Sorted (Naive Pivot)", behavior: "Degrades to O(n²) with last-element pivot. Solved by Median-of-Three." },
        { name: "All Identical Elements", behavior: "2-way partition does redundant swaps; 3-way partition sorts in O(n) time." },
      ],
    },
    realWorldApplications: [
      {
        title: "C / C++ Standard Libraries",
        description: "Foundation of `qsort` in C and `std::sort` in C++ STL (implemented as Introsort).",
      },
      {
        title: "V8 JavaScript Engine",
        description: "Used for in-memory primitive sorting in Node.js and Chrome.",
      },
      {
        title: "Game Physics Engines",
        description: "Sorting spatial bounding boxes where speed and zero memory allocation are critical.",
      },
    ],
    keyTakeaways: [
      "Quick Sort partitions elements around a pivot and sorts partitions recursively.",
      "It is in-place, highly cache-efficient, and fastest in practice.",
      "Modern implementations use Median-of-3 and 3-Way Partitioning to prevent O(n²) worst cases.",
    ],
    nextTopics: [
      { name: "Binary Search", path: "/searching/binary", reason: "Search sorted arrays in logarithmic O(log n) time." },
      { name: "BST Insertion", path: "/tree/bst-insertion", reason: "See how partitioning relates to Binary Search Tree structure." },
    ],
  },

  // Searching Algorithms

  linearSearch: {
    title: "Linear Search",
    category: "Sequential Searching",
    tagline: "The universal sequential scan that inspects elements one by one without requiring sorted data.",
    whatIsIt:
      "Linear Search is the most fundamental searching algorithm. It starts at the beginning of a data structure and sequentially inspects each element one by one until the target value is found or the end of the collection is reached.",
    whyItMatters:
      "Linear Search is the only searching algorithm that works on completely unsorted, unindexed data. It requires zero preprocessing and is the fastest search method for tiny arrays (n < 10) because it involves no overhead, pointer hashing, or index math.",
    mentalModel: {
      analogy:
        "Looking for a specific receipt in an unsorted shoebox: you pull out receipts one by one from the top until you find the matching date or empty the box.",
      diagram: `[ Sequential Scanning Array ]
  Target = 23
  Index:     [ 0 ]    [ 1 ]    [ 2 ]    [ 3 ]    [ 4 ]
  Value:       12       45       7       23       9
  Step 1:      12 != 23 (Next)
  Step 2:      45 != 23 (Next)
  Step 3:       7 != 23 (Next)
  Step 4:      23 == 23 -> FOUND AT INDEX 3!`,
    },
    coreConcepts: [
      {
        title: "1. Zero Preprocessing Requirement",
        explanation:
          "Works on raw, arbitrary, unordered collections including arrays, linked lists, files, and incoming network streams.",
      },
      {
        title: "2. Single-Pass Iteration",
        explanation:
          "Traverses data in linear O(n) time. If the target element is at index k, it takes exactly k + 1 comparisons.",
      },
      {
        title: "3. Query vs Sort Trade-Off",
        explanation:
          "If performing only 1 search query, Linear Search O(n) is faster than sorting O(n log n) + Binary Search O(log n). If performing many queries, sorting first is vastly superior.",
      },
    ],
    howItWorks: [
      "Start at index i = 0.",
      "Compare the current element `array[i]` with the target value.",
      "If `array[i] === target`, return index i immediately (element found).",
      "If `array[i] !== target`, increment i by 1.",
      "If index i reaches the array length without a match, return -1 (not found).",
    ],
    pseudocode: {
      intro: "Sequential linear search scanning each index from left to right until target is found.",
      code: `procedure linearSearch(A: List, target: Value) -> Integer
    for i ← 0 to length(A) - 1 do
        if A[i] = target then
            return i    // Target found at index i
        end if
    end for
    return -1           // Target not present
end procedure`,
    },
    workedExample: {
      input: "Array = [ 12, 45, 7, 23, 9 ], Target = 7",
      goal: "Find index of target 7",
      steps: [
        { step: "Probe index 0", state: "[ (12), 45, 7, 23, 9 ]", explanation: "12 !== 7. Continue." },
        { step: "Probe index 1", state: "[ 12, (45), 7, 23, 9 ]", explanation: "45 !== 7. Continue." },
        { step: "Probe index 2", state: "[ 12, 45, (7), 23, 9 ]", explanation: "7 === 7! Target match found." },
      ],
      result: "Target found at index 2 after 3 comparisons.",
    },
    complexity: {
      best: {
        time: "O(1)",
        condition: "Target element is located at index 0.",
      },
      average: {
        time: "O(n)",
        condition: "Target is located near the middle (~n/2 comparisons).",
      },
      worst: {
        time: "O(n)",
        condition: "Target is at the last index or does not exist in the collection.",
      },
      space: {
        memory: "O(1)",
        explanation: "Requires no extra memory; uses a single loop index pointer.",
      },
      stable: {
        isStable: true,
        reason: "Does not modify data and naturally returns the first matching occurrence.",
      },
      mathematicalIntuition:
        "Assuming uniform target probability across n elements, expected comparisons = (1 + 2 + ... + n)/n = (n + 1)/2 = O(n).",
    },
    pitfalls: [
      {
        myth: "Always sort an array before searching.",
        reality:
          "Sorting costs O(n log n). If you are only doing a single search query, sorting is significantly slower than a direct O(n) Linear Search.",
      },
    ],
    prosAndCons: {
      pros: [
        "Zero preprocessing: works on completely unsorted data.",
        "Works on all data structures (linked lists, queues, arrays, streams).",
        "Fastest search method for tiny datasets (n < 10) due to zero overhead.",
      ],
      cons: [
        "Infeasible for large datasets (searching 1 billion items takes up to 1 billion operations).",
      ],
      edgeCases: [
        { name: "Target at Index 0", behavior: "Best case O(1) in 1 comparison." },
        { name: "Target Missing", behavior: "Scans all n elements before returning -1." },
        { name: "Empty Array", behavior: "Returns -1 immediately in O(1) time." },
      ],
    },
    realWorldApplications: [
      {
        title: "Unsorted Lookup Tables",
        description: "Small config lists, environment variable lookups, or command-line flag parsing.",
      },
      {
        title: "Streaming Data Filters",
        description: "Scanning live incoming IoT sensor packets for error codes in real time.",
      },
    ],
    keyTakeaways: [
      "Linear Search checks items one by one in O(n) time.",
      "It requires no sorting or extra memory.",
      "Best for single queries on unsorted data or small arrays.",
    ],
    nextTopics: [
      { name: "Binary Search", path: "/searching/binary", reason: "Learn how sorted data enables exponential speedup to O(log n)." },
      { name: "Linked List", path: "/linked-list/traversal", reason: "See how Linear Search operates on pointer-linked nodes." },
    ],
  },

  binarySearch: {
    title: "Binary Search",
    category: "Divide and Conquer Searching",
    tagline: "The logarithmic search algorithm that cuts the search space in half with every probe.",
    whatIsIt:
      "Binary Search is an extraordinarily efficient search algorithm that finds the position of a target value within a sorted array. It repeatedly compares the target value with the middle element of the interval, immediately eliminating half of the remaining elements in each step.",
    whyItMatters:
      "Binary Search represents the power of logarithmic scaling: searching an array of 1,000,000 items takes at most 20 comparisons, and searching 1,000,000,000 items takes at most 30 comparisons. It forms the foundation of database B-Tree indexing, git bisect debugging, and competitive programming optimization.",
    mentalModel: {
      analogy:
        "Looking up a word in a printed physical dictionary: you open directly to the middle, check if your target word comes alphabetically before or after that page, and immediately discard the irrelevant half of the book.",
      diagram: `[ Interval Halving Search Space ]
  Target = 23
  Array:  [ 2,  5,  8, 12, 16, 23, 38, 56, 72, 91 ]
          ^                  ^                  ^
         low                mid                high
  Step 1: mid = index 4 (val = 16). 23 > 16 -> Discard left half! Set low = mid + 1.
  Step 2: Subarray = [ 23, 38, 56, 72, 91 ]. mid = index 7 (val = 56). 23 < 56 -> Discard right!
  Step 3: Subarray = [ 23, 38 ]. mid = index 5 (val = 23) -> MATCH FOUND!`,
    },
    coreConcepts: [
      {
        title: "1. The Sorted Invariant Requirement",
        explanation:
          "Binary Search relies strictly on the sorted order invariant. If the array is unsorted, the decision to discard a half will eliminate valid target values.",
      },
      {
        title: "2. Three Pointer Tracking (low, mid, high)",
        explanation:
          "Search boundary is defined by [low ... high]. The midpoint is calculated and updated until low > high (target not present).",
      },
      {
        title: "3. Safe Midpoint Calculation",
        explanation:
          "In languages like Java and C++, `(low + high) / 2` can overflow 32-bit signed integers when low + high > 2^31 - 1. The robust formula is `mid = low + Math.floor((high - low) / 2)`.",
      },
    ],
    howItWorks: [
      "Initialize `low = 0` and `high = n - 1`.",
      "While `low <= high`:",
      "  Calculate `mid = low + Math.floor((high - low) / 2)`.",
      "  If `array[mid] === target`, return mid (found).",
      "  If `array[mid] < target`, target must be in right half: set `low = mid + 1`.",
      "  If `array[mid] > target`, target must be in left half: set `high = mid - 1`.",
      "If loop terminates with `low > high`, return -1 (target not found).",
    ],
    pseudocode: {
      intro: "Logarithmic search halving the search window on sorted arrays in each iteration.",
      code: `procedure binarySearch(A: Sorted List, target: Value) -> Integer
    left ← 0
    right ← length(A) - 1
    
    while left ≤ right do
        mid ← left + ⌊(right - left) / 2⌋
        
        if A[mid] = target then
            return mid          // Target located at index mid
        else if A[mid] < target then
            left ← mid + 1      // Target in right half
        else
            right ← mid - 1     // Target in left half
        end if
    end while
    
    return -1                   // Target not found
end procedure`,
    },
    workedExample: {
      input: "Array = [ 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 ], Target = 23",
      goal: "Find target 23 in sorted array",
      steps: [
        {
          step: "Iteration 1",
          state: "low=0 (2), high=9 (91), mid=4 (16)",
          explanation: "16 < 23. Target is in right half. Set low = mid + 1 = 5.",
        },
        {
          step: "Iteration 2",
          state: "low=5 (23), high=9 (91), mid=7 (56)",
          explanation: "56 > 23. Target is in left half. Set high = mid - 1 = 6.",
        },
        {
          step: "Iteration 3",
          state: "low=5 (23), high=6 (38), mid=5 (23)",
          explanation: "array[5] === 23! Target match confirmed.",
        },
      ],
      result: "Target found at index 5 in exactly 3 probes.",
    },
    complexity: {
      best: {
        time: "O(1)",
        condition: "Target element is located at the exact initial midpoint.",
      },
      average: {
        time: "O(log n)",
        condition: "Each step cuts the remaining search candidate space by 50%.",
      },
      worst: {
        time: "O(log n)",
        condition: "Requires at most ⌊log₂ n⌋ + 1 comparisons.",
      },
      space: {
        memory: "O(1)",
        explanation: "Iterative implementation uses only 3 pointer variables.",
      },
      stable: {
        isStable: true,
        reason: "Deterministic search; lower_bound variants find first occurrence.",
      },
      mathematicalIntuition:
        "Search space shrinks as n, n/2, n/4, ..., n/2^k = 1. Solving for k: 2^k = n => k = log₂ n iterations.",
    },
    pitfalls: [
      {
        myth: "`mid = (low + high) / 2` is always safe.",
        reality:
          "In languages like C++ and Java, if low + high exceeds 2,147,483,647, it wraps into a negative integer, causing out-of-bounds crashes. Always use `low + (high - low) / 2`.",
      },
      {
        myth: "Binary Search can be efficiently executed on standard Singly Linked Lists.",
        reality:
          "Linked Lists lack O(1) random indexing. Finding the midpoint on a linked list takes O(n) time, destroying the logarithmic advantage (total time remains O(n)).",
      },
    ],
    prosAndCons: {
      pros: [
        "Logarithmic O(log n) speed: searching 1 billion items takes at most 30 steps.",
        "O(1) auxiliary memory.",
        "Adaptable to binary search on answer spaces (optimization problems).",
      ],
      cons: [
        "Requires data to be strictly sorted beforehand.",
        "Requires constant-time random access (arrays), making it inefficient on standard linked lists.",
      ],
      edgeCases: [
        { name: "Target at Extremes (0 or n-1)", behavior: "Halves search interval log₂(n) times to reach extreme edges." },
        { name: "Target Missing", behavior: "Detects missing element when low > high in O(log n) steps." },
        { name: "Duplicate Values", behavior: "Finds an arbitrary instance; use lower_bound / upper_bound for specific positions." },
      ],
    },
    realWorldApplications: [
      {
        title: "Database Indexing (B+ Trees)",
        description: "B-Tree node page search in SQL databases (PostgreSQL, MySQL, SQLite).",
      },
      {
        title: "Git Bisect Debugging",
        description: "Binary searching git commit histories to find the exact commit that introduced a software bug.",
      },
      {
        title: "Standard Libraries",
        description: "C++ `std::lower_bound`, Python `bisect`, Java `Arrays.binarySearch`.",
      },
    ],
    keyTakeaways: [
      "Binary Search finds items in sorted arrays in O(log n) time.",
      "It halves the search space at every step.",
      "Always calculate `mid = low + (high - low) / 2` to prevent 32-bit integer overflow.",
    ],
    nextTopics: [
      { name: "BST Insertion", path: "/tree/bst-insertion", reason: "See how binary search principles are built into tree data structures." },
      { name: "Quick Sort", path: "/sorting/quick", reason: "Explore the divide-and-conquer partition sorting algorithm." },
    ],
  },

  // Data Structures

  stack: {
    title: "Stack (Push & Pop)",
    category: "Linear Data Structure",
    tagline: "The Last-In, First-Out (LIFO) structure powering program call stacks, undo buffers, and parser state.",
    whatIsIt:
      "A Stack is a linear data structure that operates on a strict Last-In, First-Out (LIFO) protocol. Elements can only be inserted (pushed) or removed (popped) from one designated end, known as the 'top' of the stack.",
    whyItMatters:
      "The stack is the backbone of modern computer architecture. Every CPU uses an execution call stack to manage function invocations, return addresses, and local variables. Stacks enable undo/redo history in software, expression syntax parsing (converting infix to postfix), and Depth-First Search graph traversal.",
    mentalModel: {
      analogy:
        "A stack of spring-loaded dinner plates in a cafeteria: the last clean plate placed onto the top of the pile is always the very first plate picked up by the next diner.",
      diagram: `[ Stack LIFO Mechanism ]
         Push(30) ->   |   30   |  <- Top Pointer (index 2)
                       |   20   |  <- index 1
         Pop()    <-   |   10   |  <- index 0 (Bottom)
                       +--------+`,
    },
    coreConcepts: [
      {
        title: "1. The LIFO Invariant",
        explanation:
          "The most recently added element is always the first to be removed. No random access: elements below the top cannot be accessed without first popping everything above them.",
      },
      {
        title: "2. The Top Pointer Index",
        explanation:
          "In an array implementation, a single integer `top` tracks the current highest index. `push` increments `top` and writes the value; `pop` reads the value and decrements `top`.",
      },
      {
        title: "3. Boundary Conditions: Overflow & Underflow",
        explanation:
          "Stack Overflow occurs when pushing onto a full fixed-size stack. Stack Underflow occurs when popping from an empty stack.",
      },
    ],
    howItWorks: [
      "Push(val): Check for overflow; if space exists, increment `top` pointer and store `val` at `array[top]`.",
      "Pop(): Check for underflow; if not empty, retrieve `array[top]`, decrement `top` pointer, and return the value.",
      "Peek() / Top(): Return `array[top]` without modifying the `top` pointer.",
      "IsEmpty(): Return true if `top === -1` (or size === 0).",
    ],
    pseudocode: {
      intro: "LIFO (Last-In First-Out) operations maintaining a top pointer.",
      operations: [
        {
          name: "Push",
          complexity: "O(1) time, O(1) space",
          description: "Pushes element onto the top of the stack.",
          code: `procedure push(stack: Stack, element: Value)
    if stack.top = MAX_CAPACITY - 1 then
        raise StackOverflowError
    end if
    stack.top ← stack.top + 1
    stack.elements[stack.top] ← element
end procedure`,
        },
        {
          name: "Pop",
          complexity: "O(1) time, O(1) space",
          description: "Removes and returns the top element.",
          code: `procedure pop(stack: Stack) -> Value
    if isEmpty(stack) then
        raise StackUnderflowError
    end if
    value ← stack.elements[stack.top]
    stack.top ← stack.top - 1
    return value
end procedure`,
        },
        {
          name: "Peek",
          complexity: "O(1) time, O(1) space",
          description: "Inspects the top element without removing it.",
          code: `procedure peek(stack: Stack) -> Value
    if isEmpty(stack) then
        raise StackEmptyError
    end if
    return stack.elements[stack.top]
end procedure`,
        },
        {
          name: "IsEmpty",
          complexity: "O(1) time, O(1) space",
          description: "Checks if the stack currently contains zero elements.",
          code: `procedure isEmpty(stack: Stack) -> Boolean
    return stack.top = -1
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "Operations: Push(10), Push(20), Push(30), Pop(), Peek()",
      goal: "Trace stack state and outputs",
      steps: [
        { step: "Push(10)", state: "[ 10 ] (top = 0)", explanation: "10 pushed to bottom slot." },
        { step: "Push(20)", state: "[ 10, 20 ] (top = 1)", explanation: "20 pushed above 10." },
        { step: "Push(30)", state: "[ 10, 20, 30 ] (top = 2)", explanation: "30 pushed to top slot." },
        { step: "Pop()", state: "[ 10, 20 ] (top = 1)", explanation: "Top element 30 is removed and returned." },
        { step: "Peek()", state: "[ 10, 20 ] (top = 1)", explanation: "Reads top value 20 without removing it." },
      ],
      result: "Pop returned 30; Peek returned 20. Stack holds [10, 20].",
    },
    complexity: {
      best: { time: "O(1)", condition: "Push, pop, peek are always constant time." },
      average: { time: "O(1)", condition: "Amortized O(1) for dynamic array implementations." },
      worst: { time: "O(1)", condition: "Direct array index or linked list head pointer operation." },
      space: { memory: "O(n)", explanation: "Linear memory proportional to the number of elements stored." },
      stable: null,
      mathematicalIntuition:
        "All fundamental stack operations execute in strictly O(1) time because they only read or modify a single memory pointer (top).",
    },
    pitfalls: [
      {
        myth: "Stacks support random access lookup by index like arrays.",
        reality:
          "By definition, a stack strictly restricts access to the top element. Accessing the bottom element requires popping and destroying (or buffering) all n elements above it.",
      },
      {
        myth: "Stack Overflow only happens in infinite recursive functions.",
        reality:
          "Stack Overflow happens anytime fixed stack memory is exhausted, including allocating overly massive local arrays on the CPU stack frame instead of the heap.",
      },
    ],
    prosAndCons: {
      pros: [
        "Guaranteed O(1) constant time for all basic operations.",
        "Simple implementation using arrays or linked lists.",
        "Prevents memory fragmentation when managed in contiguous memory blocks.",
      ],
      cons: [
        "No random access or search capability without popping all elements.",
        "Fixed-capacity array stacks can trigger stack overflow errors.",
      ],
      edgeCases: [
        { name: "Stack Overflow", behavior: "Attempting to push onto a full fixed-capacity stack triggers error/exception." },
        { name: "Stack Underflow", behavior: "Attempting to pop or peek from an empty stack triggers error/exception." },
      ],
    },
    realWorldApplications: [
      {
        title: "CPU Execution Call Stack",
        description: "Manages function activation frames, return instruction addresses, and local scope variables in OS runtimes.",
      },
      {
        title: "Undo / Redo Architecture",
        description: "Text editors (VS Code), Photoshop history, and browser back/forward navigation.",
      },
      {
        title: "Compiler Syntax Parsing",
        description: "Matching balanced parentheses, evaluating mathematical expressions (Shunting-Yard algorithm).",
      },
    ],
    keyTakeaways: [
      "Stack is a LIFO (Last-In, First-Out) data structure.",
      "Push, pop, and peek operations run in guaranteed O(1) time.",
      "It is the engine behind function recursion, undo buffers, and graph DFS.",
    ],
    nextTopics: [
      { name: "Linked List", path: "/linked-list/traversal", reason: "Understand pointer-based dynamic memory allocation." },
      { name: "DFS", path: "/graph/dfs", reason: "See how stacks drive Depth-First Search graph traversal." },
    ],
  },

  linkedList: {
    title: "Linked List (Traversal)",
    category: "Linear Data Structure",
    tagline: "Dynamic node-pointer chaining in scattered heap memory providing O(1) head operations.",
    whatIsIt:
      "A Linked List is a dynamic linear data structure composed of distinct nodes stored in heap memory. Each node encapsulates two fields: its data payload and a reference pointer (`next`) pointing to the subsequent node in the sequence, terminating with a `null` pointer.",
    whyItMatters:
      "Unlike contiguous arrays that require costly resizing and memory reallocations when capacity is reached, Linked Lists can allocate or deallocate nodes individually on the fly. They provide O(1) constant-time insertions and deletions at the head without shifting subsequent elements.",
    mentalModel: {
      analogy:
        "A treasure hunt: each clue you find contains a message (data) and directions to the physical location of the next clue (pointer), ending when a clue reads 'Treasure found' (NULL).",
      diagram: `[ Singly Linked List Node Chain ]
  Head
   │
   ▼
  ┌────────┬──────┐    ┌────────┬──────┐    ┌────────┬──────┐
  │ Val:12 │ Next ┼───►│ Val:99 │ Next ┼───►│ Val:37 │ NULL │
  └────────┴──────┘    └────────┴──────┘    └────────┴──────┘`,
    },
    coreConcepts: [
      {
        title: "1. Non-Contiguous Memory Allocation",
        explanation:
          "Array elements sit side-by-side in contiguous RAM blocks. Linked list nodes are scattered arbitrarily across the heap and connected solely via pointers.",
      },
      {
        title: "2. The Head and Null Termination",
        explanation:
          "The `head` pointer is the single entry point into the list. If `head === null`, the list is empty. The last node's `next` pointer is always `null`.",
      },
      {
        title: "3. Sequential Traversal Invariant",
        explanation:
          "To reach node k, you must start at `head` and traverse k pointer hops (`current = current.next`). Random index access in O(1) is impossible.",
      },
    ],
    howItWorks: [
      "Initialize a traversal pointer `current = head`.",
      "While `current !== null`:",
      "  Process or inspect `current.value`.",
      "  Advance the pointer: `current = current.next`.",
      "When `current === null`, the end of the list has been reached.",
    ],
    pseudocode: {
      intro: "Sequential linear traversal through node next pointers starting from head.",
      code: `procedure traverseList(head: Node)
    curr ← head
    while curr ≠ NULL do
        processNode(curr.value)
        curr ← curr.next
    end while
end procedure`,
    },
    workedExample: {
      input: "Head -> [12] -> [99] -> [37] -> NULL",
      goal: "Traverse and print all elements",
      steps: [
        { step: "Step 1", state: "current -> [12]", explanation: "Visit Head node. Value = 12. Advance current to next." },
        { step: "Step 2", state: "current -> [99]", explanation: "Visit second node. Value = 99. Advance current to next." },
        { step: "Step 3", state: "current -> [37]", explanation: "Visit third node. Value = 37. Advance current to next." },
        { step: "Step 4", state: "current === null", explanation: "Null reached. Traversal complete." },
      ],
      result: "Visited 3 nodes in O(n) linear time.",
    },
    complexity: {
      best: { time: "O(1)", condition: "Accessing or inserting at the head node." },
      average: { time: "O(n)", condition: "Traversing to the middle or finding an element." },
      worst: { time: "O(n)", condition: "Traversing to the tail node or searching for a missing value." },
      space: { memory: "O(n)", explanation: "Each node requires extra pointer overhead (8 bytes on 64-bit systems)." },
      stable: null,
      mathematicalIntuition:
        "Accessing node at index k requires exactly k pointer dereferences, making random access strictly Θ(k) = O(n).",
    },
    pitfalls: [
      {
        myth: "Linked Lists are always faster than Arrays for insertions.",
        reality:
          "Linked Lists are only O(1) when you already hold a direct pointer to the insertion node (e.g. at head). Inserting at index k requires O(k) traversal first.",
      },
      {
        myth: "Linked Lists have better hardware cache performance than Arrays.",
        reality:
          "Linked Lists have poor cache locality because nodes are scattered in memory, triggering CPU cache misses on every pointer dereference. Arrays benefit from contiguous hardware pre-fetching.",
      },
    ],
    prosAndCons: {
      pros: [
        "Dynamic sizing: nodes can be allocated and freed at runtime without resizing penalties.",
        "O(1) insertion and deletion at head without shifting elements.",
        "Efficient basis for queues, stacks, and chaining hash tables.",
      ],
      cons: [
        "No O(1) random indexing access.",
        "Memory overhead for storing pointer references on every node.",
        "Poor CPU cache locality due to scattered heap allocation.",
      ],
      edgeCases: [
        { name: "Empty List (head === null)", behavior: "Traversal loop does not execute; safely halts immediately." },
        { name: "Single Node List", behavior: "Visits head node and immediately encounters current.next === null." },
        { name: "Cyclic List", behavior: "Without cycle detection (Floyd's Tortoise and Hare), causes an infinite traversal loop." },
      ],
    },
    realWorldApplications: [
      {
        title: "OS Kernel Free Lists",
        description: "Dynamic memory allocation blocks in operating system kernels and C `malloc` implementations.",
      },
      {
        title: "Hash Table Collision Chaining",
        description: "Resolving bucket hash collisions in Java `HashMap` and Python dictionaries.",
      },
      {
        title: "Music Playlist Queue",
        description: "Managing seamless next/previous track navigation.",
      },
    ],
    keyTakeaways: [
      "Linked List nodes contain data and a `next` pointer.",
      "Head insertion/deletion is O(1); search/traversal is O(n).",
      "Dynamic sizing avoids array copying at the cost of pointer overhead and cache locality.",
    ],
    nextTopics: [
      { name: "BST Insertion", path: "/tree/bst-insertion", reason: "Extend single-pointer nodes into two-pointer binary tree hierarchies." },
      { name: "Stack", path: "/stack/push-pop", reason: "See how linked lists implement O(1) LIFO stacks." },
    ],
  },

  // Trees & Graphs

  bstInsertion: {
    title: "Binary Search Tree (BST)",
    category: "Tree Data Structure",
    tagline: "The ordered hierarchical structure combining dynamic node allocation with logarithmic search, insertion, and deletion.",
    whatIsIt:
      "A Binary Search Tree (BST) is a hierarchical node-based data structure where every node maintains the fundamental BST Ordering Invariant: all values in a node's left subtree are strictly less than the node's value (Left < Node), and all values in its right subtree are strictly greater (Right > Node). This property holds recursively for every subtree in the structure.",
    whyItMatters:
      "A BST provides an optimal middle ground between contiguous arrays (fast search, slow O(n) insert/delete) and linked lists (fast O(1) pointer updates, slow O(n) search). When balanced, a BST achieves O(h) = O(log n) time complexity for Search, Insert, and Delete. An Inorder Traversal (Left -> Root -> Right) visits all nodes in strictly sorted ascending order in linear O(n) time.",
    mentalModel: {
      analogy:
        "A multi-lane highway fork system: at every interchange (node), vehicles check the destination sign. If destination < current intersection, take the Left fork; if destination > current intersection, take the Right fork. At each split, half of the remaining road network is eliminated.",
      diagram: `[ Binary Search Tree Invariant ]
           [ 50 ]
          /      \\
      [ 25 ]    [ 75 ]
      /    \\    /    \\
    [12]  [37] [62]  [87]
 Left < 50        Right > 50
Inorder: 12 → 25 → 37 → 50 → 62 → 75 → 87 (Sorted)`,
    },
    coreConcepts: [
      {
        title: "1. The BST Ordering Invariant",
        explanation:
          "For any node N: ∀ Left child L, L.val < N.val. ∀ Right child R, R.val > N.val. This invariant holds across all subtrees and ensures that an Inorder Traversal (LNR) yields sorted ascending order.",
      },
      {
        title: "2. Tree Height (h) Determines Cost",
        explanation:
          "All fundamental operations (Search, Insert, Delete) require O(h) comparisons where h is the tree height. In a balanced tree, h = ⌊log₂ n⌋ yielding O(log n). In a skewed tree, h = n yielding O(n).",
      },
      {
        title: "3. The 3 Deletion Cases",
        explanation:
          "Deleting a node requires 3 distinct structural mechanics: (1) Leaf Node: directly sever parent pointer; (2) Single Child: bypass node by linking parent directly to the child; (3) Two Children: replace node value with its In-order Successor (smallest node in right subtree) and recursively delete the successor.",
      },
    ],
    howItWorks: [
      "Search(val): Start at root. If val === curr.val, return found. If val < curr.val, traverse left; if val > curr.val, traverse right. If curr === null, value does not exist.",
      "Insert(val): Start at root. Traverse left if val < curr.val or right if val > curr.val until reaching a null pointer. Attach new node at the null slot.",
      "Delete — Case 1 (Leaf): If target node has 0 children, unlink it from its parent.",
      "Delete — Case 2 (Single Child): If target node has 1 child, update parent's pointer to point directly to target's only child.",
      "Delete — Case 3 (Two Children): Find the In-order Successor (minimum node in right subtree), copy its value into target, and delete the successor node.",
      "Traversals: Inorder (LNR: Sorted), Preorder (NLR: Serialization/Cloning), Postorder (LRN: Bottom-up deletion/height), and BFS (Level-order queue exploration).",
    ],
    pseudocode: {
      intro: "Binary Search Tree operations maintaining the invariant: left < root < right.",
      operations: [
        {
          name: "Search",
          complexity: "O(h) time, O(1) space",
          description: "Locates a node by walking left if target < curr, or right if target > curr.",
          code: `procedure searchBST(root: TreeNode, target: Value) -> TreeNode
    curr ← root
    while curr ≠ NULL and curr.value ≠ target do
        if target < curr.value then
            curr ← curr.left
        else
            curr ← curr.right
        end if
    end while
    return curr
end procedure`,
        },
        {
          name: "Insert",
          complexity: "O(h) time, O(h) space (recursion)",
          description: "Inserts a new value into its correct leaf position.",
          code: `procedure insertBST(root: TreeNode, val: Value) -> TreeNode
    if root = NULL then
        return createNode(val)
    end if
    if val < root.value then
        root.left ← insertBST(root.left, val)
    else if val > root.value then
        root.right ← insertBST(root.right, val)
    end if
    return root
end procedure`,
        },
        {
          name: "Delete",
          complexity: "O(h) time, O(h) space (recursion)",
          description: "Deletes node, handling 0, 1, or 2 children via in-order successor.",
          code: `procedure deleteBST(root: TreeNode, val: Value) -> TreeNode
    if root = NULL then return NULL
    
    if val < root.value then
        root.left ← deleteBST(root.left, val)
    else if val > root.value then
        root.right ← deleteBST(root.right, val)
    else
        // Case 1 & 2: 0 or 1 child
        if root.left = NULL then return root.right
        if root.right = NULL then return root.left
        
        // Case 3: 2 children -> replace with in-order successor
        successor ← findMin(root.right)
        root.value ← successor.value
        root.right ← deleteBST(root.right, successor.value)
    end if
    return root
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "BST [50, 25, 75]. Operations: Search(25), Insert(62), Delete(50)",
      goal: "Execute fundamental BST operations preserving the BST invariant",
      steps: [
        { step: "Search (25)", state: "25 < 50 -> left -> 25 === 25", explanation: "Found node 25 in 1 hop from root." },
        { step: "Insert (62)", state: "62 > 50 (right) -> 62 < 75 (left)", explanation: "Attached 62 as left child of 75." },
        { step: "Delete Root (50)", state: "2 children -> Successor is 62", explanation: "Copied successor 62 to root, removed original leaf 62." },
      ],
      result: "BST invariant fully maintained: Root is now [62], Left subtree [25], Right subtree [75].",
    },
    complexity: {
      best: { time: "O(log n)", condition: "Balanced binary tree where height h = ⌊log₂ n⌋." },
      average: { time: "O(log n)", condition: "Randomized key insertions maintain balanced logarithmic height." },
      worst: { time: "O(n)", condition: "Degenerate skewed tree (inserting pre-sorted data produces linked list shape)." },
      space: { memory: "O(h)", explanation: "Recursion call stack depth equal to tree height h (O(log n) balanced, O(n) skewed)." },
      stable: null,
      mathematicalIntuition:
        "Tree height h dictates search and insertion cost. Balanced tree has depth log₂(n). Inorder traversal visits all n nodes in strictly sorted order in O(n) time.",
    },
    pitfalls: [
      {
        myth: "Standard BSTs guarantee O(log n) performance in all production environments.",
        reality:
          "If data arrives pre-sorted (e.g. 1, 2, 3, 4, 5), standard BST degenerates into a linear linked list with O(n) search time. Production engines use Self-Balancing Trees (Red-Black Trees or AVL Trees).",
      },
      {
        myth: "When deleting a node with 2 children, any child can replace the deleted node.",
        reality:
          "Only the In-order Successor (smallest in right subtree) or In-order Predecessor (largest in left subtree) can safely replace the node without violating the BST invariant.",
      },
    ],
    prosAndCons: {
      pros: [
        "Maintains sorted order dynamically with O(log n) search, insert, and delete when balanced.",
        "Inorder traversal yields sorted ascending order in linear O(n) time.",
        "Supports range queries (find all keys between min and max efficiently).",
      ],
      cons: [
        "Can degrade to O(n) linear performance on sorted input if not self-balancing.",
        "Requires self-balancing extensions (Red-Black / AVL) in production databases.",
      ],
      edgeCases: [
        { name: "Inserting into Empty Tree", behavior: "New node immediately becomes root." },
        { name: "Duplicate Values", behavior: "Typically rejected or routed per definition to prevent invariant ambiguity." },
        { name: "Deleting Root Node", behavior: "Correctly reassigns tree root pointer to successor or child." },
      ],
    },
    realWorldApplications: [
      {
        title: "C++ STL `std::set` and `std::map`",
        description: "Implemented as Red-Black Self-Balancing Binary Search Trees.",
      },
      {
        title: "Java `TreeSet` and `TreeMap`",
        description: "Navigable sorted associative maps in the Java standard library.",
      },
      {
        title: "Database Indexing & Filesystems",
        description: "Hierarchical B-Tree disk storage engines.",
      },
    ],
    keyTakeaways: [
      "BST enforces Left < Node < Right property across all subtrees.",
      "Search, Insert, and Delete take O(h) time, requiring tree balance for O(log n) efficiency.",
      "In-order successor (minimum in right subtree) is the invariant-safe replacement for 2-child deletion.",
    ],
    nextTopics: [
      { name: "Inorder Traversal", path: "/tree/inorder", reason: "Explore how LNR traversal extracts sorted sequences in linear O(n) time." },
      { name: "Min Heap", path: "/tree/min-heap", reason: "Compare BST ordered invariants with Binary Heap priority structures." },
    ],
  },

  bfs: {
    title: "Breadth-First Search (BFS)",
    category: "Graph Traversal",
    tagline: "The level-order frontier exploration algorithm that guarantees the Shortest Path in unweighted graphs.",
    whatIsIt:
      "Breadth-First Search (BFS) is a graph and tree traversal algorithm that explores vertices layer by layer. It starts at a designated source node and visits all immediate distance-1 neighbors before expanding to distance-2 neighbors, using a First-In, First-Out (FIFO) Queue to maintain the discovery frontier.",
    whyItMatters:
      "BFS guarantees finding the shortest path (minimum number of edges) between any two nodes in an unweighted graph. It powers web crawlers, GPS routing on unweighted grids, peer-to-peer network discovery, and social network degrees of separation ('People You May Know').",
    mentalModel: {
      analogy:
        "Ripples expanding outward when a pebble is dropped in water: the wave touches all points at distance 1 first, then distance 2, then distance 3 in concentric circles.",
      diagram: `[ BFS Level-by-Level Expansion ]
                 ( Root )        <- Level 0
                /        \\
             ( A )      ( B )    <- Level 1 (Queue frontier)
            /     \\        \\
          ( C )   ( D )    ( E ) <- Level 2
  Exploration Order: Root -> A -> B -> C -> D -> E`,
    },
    coreConcepts: [
      {
        title: "1. The FIFO Queue Frontier",
        explanation:
          "BFS enqueues newly discovered neighbors at the back of a Queue. Because nodes are processed in first-in order, all nodes at level k are exhausted before any node at level k+1 is processed.",
      },
      {
        title: "2. The Visited Set Invariant",
        explanation:
          "To prevent infinite loops in graphs with cycles, nodes are marked as 'visited' the exact moment they are enqueued.",
      },
      {
        title: "3. Shortest Path Property",
        explanation:
          "The first time BFS encounters a target node, the path taken is mathematically guaranteed to have the minimum number of edge transitions.",
      },
    ],
    howItWorks: [
      "Create an empty Queue `Q` and a `visited` set.",
      "Enqueue the starting node `source` into `Q` and add `source` to `visited`.",
      "While `Q` is not empty:",
      "  Dequeue the front vertex `u`.",
      "  Process vertex `u`.",
      "  For each neighbor `v` of `u` in the adjacency list:",
      "    If `v` is not in `visited`:",
      "      Add `v` to `visited`.",
      "      Set `parent[v] = u` (for path reconstruction).",
      "      Enqueue `v` into `Q`.",
    ],
    pseudocode: {
      intro: "Breadth-First Search traverses graph layer-by-layer using a FIFO queue.",
      code: `procedure breadthFirstSearch(graph: Graph, startNode: Node)
    visited ← new Set()
    queue ← new FIFOQueue()
    
    visited.add(startNode)
    queue.enqueue(startNode)
    
    while not queue.isEmpty() do
        curr ← queue.dequeue()
        process(curr)
        
        for each neighbor in graph.getNeighbors(curr) do
            if neighbor ∉ visited then
                visited.add(neighbor)
                queue.enqueue(neighbor)
            end if
        end for
    end while
end procedure`,
    },
    workedExample: {
      input: "Graph: A connected to B, C; B connected to D; C connected to D. Start = A",
      goal: "Find BFS traversal order",
      steps: [
        { step: "Init", state: "Queue=[A], Visited={A}", explanation: "Source A enqueued." },
        { step: "Visit A", state: "Queue=[B, C], Visited={A, B, C}", explanation: "Dequeues A. Enqueues unvisited neighbors B and C." },
        { step: "Visit B", state: "Queue=[C, D], Visited={A, B, C, D}", explanation: "Dequeues B. Enqueues unvisited neighbor D." },
        { step: "Visit C", state: "Queue=[D], Visited={A, B, C, D}", explanation: "Dequeues C. Neighbor D is already visited, skip." },
        { step: "Visit D", state: "Queue=[], Visited={A, B, C, D}", explanation: "Dequeues D. Queue empty. Complete." },
      ],
      result: "Traversal Order: A -> B -> C -> D (Shortest path to D is A->B->D or A->C->D).",
    },
    complexity: {
      best: { time: "O(V + E)", condition: "Visits all reachable vertices V and examines all incident edges E." },
      average: { time: "O(V + E)", condition: "Standard adjacency list graph traversal." },
      worst: { time: "O(V + E)", condition: "Dense graph traversal." },
      space: { memory: "O(V)", explanation: "Queue and visited set can hold up to V vertices at maximum graph width." },
      stable: null,
      mathematicalIntuition:
        "Every vertex is enqueued at most once (O(V)) and every edge is traversed at most twice in undirected graphs (O(E)), giving total runtime Θ(V + E).",
    },
    pitfalls: [
      {
        myth: "BFS finds the shortest path on graphs with weighted edges.",
        reality:
          "BFS only finds the shortest path on UNWEIGHTED graphs (where every edge cost is equal to 1). For weighted graphs, Dijkstra's Algorithm or Bellman-Ford must be used.",
      },
      {
        myth: "You can mark a node as visited when you dequeue it.",
        reality:
          "Nodes must be marked as visited immediately when ENQUEUED. Delaying until dequeue allows duplicate entries of the same node into the queue, causing exponential memory blowup.",
      },
    ],
    prosAndCons: {
      pros: [
        "Guarantees finding the Shortest Path in unweighted graphs.",
        "Finds all nodes within k hops from the source.",
        "Never gets trapped in infinite depth branches unlike unvisited DFS.",
      ],
      cons: [
        "High memory consumption: Queue frontier can require O(V) memory on wide graphs.",
        "Does not handle edge weights.",
      ],
      edgeCases: [
        { name: "Disconnected Graph", behavior: "Only visits vertices in the connected component of the source node." },
        { name: "Cyclic Graph", behavior: "Visited set prevents infinite loops." },
        { name: "Single Node Graph", behavior: "Dequeues source and immediately halts in O(1)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Social Network Degrees of Separation",
        description: "LinkedIn 1st, 2nd, and 3rd degree connection network exploration.",
      },
      {
        title: "Web Search Engine Crawlers",
        description: "Googlebot crawling web links level-by-level from high-authority seed URLs.",
      },
      {
        title: "GPS Grid Shortest Path",
        description: "Finding shortest turns on unweighted tile maps and maze navigation.",
      },
    ],
    keyTakeaways: [
      "BFS uses a FIFO Queue to explore graphs level by level.",
      "It guarantees the Shortest Path on unweighted graphs.",
      "Runs in O(V + E) time and O(V) space.",
    ],
    nextTopics: [
      { name: "DFS", path: "/graph/dfs", reason: "Compare with depth-first exploration and backtracking." },
      { name: "Binary Search Tree", path: "/tree/bst-insertion", reason: "Review hierarchical node storage structures." },
    ],
  },

  dfs: {
    title: "Depth-First Search (DFS)",
    category: "Graph Traversal",
    tagline: "The deep-path exploration algorithm powered by recursion, backtracking, and stack memory.",
    whatIsIt:
      "Depth-First Search (DFS) is a fundamental graph and tree traversal algorithm that explores as deeply as possible along each branch before backtracking. It uses a Last-In, First-Out (LIFO) Stack or the recursive call stack to manage traversal order.",
    whyItMatters:
      "DFS is the Swiss Army Knife of graph theory. Because it naturally tracks exploration paths and backtracking points, DFS forms the algorithmic foundation for Cycle Detection, Topological Sorting (build systems and compilers), Strongly Connected Components (Tarjan's/Kosaraju's), Maze Solving, and Backtracking (Sudoku / N-Queens).",
    mentalModel: {
      analogy:
        "Navigating a hedge maze: you follow a single corridor all the way to its dead end, drop a breadcrumb marker, backtrack to the last unexplored intersection, and try the next path.",
      diagram: `[ DFS Deep Branch & Backtracking ]
                 ( 1 )           <- Start at Root
                /     \\
             ( 2 )   ( 5 )       <- 1 goes deep to 2
            /     \\
          ( 3 )   ( 4 )          <- 2 goes deep to 3 (dead end), backtracks to 4
  Exploration Order: 1 -> 2 -> 3 -> 4 -> 5`,
    },
    coreConcepts: [
      {
        title: "1. The LIFO Call Stack Mechanism",
        explanation:
          "DFS goes as deep as possible by pushing unvisited neighbors onto the recursion stack. When a dead end (no unvisited neighbors) is reached, the function returns (backtracks).",
      },
      {
        title: "2. The Visited State Tracking",
        explanation:
          "A visited set prevents re-visiting nodes. In cycle detection, a 3-state coloring system (Unvisited=0, Visiting=1, Visited=2) detects back-edges.",
      },
      {
        title: "3. Discovery & Finish Timestamps",
        explanation:
          "Recording when a node is first entered vs when all its descendants are finished allows computing Topological Order (reverse finish order).",
      },
    ],
    howItWorks: [
      "Mark the current node `u` as visited.",
      "Process node `u`.",
      "For each neighbor `v` in the adjacency list of `u`:",
      "  If `v` has not been visited:",
      "    Recursively call `dfs(v)`.",
      "When all neighbors of `u` are visited, backtrack to the caller.",
    ],
    pseudocode: {
      intro: "Depth-First Search explores deeply along each branch before backtracking.",
      operations: [
        {
          name: "Recursive DFS",
          complexity: "O(V + E) time, O(V) space",
          description: "Natural recursive depth-first exploration via call stack.",
          code: `procedure depthFirstSearch(graph: Graph, startNode: Node)
    visited ← new Set()
    dfsRecursive(graph, startNode, visited)
end procedure

procedure dfsRecursive(graph: Graph, node: Node, visited: Set)
    visited.add(node)
    process(node)
    
    for each neighbor in graph.getNeighbors(node) do
        if neighbor ∉ visited then
            dfsRecursive(graph, neighbor, visited)
        end if
    end for
end procedure`,
        },
        {
          name: "Iterative DFS",
          complexity: "O(V + E) time, O(V) space",
          description: "Explicit stack implementation avoiding recursion depth limits.",
          code: `procedure dfsIterative(graph: Graph, startNode: Node)
    visited ← new Set()
    stack ← new Stack()
    stack.push(startNode)
    
    while not stack.isEmpty() do
        curr ← stack.pop()
        if curr ∉ visited then
            visited.add(curr)
            process(curr)
            
            for each neighbor in graph.getNeighbors(curr) in reverse do
                if neighbor ∉ visited then
                    stack.push(neighbor)
                end if
            end for
        end if
    end while
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "Graph: A -> B -> C, A -> D. Start = A",
      goal: "Find DFS traversal order",
      steps: [
        { step: "Call DFS(A)", state: "Stack=[A], Visited={A}", explanation: "Visit A. Pick neighbor B." },
        { step: "Call DFS(B)", state: "Stack=[A, B], Visited={A, B}", explanation: "Visit B. Pick neighbor C." },
        { step: "Call DFS(C)", state: "Stack=[A, B, C], Visited={A, B, C}", explanation: "Visit C. Dead end reached!" },
        { step: "Backtrack to B, then A", state: "Stack=[A]", explanation: "B has no other neighbors. Backtrack to A." },
        { step: "Call DFS(D)", state: "Stack=[A, D], Visited={A, B, C, D}", explanation: "Visit unvisited neighbor D." },
      ],
      result: "Traversal Order: A -> B -> C -> D.",
    },
    complexity: {
      best: { time: "O(V + E)", condition: "Visits all reachable vertices V and traverses all edges E." },
      average: { time: "O(V + E)", condition: "Standard adjacency list traversal." },
      worst: { time: "O(V + E)", condition: "Dense graph traversal." },
      space: { memory: "O(V)", explanation: "Recursion call stack memory equal to maximum path depth (O(V) worst case, O(h) on balanced trees)." },
      stable: null,
      mathematicalIntuition:
        "Every vertex is visited once (O(V)) and every edge is explored once per direction (O(E)), giving exact runtime Θ(V + E).",
    },
    pitfalls: [
      {
        myth: "DFS finds the shortest path like BFS.",
        reality:
          "DFS does NOT guarantee the shortest path. It follows deep branches and may find a path of length 10 before discovering an alternative path of length 1.",
      },
      {
        myth: "Recursive DFS is always safe on large graphs.",
        reality:
          "Very deep graphs (e.g. line graphs with 100,000 nodes) can trigger CPU Call Stack Overflow errors. Deep graphs require an iterative DFS with an explicit heap-allocated stack.",
      },
    ],
    prosAndCons: {
      pros: [
        "Low memory consumption on narrow graphs: O(h) stack depth vs O(w) for BFS.",
        "Optimal for cycle detection, topological sorting, and connected components.",
        "Natural recursive implementation for backtracking and puzzle solvers.",
      ],
      cons: [
        "Does not guarantee finding the shortest path.",
        "Can cause stack overflow on very deep recursion trees without manual stack.",
      ],
      edgeCases: [
        { name: "Graph with Cycles", behavior: "Visited set prevents infinite looping." },
        { name: "Disconnected Components", behavior: "Outer loop across all vertices required to visit all components." },
        { name: "Deep Line Graph", behavior: "May cause call stack overflow; requires iterative stack on deep graphs." },
      ],
    },
    realWorldApplications: [
      {
        title: "Build Dependency Resolution (Topological Sort)",
        description: "Webpack, Vite, Make, and npm resolving dependency graphs in build systems.",
      },
      {
        title: "Deadlock & Cycle Detection",
        description: "OS kernels detecting resource allocation circular deadlocks.",
      },
      {
        title: "Maze & Game State Tree Solvers",
        description: "Backtracking algorithms solving Sudoku, Chess minimax trees, and maze paths.",
      },
    ],
    keyTakeaways: [
      "DFS explores as deep as possible along each branch before backtracking.",
      "It runs in O(V + E) time using LIFO call stack memory.",
      "It is the foundation of Topological Sort, Cycle Detection, and Backtracking.",
    ],
    nextTopics: [
      { name: "BFS", path: "/graph/bfs", reason: "Compare with level-order shortest-path traversal." },
      { name: "Stack", path: "/stack/push-pop", reason: "Master the LIFO stack structure powering DFS." },
    ],
  },
  // Stack Extensions

  balancedParens: {
    title: "Balanced Parentheses",
    category: "Stack Algorithm",
    tagline: "The foundational syntax validation algorithm using LIFO state to match nested delimiters.",
    whatIsIt:
      "Balanced Parentheses matching is an algorithm that verifies whether every opening delimiter (parentheses '()', curly braces '{}', square brackets '[]') has a corresponding, properly nested closing delimiter in the correct order.",
    whyItMatters:
      "Every compiler, IDE, markdown engine, and JSON/XML parser uses balanced bracket matching as its first-pass lexical scanner. Code with mismatched brackets cannot be compiled into an Abstract Syntax Tree (AST).",
    mentalModel: {
      analogy:
        "Russian nesting dolls: the doll opened most recently must be the first doll closed before any outer doll can be shut.",
      diagram: `[ Bracket Matching Stack Trace ]
  Input: "{ [ ( ) ] }"
  Scan '{': Push '{' -> Stack: [ '{' ]
  Scan '[': Push '[' -> Stack: [ '{', '[' ]
  Scan '(': Push '(' -> Stack: [ '{', '[', '(' ]
  Scan ')': Matches top '(' -> Pop -> Stack: [ '{', '[' ]
  Scan ']': Matches top '[' -> Pop -> Stack: [ '{' ]
  Scan '}': Matches top '{' -> Pop -> Stack: [ ] (Empty -> VALID!)`,
    },
    coreConcepts: [
      {
        title: "1. The LIFO Matching Invariant",
        explanation:
          "The most recently opened bracket must be the earliest closed. An opening bracket is pushed onto the stack; a closing bracket must match the element at the top of the stack.",
      },
      {
        title: "2. Mismatch Failure Modes",
        explanation:
          "Three failure conditions: (1) Type mismatch (e.g. '(]'), (2) Premature close / stack underflow (e.g. ')' when stack is empty), (3) Unclosed open brackets at end of string (stack not empty).",
      },
      {
        title: "3. Hash Map Lookup Optimization",
        explanation:
          "Using a hash map { ')': '(', '}': '{', ']': '[' } allows O(1) matching between closing tokens and required opening tokens.",
      },
    ],
    howItWorks: [
      "Initialize an empty Stack.",
      "Iterate through each character in the string.",
      "If the character is an opening delimiter ('(', '{', '['), push it onto the stack.",
      "If the character is a closing delimiter (')', '}', ']'):",
      "  If stack is empty, return false (unmatched closing bracket).",
      "  Pop the top character from the stack.",
      "  If the popped character does not match the closing delimiter type, return false.",
      "After scanning the entire string, return true if stack is empty, else false.",
    ],
    pseudocode: {
      intro: "Stack-based parentheses matching verifying structural syntax balance.",
      code: `procedure isBalancedParentheses(s: String) -> Boolean
    stack ← new Stack()
    matchingMap ← { ')': '(', '}': '{', ']': '[' }
    
    for each char in s do
        if char is in ['(', '{', '['] then
            stack.push(char)
        else if char is in [')', '}', ']'] then
            if stack.isEmpty() or stack.pop() ≠ matchingMap[char] then
                return false   // Mismatch or unexpected closing bracket
            end if
        end if
    end for
    
    return stack.isEmpty()     // True only if all openers matched & popped
end procedure`,
    },
    workedExample: {
      input: "\"{ [ ( ) ] }\"",
      goal: "Validate if parentheses are balanced",
      steps: [
        { step: "Scan '{'", state: "Stack=[ '{' ]", explanation: "Opening brace -> Push to stack." },
        { step: "Scan '['", state: "Stack=[ '{', '[' ]", explanation: "Opening bracket -> Push to stack." },
        { step: "Scan '('", state: "Stack=[ '{', '[', '(' ]", explanation: "Opening paren -> Push to stack." },
        { step: "Scan ')'", state: "Stack=[ '{', '[' ]", explanation: "Closing paren matches top '('. Pop stack." },
        { step: "Scan ']'", state: "Stack=[ '{' ]", explanation: "Closing bracket matches top '['. Pop stack." },
        { step: "Scan '}'", state: "Stack=[ ]", explanation: "Closing brace matches top '{'. Pop stack." },
      ],
      result: "Valid! Entire string processed and stack is completely empty.",
    },
    complexity: {
      best: { time: "O(1)", condition: "String starts with mismatched closing bracket like ')'." },
      average: { time: "O(n)", condition: "Single pass scanning all n characters." },
      worst: { time: "O(n)", condition: "Valid or long balanced sequence." },
      space: { memory: "O(n)", explanation: "In worst case (all open brackets '(((((('), stack holds n characters." },
      stable: null,
      mathematicalIntuition:
        "Every character is pushed at most once and popped at most once. Total operations <= 2n => strictly Θ(n) time.",
    },
    pitfalls: [
      {
        myth: "Counting open and close parentheses with integers is enough to check validity.",
        reality:
          "Simple counters fail on mixed types (e.g. '[(])' has equal counts of brackets and parens but is invalid nesting). A stack is mandatory to enforce LIFO ordering.",
      },
      {
        myth: "If no closing bracket triggers a mismatch, the string is valid.",
        reality:
          "You must check that the stack is completely empty after the scan. Strings like '(()' never trigger a mismatch during the loop but leave unclosed brackets in the stack.",
      },
    ],
    prosAndCons: {
      pros: [
        "Optimal O(n) single-pass linear time.",
        "Simple implementation using standard stack.",
        "Extensible to custom markup tags (e.g. HTML/XML <div>...</div>).",
      ],
      cons: [
        "Requires O(n) memory in worst case for deeply nested structures.",
      ],
      edgeCases: [
        { name: "Empty String", behavior: "Trivially balanced -> returns true." },
        { name: "Single Character (e.g. '(')", behavior: "Fails post-loop stack empty check -> returns false." },
        { name: "Starts with Closing (e.g. ']')", behavior: "Immediate underflow -> returns false." },
      ],
    },
    realWorldApplications: [
      {
        title: "Compiler Lexers & Parsers",
        description: "Checking syntax integrity in Babel, TypeScript compiler (tsc), GCC, and Clang.",
      },
      {
        title: "IDE Bracket Pair Colorization",
        description: "VS Code highlighting matching delimiter scopes in real-time.",
      },
      {
        title: "JSON & XML Schema Validators",
        description: "Validating structural document integrity in serialization libraries.",
      },
    ],
    keyTakeaways: [
      "LIFO stack ensures inner brackets close before outer brackets.",
      "Check both mismatch during scan AND empty stack at end.",
      "Runs in O(n) time and O(n) space.",
    ],
    nextTopics: [
      { name: "Next Greater Element", path: "/stack/next-greater", reason: "Learn advanced Monotonic Stack patterns." },
      { name: "Stack (Push & Pop)", path: "/stack/push-pop", reason: "Review foundational stack operations." },
    ],
  },

  nextGreaterElement: {
    title: "Next Greater Element",
    category: "Monotonic Stack",
    tagline: "The optimal O(n) pattern for finding the nearest greater neighbor using a monotonically decreasing stack.",
    whatIsIt:
      "The Next Greater Element (NGE) problem asks: for each element in an array, find the first element to its right that is strictly greater than it. If no such element exists, return -1.",
    whyItMatters:
      "A brute-force solution compares every pair in O(n²) time. The Monotonic Stack reduces this to O(n) linear time. This technique is the foundational pattern for solving classic engineering problems like Daily Temperatures, Stock Span, and Largest Rectangle in a Histogram.",
    mentalModel: {
      analogy:
        "People standing in a line looking to their right: tall people block the view of shorter people behind them. Each person can only see the first person taller than themselves.",
      diagram: `[ Monotonic Decreasing Stack ]
  Array: [ 2, 1, 2, 4, 3 ]
  Traverse Right-to-Left:
  Scan 3: Stack empty -> NGE(3) = -1. Push 3.           Stack: [3]
  Scan 4: Pop 3 (4 > 3) -> Stack empty -> NGE(4) = -1. Push 4. Stack: [4]
  Scan 2: Top is 4 (4 > 2) -> NGE(2) = 4. Push 2.       Stack: [4, 2]
  Scan 1: Top is 2 (2 > 1) -> NGE(1) = 2. Push 1.       Stack: [4, 2, 1]
  Scan 2: Pop 1 (2 >= 1). Top is 2 (equal, pop 2). Top is 4 -> NGE(2) = 4.
  Result: [ 4, 2, 4, -1, -1 ]`,
    },
    coreConcepts: [
      {
        title: "1. The Monotonic Invariant",
        explanation:
          "The stack maintains elements in strictly decreasing order from bottom to top. Any incoming element that is larger than the top pops smaller elements until order is restored.",
      },
      {
        title: "2. Amortized Linear Cost",
        explanation:
          "Although there is a while-loop inside the for-loop, each array element is pushed onto the stack exactly once and popped at most once, guaranteeing total 2n operations = O(n).",
      },
      {
        title: "3. Circular Array Extension",
        explanation:
          "For circular arrays (where the search wraps around to index 0), simulate a double-length array by looping from 2n - 1 down to 0 with index i % n.",
      },
    ],
    howItWorks: [
      "Initialize an array `result` of size n filled with -1.",
      "Initialize an empty Stack.",
      "Iterate backwards from index n - 1 down to 0:",
      "  While stack is not empty and `stack.top() <= array[i]`, pop the stack.",
      "  If stack is not empty, `result[i] = stack.top()`.",
      "  Push `array[i]` onto the stack.",
      "Return `result`.",
    ],
    pseudocode: {
      intro: "Monotonic decreasing stack resolving next greater element in linear O(n) time.",
      code: `procedure nextGreaterElement(A: List of Integers) -> List of Integers
    n ← length(A)
    result ← array of size n filled with -1
    stack ← new Stack()    // Stores indices with descending values
    
    for i ← 0 to n - 1 do
        while not stack.isEmpty() and A[stack.peek()] < A[i] do
            resolvedIndex ← stack.pop()
            result[resolvedIndex] ← A[i]
        end while
        stack.push(i)
    end for
    
    return result
end procedure`,
    },
    workedExample: {
      input: "[ 4, 5, 2, 25 ]",
      goal: "Find Next Greater Element for each index",
      steps: [
        { step: "Index 3 (val 25)", state: "Stack=[25], NGE[3]=-1", explanation: "Stack empty. NGE is -1. Push 25." },
        { step: "Index 2 (val 2)", state: "Stack=[25, 2], NGE[2]=25", explanation: "Top 25 > 2. NGE is 25. Push 2." },
        { step: "Index 1 (val 5)", state: "Stack=[25, 5], NGE[1]=25", explanation: "Pop 2 (5 >= 2). Top 25 > 5. NGE is 25. Push 5." },
        { step: "Index 0 (val 4)", state: "Stack=[25, 5, 4], NGE[0]=5", explanation: "Top 5 > 4. NGE is 5. Push 4." },
      ],
      result: "[ 5, 25, 25, -1 ] computed in linear O(n) time.",
    },
    complexity: {
      best: { time: "O(n)", condition: "Strictly decreasing array." },
      average: { time: "O(n)", condition: "Random array requiring amortized 1 push and 1 pop per item." },
      worst: { time: "O(n)", condition: "Strictly increasing array." },
      space: { memory: "O(n)", explanation: "Stack can store up to n elements in worst case." },
      stable: null,
      mathematicalIntuition:
        "Every element enters the stack once and leaves at most once. Push operations = n, pop operations <= n => Total operations <= 2n = O(n).",
    },
    pitfalls: [
      {
        myth: "Because there is a while loop inside the for loop, time complexity is O(n²).",
        reality:
          "This is a classic amortized analysis mistake. An element popped from the stack is never re-evaluated. Total pops across the entire loop cannot exceed n.",
      },
    ],
    prosAndCons: {
      pros: [
        "Reduces quadratic O(n²) brute force to optimal O(n) linear time.",
        "Versatile building block for range-minimum and histogram optimization.",
      ],
      cons: [
        "Requires auxiliary O(n) memory for stack storage.",
      ],
      edgeCases: [
        { name: "Strictly Decreasing (e.g. [5,4,3,2,1])", behavior: "All NGEs are -1." },
        { name: "Strictly Increasing (e.g. [1,2,3,4,5])", behavior: "Each element's NGE is its immediate right neighbor." },
        { name: "All Identical", behavior: "All NGEs are -1 (strict inequality requirement)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Stock Market Momentum Analysis",
        description: "Calculating stock span (consecutive days price was below current).",
      },
      {
        title: "Weather Forecast Warnings",
        description: "Daily temperature wait-time calculation for climate sensors.",
      },
      {
        title: "Audio Signal Peak Detection",
        description: "Finding next resonant frequencies in digital signal processing.",
      },
    ],
    keyTakeaways: [
      "Monotonic stack maintains elements in strictly decreasing/increasing order.",
      "Amortized cost is O(n) because each item is pushed/popped at most once.",
      "Optimal solution for Next Greater / Previous Smaller element queries.",
    ],
    nextTopics: [
      { name: "Balanced Parentheses", path: "/stack/balanced-parens", reason: "Practice LIFO bracket matching." },
      { name: "Priority Queue", path: "/queue/priority", reason: "Explore heap-based priority retrieval." },
    ],
  },

  // Queue Algorithms

  enqueueDequeue: {
    title: "Queue (Enqueue & Dequeue)",
    category: "Linear Data Structure",
    tagline: "The fundamental First-In, First-Out (FIFO) queue managing asynchronous job orders and BFS discovery.",
    whatIsIt:
      "A Queue is a linear data structure that adheres to the First-In, First-Out (FIFO) principle. Items are inserted at the back (Enqueue) and removed from the front (Dequeue), ensuring that the oldest added element is always processed first.",
    whyItMatters:
      "Queues buffer asynchronous requests across decoupled systems. From operating system CPU task scheduling and printer spooling to web request throttling and Breadth-First Search (BFS) graph traversals, queues maintain fair, orderly execution flow.",
    mentalModel: {
      analogy:
        "A checkout line at a grocery store: the first customer to stand in line is the first customer served and checked out.",
      diagram: `[ Queue FIFO Protocol ]
  Enqueue(40) ──► [ 40 | 30 | 20 | 10 ] ──► Dequeue() returns 10
                  ▲                ▲
                 Rear            Front`,
    },
    coreConcepts: [
      {
        title: "1. The FIFO Invariant",
        explanation:
          "Insertion happens exclusively at rear; deletion happens exclusively at front. Items exit in the exact order they arrived.",
      },
      {
        title: "2. Front and Rear Pointer Mechanics",
        explanation:
          "Using two pointers prevents O(n) shifting: enqueue writes to rear and increments it; dequeue reads from front and increments it.",
      },
      {
        title: "3. Implementation Strategies",
        explanation:
          "Can be implemented via Doubly Linked Lists (pure O(1) without capacity limits) or Circular Arrays (fixed capacity cache locality).",
      },
    ],
    howItWorks: [
      "Enqueue(val): Place val at the rear of the queue and increment the rear pointer.",
      "Dequeue(): Retrieve the value at the front pointer, increment the front pointer, and return the value.",
      "Peek() / Front(): Return the element at the front pointer without removing it.",
      "IsEmpty(): Return true if size is 0 or front > rear.",
    ],
    pseudocode: {
      intro: "FIFO (First-In First-Out) operations maintaining front and rear pointers.",
      operations: [
        {
          name: "Enqueue",
          complexity: "O(1) time, O(1) space",
          description: "Appends a new element to the rear of the queue.",
          code: `procedure enqueue(queue: Queue, element: Value)
    newNode ← createNode(element)
    if queue.rear = NULL then
        queue.front ← newNode
        queue.rear ← newNode
    else
        queue.rear.next ← newNode
        queue.rear ← newNode
    end if
    queue.size ← queue.size + 1
end procedure`,
        },
        {
          name: "Dequeue",
          complexity: "O(1) time, O(1) space",
          description: "Removes and returns the front element.",
          code: `procedure dequeue(queue: Queue) -> Value
    if isEmpty(queue) then
        raise QueueUnderflowError
    end if
    removedNode ← queue.front
    queue.front ← queue.front.next
    if queue.front = NULL then
        queue.rear ← NULL
    end if
    queue.size ← queue.size - 1
    return removedNode.value
end procedure`,
        },
        {
          name: "Front / Peek",
          complexity: "O(1) time, O(1) space",
          description: "Inspects the front element without removing it.",
          code: `procedure front(queue: Queue) -> Value
    if isEmpty(queue) then
        raise QueueEmptyError
    end if
    return queue.front.value
end procedure`,
        },
        {
          name: "IsEmpty",
          complexity: "O(1) time, O(1) space",
          description: "Checks if queue currently contains zero elements.",
          code: `procedure isEmpty(queue: Queue) -> Boolean
    return queue.front = NULL
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "Operations: Enqueue(10), Enqueue(20), Enqueue(30), Dequeue(), Peek()",
      goal: "Trace queue FIFO evolution",
      steps: [
        { step: "Enqueue(10)", state: "Queue=[10] (Front=10, Rear=10)", explanation: "10 added as first element." },
        { step: "Enqueue(20)", state: "Queue=[10, 20] (Front=10, Rear=20)", explanation: "20 added behind 10." },
        { step: "Enqueue(30)", state: "Queue=[10, 20, 30] (Front=10, Rear=30)", explanation: "30 added behind 20." },
        { step: "Dequeue()", state: "Queue=[20, 30] (Front=20, Rear=30)", explanation: "Removes and returns front element 10." },
        { step: "Peek()", state: "Queue=[20, 30] (Front=20, Rear=30)", explanation: "Inspects front element 20 without removing." },
      ],
      result: "Dequeue returned 10; Peek returned 20. Queue holds [20, 30].",
    },
    complexity: {
      best: { time: "O(1)", condition: "Enqueue and Dequeue are constant time." },
      average: { time: "O(1)", condition: "Amortized constant time." },
      worst: { time: "O(1)", condition: "Direct pointer / circular array access." },
      space: { memory: "O(n)", explanation: "Linear space proportional to elements in queue." },
      stable: null,
      mathematicalIntuition:
        "All basic queue operations manipulate exactly one index pointer (front or rear), guaranteeing strictly O(1) time.",
    },
    pitfalls: [
      {
        myth: "A naive array with shift() is fine for production queues in JavaScript/Python.",
        reality:
          "Calling array.shift() or list.pop(0) takes O(n) linear time because all remaining n-1 elements must shift in memory. Use a linked list or circular buffer for true O(1) queues.",
      },
    ],
    prosAndCons: {
      pros: [
        "Guaranteed O(1) constant time for enqueue and dequeue.",
        "Ensures fair First-In, First-Out processing order.",
        "Decouples asynchronous producers and consumers.",
      ],
      cons: [
        "No random access: middle elements cannot be directly queried.",
        "Linear array implementations suffer from wasted memory (solved by Circular Queue).",
      ],
      edgeCases: [
        { name: "Queue Underflow", behavior: "Attempting to dequeue from empty queue triggers error/null." },
        { name: "Single Element Queue", behavior: "Dequeuing sets both front and rear to idle state." },
      ],
    },
    realWorldApplications: [
      {
        title: "Operating System CPU Scheduling",
        description: "Round-robin ready queues managing CPU time slices across running processes.",
      },
      {
        title: "Breadth-First Search (BFS)",
        description: "Frontier exploration queue exploring vertices level-by-level.",
      },
      {
        title: "Message Brokers (Kafka / RabbitMQ)",
        description: "Enterprise pub/sub event streaming queues.",
      },
    ],
    keyTakeaways: [
      "Queue enforces FIFO (First-In, First-Out) ordering.",
      "Enqueue adds to rear; Dequeue removes from front in O(1) time.",
      "Core driver of BFS graph search and asynchronous message processing.",
    ],
    nextTopics: [
      { name: "Circular Queue", path: "/queue/circular", reason: "Learn how ring buffers eliminate array memory waste." },
      { name: "BFS", path: "/graph/bfs", reason: "See how FIFO queues power Breadth-First Search." },
    ],
  },

  circularQueue: {
    title: "Circular Queue (Ring Buffer)",
    category: "Linear Data Structure",
    tagline: "The bounded FIFO buffer using modulo arithmetic to reuse memory and eliminate shifting.",
    whatIsIt:
      "A Circular Queue (or Ring Buffer) is a fixed-size queue that logically connects the last position back to the first position in a continuous loop. It uses modulo arithmetic to wrap front and rear pointers, reusing deallocated slots without shifting memory.",
    whyItMatters:
      "In a standard array-based queue, dequeuing elements leaves empty 'dead space' at the front that cannot be reused without costly O(n) shifting. Circular queues provide guaranteed O(1) time and zero memory reallocation, making them the standard for audio DSP streaming, network socket buffers, and OS device drivers.",
    mentalModel: {
      analogy:
        "A circular carousel or a clock face: when the minute hand reaches 12 (the end of the array), it wraps seamlessly back to 1 (the start) without needing a new clock.",
      diagram: `[ Circular Ring Buffer (Capacity = 5) ]
              [ 0: 10 ]  <- Front
             /         \\
      [ 4: _ ]          [ 1: 20 ]
          |                 |
      [ 3: _ ]          [ 2: 30 ]  <- Rear
             \\         /
              [ Modulo: index = (index + 1) % 5 ]`,
    },
    coreConcepts: [
      {
        title: "1. Modulo Arithmetic Wrap-Around",
        explanation:
          "Advancing pointers uses: rear = (rear + 1) % capacity and front = (front + 1) % capacity. When index reaches capacity - 1, the next index is 0.",
      },
      {
        title: "2. Full vs Empty Ambiguity Resolution",
        explanation:
          "When front === rear, the queue could be completely full or completely empty. This is resolved by either maintaining an explicit count variable or leaving one empty sentinel slot.",
      },
      {
        title: "3. Lock-Free Single-Producer Single-Consumer (SPSC)",
        explanation:
          "In concurrent systems, ring buffers allow one thread to write to rear and another thread to read from front with zero mutex locking.",
      },
    ],
    howItWorks: [
      "Initialize array of size k, front = 0, rear = -1, count = 0.",
      "Enqueue(val): If count === k, return false (Full). Set rear = (rear + 1) % k, write array[rear] = val, increment count.",
      "Dequeue(): If count === 0, return false (Empty). Retrieve array[front], set front = (front + 1) % k, decrement count.",
      "Front(): Return count === 0 ? -1 : array[front].",
      "Rear(): Return count === 0 ? -1 : array[rear].",
    ],
    pseudocode: {
      intro: "Ring buffer maintaining modular front and rear indices with fixed capacity.",
      operations: [
        {
          name: "Enqueue",
          complexity: "O(1) time, O(1) space",
          description: "Adds item at rear using modular arithmetic.",
          code: `procedure enqueue(cq: CircularQueue, val: Value) -> Boolean
    if isFull(cq) then return false
    
    if isEmpty(cq) then
        cq.front ← 0
    end if
    cq.rear ← (cq.rear + 1) mod cq.capacity
    cq.buffer[cq.rear] ← val
    cq.count ← cq.count + 1
    return true
end procedure`,
        },
        {
          name: "Dequeue",
          complexity: "O(1) time, O(1) space",
          description: "Removes item from front using modular arithmetic.",
          code: `procedure dequeue(cq: CircularQueue) -> Value
    if isEmpty(cq) then raise QueueUnderflowError
    
    val ← cq.buffer[cq.front]
    if cq.front = cq.rear then
        cq.front ← -1
        cq.rear ← -1
    else
        cq.front ← (cq.front + 1) mod cq.capacity
    end if
    cq.count ← cq.count - 1
    return val
end procedure`,
        },
        {
          name: "IsFull / IsEmpty",
          complexity: "O(1) time, O(1) space",
          description: "Checks capacity boundaries in constant time.",
          code: `procedure isFull(cq: CircularQueue) -> Boolean
    return cq.count = cq.capacity
end procedure

procedure isEmpty(cq: CircularQueue) -> Boolean
    return cq.count = 0
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "Capacity 3: Enqueue(1), Enqueue(2), Enqueue(3), Dequeue(), Enqueue(4)",
      goal: "Demonstrate wrap-around without memory shifting",
      steps: [
        { step: "Enqueue 1, 2, 3", state: "[ 1, 2, 3 ] (Full)", explanation: "Buffer filled. Rear is at index 2." },
        { step: "Dequeue()", state: "[ _, 2, 3 ] (Front at index 1)", explanation: "1 removed. Slot 0 is now reusable." },
        { step: "Enqueue(4)", state: "[ 4, 2, 3 ] (Rear wrapped to 0!)", explanation: "Rear wraps: (2+1)%3 = 0. 4 written to slot 0!" },
      ],
      result: "Wrap-around successful: Front = 2 (index 1), Rear = 4 (index 0).",
    },
    complexity: {
      best: { time: "O(1)", condition: "All operations are direct modulo index access." },
      average: { time: "O(1)", condition: "Constant time." },
      worst: { time: "O(1)", condition: "Guaranteed O(1) with zero dynamic allocation." },
      space: { memory: "O(k)", explanation: "Fixed bounded capacity k." },
      stable: null,
      mathematicalIntuition:
        "Pointer advancement takes exactly 1 modulo operation and 1 array assignment: strictly O(1) time and O(1) auxiliary space.",
    },
    pitfalls: [
      {
        myth: "A circular queue automatically resizes when full.",
        reality:
          "A classic ring buffer has a strict fixed capacity. Resizing a ring buffer requires re-aligning wrapped indices, which takes O(n) time.",
      },
    ],
    prosAndCons: {
      pros: [
        "Guaranteed O(1) enqueue and dequeue with zero memory waste.",
        "Fixed memory footprint with zero garbage collection overhead.",
        "Exceptional cache locality and ideal for lock-free concurrency.",
      ],
      cons: [
        "Fixed maximum capacity (cannot dynamically grow without reallocation).",
      ],
      edgeCases: [
        { name: "Full Queue", behavior: "Enqueue fails or overwrites oldest data depending on implementation policy." },
        { name: "Empty Queue", behavior: "Dequeue returns underflow error." },
      ],
    },
    realWorldApplications: [
      {
        title: "Audio Streaming Buffers (DSP)",
        description: "Sound cards reading audio samples continuously from a ring buffer.",
      },
      {
        title: "Network Interface Cards (NIC)",
        description: "Hardware packet ring buffers buffering incoming Ethernet frames.",
      },
      {
        title: "Keyboard Typeahead Buffers",
        description: "Operating system buffering keystrokes when CPU is under heavy load.",
      },
    ],
    keyTakeaways: [
      "Circular Queue wraps pointers using (index + 1) % capacity.",
      "Eliminates wasted array memory and O(n) element shifting.",
      "Standard for audio, network packet buffering, and real-time systems.",
    ],
    nextTopics: [
      { name: "Priority Queue", path: "/queue/priority", reason: "Explore priority-based queue retrieval with Binary Heaps." },
      { name: "Queue (Enqueue & Dequeue)", path: "/queue/enqueue-dequeue", reason: "Review foundational FIFO queue concepts." },
    ],
  },

  priorityQueue: {
    title: "Priority Queue (Binary Heap)",
    category: "Queue / Tree Structure",
    tagline: "The priority-driven retrieval structure providing logarithmic insertion and instant minimum/maximum access.",
    whatIsIt:
      "A Priority Queue is an abstract data structure where each element has an associated priority. Elements with higher priority are dequeued before elements with lower priority. It is most efficiently implemented using a Binary Heap (Min-Heap or Max-Heap).",
    whyItMatters:
      "Priority Queues power the world's most important optimization algorithms: Dijkstra's Shortest Path, Prim's Minimum Spanning Tree, Huffman Coding data compression, and real-time event-driven simulations.",
    mentalModel: {
      analogy:
        "A hospital Emergency Room triage: patients are not treated in the order they arrived, but strictly in order of medical urgency.",
      diagram: `[ Binary Min-Heap Array Mapping ]
  Tree View:            [ 10 ]                 Array View:
                       /      \\                Index: 0   1   2   3   4
                    [ 20 ]  [ 15 ]             Value:[10, 20, 15, 40, 50]
                    /    \\
                 [40]   [50]
  Parent(i) = floor((i-1)/2) | Left(i) = 2i+1 | Right(i) = 2i+2`,
    },
    coreConcepts: [
      {
        title: "1. The Heap-Order Property",
        explanation:
          "In a Min-Heap, for every node i other than root: parent(i) <= node(i). The absolute minimum element is always at the root (index 0).",
      },
      {
        title: "2. Sift-Up (Bubble-Up) on Insertion",
        explanation:
          "Add new element to the bottom of the heap (end of array) and swap it upward with its parent until heap order is restored (at most O(log n) swaps).",
      },
      {
        title: "3. Sift-Down (Sink) on Extract-Min",
        explanation:
          "Replace root with the last element in the array, pop the end, and swap the new root downward with its smallest child until order is restored (O(log n) time).",
      },
    ],
    howItWorks: [
      "Insert(val): Append val to end of array. While val < parent, swap with parent (Sift-Up).",
      "ExtractMin(): Save root = array[0]. Move last element to array[0]. Pop last. Sift-down array[0] by swapping with smallest child until valid.",
      "Peek(): Return array[0] in O(1) time.",
      "BuildHeap (Floyd's Algorithm): Run sift-down on all non-leaf nodes from index floor(n/2)-1 down to 0 in O(n) linear time.",
    ],
    pseudocode: {
      intro: "Priority Queue backed by a binary max-heap ensuring logarithmic insertion and extraction.",
      operations: [
        {
          name: "Insert / Enqueue",
          complexity: "O(log n) time, O(1) space",
          description: "Appends item to heap array and bubbles up.",
          code: `procedure insert(pq: PriorityQueue, item: Element)
    pq.heap.append(item)
    heapifyUp(pq.heap, length(pq.heap) - 1)
end procedure`,
        },
        {
          name: "Extract-Max",
          complexity: "O(log n) time, O(1) space",
          description: "Removes root item and sifts replacement down.",
          code: `procedure extractMax(pq: PriorityQueue) -> Element
    if pq.isEmpty() then raise UnderflowError
    maxItem ← pq.heap[0]
    lastItem ← pq.heap.pop()
    if not pq.isEmpty() then
        pq.heap[0] ← lastItem
        heapifyDown(pq.heap, 0)
    end if
    return maxItem
end procedure`,
        },
        {
          name: "Peek",
          complexity: "O(1) time, O(1) space",
          description: "Returns highest priority element at root in O(1).",
          code: `procedure peek(pq: PriorityQueue) -> Element
    if pq.isEmpty() then raise EmptyQueueError
    return pq.heap[0]
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "Insert 5 into Min-Heap [ 10, 20, 15, 40, 50 ]",
      goal: "Maintain Min-Heap property",
      steps: [
        { step: "Append 5", state: "[ 10, 20, 15, 40, 50, (5) ]", explanation: "5 placed at index 5 (child of index 2 val 15)." },
        { step: "Sift-Up: Swap with 15", state: "[ 10, 20, (5), 40, 50, 15 ]", explanation: "5 < 15 -> Swap 5 with 15." },
        { step: "Sift-Up: Swap with 10", state: "[ (5), 20, 10, 40, 50, 15 ]", explanation: "5 < 10 -> Swap 5 with 10. 5 is now new root!" },
      ],
      result: "Min-Heap restored in 2 swaps (O(log n) height). New min is 5.",
    },
    complexity: {
      best: { time: "O(1)", condition: "Peek minimum element; or insert without sifting up." },
      average: { time: "O(log n)", condition: "Insert and Extract-Min operations." },
      worst: { time: "O(log n)", condition: "Full tree height sift-down." },
      space: { memory: "O(n)", explanation: "Contiguous array storage." },
      stable: { isStable: false, reason: "Swapping during sift breaks original insertion order of equal keys." },
      mathematicalIntuition:
        "Complete binary tree has height h = ⌊log₂ n⌋. Sift operations traverse at most h levels => O(log n). Build-Heap runs in O(n) time via converging series.",
    },
    pitfalls: [
      {
        myth: "Building a heap of n elements takes O(n log n) by inserting one by one.",
        reality:
          "While inserting one by one takes O(n log n), Floyd's bottom-up Build-Heap algorithm builds the entire heap in strictly O(n) linear time.",
      },
      {
        myth: "A Binary Heap is a Binary Search Tree (BST).",
        reality:
          "A BST maintains Left < Node < Right ordering. A Heap only maintains Parent <= Children, allowing it to be stored as a flat array without pointer overhead.",
      },
    ],
    prosAndCons: {
      pros: [
        "O(1) instant access to minimum/maximum element.",
        "O(log n) insertion and deletion.",
        "Flat array storage with zero pointer overhead.",
      ],
      cons: [
        "Searching for an arbitrary non-root element takes O(n) linear time.",
        "Unstable ordering for identical priority keys.",
      ],
      edgeCases: [
        { name: "Single Element Heap", behavior: "Extract-Min leaves empty heap in O(1)." },
        { name: "Duplicate Priorities", behavior: "Arbitrary child chosen during tie-breaker." },
      ],
    },
    realWorldApplications: [
      {
        title: "Dijkstra's Shortest Path",
        description: "Extracting the next closest unvisited vertex in O(log V) time.",
      },
      {
        title: "Huffman Coding Compression",
        description: "Building optimal prefix encoding trees by repeatedly combining lowest frequency nodes.",
      },
      {
        title: "Operating System Process Schedulers",
        description: "Selecting highest priority tasks ready to execute.",
      },
    ],
    keyTakeaways: [
      "Priority Queue retrieves highest priority items first.",
      "Implemented via Binary Heap in a flat array in O(log n) time.",
      "Root at index 0 always holds the global minimum/maximum.",
    ],
    nextTopics: [
      { name: "Dijkstra's Algorithm", path: "/graph/dijkstra", reason: "See Priority Queues drive shortest-path graph exploration." },
      { name: "Min Heap", path: "/tree/min-heap", reason: "Deep-dive into heap tree invariants and Heapsort." },
    ],
  },

  // Linked List Extensions

  singlyInsertDelete: {
    title: "Singly Linked List (Insert & Delete)",
    category: "Linked List Operations",
    tagline: "The core pointer manipulation mechanics for inserting and deleting nodes at head, tail, and arbitrary positions.",
    whatIsIt:
      "Insertion and Deletion in a Singly Linked List modify the directional next pointers connecting heap-allocated nodes. Inserting splices a new node into the chain; deleting bypasses a target node so it can be deallocated.",
    whyItMatters:
      "Unlike arrays that require O(n) shifting of elements when inserting at the front or middle, Linked List pointer redirection is strictly O(1) once the target position is reached. Mastering pointer mutation is the cornerstone of all advanced data structures (Trees, Graphs, Skip Lists).",
    mentalModel: {
      analogy:
        "A group of people holding hands in a chain: to insert a newcomer between Alice and Bob, Alice lets go of Bob's hand and holds the newcomer's hand, who in turn takes Bob's hand.",
      diagram: `[ Node Insertion Between Nodes ]
  Before:  [ A ] ───────────────► [ B ]
  Action:  1. NewNode.next = A.next (points to B)
           2. A.next = NewNode
  After:   [ A ] ──► [ NewNode ] ──► [ B ]`,
    },
    coreConcepts: [
      {
        title: "1. Head Insertion: O(1) Constant Time",
        explanation:
          "newNode.next = head; head = newNode;. Does not require traversing the list.",
      },
      {
        title: "2. Pointer Splicing Order Invariant",
        explanation:
          "Crucial rule: Always connect newNode.next = prev.next BEFORE overwriting prev.next = newNode. Reversing this order severs and permanently loses the rest of the list.",
      },
      {
        title: "3. Deletion via Pointer Bypass",
        explanation:
          "To delete node curr following prev: prev.next = curr.next. The bypassed node curr is automatically garbage-collected (or manually freed in C++).",
      },
    ],
    howItWorks: [
      "Insert at Head: Allocate new node, set newNode.next = head, update head = newNode.",
      "Insert after Node prev: Set newNode.next = prev.next, set prev.next = newNode.",
      "Delete at Head: Set head = head.next.",
      "Delete after Node prev: Set target = prev.next, set prev.next = target.next.",
    ],
    pseudocode: {
      intro: "Singly Linked List dynamic memory pointer manipulation operations.",
      operations: [
        {
          name: "Insert at Head",
          complexity: "O(1) time, O(1) space",
          description: "Allocates node and prepends to head.",
          code: `procedure insertHead(head: Node, val: Value) -> Node
    newNode ← createNode(val)
    newNode.next ← head
    return newNode
end procedure`,
        },
        {
          name: "Insert at Tail",
          complexity: "O(n) time, O(1) space",
          description: "Traverses to last node and links new node.",
          code: `procedure insertTail(head: Node, val: Value) -> Node
    newNode ← createNode(val)
    if head = NULL then return newNode
    
    curr ← head
    while curr.next ≠ NULL do
        curr ← curr.next
    end while
    curr.next ← newNode
    return head
end procedure`,
        },
        {
          name: "Insert at Index",
          complexity: "O(k) time, O(1) space",
          description: "Traverses to index k-1 and inserts node.",
          code: `procedure insertAtIndex(head: Node, index: Integer, val: Value) -> Node
    if index = 0 then return insertHead(head, val)
    
    curr ← head
    for i ← 0 to index - 2 do
        if curr = NULL then raise IndexOutOfBoundsError
        curr ← curr.next
    end for
    
    newNode ← createNode(val)
    newNode.next ← curr.next
    curr.next ← newNode
    return head
end procedure`,
        },
        {
          name: "Delete Head",
          complexity: "O(1) time, O(1) space",
          description: "Advances head pointer to head.next.",
          code: `procedure deleteHead(head: Node) -> Node
    if head = NULL then return NULL
    return head.next
end procedure`,
        },
        {
          name: "Delete Tail",
          complexity: "O(n) time, O(1) space",
          description: "Traverses to second-to-last node and sets next to NULL.",
          code: `procedure deleteTail(head: Node) -> Node
    if head = NULL or head.next = NULL then return NULL
    
    curr ← head
    while curr.next.next ≠ NULL do
        curr ← curr.next
    end while
    curr.next ← NULL
    return head
end procedure`,
        },
        {
          name: "Delete by Value",
          complexity: "O(n) time, O(1) space",
          description: "Finds target value and rewires predecessor pointer.",
          code: `procedure deleteValue(head: Node, target: Value) -> Node
    if head = NULL then return NULL
    if head.value = target then return head.next
    
    curr ← head
    while curr.next ≠ NULL and curr.next.value ≠ target do
        curr ← curr.next
    end while
    
    if curr.next ≠ NULL then
        curr.next ← curr.next.next
    end if
    return head
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "List: [10] -> [30] -> NULL. Insert 20 after 10.",
      goal: "Splice node 20 into list",
      steps: [
        { step: "Allocate Node 20", state: "NewNode = [20 -> NULL]", explanation: "Node 20 created in memory." },
        { step: "Step 1: Point to 30", state: "NewNode.next = [30]", explanation: "Connects 20 to the tail node 30." },
        { step: "Step 2: Point 10 to 20", state: "[10] -> [20] -> [30] -> NULL", explanation: "Updates 10.next to 20. Splicing complete!" },
      ],
      result: "[10] -> [20] -> [30] -> NULL (Inserted in O(1) pointer updates).",
    },
    complexity: {
      best: { time: "O(1)", condition: "Insert or delete at Head pointer." },
      average: { time: "O(n)", condition: "Traversing to index k before inserting/deleting." },
      worst: { time: "O(n)", condition: "Inserting or deleting at tail without tail pointer." },
      space: { memory: "O(1)", explanation: "Only modifies existing pointers." },
      stable: null,
      mathematicalIntuition:
        "Pointer mutation itself takes exactly 2 assignments (O(1)). The O(n) cost is purely from walking the list to reach the insertion spot.",
    },
    pitfalls: [
      {
        myth: "Deleting a node in a Singly Linked List given only a pointer to that node is O(1).",
        reality:
          "In a Singly Linked List, you cannot find the preceding node (prev) without traversing from head (O(n)). To delete in true O(1), a Doubly Linked List is required.",
      },
      {
        myth: "Overwriting prev.next before setting newNode.next is harmless.",
        reality:
          "This is the most common pointer bug: it causes dangling pointer loss and memory leaks by disconnecting the entire remaining list.",
      },
    ],
    prosAndCons: {
      pros: [
        "O(1) insertion and deletion at head without shifting elements.",
        "Dynamic memory sizing without array re-allocation.",
      ],
      cons: [
        "O(n) traversal needed to reach middle positions.",
        "No backward traversal (single pointer).",
      ],
      edgeCases: [
        { name: "Deleting Head Node", behavior: "Update head = head.next. Check for null head." },
        { name: "Deleting Only Node in List", behavior: "Sets head = null, returning an empty list." },
      ],
    },
    realWorldApplications: [
      {
        title: "Memory Allocator Free Lists",
        description: "Tracking unallocated RAM chunks in C runtime malloc libraries.",
      },
      {
        title: "Chaining Hash Tables",
        description: "Inserting colliding key-value pairs at the head of a bucket list in O(1).",
      },
    ],
    keyTakeaways: [
      "Head insert/delete is O(1); arbitrary index insert requires O(n) traversal.",
      "Always set newNode.next before updating prev.next.",
      "Pointer bypass allows seamless deletion without shifting.",
    ],
    nextTopics: [
      { name: "Reverse Linked List", path: "/linked-list/reverse", reason: "Learn the 3-pointer iterative list reversal algorithm." },
      { name: "Detect Cycle", path: "/linked-list/cycle", reason: "Master Floyd's Tortoise and Hare cycle detection algorithm." },
    ],
  },

  reverseList: {
    title: "Reverse Linked List",
    category: "Linked List Algorithm",
    tagline: "The essential 3-pointer in-place list reversal algorithm.",
    whatIsIt:
      "Reverse Linked List is an algorithm that inverts the directional flow of all next pointers in a linked list, transforming the original tail node into the new head and the original head into the null-terminated tail.",
    whyItMatters:
      "Reversing a linked list is the quintessential technical interview problem. It tests precise pointer manipulation, avoiding dangling pointers, and understanding in-place mutation with O(1) auxiliary memory.",
    mentalModel: {
      analogy:
        "A one-way train track where every switch is reversed: train cars that pointed forward now point backward toward the original origin station.",
      diagram: `[ 3-Pointer Iterative Reversal ]
  Before:  [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► NULL
  Pointers: prev=NULL, curr=[1], next=[2]

  Step:    1. Save next = curr.next
           2. Reverse: curr.next = prev
           3. Advance: prev = curr, curr = next

  After:   NULL ◄── [ 1 ] ◄── [ 2 ] ◄── [ 3 ]  (Head = [3])`,
    },
    coreConcepts: [
      {
        title: "1. The 3-Pointer Technique",
        explanation:
          "Maintains three tracking pointers: prev (already reversed list), curr (node currently being reversed), and next (temporary reference to prevent losing the unreversed tail).",
      },
      {
        title: "2. The Invariant Reversal Step",
        explanation:
          "next = curr.next; curr.next = prev; prev = curr; curr = next; executed in an exact 4-line loop.",
      },
      {
        title: "3. The Termination State",
        explanation:
          "The loop terminates when curr === null. At that exact moment, prev points to the new head of the reversed list.",
      },
    ],
    howItWorks: [
      "Initialize prev = null and curr = head.",
      "While curr !== null:",
      "  Save next = curr.next.",
      "  Reverse pointer: curr.next = prev.",
      "  Advance prev = curr.",
      "  Advance curr = next.",
      "Return prev as the new head.",
    ],
    pseudocode: {
      intro: "Iterative in-place 3-pointer reversal of Singly Linked List pointers.",
      code: `procedure reverseList(head: Node) -> Node
    prev ← NULL
    curr ← head
    
    while curr ≠ NULL do
        nextTemp ← curr.next   // 1. Save next reference
        curr.next ← prev        // 2. Reverse current node pointer
        prev ← curr             // 3. Advance prev pointer
        curr ← nextTemp         // 4. Advance curr pointer
    end while
    
    return prev                 // New head of reversed list
end procedure`,
    },
    workedExample: {
      input: "Head -> [1] -> [2] -> [3] -> NULL",
      goal: "Reverse into Head -> [3] -> [2] -> [1] -> NULL",
      steps: [
        { step: "Init", state: "prev=NULL, curr=[1]", explanation: "Pointers set." },
        { step: "Node 1 Reversed", state: "NULL <- [1], curr=[2]", explanation: "[1].next points to NULL. prev=[1]." },
        { step: "Node 2 Reversed", state: "[1] <- [2], curr=[3]", explanation: "[2].next points to [1]. prev=[2]." },
        { step: "Node 3 Reversed", state: "[2] <- [3], curr=NULL", explanation: "[3].next points to [2]. prev=[3]." },
      ],
      result: "New Head is [3] -> [2] -> [1] -> NULL (Reversed in O(n) time, O(1) space).",
    },
    complexity: {
      best: { time: "O(n)", condition: "Single linear pass over all n nodes." },
      average: { time: "O(n)", condition: "Linear time." },
      worst: { time: "O(n)", condition: "Linear time." },
      space: { memory: "O(1)", explanation: "Iterative implementation uses only 3 pointer variables." },
      stable: null,
      mathematicalIntuition:
        "Every node's next pointer is redirected exactly once: exactly n loop iterations = Θ(n) time and O(1) space.",
    },
    pitfalls: [
      {
        myth: "Reversing a linked list recursively is better than iteratively.",
        reality:
          "Recursive reversal consumes O(n) call stack memory, creating Stack Overflow risk on lists with 100,000+ nodes. Iterative 3-pointer reversal is strictly O(1) space and production-safe.",
      },
      {
        myth: "Forgetting to store curr.next in a temporary variable before mutating.",
        reality:
          "If you write curr.next = prev before saving next, you sever the connection to the remaining list and can never reach the rest of the nodes.",
      },
    ],
    prosAndCons: {
      pros: [
        "In-place reversal with O(1) auxiliary space.",
        "Single pass O(n) execution.",
        "Clean, elegant pointer mechanics.",
      ],
      cons: [
        "Destructive in-place mutation (destroys the original list direction).",
      ],
      edgeCases: [
        { name: "Empty List (head === null)", behavior: "Returns null immediately in O(1)." },
        { name: "Single Node List", behavior: "Points [1].next to null and returns [1] in O(1)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Palindrome Linked List Verification",
        description: "Reversing the second half of a linked list to compare values with the first half in O(1) space.",
      },
      {
        title: "Adding Large Numbers as Lists",
        description: "Reversing lists to add digits from least significant to most significant.",
      },
    ],
    keyTakeaways: [
      "Use 3 pointers: prev, curr, and next.",
      "Always save next = curr.next before reversing curr.next = prev.",
      "Runs in O(n) time and O(1) space.",
    ],
    nextTopics: [
      { name: "Detect Cycle", path: "/linked-list/cycle", reason: "Learn Floyd's Tortoise and Hare cycle detection algorithm." },
      { name: "Doubly Linked List", path: "/linked-list/doubly-insert-delete", reason: "Explore bidirectional pointer nodes." },
    ],
  },

  detectCycle: {
    title: "Detect Cycle in Linked List",
    category: "Linked List Algorithm",
    tagline: "Floyd's Tortoise and Hare two-pointer cycle detection algorithm in O(n) time and O(1) memory.",
    whatIsIt:
      "Cycle Detection determines whether a linked list contains a loop (where a node's next pointer points back to a previous node in the chain). Floyd's Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at different speeds to detect cycles with zero extra memory.",
    whyItMatters:
      "A cyclic linked list causes standard traversal loops to run infinitely, crashing applications with memory leaks and CPU lockups. Floyd's algorithm solves this in O(1) auxiliary memory without requiring a hash set of visited pointers.",
    mentalModel: {
      analogy:
        "Two runners on a circular running track: a fast runner running at 2 m/s and a slow runner running at 1 m/s. Even if the fast runner starts behind, they are mathematically guaranteed to lap and meet the slow runner.",
      diagram: `[ Floyd's Fast & Slow Pointer Race ]
  [ 1 ] ──► [ 2 ] ──► [ 3 ] ──► [ 4 ]
                         ▲         │
                         └── [ 5 ] ◄┘  <- Loop formed by (5 -> 3)
  Slow: moves 1 step per tick (1 -> 2 -> 3 -> 4)
  Fast: moves 2 steps per tick (1 -> 3 -> 5 -> 4)
  Collision guaranteed inside cycle!`,
    },
    coreConcepts: [
      {
        title: "1. The Relative Speed Gap",
        explanation:
          "Fast pointer advances 2 nodes (fast = fast.next.next); Slow pointer advances 1 node (slow = slow.next). Their relative distance decreases by exactly 1 node per iteration inside the cycle.",
      },
      {
        title: "2. The Collision Guarantee",
        explanation:
          "If a cycle of length C exists, fast will catch slow in at most C iterations after slow enters the cycle.",
      },
      {
        title: "3. Finding the Cycle Start Node",
        explanation:
          "After collision, reset slow = head while leaving fast at the meeting point. Advance both 1 step at a time (slow = slow.next, fast = fast.next). They will meet exactly at the cycle entrance!",
      },
    ],
    howItWorks: [
      "Initialize slow = head and fast = head.",
      "While fast !== null and fast.next !== null:",
      "  Advance slow = slow.next (1 step).",
      "  Advance fast = fast.next.next (2 steps).",
      "  If slow === fast, a cycle is detected (return true).",
      "If loop terminates with fast hitting null, no cycle exists (return false).",
    ],
    pseudocode: {
      intro: "Floyd's Cycle-Finding Algorithm (Tortoise and Hare) with two pointers moving at different speeds.",
      code: `procedure hasCycle(head: Node) -> Boolean
    if head = NULL or head.next = NULL then
        return false
    end if
    
    slow ← head
    fast ← head
    
    while fast ≠ NULL and fast.next ≠ NULL do
        slow ← slow.next             // Tortoise advances 1 node
        fast ← fast.next.next        // Hare advances 2 nodes
        
        if slow = fast then
            return true              // Pointers intersected: cycle detected!
        end if
    end while
    
    return false                     // Fast pointer reached NULL: acyclic
end procedure`,
    },
    workedExample: {
      input: "List: 1 -> 2 -> 3 -> 4 -> 5 -> (points back to 3)",
      goal: "Detect if cycle exists",
      steps: [
        { step: "Tick 1", state: "Slow=[2], Fast=[3]", explanation: "Slow moves to 2; Fast moves to 3." },
        { step: "Tick 2", state: "Slow=[3], Fast=[5]", explanation: "Slow moves to 3; Fast moves to 5." },
        { step: "Tick 3", state: "Slow=[4], Fast=[4]", explanation: "Slow moves to 4; Fast wraps to 4. COLLISION!" },
      ],
      result: "Cycle detected at node 4 in 3 iterations without extra memory.",
    },
    complexity: {
      best: { time: "O(1)", condition: "Cycle at head node or empty list." },
      average: { time: "O(n)", condition: "Slow traverses at most n steps before collision." },
      worst: { time: "O(n)", condition: "Linear time bounded by list length." },
      space: { memory: "O(1)", explanation: "Only uses two pointer variables (no hash set needed)." },
      stable: null,
      mathematicalIntuition:
        "If non-cycle length is k and cycle length is C, total steps <= k + C = n => strictly O(n) time and O(1) space.",
    },
    pitfalls: [
      {
        myth: "Using a Hash Set of visited node pointers is the best way to detect cycles.",
        reality:
          "A Hash Set takes O(n) extra memory. Floyd's Tortoise and Hare algorithm achieves the exact same result in O(1) auxiliary space.",
      },
      {
        myth: "Forgetting to check while (fast && fast.next) causes null pointer crashes.",
        reality:
          "In acyclic lists, fast.next.next will throw a NullPointerException unless you verify both fast and fast.next are non-null before advancing.",
      },
    ],
    prosAndCons: {
      pros: [
        "O(1) memory space: zero hash set allocation overhead.",
        "Optimal O(n) runtime.",
        "Can be extended to find cycle start node and cycle length.",
      ],
      cons: [
        "Does not repair or break the cycle on its own without pointer resetting.",
      ],
      edgeCases: [
        { name: "Acyclic List", behavior: "Fast hits null and returns false in n/2 steps." },
        { name: "Single Node with Self-Loop", behavior: "Detected immediately on first iteration." },
      ],
    },
    realWorldApplications: [
      {
        title: "Deadlock Detection in Distributed Systems",
        description: "Detecting circular dependency waits in resource allocation graphs.",
      },
      {
        title: "Cryptographic Pseudo-Random Generators",
        description: "Pollard's rho algorithm using Floyd's cycle detection for integer factorization.",
      },
    ],
    keyTakeaways: [
      "Slow moves 1 step; Fast moves 2 steps.",
      "Collision inside loop proves cycle existence in O(1) memory.",
      "Resetting slow to head finds the exact cycle start node.",
    ],
    nextTopics: [
      { name: "Doubly Linked List", path: "/linked-list/doubly-insert-delete", reason: "Explore bidirectional linked list mechanics." },
      { name: "Reverse Linked List", path: "/linked-list/reverse", reason: "Master in-place pointer reversal." },
    ],
  },

  doublyInsertDelete: {
    title: "Doubly Linked List (Insert & Delete)",
    category: "Linked List Operations",
    tagline: "Bidirectional pointer chains providing true O(1) node deletion and two-way traversal.",
    whatIsIt:
      "A Doubly Linked List (DLL) is a linked data structure where each node contains two pointers: next (pointing forward to the next node) and prev (pointing backward to the previous node).",
    whyItMatters:
      "In a Singly Linked List, deleting a node requires O(n) traversal to locate the preceding node. In a Doubly Linked List, holding a direct pointer to a node allows deleting it in strictly O(1) time. This makes DLLs the indispensable foundation for LRU (Least Recently Used) Caches and browser tab history.",
    mentalModel: {
      analogy:
        "A two-way train coupling: each train car is physically hooked to both the car in front of it and the car behind it. You can walk forwards or backwards along the train.",
      diagram: `[ Doubly Linked Node Structure ]
       NULL ◄──┌──────────────┐──► ┌──────────────┐ ──► NULL
               │ Prev │ Val:10│    │ Prev │ Val:20│
               └──────┴──Next─┘◄───└──────┴──Next─┘`,
    },
    coreConcepts: [
      {
        title: "1. Bidirectional Pointers (prev and next)",
        explanation:
          "Every node maintains connections in both directions: node.next.prev === node and node.prev.next === node.",
      },
      {
        title: "2. True O(1) Node Deletion",
        explanation:
          "Given direct reference to node: node.prev.next = node.next; node.next.prev = node.prev;. Zero traversal required.",
      },
      {
        title: "3. Sentinel (Dummy) Head & Tail Nodes",
        explanation:
          "Using dummy head and tail nodes eliminates all edge-case null checks during insertion and deletion.",
      },
    ],
    howItWorks: [
      "Insert After Node curr: Set newNode.next = curr.next, newNode.prev = curr, curr.next.prev = newNode, curr.next = newNode.",
      "Delete Node target: Set target.prev.next = target.next, set target.next.prev = target.prev.",
      "Insert at Head: Connect with dummy head or update head.prev = newNode.",
    ],
    pseudocode: {
      intro: "Doubly Linked List bidirectional pointer wiring (next and prev).",
      operations: [
        {
          name: "Insert at Head",
          complexity: "O(1) time, O(1) space",
          description: "Prepends node and links head.prev.",
          code: `procedure insertHead(head: Node, val: Value) -> Node
    newNode ← createNode(val)
    newNode.next ← head
    if head ≠ NULL then
        head.prev ← newNode
    end if
    return newNode
end procedure`,
        },
        {
          name: "Insert at Tail",
          complexity: "O(n) time, O(1) space",
          description: "Traverses to tail and links forward and backward pointers.",
          code: `procedure insertTail(head: Node, val: Value) -> Node
    newNode ← createNode(val)
    if head = NULL then return newNode
    
    curr ← head
    while curr.next ≠ NULL do
        curr ← curr.next
    end while
    
    curr.next ← newNode
    newNode.prev ← curr
    return head
end procedure`,
        },
        {
          name: "Insert at Index",
          complexity: "O(k) time, O(1) space",
          description: "Rewires four pointers: curr.next, newNode.prev, newNode.next, and next.prev.",
          code: `procedure insertAtIndex(head: Node, index: Integer, val: Value) -> Node
    if index = 0 then return insertHead(head, val)
    
    curr ← head
    for i ← 0 to index - 2 do
        if curr = NULL then raise IndexOutOfBoundsError
        curr ← curr.next
    end for
    
    newNode ← createNode(val)
    newNode.next ← curr.next
    newNode.prev ← curr
    if curr.next ≠ NULL then
        curr.next.prev ← newNode
    end if
    curr.next ← newNode
    return head
end procedure`,
        },
        {
          name: "Delete Head",
          complexity: "O(1) time, O(1) space",
          description: "Removes head and clears new head prev pointer.",
          code: `procedure deleteHead(head: Node) -> Node
    if head = NULL then return NULL
    newHead ← head.next
    if newHead ≠ NULL then
        newHead.prev ← NULL
    end if
    return newHead
end procedure`,
        },
        {
          name: "Delete Tail",
          complexity: "O(n) time, O(1) space",
          description: "Removes tail and unlinks second-to-last node next.",
          code: `procedure deleteTail(head: Node) -> Node
    if head = NULL or head.next = NULL then return NULL
    
    curr ← head
    while curr.next ≠ NULL do
        curr ← curr.next
    end while
    
    curr.prev.next ← NULL
    return head
end procedure`,
        },
        {
          name: "Delete by Value",
          complexity: "O(n) time, O(1) space",
          description: "Locates target and connects predecessor to successor in both directions.",
          code: `procedure deleteValue(head: Node, target: Value) -> Node
    if head = NULL then return NULL
    
    curr ← head
    while curr ≠ NULL and curr.value ≠ target do
        curr ← curr.next
    end while
    
    if curr = NULL then return head // Target not found
    
    if curr.prev ≠ NULL then
        curr.prev.next ← curr.next
    else
        head ← curr.next // Deleting head node
    end if
    
    if curr.next ≠ NULL then
        curr.next.prev ← curr.prev
    end if
    
    return head
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "[10] <-> [20] <-> [30]. Delete node [20].",
      goal: "Remove [20] in O(1) operations",
      steps: [
        { step: "Bypass Next", state: "[10].next = [30]", explanation: "Node 10 now points forward directly to Node 30." },
        { step: "Bypass Prev", state: "[30].prev = [10]", explanation: "Node 30 now points backward directly to Node 10." },
      ],
      result: "[10] <-> [30] (Node 20 deleted in exactly 2 pointer assignments).",
    },
    complexity: {
      best: { time: "O(1)", condition: "Insert or delete when node pointer is already held." },
      average: { time: "O(1)", condition: "O(1) with direct pointer; O(n) if searching by value first." },
      worst: { time: "O(1)", condition: "Pure pointer mutation." },
      space: { memory: "O(n)", explanation: "Requires 2 pointer references per node (16 bytes on 64-bit architectures)." },
      stable: null,
      mathematicalIntuition:
        "Deleting a node updates exactly 2 pointers: node.prev.next and node.next.prev. Total operations = 2 => strictly O(1) time.",
    },
    pitfalls: [
      {
        myth: "Doubly Linked Lists are always better than Singly Linked Lists.",
        reality:
          "DLL nodes consume 2x more pointer memory and have more pointer manipulation overhead. Use Singly Linked Lists when memory is tight and backward traversal is unnecessary.",
      },
    ],
    prosAndCons: {
      pros: [
        "True O(1) node deletion given direct node pointer.",
        "Bidirectional traversal (forward and backward).",
        "Ideal structure for LRU Cache and deque implementations.",
      ],
      cons: [
        "Extra memory overhead for storing two pointers per node.",
        "More complex pointer updates on every operation.",
      ],
      edgeCases: [
        { name: "Deleting Head Node", behavior: "Update head = head.next; head.prev = null;." },
        { name: "Deleting Tail Node", behavior: "Update tail = tail.prev; tail.next = null;." },
      ],
    },
    realWorldApplications: [
      {
        title: "LRU (Least Recently Used) Cache",
        description: "Combining a Hash Map with a Doubly Linked List for O(1) cache get and put operations.",
      },
      {
        title: "Browser Navigation History",
        description: "Back and Forward button state management.",
      },
      {
        title: "Undo / Redo Managers",
        description: "Navigating backward and forward across application states.",
      },
    ],
    keyTakeaways: [
      "DLL nodes hold prev and next pointers.",
      "Enables true O(1) node deletion without preceding node traversal.",
      "Core engine of LRU Cache and bidirectional history managers.",
    ],
    nextTopics: [
      { name: "BST Insertion", path: "/tree/bst-insertion", reason: "See how 2 pointers evolve into left and right child trees." },
      { name: "Stack (Push & Pop)", path: "/stack/push-pop", reason: "Review LIFO operations." },
    ],
  },

  // Tree Traversals & Heaps

  inorderTraversal: {
    title: "Inorder Traversal (LNR)",
    category: "Tree Traversal",
    tagline: "The depth-first traversal visiting Left -> Root -> Right, yielding sorted order on BSTs.",
    whatIsIt:
      "Inorder Traversal is a depth-first binary tree traversal that recursively visits the Left Subtree first, then the Root Node, and finally the Right Subtree (LNR order).",
    whyItMatters:
      "When applied to a Binary Search Tree (BST), Inorder Traversal visits nodes in **strictly ascending sorted numerical order** in O(n) linear time. It is the primary mechanism for validating BST invariants and building sorted array projections.",
    mentalModel: {
      analogy:
        "Reading a book from left to right: you finish all topics on the left page before reading the headline in the middle and moving to the right page.",
      diagram: `[ Inorder Traversal (Left -> Root -> Right) ]
                 [ 50 ]
                /      \\
            [ 30 ]    [ 70 ]
            /    \\
          [20]  [40]
  Traversal Order: 20 -> 30 -> 40 -> 50 -> 70 (Strictly Sorted!)`,
    },
    coreConcepts: [
      {
        title: "1. The LNR Recursive Order",
        explanation:
          "Recursively traverse left, process node, recursively traverse right. Base case: return when node is null.",
      },
      {
        title: "2. The BST Sorted Property",
        explanation:
          "Because all left nodes < Root and all right nodes > Root, LNR naturally outputs keys in ascending order.",
      },
      {
        title: "3. Morris Traversal (O(1) Space)",
        explanation:
          "Standard recursion takes O(h) stack space. Morris Traversal creates temporary threaded pointers to predecessor nodes to achieve O(1) auxiliary space.",
      },
    ],
    howItWorks: [
      "If node === null, return.",
      "Recursively call inorder(node.left).",
      "Process / Print node.val.",
      "Recursively call inorder(node.right).",
    ],
    pseudocode: {
      intro: "Depth-first in-order traversal visiting Left Subtree → Root Node → Right Subtree.",
      code: `procedure inorderTraversal(root: TreeNode)
    if root = NULL then return
    
    inorderTraversal(root.left)    // 1. Traverse left subtree
    visit(root.value)              // 2. Process current node
    inorderTraversal(root.right)   // 3. Traverse right subtree
end procedure`,
    },
    workedExample: {
      input: "Tree: Root=50, Left=30 (child 20, 40), Right=70",
      goal: "Generate Inorder sequence",
      steps: [
        { step: "Go Left to 30, then 20", state: "Visit [20]", explanation: "20 has no left child. Process 20." },
        { step: "Backtrack to 30", state: "Visit [30]", explanation: "Left done. Process 30." },
        { step: "Go Right to 40", state: "Visit [40]", explanation: "Process 40." },
        { step: "Backtrack to Root 50", state: "Visit [50]", explanation: "Left subtree complete. Process 50." },
        { step: "Go Right to 70", state: "Visit [70]", explanation: "Process 70." },
      ],
      result: "[ 20, 30, 40, 50, 70 ] in strictly ascending sorted order.",
    },
    complexity: {
      best: { time: "O(n)", condition: "Visits every node exactly once." },
      average: { time: "O(n)", condition: "Linear time." },
      worst: { time: "O(n)", condition: "Linear time across all tree topologies." },
      space: { memory: "O(h)", explanation: "Call stack memory equal to tree height h (O(log n) balanced, O(n) skewed)." },
      stable: null,
      mathematicalIntuition:
        "Every node is visited once and each edge is traversed twice (down and up) => total runtime is Θ(n).",
    },
    pitfalls: [
      {
        myth: "Inorder traversal gives sorted order on any binary tree.",
        reality:
          "Inorder traversal ONLY produces sorted order if the tree strictly satisfies the Binary Search Tree (BST) property.",
      },
    ],
    prosAndCons: {
      pros: [
        "Extracts sorted elements from BST in linear O(n) time.",
        "Simple recursive or iterative stack implementation.",
      ],
      cons: [
        "Requires O(h) recursion stack space.",
      ],
      edgeCases: [
        { name: "Empty Tree", behavior: "Returns empty list in O(1)." },
        { name: "Skewed Line Tree", behavior: "Recursion depth equals n (requires deep stack)." },
      ],
    },
    realWorldApplications: [
      {
        title: "BST Validation (LeetCode 98)",
        description: "Checking if a binary tree is a valid BST by verifying strictly increasing inorder output.",
      },
      {
        title: "Database Index Flattening",
        description: "Exporting sorted table keys from B-Tree index memory pages.",
      },
    ],
    keyTakeaways: [
      "Inorder visits Left -> Root -> Right.",
      "Produces strictly sorted output on Binary Search Trees.",
      "Runs in O(n) time and O(h) call stack space.",
    ],
    nextTopics: [
      { name: "Preorder Traversal", path: "/tree/preorder", reason: "Learn root-first tree cloning and serialization." },
      { name: "Postorder Traversal", path: "/tree/postorder", reason: "Master bottom-up tree deletion and syntax evaluation." },
    ],
  },

  preorderTraversal: {
    title: "Preorder Traversal (NLR)",
    category: "Tree Traversal",
    tagline: "The root-first depth traversal visiting Root -> Left -> Right, ideal for serialization and cloning.",
    whatIsIt:
      "Preorder Traversal is a depth-first tree traversal algorithm that visits the Root Node first, then recursively traverses the Left Subtree, and finally traverses the Right Subtree (NLR order).",
    whyItMatters:
      "Because Preorder Traversal processes parent nodes before any of their children, it is the primary method for copying/cloning trees, serializing tree structures into flat strings/files, and evaluating prefix (Polish notation) mathematical expression trees.",
    mentalModel: {
      analogy:
        "An organizational corporate hierarchy: the CEO (Root) speaks first, followed by the VP of Engineering and their team, followed by the VP of Sales and their team.",
      diagram: `[ Preorder Traversal (Root -> Left -> Right) ]
                 ( 1 )
                /     \\
             ( 2 )   ( 5 )
            /     \\
          ( 3 )   ( 4 )
  Traversal Order: 1 -> 2 -> 3 -> 4 -> 5 (Parent always before Children)`,
    },
    coreConcepts: [
      {
        title: "1. The NLR Order Invariant",
        explanation:
          "Process node first, then recurse on node.left, then recurse on node.right.",
      },
      {
        title: "2. Tree Serialization / Deserialization",
        explanation:
          "Preorder traversal with null placeholders allows reconstructing the exact unique original binary tree structure.",
      },
      {
        title: "3. Prefix Expression Evaluation",
        explanation:
          "In an arithmetic expression tree (+ * 2 3 4), Preorder output yields valid Polish Notation.",
      },
    ],
    howItWorks: [
      "If node === null, return.",
      "Process / Print node.val.",
      "Recursively call preorder(node.left).",
      "Recursively call preorder(node.right).",
    ],
    pseudocode: {
      intro: "Depth-first pre-order traversal visiting Root Node → Left Subtree → Right Subtree.",
      code: `procedure preorderTraversal(root: TreeNode)
    if root = NULL then return
    
    visit(root.value)              // 1. Process current node first
    preorderTraversal(root.left)   // 2. Traverse left subtree
    preorderTraversal(root.right)  // 3. Traverse right subtree
end procedure`,
    },
    workedExample: {
      input: "Tree: Root=1, Left=2 (children 3, 4), Right=5",
      goal: "Generate Preorder sequence",
      steps: [
        { step: "Visit Root (1)", state: "Output: [ 1 ]", explanation: "Process root 1 first." },
        { step: "Visit Left Child (2)", state: "Output: [ 1, 2 ]", explanation: "Process 2 before its children." },
        { step: "Visit Leaf (3)", state: "Output: [ 1, 2, 3 ]", explanation: "Process 3." },
        { step: "Visit Leaf (4)", state: "Output: [ 1, 2, 3, 4 ]", explanation: "Process 4." },
        { step: "Visit Right Child (5)", state: "Output: [ 1, 2, 3, 4, 5 ]", explanation: "Process 5." },
      ],
      result: "[ 1, 2, 3, 4, 5 ] (Parent processed before subtrees).",
    },
    complexity: {
      best: { time: "O(n)", condition: "Visits every node once." },
      average: { time: "O(n)", condition: "Linear time." },
      worst: { time: "O(n)", condition: "Linear time." },
      space: { memory: "O(h)", explanation: "Recursion stack depth equal to tree height h." },
      stable: null,
      mathematicalIntuition:
        "Every node is processed at entry and each edge is traversed twice => strictly Θ(n) time.",
    },
    pitfalls: [
      {
        myth: "Preorder traversal gives sorted order on BSTs.",
        reality:
          "Preorder gives Root first. Only Inorder gives sorted order on BSTs.",
      },
    ],
    prosAndCons: {
      pros: [
        "Guarantees parent is created before children (essential for cloning trees).",
        "Fast single-pass O(n) traversal.",
      ],
      cons: [
        "Does not produce sorted order on BSTs.",
      ],
      edgeCases: [
        { name: "Single Node Tree", behavior: "Processes root and terminates in O(1)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Tree Serialization (JSON / Database Storage)",
        description: "Flattening hierarchical structures into linear database records.",
      },
      {
        title: "Abstract Syntax Tree (AST) Cloning",
        description: "Compilers copying AST syntax nodes during code transformation passes.",
      },
    ],
    keyTakeaways: [
      "Preorder visits Root -> Left -> Right.",
      "Processes parents before children.",
      "Standard for tree serialization, cloning, and prefix notation.",
    ],
    nextTopics: [
      { name: "Postorder Traversal", path: "/tree/postorder", reason: "Learn bottom-up tree deletion and height computation." },
      { name: "Inorder Traversal", path: "/tree/inorder", reason: "Review sorted BST retrieval." },
    ],
  },

  postorderTraversal: {
    title: "Postorder Traversal (LRN)",
    category: "Tree Traversal",
    tagline: "The bottom-up depth traversal visiting Left -> Right -> Root, essential for safe deletion and height calculations.",
    whatIsIt:
      "Postorder Traversal is a depth-first tree traversal algorithm that recursively visits the Left Subtree first, then the Right Subtree, and finally processes the Root Node (LRN order).",
    whyItMatters:
      "Because Postorder Traversal processes all child nodes before their parent, it is the only safe way to delete/free an entire tree in memory (preventing dangling pointer memory leaks). It is also used to compute subtree heights, directory disk space usage, and evaluate postfix (Reverse Polish notation) trees.",
    mentalModel: {
      analogy:
        "Calculating folder disk size on your computer: a directory cannot display its total size until it first sums the sizes of all files and subfolders inside it.",
      diagram: `[ Postorder Traversal (Left -> Right -> Root) ]
                 ( 5 )           <- Root processed LAST
                /     \\
             ( 3 )   ( 4 )
            /     \\
          ( 1 )   ( 2 )          <- Leaves processed FIRST
  Traversal Order: 1 -> 2 -> 3 -> 4 -> 5 (Children always before Parent)`,
    },
    coreConcepts: [
      {
        title: "1. The LRN Order Invariant",
        explanation:
          "Recurse left, recurse right, process node last.",
      },
      {
        title: "2. Bottom-Up Aggregation",
        explanation:
          "Information flows upward from leaves to root: perfect for computing tree height (1 + max(left_h, right_h)) and subtree node counts.",
      },
      {
        title: "3. Safe Memory Deallocation",
        explanation:
          "In languages like C/C++, deleting a parent before children loses access to child memory pointers. Postorder frees children first.",
      },
    ],
    howItWorks: [
      "If node === null, return.",
      "Recursively call postorder(node.left).",
      "Recursively call postorder(node.right).",
      "Process / Print node.val.",
    ],
    pseudocode: {
      intro: "Depth-first post-order traversal visiting Left Subtree → Right Subtree → Root Node.",
      code: `procedure postorderTraversal(root: TreeNode)
    if root = NULL then return
    
    postorderTraversal(root.left)   // 1. Traverse left subtree
    postorderTraversal(root.right)  // 2. Traverse right subtree
    visit(root.value)               // 3. Process current node last
end procedure`,
    },
    workedExample: {
      input: "Tree: Root=5, Left=3 (children 1, 2), Right=4",
      goal: "Generate Postorder sequence",
      steps: [
        { step: "Go Left to leaf (1)", state: "Output: [ 1 ]", explanation: "Leaf 1 processed first." },
        { step: "Go Right to leaf (2)", state: "Output: [ 1, 2 ]", explanation: "Leaf 2 processed." },
        { step: "Process Parent (3)", state: "Output: [ 1, 2, 3 ]", explanation: "Children complete. Process 3." },
        { step: "Go Right to leaf (4)", state: "Output: [ 1, 2, 3, 4 ]", explanation: "Process leaf 4." },
        { step: "Process Root (5)", state: "Output: [ 1, 2, 3, 4, 5 ]", explanation: "All subtrees complete. Process root 5." },
      ],
      result: "[ 1, 2, 3, 4, 5 ] (Bottom-up execution).",
    },
    complexity: {
      best: { time: "O(n)", condition: "Visits every node once." },
      average: { time: "O(n)", condition: "Linear time." },
      worst: { time: "O(n)", condition: "Linear time." },
      space: { memory: "O(h)", explanation: "Recursion call stack memory equal to tree height h." },
      stable: null,
      mathematicalIntuition:
        "Every node is visited once after both child subtrees complete => strictly Θ(n) time.",
    },
    pitfalls: [
      {
        myth: "Iterative Postorder traversal with a single stack is as simple as Preorder.",
        reality:
          "Iterative Postorder is notoriously tricky because a node must be visited twice (once returning from left, once returning from right) before being processed. It requires tracking the lastVisited node.",
      },
    ],
    prosAndCons: {
      pros: [
        "Guarantees child subtrees are solved before parent is evaluated.",
        "Essential for safe bottom-up memory deallocation.",
        "Natural fit for tree property aggregations (diameter, height).",
      ],
      cons: [
        "More complex iterative stack implementation compared to Preorder.",
      ],
      edgeCases: [
        { name: "Single Node Tree", behavior: "Processes root in O(1)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Filesystem Directory Size Calculation",
        description: "Computing folder sizes by summing file sizes bottom-up (e.g. du command in Linux).",
      },
      {
        title: "Syntax Tree Calculator (RPN)",
        description: "Evaluating mathematical expression trees in compiler backends.",
      },
      {
        title: "Garbage Collection & Tree Deletion",
        description: "Freeing hierarchical node allocations safely.",
      },
    ],
    keyTakeaways: [
      "Postorder visits Left -> Right -> Root.",
      "Processes all children before parents.",
      "Standard for tree deletion, height calculations, and RPN math evaluation.",
    ],
    nextTopics: [
      { name: "Min Heap", path: "/tree/min-heap", reason: "Explore array-backed complete binary heap trees." },
      { name: "Inorder Traversal", path: "/tree/inorder", reason: "Review sorted BST traversal." },
    ],
  },

  minHeap: {
    title: "Min Heap",
    category: "Heap / Priority Structure",
    tagline: "The complete binary tree where parents are always smaller than children, guaranteeing O(1) minimum access.",
    whatIsIt:
      "A Min Heap is a complete binary tree data structure where every parent node satisfies the Min-Heap Property: parent.val <= children.val. As a consequence, the absolute minimum element in the entire structure is always stored at the root.",
    whyItMatters:
      "Min Heaps provide the optimal balance between insertion and extraction: finding the minimum takes O(1) time, while inserting and deleting take O(log n). They form the computational engine behind Dijkstra's Shortest Path, Prim's MST, and k-way stream mergers.",
    mentalModel: {
      analogy:
        "A corporate hierarchy where the person with the smallest employee ID number is CEO (Root), and every manager has a smaller ID number than their direct reports.",
      diagram: `[ Min-Heap Complete Binary Tree ]
                 [ 2 ]
                /     \\
             [ 5 ]   [ 8 ]
            /    \\
          [ 12 ] [ 9 ]
  Array: [ 2, 5, 8, 12, 9 ]
  Parent(i) = floor((i-1)/2) | Left(i) = 2i+1 | Right(i) = 2i+2`,
    },
    coreConcepts: [
      {
        title: "1. The Complete Binary Tree Invariant",
        explanation:
          "All levels are fully filled except possibly the last level, which is filled from left to right. This allows perfect mapping to a contiguous array without pointers.",
      },
      {
        title: "2. The Min-Heap Order Property",
        explanation:
          "For every index i > 0: array[Math.floor((i-1)/2)] <= array[i].",
      },
      {
        title: "3. Sift-Up and Sift-Down Mechanics",
        explanation:
          "Sift-Up restores order by swapping an inserted leaf upward with its parent. Sift-Down restores order by swapping the root downward with its smallest child.",
      },
    ],
    howItWorks: [
      "Insert(val): Append val to end of array. While val < parent, swap with parent (Sift-Up).",
      "ExtractMin(): Save min = array[0]. Move last element to index 0. Pop last element. Sift-down index 0 by swapping with smallest child until valid.",
      "Peek(): Return array[0] in O(1) time.",
      "BuildHeap: Sift-down from index floor(n/2) - 1 down to 0 in O(n) linear time.",
    ],
    pseudocode: {
      intro: "Complete binary tree satisfying the Min-Heap property: parent ≤ children.",
      operations: [
        {
          name: "Insert (Heapify-Up)",
          complexity: "O(log n) time, O(1) space",
          description: "Appends element to array tail and sifts up while child < parent.",
          code: `procedure insert(heap: List, val: Value)
    heap.append(val)
    i ← length(heap) - 1
    
    while i > 0 do
        parent ← ⌊(i - 1) / 2⌋
        if heap[i] < heap[parent] then
            swap(heap[i], heap[parent])
            i ← parent
        else
            break
        end if
    end while
end procedure`,
        },
        {
          name: "Extract-Min (Heapify-Down)",
          complexity: "O(log n) time, O(1) space",
          description: "Replaces root with last element and sifts down with smallest child.",
          code: `procedure extractMin(heap: List) -> Value
    if length(heap) = 0 then raise HeapUnderflowError
    minVal ← heap[0]
    lastVal ← heap.pop()
    
    if length(heap) > 0 then
        heap[0] ← lastVal
        i ← 0
        n ← length(heap)
        
        while 2 * i + 1 < n do
            smallest ← i
            left ← 2 * i + 1
            right ← 2 * i + 2
            
            if left < n and heap[left] < heap[smallest] then
                smallest ← left
            end if
            if right < n and heap[right] < heap[smallest] then
                smallest ← right
            end if
            
            if smallest ≠ i then
                swap(heap[i], heap[smallest])
                i ← smallest
            else
                break
            end if
        end while
    end if
    
    return minVal
end procedure`,
        },
        {
          name: "Peek",
          complexity: "O(1) time, O(1) space",
          description: "Returns minimum element at root in O(1).",
          code: `procedure peek(heap: List) -> Value
    if length(heap) = 0 then raise HeapEmptyError
    return heap[0]
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "ExtractMin() from [ 2, 5, 8, 12, 9 ]",
      goal: "Remove root 2 and restore Min-Heap",
      steps: [
        { step: "Save Min & Move Last", state: "[ (9), 5, 8, 12 ]", explanation: "Min=2 saved. Last element 9 moved to root." },
        { step: "Sift-Down: Compare Children (5, 8)", state: "[ (5), (9), 8, 12 ]", explanation: "Smallest child is 5. 9 > 5 -> Swap 9 with 5." },
        { step: "Check Leaf", state: "[ 5, 9, 8, 12 ]", explanation: "9 has child 12 (9 < 12, ok). Sift complete." },
      ],
      result: "Extracted 2. New Min-Heap is [ 5, 9, 8, 12 ] with root 5.",
    },
    complexity: {
      best: { time: "O(1)", condition: "Peek minimum element." },
      average: { time: "O(log n)", condition: "Insert and Extract-Min." },
      worst: { time: "O(log n)", condition: "Full tree height sift-down." },
      space: { memory: "O(n)", explanation: "Contiguous flat array storage." },
      stable: { isStable: false, reason: "Sift swaps disrupt relative order of identical keys." },
      mathematicalIntuition:
        "Complete binary tree has depth ⌊log₂ n⌋. Sift path travels at most depth levels => strictly O(log n) time.",
    },
    pitfalls: [
      {
        myth: "Min Heap is sorted like a Binary Search Tree.",
        reality:
          "Min Heap does NOT maintain left < right child order. A left child can be larger than a right child. Only parent <= child is enforced.",
      },
    ],
    prosAndCons: {
      pros: [
        "O(1) instant access to minimum element.",
        "O(log n) insert and extract operations.",
        "Zero pointer memory overhead (contiguous array).",
      ],
      cons: [
        "O(n) linear search for non-root elements.",
        "Unstable ordering.",
      ],
      edgeCases: [
        { name: "Single Element", behavior: "Extract-Min leaves empty heap in O(1)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Dijkstra's Shortest Path",
        description: "Retrieving nearest unvisited vertex in O(log V) time.",
      },
      {
        title: "Continuous Stream Median Finding",
        description: "Pairing a Min-Heap and Max-Heap to track real-time running medians.",
      },
    ],
    keyTakeaways: [
      "Min-Heap root is always the global minimum (O(1)).",
      "Insert and Extract-Min take O(log n) via Sift-Up/Down.",
      "Stored as a flat array using simple index arithmetic.",
    ],
    nextTopics: [
      { name: "Max Heap", path: "/tree/max-heap", reason: "Compare with Max-Heap and Heapsort." },
      { name: "Dijkstra's Algorithm", path: "/graph/dijkstra", reason: "See Min-Heaps power shortest path graph algorithms." },
    ],
  },

  maxHeap: {
    title: "Max Heap",
    category: "Heap / Sorting Structure",
    tagline: "The complete binary tree where parents are always larger than children, powering Heapsort and priority schedulers.",
    whatIsIt:
      "A Max Heap is a complete binary tree data structure where every parent node satisfies the Max-Heap Property: parent.val >= children.val. The absolute maximum element is always stored at the root.",
    whyItMatters:
      "Max Heaps are the engine behind Heapsort (an in-place sorting algorithm with guaranteed O(n log n) worst-case time and O(1) auxiliary space) and priority task schedulers where the highest-value jobs must be processed first.",
    mentalModel: {
      analogy:
        "A tournament bracket: the champion (largest number) stands at the peak podium, with runners-up occupying the lower tiers.",
      diagram: `[ Max-Heap Complete Binary Tree ]
                 [ 90 ]                <- Global Maximum at Root
                /      \\
             [ 70 ]  [ 80 ]
            /    \\
          [20]  [50]
  Array: [ 90, 70, 80, 20, 50 ]`,
    },
    coreConcepts: [
      {
        title: "1. The Max-Heap Order Property",
        explanation:
          "For every index i > 0: array[Math.floor((i-1)/2)] >= array[i].",
      },
      {
        title: "2. Heapsort Algorithm",
        explanation:
          "Build Max-Heap O(n). Repeatedly swap root with last element, shrink heap boundary by 1, and sift-down new root. Produces sorted ascending array in-place in O(n log n) time!",
      },
      {
        title: "3. Flat Array Representation",
        explanation:
          "Parent is at floor((i-1)/2); children are at 2i+1 and 2i+2. No node pointers needed.",
      },
    ],
    howItWorks: [
      "Insert(val): Append val to end of array. While val > parent, swap with parent (Sift-Up).",
      "ExtractMax(): Save max = array[0]. Move last element to index 0. Pop last. Sift-down index 0 by swapping with largest child until valid.",
      "Heapsort: Build max-heap, then for i = n-1 down to 1: swap array[0] with array[i], run sift-down on array[0...i-1].",
    ],
    pseudocode: {
      intro: "Complete binary tree satisfying the Max-Heap property: parent ≥ children.",
      operations: [
        {
          name: "Insert (Heapify-Up)",
          complexity: "O(log n) time, O(1) space",
          description: "Appends element to array tail and sifts up while child > parent.",
          code: `procedure insert(heap: List, val: Value)
    heap.append(val)
    i ← length(heap) - 1
    
    while i > 0 do
        parent ← ⌊(i - 1) / 2⌋
        if heap[i] > heap[parent] then
            swap(heap[i], heap[parent])
            i ← parent
        else
            break
        end if
    end while
end procedure`,
        },
        {
          name: "Extract-Max (Heapify-Down)",
          complexity: "O(log n) time, O(1) space",
          description: "Replaces root with last element and sifts down with largest child.",
          code: `procedure extractMax(heap: List) -> Value
    if length(heap) = 0 then raise HeapUnderflowError
    maxVal ← heap[0]
    lastVal ← heap.pop()
    
    if length(heap) > 0 then
        heap[0] ← lastVal
        i ← 0
        n ← length(heap)
        
        while 2 * i + 1 < n do
            largest ← i
            left ← 2 * i + 1
            right ← 2 * i + 2
            
            if left < n and heap[left] > heap[largest] then
                largest ← left
            end if
            if right < n and heap[right] > heap[largest] then
                largest ← right
            end if
            
            if largest ≠ i then
                swap(heap[i], heap[largest])
                i ← largest
            else
                break
            end if
        end while
    end if
    
    return maxVal
end procedure`,
        },
        {
          name: "Peek",
          complexity: "O(1) time, O(1) space",
          description: "Returns maximum element at root in O(1).",
          code: `procedure peek(heap: List) -> Value
    if length(heap) = 0 then raise HeapEmptyError
    return heap[0]
end procedure`,
        }
      ],
    },
    workedExample: {
      input: "Insert 95 into Max-Heap [ 90, 70, 80, 20, 50 ]",
      goal: "Maintain Max-Heap property",
      steps: [
        { step: "Append 95", state: "[ 90, 70, 80, 20, 50, (95) ]", explanation: "95 added at index 5 (child of index 2 val 80)." },
        { step: "Sift-Up: Swap with 80", state: "[ 90, 70, (95), 20, 50, 80 ]", explanation: "95 > 80 -> Swap 95 with 80." },
        { step: "Sift-Up: Swap with 90", state: "[ (95), 70, 90, 20, 50, 80 ]", explanation: "95 > 90 -> Swap 95 with 90. 95 is new root!" },
      ],
      result: "Max-Heap restored in 2 swaps. New maximum is 95.",
    },
    complexity: {
      best: { time: "O(1)", condition: "Peek maximum element." },
      average: { time: "O(log n)", condition: "Insert and Extract-Max." },
      worst: { time: "O(log n)", condition: "Full tree height sift-down." },
      space: { memory: "O(1)", explanation: "In-place Heapsort uses O(1) auxiliary space." },
      stable: { isStable: false, reason: "Heapsort is unstable due to long-distance swaps." },
      mathematicalIntuition:
        "Building max heap takes O(n) time. Exactly n-1 extractions of cost O(log n) yield total Heapsort runtime Θ(n log n).",
    },
    pitfalls: [
      {
        myth: "Heapsort is faster than QuickSort because both are O(n log n).",
        reality:
          "QuickSort has much better CPU cache locality (scanning contiguous segments) whereas Heap sift-down jumps across 2i+1 memory strides, making QuickSort 2-3x faster in RAM.",
      },
    ],
    prosAndCons: {
      pros: [
        "O(1) instant access to maximum element.",
        "O(log n) insert and delete operations.",
        "Enables in-place O(n log n) Heapsort with zero extra memory.",
      ],
      cons: [
        "Unstable sorting algorithm.",
        "Poor CPU cache locality compared to QuickSort.",
      ],
      edgeCases: [
        { name: "Single Element", behavior: "Extract-Max leaves empty heap in O(1)." },
      ],
    },
    realWorldApplications: [
      {
        title: "Heapsort in Standard Libraries",
        description: "Introsort fallback when QuickSort recursion depth exceeds 2*log(n) (prevents O(n²) worst case).",
      },
      {
        title: "K-Largest Elements in Streaming Data",
        description: "Tracking top-k highest scoring players or web metrics.",
      },
    ],
    keyTakeaways: [
      "Max-Heap root always holds the global maximum in O(1).",
      "Heapsort achieves guaranteed O(n log n) time and O(1) space.",
      "Flat array representation requires zero pointer memory.",
    ],
    nextTopics: [
      { name: "Min Heap", path: "/tree/min-heap", reason: "Review Min-Heap mechanics." },
      { name: "Quick Sort", path: "/sorting/quick", reason: "Compare with in-place partition sorting." },
    ],
  },

  // Shortest Path Graph Algorithms

  dijkstra: {
    title: "Dijkstra's Algorithm",
    category: "Graph Shortest Path",
    tagline: "The optimal greedy shortest-path algorithm for weighted graphs with non-negative edge costs.",
    whatIsIt:
      "Dijkstra's Algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph with non-negative edge weights. It uses a Greedy strategy powered by a Priority Queue (Min-Heap) to iteratively expand the closest tentative vertex.",
    whyItMatters:
      "Dijkstra's algorithm is one of the most celebrated algorithms in computing history. It powers Google Maps and GPS navigation, OSPF (Open Shortest Path First) internet packet routing, and network connection optimization.",
    mentalModel: {
      analogy:
        "Lighting a fire at the source node in a network of combustible fuses: the fire spreads along each path proportional to edge length. The moment fire first reaches any intersection, it has arrived via the shortest possible time path.",
      diagram: `[ Dijkstra's Greedy Relaxation ]
        ( A ) ─── 4 ───► ( B )
          │                ▲
          2                1
          ▼                │
        ( C ) ─── 1 ───► ( D )
  Shortest Path to B: A -> C -> D -> B (Cost = 2 + 1 + 1 = 4)`,
    },
    coreConcepts: [
      {
        title: "1. The Greedy Invariant",
        explanation:
          "Once a vertex u with the minimum tentative distance is popped from the Priority Queue, its shortest path distance from source is finalized and mathematically guaranteed.",
      },
      {
        title: "2. Edge Relaxation Formula",
        explanation:
          "For edge (u, v) with weight w: If dist[u] + w < dist[v], update dist[v] = dist[u] + w, record parent[v] = u, and push (dist[v], v) to Priority Queue.",
      },
      {
        title: "3. Non-Negative Weight Constraint",
        explanation:
          "Dijkstra fails on graphs with negative edge weights because greedy finality assumption breaks (a later negative edge could reduce an already finalized distance).",
      },
    ],
    howItWorks: [
      "Initialize dist[] array to infinity (\\u221E) for all vertices; set dist[source] = 0.",
      "Create Min-Priority Queue PQ and enqueue (0, source).",
      "While PQ is not empty:",
      "  Extract vertex u with smallest distance d.",
      "  If d > dist[u], skip (stale duplicate in PQ).",
      "  For each neighbor v of u with edge weight w:",
      "    If dist[u] + w < dist[v]:",
      "      dist[v] = dist[u] + w.",
      "      parent[v] = u.",
      "      Enqueue (dist[v], v) to PQ.",
    ],
    pseudocode: {
      intro: "Greedy single-source shortest path algorithm using a min-priority queue for non-negative weighted graphs.",
      code: `procedure dijkstra(graph: WeightedGraph, source: Node) -> (Distances, Predecessors)
    dist ← map initialized to ∞ for all nodes, dist[source] ← 0
    prev ← map initialized to NULL for all nodes
    pq ← new MinPriorityQueue()   // Elements stored as (distance, node)
    
    pq.insert(0, source)
    
    while not pq.isEmpty() do
        (d, u) ← pq.extractMin()
        
        // Skip if a shorter path to u was already settled
        if d > dist[u] then continue
        
        for each edge (u, v, weight) in graph.getOutgoingEdges(u) do
            alt ← dist[u] + weight
            if alt < dist[v] then
                dist[v] ← alt
                prev[v] ← u
                pq.insert(alt, v)
            end if
        end for
    end while
    
    return (dist, prev)
end procedure`,
    },
    workedExample: {
      input: "Graph: A->B (4), A->C (2), C->B (1). Source = A",
      goal: "Find shortest distance from A to B",
      steps: [
        { step: "Init", state: "dist[A]=0, dist[B]=\\u221E, dist[C]=\\u221E. PQ=[(0,A)]", explanation: "Start at source A." },
        { step: "Visit A", state: "Relax B: dist[B]=4; Relax C: dist[C]=2. PQ=[(2,C), (4,B)]", explanation: "Examines neighbors B and C." },
        { step: "Extract C (dist 2)", state: "Relax B via C: 2+1=3 < 4! Update dist[B]=3. PQ=[(3,B), (4,B)]", explanation: "C is closest. Path A->C->B is shorter than direct A->B!" },
        { step: "Extract B (dist 3)", state: "Finalized dist[B] = 3", explanation: "Shortest path to B finalized as 3." },
      ],
      result: "Shortest Path to B is A -> C -> B with total cost 3.",
    },
    complexity: {
      best: { time: "O((V + E) log V)", condition: "Binary Min-Heap implementation." },
      average: { time: "O((V + E) log V)", condition: "Standard adjacency list graph." },
      worst: { time: "O((V + E) log V)", condition: "Dense graph (can be O(E + V log V) with Fibonacci Heap)." },
      space: { memory: "O(V)", explanation: "Distance array and priority queue storage." },
      stable: null,
      mathematicalIntuition:
        "Every vertex is extracted from PQ once (O(V log V)) and every edge is relaxed at most once (O(E log V)) => O((V + E) log V).",
    },
    pitfalls: [
      {
        myth: "Dijkstra's Algorithm works with negative edge weights if you add a constant to make all weights positive.",
        reality:
          "Adding a constant changes path lengths unevenly (paths with more edges get penalized more). Dijkstra completely fails on negative weights; use Bellman-Ford instead.",
      },
    ],
    prosAndCons: {
      pros: [
        "Highly efficient O((V + E) log V) runtime for weighted graphs.",
        "Guarantees optimal shortest paths on all non-negative graphs.",
        "Industry standard for road networks and IP routing.",
      ],
      cons: [
        "Fails completely on graphs with negative edge weights.",
        "Explores in all directions equally without heuristic guidance (unlike A* Search).",
      ],
      edgeCases: [
        { name: "Disconnected Graph", behavior: "Unreachable nodes retain distance infinity (\\u221E)." },
        { name: "Zero Weight Edges", behavior: "Handled correctly without infinite looping." },
      ],
    },
    realWorldApplications: [
      {
        title: "GPS Navigation & Road Routing",
        description: "Google Maps, Apple Maps, and OpenStreetMap computing turn-by-turn routes.",
      },
      {
        title: "OSPF Internet Routing Protocol",
        description: "Core internet routers dynamically finding fastest packet routes.",
      },
      {
        title: "Airline Flight Network Cost Optimization",
        description: "Finding cheapest multi-city flight layovers.",
      },
    ],
    keyTakeaways: [
      "Dijkstra finds single-source shortest paths on non-negative weighted graphs.",
      "Uses a Min-Priority Queue with greedy edge relaxation in O((V + E) log V) time.",
      "Cannot handle negative edge weights.",
    ],
    nextTopics: [
      { name: "Bellman-Ford", path: "/graph/bellman-ford", reason: "Learn how to handle negative edge weights and detect negative cycles." },
      { name: "BFS", path: "/graph/bfs", reason: "Review unweighted graph shortest path traversal." },
    ],
  },

  bellmanFord: {
    title: "Bellman-Ford Algorithm",
    category: "Graph Shortest Path",
    tagline: "The dynamic programming shortest-path algorithm that handles negative weights and detects negative cycles.",
    whatIsIt:
      "The Bellman-Ford Algorithm is a single-source shortest path algorithm capable of handling graphs with negative edge weights. It works by iteratively relaxing all edges V - 1 times, and can detect whether the graph contains a **Negative Weight Cycle**.",
    whyItMatters:
      "While Dijkstra is faster, it fails on negative weights. Bellman-Ford guarantees correctness even with negative edges. In financial engineering, detecting a negative weight cycle on logarithmic currency exchange rate graphs reveals risk-free **Currency Arbitrage opportunities**.",
    mentalModel: {
      analogy:
        "A wave of price updates propagating through a supply chain: in each round, every supplier updates their best price based on suppliers one step away. After V-1 rounds, prices must stabilize unless there is an infinite-discount loop.",
      diagram: `[ Negative Cycle Detection ]
        ( A ) ─── 1 ───► ( B )
          ▲                │
          │                2
         -4                │
          │                ▼
        ( D ) ◄─── 1 ─── ( C )
  Cycle Cost: 1 + 2 + 1 + (-4) = 0. If weight was -5, sum = -1 (Infinite Negative Loop!)`,
    },
    coreConcepts: [
      {
        title: "1. The V - 1 Iteration Invariant",
        explanation:
          "A simple shortest path in a graph of V vertices contains at most V - 1 edges. Therefore, relaxing all edges V - 1 times guarantees all shortest paths are computed.",
      },
      {
        title: "2. The V-th Pass Negative Cycle Test",
        explanation:
          "If performing a V-th relaxation pass reduces ANY distance further, a negative cycle exists because distance is infinitely decreasing.",
      },
      {
        title: "3. Dynamic Programming Principle",
        explanation:
          "Computes shortest paths of length at most 1 edge in pass 1, at most 2 edges in pass 2, ..., up to V-1 edges in pass V-1.",
      },
    ],
    howItWorks: [
      "Initialize dist[] to infinity (\\u221E) for all vertices; set dist[source] = 0.",
      "Repeat V - 1 times:",
      "  For every edge (u, v) with weight w in edge list:",
      "    If dist[u] != \\u221E and dist[u] + w < dist[v]:",
      "      dist[v] = dist[u] + w.",
      "      parent[v] = u.",
      "Run 1 final pass (V-th pass) over all edges:",
      "  If dist[u] + w < dist[v], report: \"Negative Weight Cycle Detected!\"",
    ],
    pseudocode: {
      intro: "Single-source shortest path algorithm supporting negative weights with negative cycle detection.",
      code: `procedure bellmanFord(vertices: List, edges: List of (u, v, w), source: Node)
    dist ← map initialized to ∞ for all vertices, dist[source] ← 0
    prev ← map initialized to NULL for all vertices
    
    // Phase 1: Relax all edges |V| - 1 times
    for i ← 1 to |vertices| - 1 do
        updated ← false
        for each edge (u, v, w) in edges do
            if dist[u] ≠ ∞ and dist[u] + w < dist[v] then
                dist[v] ← dist[u] + w
                prev[v] ← u
                updated ← true
            end if
        end for
        if not updated then break   // Early termination if converged
    end for
    
    // Phase 2: Detect negative-weight cycles (|V|-th pass)
    for each edge (u, v, w) in edges do
        if dist[u] ≠ ∞ and dist[u] + w < dist[v] then
            raise NegativeWeightCycleDetectedError
        end if
    end for
    
    return (dist, prev)
end procedure`,
    },
    workedExample: {
      input: "3 Vertices: A->B (4), A->C (5), C->B (-3). Source = A",
      goal: "Find shortest distance from A to B with negative weight",
      steps: [
        { step: "Init", state: "dist[A]=0, dist[B]=\\u221E, dist[C]=\\u221E", explanation: "Set source distance." },
        { step: "Pass 1", state: "Relax A->B: dist[B]=4; Relax A->C: dist[C]=5", explanation: "Paths of length 1 relaxed." },
        { step: "Pass 2", state: "Relax C->B: 5 + (-3) = 2 < 4! dist[B] updated to 2", explanation: "Path A->C->B with negative edge is shorter!" },
        { step: "Pass 3 (Check)", state: "No changes", explanation: "No further reductions -> No negative cycle." },
      ],
      result: "Final Shortest Distance to B = 2 via path A -> C -> B.",
    },
    complexity: {
      best: { time: "O(E)", condition: "Terminates in 1 pass if no changes occur (with early-stop flag)." },
      average: { time: "O(V * E)", condition: "Standard dense edge relaxation." },
      worst: { time: "O(V * E)", condition: "Requires all V - 1 passes." },
      space: { memory: "O(V)", explanation: "Only requires distance and parent arrays." },
      stable: null,
      mathematicalIntuition:
        "The algorithm executes V - 1 outer passes. Each pass scans all E edges => strictly O(V * E) time.",
    },
    pitfalls: [
      {
        myth: "Bellman-Ford can find shortest paths even inside a negative weight cycle.",
        reality:
          "If a reachable negative weight cycle exists, shortest path is mathematically undefined (-infinity). Bellman-Ford correctly detects the cycle and aborts.",
      },
      {
        myth: "Bellman-Ford is obsolete because Dijkstra is faster.",
        reality:
          "Bellman-Ford is mandatory when edge weights can be negative, and its decentralized design is the foundation of internet Distance-Vector Routing (BGP / RIP).",
      },
    ],
    prosAndCons: {
      pros: [
        "Handles negative edge weights correctly.",
        "Detects and flags negative weight cycles.",
        "Simple implementation using flat edge list.",
      ],
      cons: [
        "Slower than Dijkstra: O(V * E) vs O((V + E) log V).",
      ],
      edgeCases: [
        { name: "Reachable Negative Cycle", behavior: "Flags negative cycle detection on V-th pass." },
        { name: "Unreachable Negative Cycle", behavior: "Does not affect distances from source." },
      ],
    },
    realWorldApplications: [
      {
        title: "Forex Currency Arbitrage Detection",
        description: "Transforming exchange rates to negative logs (-ln(rate)) to detect arbitrage cycles.",
      },
      {
        title: "Routing Information Protocol (RIP & BGP)",
        description: "Distributed Distance-Vector routing protocols across internet autonomous systems.",
      },
    ],
    keyTakeaways: [
      "Bellman-Ford handles negative weights by relaxing all edges V-1 times.",
      "Runs in O(V * E) time and O(V) space.",
      "A V-th pass detects negative weight cycles.",
    ],
    nextTopics: [
      { name: "Dijkstra's Algorithm", path: "/graph/dijkstra", reason: "Compare with fast O((V+E) log V) Dijkstra." },
      { name: "DFS", path: "/graph/dfs", reason: "Explore cycle detection using Depth-First Search." },
    ],
  },
};

// Path to Theory Key Mapping
export const PATH_TO_THEORY_KEY = {
  "/sorting/bubble": "bubbleSort",
  "/sorting/selection": "selectionSort",
  "/sorting/insertion": "insertionSort",
  "/sorting/merge": "mergeSort",
  "/sorting/quick": "quickSort",
  "/searching/linear": "linearSearch",
  "/searching/binary": "binarySearch",
  "/stack/push-pop": "stack",
  "/stack/balanced-parens": "balancedParens",
  "/stack/next-greater": "nextGreaterElement",
  "/queue/enqueue-dequeue": "enqueueDequeue",
  "/queue/circular": "circularQueue",
  "/queue/priority": "priorityQueue",
  "/linked-list/traversal": "linkedList",
  "/linked-list/singly-insert-delete": "singlyInsertDelete",
  "/linked-list/reverse": "reverseList",
  "/linked-list/cycle": "detectCycle",
  "/linked-list/doubly-insert-delete": "doublyInsertDelete",
  "/tree/bst-insertion": "bstInsertion",
  "/tree/inorder": "inorderTraversal",
  "/tree/preorder": "preorderTraversal",
  "/tree/postorder": "postorderTraversal",
  "/tree/min-heap": "minHeap",
  "/tree/max-heap": "maxHeap",
  "/graph/bfs": "bfs",
  "/graph/dfs": "dfs",
  "/graph/dijkstra": "dijkstra",
  "/graph/bellman-ford": "bellmanFord",
};
