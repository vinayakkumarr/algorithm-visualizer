import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VisualizerLayout from "../../../components/VisualizerLayout";
import ArrayBars       from "../../../components/ArrayBars";
import { generateSteps, randomArray, speedToMs, PSEUDOCODE } from "../../../algorithms/bubbleSort";

// Constants
const COMPLEXITY = {
  best:    "O(n)",
  average: "O(n²)",
  worst:   "O(n²)",
  space:   "O(1)",
  stable:  true,
};

const DEFAULT_SIZE  = 14;
const DEFAULT_SPEED = 3;

/**
 * Animation status values
 *   idle    — nothing started yet / just reset
 *   running — interval is ticking
 *   paused  — interval stopped mid-way, stepIdx preserved
 *   done    — reached the last step
 */
const STATUS = { IDLE: "idle", RUNNING: "running", PAUSED: "paused", DONE: "done" };

// Component
export default function BubbleSort() {
  useEffect(() => { document.title = "Bubble Sort — Algorithm Visualizer"; }, []);
  // Settings
  const [size,  setSize]  = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  // Array & pre-computed steps
  const [inputArray, setInputArray] = useState(() => randomArray(DEFAULT_SIZE));
  // generateSteps is expensive for n=100 — memoize it
  const steps = useMemo(() => generateSteps(inputArray), [inputArray]);

  // Playback state
  const [stepIdx, setStepIdx] = useState(0);
  const [status,  setStatus]  = useState(STATUS.IDLE);

  // Timer ref — holds the live setInterval id
  const timerRef = useRef(null);

  // Speed ref — lets the interval callback read the latest speed
  //    without the effect needing `speed` as a dependency ──
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  // Clear interval helper
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Start a new interval at current speed
  const startTimer = useCallback(() => {
    clearTimer();
    timerRef.current = setInterval(() => {
      setStepIdx(prev => {
        const next = prev + 1;
        if (next >= steps.length - 1) {
          // Reached last frame — stop
          clearInterval(timerRef.current);
          timerRef.current = null;
          setStatus(STATUS.DONE);
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speedRef.current));
  }, [clearTimer, steps.length]);

  // Effect: restart timer when speed changes mid-run
  // When status is RUNNING and speed changes, we tear down the old
  // interval and spin up a new one at the new delay immediately.
  useEffect(() => {
    if (status === STATUS.RUNNING) {
      startTimer();
    }
    // Cleanup on unmount / before next run
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, speed]); // `speed` here triggers the restart; startTimer/clearTimer are stable

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

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  // stepIdx mirror ref (solves stale-closure in handlers)
  const stepIdxRef = useRef(0);
  useEffect(() => { stepIdxRef.current = stepIdx; }, [stepIdx]);

  // Handlers
  const handleStart = useCallback(() => {
    if (status === STATUS.DONE) return;
    setStatus(STATUS.RUNNING);
    // startTimer fires via the status effect above
  }, [status]);

  const handlePause = useCallback(() => {
    clearTimer();
    setStatus(STATUS.PAUSED);
  }, [clearTimer]);

  const handleReset = useCallback(() => {
    clearTimer();
    // Generate a fresh array (triggers the size effect chain)
    setInputArray(randomArray(size));
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer, size]);

  const handleStepBack = useCallback(() => {
    clearTimer();
    setStatus(STATUS.PAUSED);
    setStepIdx(prev => Math.max(0, prev - 1));
  }, [clearTimer]);

  const handleStepForward = useCallback(() => {
    clearTimer();
    const next = stepIdxRef.current + 1;
    if (next >= steps.length - 1) {
      setStepIdx(steps.length - 1);
      setStatus(STATUS.DONE);
    } else {
      setStepIdx(next);
      setStatus(STATUS.PAUSED);
    }
  }, [clearTimer, steps.length]);

  const handleJumpStart = useCallback(() => {
    clearTimer();
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer]);

  const handleJumpEnd = useCallback(() => {
    clearTimer();
    setStepIdx(steps.length - 1);
    setStatus(STATUS.DONE);
  }, [clearTimer, steps.length]);

  const handleScrub = useCallback((idx) => {
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    setStepIdx(clamped);
    if (clamped >= steps.length - 1) setStatus(STATUS.DONE);
    else setStatus(STATUS.PAUSED);
  }, [steps.length]);

  // Derived display values
  const currentFrame = steps[stepIdx] ?? {
    array: inputArray, comparing: [], swapped: [], done: new Set(),
  };

  const densityClass =
    inputArray.length > 70 ? "array-bars--packed" :
    inputArray.length > 40 ? "array-bars--dense"  : "";

  const isRunning = status === STATUS.RUNNING;

  return (
    <VisualizerLayout
      title="Bubble Sort"
      description="Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. Simple but inefficient — best used to teach sorting concepts, not in production code."
      nextAlgorithm={{ name: "Selection Sort", path: "/sorting/selection" }}
      complexity={COMPLEXITY}
      stepIdx={stepIdx}
      totalSteps={Math.max(steps.length - 1, 0)}
      isRunning={isRunning}
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
        className={densityClass}
      />
    </VisualizerLayout>
  );
}
