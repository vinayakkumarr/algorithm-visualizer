/**
 * queueCircular.js — Step generator and state machine for Circular Queue (Ring Buffer).
 *
 * Demonstrates modulo indexing `(i + 1) % capacity` to reuse freed buffer slots without
 * shifting elements, achieving O(1) Enqueue, Dequeue, and Peek.
 *
 * Time Complexity: O(1) for all operations.
 * Auxiliary Space: O(capacity) fixed contiguous array memory.
 */

export const PSEUDOCODE_CIRCULAR_QUEUE = {
  enqueue: [
    "procedure enqueue(value):",
    "  if isFull(): throw OverflowError (count == capacity)",
    "  rear = (rear + 1) % capacity",
    "  buffer[rear] = value",
    "  count = count + 1",
  ],
  dequeue: [
    "procedure dequeue():",
    "  if isEmpty(): throw UnderflowError (count == 0)",
    "  val = buffer[front]",
    "  buffer[front] = null",
    "  front = (front + 1) % capacity",
    "  count = count - 1",
    "  return val",
  ],
  peek: [
    "procedure peek():",
    "  if isEmpty(): return null",
    "  return buffer[front]",
  ],
};

/**
 * Creates initial circular queue state.
 * @param {number} capacity - Ring buffer capacity (default 6)
 * @param {Array<number>} initialValues - Initial values to enqueue
 */
export function createCircularQueue(capacity = 6, initialValues = [10, 20, 30]) {
  const cap = Math.max(3, Math.min(10, capacity));
  const buffer = new Array(cap).fill(null);
  let front = 0;
  let rear = -1;
  let count = 0;

  if (Array.isArray(initialValues)) {
    for (const val of initialValues) {
      if (count < cap) {
        rear = (rear + 1) % cap;
        buffer[rear] = val;
        count++;
      }
    }
  }

  return {
    buffer,
    capacity: cap,
    front,
    rear: rear === -1 ? 0 : rear,
    count,
  };
}

export function generateEnqueueSteps(qState, value) {
  const state = {
    buffer: [...qState.buffer],
    capacity: qState.capacity,
    front: qState.front,
    rear: qState.rear,
    count: qState.count,
  };

  const steps = [];

  const makeSnapshot = (activeSlot = null, action = "") => ({
    buffer: state.buffer.map((val, idx) => ({
      index: idx,
      value: val,
      isOccupied: val !== null,
      isFront: state.count > 0 && idx === state.front,
      isRear: state.count > 0 && idx === state.rear,
      isActive: idx === activeSlot,
    })),
    capacity: state.capacity,
    front: state.front,
    rear: state.rear,
    count: state.count,
    isFull: state.count === state.capacity,
    isEmpty: state.count === 0,
    action,
    operationType: "enqueue",
  });

  // Step 1: Check capacity
  if (state.count >= state.capacity) {
    steps.push({
      ...makeSnapshot(null, "Overflow check"),
      activeLine: 1,
      pseudocode: PSEUDOCODE_CIRCULAR_QUEUE.enqueue,
      narrative: `Queue Overflow Error! Circular buffer is full (${state.count}/${state.capacity}). Cannot enqueue ${value}.`,
      isTerminal: true,
      error: "Queue Full (Overflow)",
      finalState: state,
    });
    return steps;
  }

  // Step 2: Compute next rear index via modulo
  const nextRear = state.count === 0 ? 0 : (state.rear + 1) % state.capacity;

  steps.push({
    ...makeSnapshot(nextRear, "Advance Rear"),
    activeLine: 2,
    pseudocode: PSEUDOCODE_CIRCULAR_QUEUE.enqueue,
    narrative: `Advancing REAR pointer: (${state.rear} + 1) % ${state.capacity} = slot [${nextRear}].`,
    isTerminal: false,
  });

  // Step 3: Write value into slot
  state.buffer[nextRear] = value;
  state.rear = nextRear;
  state.count++;

  steps.push({
    ...makeSnapshot(nextRear, "Write Value"),
    activeLine: 3,
    pseudocode: PSEUDOCODE_CIRCULAR_QUEUE.enqueue,
    narrative: `Wrote value ${value} into buffer slot [${nextRear}]. Total elements in ring: ${state.count}/${state.capacity}.`,
    isTerminal: true,
    finalState: state,
  });

  return steps;
}

export function generateDequeueSteps(qState) {
  const state = {
    buffer: [...qState.buffer],
    capacity: qState.capacity,
    front: qState.front,
    rear: qState.rear,
    count: qState.count,
  };

  const steps = [];

  const makeSnapshot = (activeSlot = null, action = "") => ({
    buffer: state.buffer.map((val, idx) => ({
      index: idx,
      value: val,
      isOccupied: val !== null,
      isFront: state.count > 0 && idx === state.front,
      isRear: state.count > 0 && idx === state.rear,
      isActive: idx === activeSlot,
    })),
    capacity: state.capacity,
    front: state.front,
    rear: state.rear,
    count: state.count,
    isFull: state.count === state.capacity,
    isEmpty: state.count === 0,
    action,
    operationType: "dequeue",
  });

  // Step 1: Check underflow
  if (state.count === 0) {
    steps.push({
      ...makeSnapshot(null, "Underflow check"),
      activeLine: 1,
      pseudocode: PSEUDOCODE_CIRCULAR_QUEUE.dequeue,
      narrative: "Queue Underflow Error! Circular buffer is empty (0 elements). Cannot dequeue.",
      isTerminal: true,
      error: "Queue Empty (Underflow)",
      finalState: state,
    });
    return steps;
  }

  // Step 2: Read value from front
  const removedVal = state.buffer[state.front];
  const oldFront = state.front;

  steps.push({
    ...makeSnapshot(oldFront, "Read Front"),
    activeLine: 2,
    pseudocode: PSEUDOCODE_CIRCULAR_QUEUE.dequeue,
    narrative: `Reading front element: buffer[${oldFront}] = ${removedVal}.`,
    isTerminal: false,
  });

  // Step 3: Clear slot and advance front
  state.buffer[oldFront] = null;
  state.front = (oldFront + 1) % state.capacity;
  state.count--;

  steps.push({
    ...makeSnapshot(oldFront, "Advance Front"),
    activeLine: 4,
    pseudocode: PSEUDOCODE_CIRCULAR_QUEUE.dequeue,
    narrative: `Dequeued ${removedVal}! Advanced FRONT pointer: (${oldFront} + 1) % ${state.capacity} = slot [${state.front}]. Remaining: ${state.count}.`,
    isTerminal: true,
    dequeuedValue: removedVal,
    finalState: state,
  });

  return steps;
}
