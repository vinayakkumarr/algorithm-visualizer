import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VisualizerLayout, { useVisualizer } from "../../../components/VisualizerLayout";
import SearchVisualizer   from "../../../components/SearchVisualizer";
import { generateSteps, sortedArray, speedToMs, PSEUDOCODE } from "../../../algorithms/binarySearch";
import { CustomArrayIcon, ShuffleIcon } from "../../../components/Icons";

// Target Bar with In-Canvas Actions
function BinarySearchTargetBar({ target, setTarget, pickRandom, pickMissing, status }) {
  const { openCustomModal } = useVisualizer();
  return (
    <div className="search-target">
      <span className="search-target__label">Search for</span>
      <input
        className="search-target__input"
        type="number"
        value={target}
        onChange={e => setTarget(e.target.value)}
        placeholder="e.g. 42"
        disabled={status === STATUS.RUNNING}
        min={10}
        max={99}
        aria-label="Target value to search for"
      />
      <button
        type="button"
        className="search-target__btn search-target__btn--random"
        onClick={pickRandom}
        disabled={status === STATUS.RUNNING}
        title="Pick an existing value (guaranteed found)"
      >
        <ShuffleIcon size={13} className="search-target__btn-icon" />
        <span>Random</span>
      </button>
      <button
        type="button"
        className="search-target__btn search-target__btn--missing"
        onClick={pickMissing}
        disabled={status === STATUS.RUNNING}
        title="Pick a value not in the array"
      >
        <span>✕ Missing</span>
      </button>
      <button
        type="button"
        className="search-target__btn search-target__btn--custom"
        onClick={openCustomModal}
        disabled={status === STATUS.RUNNING}
        title="Create or paste a custom array"
      >
        <CustomArrayIcon size={13} className="search-target__btn-icon" />
        <span>Custom Array</span>
      </button>
      <span className="search-sorted-badge">↑ Sorted</span>
    </div>
  );
}

// Constants
const COMPLEXITY = {
  best:    "O(1)",
  average: "O(log n)",
  worst:   "O(log n)",
  space:   "O(1)",
  stable:  null,   // not applicable for searching
};

const DEFAULT_SIZE  = 14;
const DEFAULT_SPEED = 3;   // slower default — binary search has very few steps

const STATUS = { IDLE: "idle", RUNNING: "running", PAUSED: "paused", DONE: "done" };

