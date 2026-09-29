import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VisualizerLayout from "../../../components/VisualizerLayout";
import ArrayBars        from "../../../components/ArrayBars";
import { generateSteps, randomArray, speedToMs, PSEUDOCODE } from "../../../algorithms/quickSort";

// Constants
const COMPLEXITY = {
  best:    "O(n log n)",
  average: "O(n log n)",
  worst:   "O(n²)",
  space:   "O(log n)",
  stable:  false,
};

const DEFAULT_SIZE  = 14;
const DEFAULT_SPEED = 3;

const STATUS = { IDLE: "idle", RUNNING: "running", PAUSED: "paused", DONE: "done" };

// Component
export default function QuickSort() {
  useEffect(() => { document.title = "Quick Sort — Algorithm Visualizer"; }, []);
  // Settings
  const [size,  setSize]  = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  // Array & pre-computed steps
  const [inputArray, setInputArray] = useState(() => randomArray(DEFAULT_SIZE));
  const steps = useMemo(() => generateSteps(inputArray), [inputArray]);

  // Playback state
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

  // Restart interval immediately when speed changes mid-run
  useEffect(() => {
    if (status === STATUS.RUNNING) startTimer();
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, speed]);

  const isCustomRef = useRef(false);

  const handleCustomArray = useCallback((newArr) => {
    clearTimer();
    isCustomRef.current = true;
    setSize(newArr.length);
    setInputArray(newArr);
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer]);

  // Array size change → full reset
  useEffect(() => {
    if (isCustomRef.current) {
      isCustomRef.current = false;
      return;
    }
    clearTimer();
    setInputArray(randomArray(size));
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [size, clearTimer]);

  // Unmount cleanup
  useEffect(() => clearTimer, [clearTimer]);

  // Handlers
  const handleStart = useCallback(() => {
    if (status === STATUS.DONE) return;
    setStatus(STATUS.RUNNING);
  }, [status]);

  const handlePause = useCallback(() => {
    clearTimer();
    setStatus(STATUS.PAUSED);
  }, [clearTimer]);

  const handleReset = useCallback(() => {
    clearTimer();
    setInputArray(randomArray(size));
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer, size]);

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
    clearTimer(); setStepIdx(steps.length - 1); setStatus(STATUS.DONE);
  }, [clearTimer, steps.length]);

  const handleScrub = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    setStepIdx(clamped);
    if (clamped >= steps.length - 1) setStatus(STATUS.DONE);
    else setStatus(STATUS.PAUSED);
  }, [steps.length]);

  // Derived values
  const currentFrame = steps[stepIdx] ?? {
    array: inputArray, comparing: [], swapped: [], done: new Set(),
  };

  const densityClass =
    inputArray.length > 70 ? "array-bars--packed" :
    inputArray.length > 40 ? "array-bars--dense"  : "";

  return (
    <VisualizerLayout
      title="Quick Sort"
      description="Picks a pivot, partitions elements around it, and recurses on each side. Fastest in practice for most real-world data — used in C's qsort() and most language standard libraries."
      nextAlgorithm={{ name: "Linear Search", path: "/searching/linear" }}
      complexity={COMPLEXITY}
      stepIdx={stepIdx}
      totalSteps={Math.max(steps.length - 1, 0)}
      isRunning={status === STATUS.RUNNING}
      speed={speed}
      setSpeed={setSpeed}
      size={size}
      setSize={setSize}
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
    >
      <ArrayBars
        array={currentFrame.array}
        comparing={currentFrame.comparing}
        swapped={currentFrame.swapped}
        done={currentFrame.done}
        pivot={currentFrame.pivot}
        range={currentFrame.range}
        className={densityClass}
      />
    </VisualizerLayout>
  );
}