// Component
export default function BinarySearch() {
  useEffect(() => { document.title = "Binary Search — Algorithm Visualizer"; }, []);
  // Settings
  const [size,  setSize]  = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  // Array (always sorted) + target
  const [inputArray, setInputArray] = useState(() => sortedArray(DEFAULT_SIZE));
  const [target,     setTarget]     = useState("");

  // Pre-computed steps
  const steps = useMemo(() => {
    const t = Number(target);
    if (target === "" || isNaN(t)) return [];
    return generateSteps(inputArray, t);
  }, [inputArray, target]);

  // Playback
  const [stepIdx, setStepIdx] = useState(0);
  const [status,  setStatus]  = useState(STATUS.IDLE);

  // Refs
  const timerRef = useRef(null);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Timer helpers
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setStatus(STATUS.DONE);
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speedRef.current));
  }, [clearTimer, steps.length]);

  // Restart timer when speed changes while running
  useEffect(() => {
    if (status === STATUS.RUNNING) startTimer();
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, speed]);

  // Reset whenever steps recompute (target or array changed)
  useEffect(() => {
    clearTimer();
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [steps, clearTimer]);

  const isCustomRef = useRef(false);

  const handleCustomArray = useCallback((newArr) => {
    clearTimer();
    isCustomRef.current = true;
    const sorted = [...newArr].sort((a, b) => a - b);
    setSize(sorted.length);
    setInputArray(sorted);
    setTarget("");
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer]);

  // Array size change → regenerate sorted array
  useEffect(() => {
    if (isCustomRef.current) {
      isCustomRef.current = false;
      return;
    }
    clearTimer();
    setInputArray(sortedArray(size));
    setTarget("");
  }, [size, clearTimer]);

  // Unmount cleanup
  useEffect(() => clearTimer, [clearTimer]);

  // Handlers
  const handleStart = useCallback(() => {
    if (status === STATUS.DONE || steps.length === 0) return;
    setStatus(STATUS.RUNNING);
  }, [status, steps.length]);

  const handlePause = useCallback(() => {
    clearTimer();
    setStatus(STATUS.PAUSED);
  }, [clearTimer]);

  const handleReset = useCallback(() => {
    clearTimer();
    setInputArray(sortedArray(size));
    setTarget("");
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer, size]);

  // Pick a random existing value from the sorted array as the target
  const pickRandom = useCallback(() => {
    const val = inputArray[Math.floor(Math.random() * inputArray.length)];
    setTarget(String(val));
  }, [inputArray]);

  // Pick a value guaranteed NOT to be in the array (for not-found demo)
  const pickMissing = useCallback(() => {
    const set = new Set(inputArray);
    for (let v = 10; v <= 99; v++) {
      if (!set.has(v)) { setTarget(String(v)); return; }
    }
  }, [inputArray]);

  const stepIdxRef = useRef(0);
  useEffect(() => { stepIdxRef.current = stepIdx; }, [stepIdx]);

  const handleStepBack = useCallback(() => {
    clearTimer();
    setStatus(STATUS.PAUSED);
    setStepIdx(prev => Math.max(0, prev - 1));
  }, [clearTimer]);

  const handleStepForward = useCallback(() => {
    clearTimer();
    const next = stepIdxRef.current + 1;
    if (next >= steps.length - 1) { setStepIdx(steps.length - 1); setStatus(STATUS.DONE); }
    else { setStepIdx(next); setStatus(STATUS.PAUSED); }
  }, [clearTimer, steps.length]);

  const handleJumpStart = useCallback(() => {
    clearTimer(); setStepIdx(0); setStatus(STATUS.IDLE);
  }, [clearTimer]);

  const handleJumpEnd = useCallback(() => {
    if (steps.length === 0) return;
    clearTimer(); setStepIdx(steps.length - 1); setStatus(STATUS.DONE);
  }, [clearTimer, steps.length]);

  const handleScrub = useCallback((idx) => {
    if (steps.length === 0) return;
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    setStepIdx(clamped);
    if (clamped >= steps.length - 1) setStatus(STATUS.DONE);
    else setStatus(STATUS.PAUSED);
  }, [steps.length]);

  // Derived values
  const currentFrame = steps[stepIdx] ?? {
    array: inputArray,
    low: 0, mid: null, high: inputArray.length - 1,
    found: null, eliminated: new Set(),
  };

  const lastFrame   = steps[steps.length - 1];
  const doneMessage = lastFrame?.found != null
    ? `✅ Found ${target} at index ${lastFrame.found}!`
    : `❌ ${target || "Target"} not found in the array`;

  return (
    <VisualizerLayout
      title="Binary Search"
      description="Repeatedly halves the search range by comparing with the middle element. Requires a sorted array but runs in O(log n) — dramatically faster than linear search on large datasets."
      nextAlgorithm={{ name: "BST Insertion", path: "/tree/bst-insertion" }}
      complexity={COMPLEXITY}
      stepIdx={stepIdx}
      totalSteps={Math.max(steps.length - 1, 0)}
      isRunning={status === STATUS.RUNNING}
      speed={speed}
      setSpeed={setSpeed}
      size={size}
      setSize={setSize}
      sizeMin={5}
      sizeMax={20}
      onStart={handleStart}
      onPause={handlePause}
      onReset={handleReset}
      onStepBack={handleStepBack}
      onStepForward={handleStepForward}
      onJumpStart={handleJumpStart}
      onJumpEnd={handleJumpEnd}
      onScrub={handleScrub}
      pseudocode={PSEUDOCODE}
      activeLine={currentFrame.activeLine ?? -1}
      narrative={currentFrame.narrative ?? ""}
      onCustomArray={handleCustomArray}
      currentArray={inputArray}
      requireSorted={true}
      doneMessage={doneMessage}
    >
      {/* Canvas content: target input + sorted badge + visualizer */}
      <div className="search-canvas">
        <BinarySearchTargetBar
          target={target}
          setTarget={setTarget}
          pickRandom={pickRandom}
          pickMissing={pickMissing}
          status={status}
        />

        <SearchVisualizer
          array={currentFrame.array}
          target={target !== "" ? Number(target) : ""}
          checking={currentFrame.mid}       // mid is the "checking" index
          found={currentFrame.found}
          eliminated={currentFrame.eliminated}
          low={currentFrame.low}
          mid={currentFrame.mid}
          high={currentFrame.high}
        />
      </div>
    </VisualizerLayout>
  );
}
