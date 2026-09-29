import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VisualizerLayout       from "../../../components/VisualizerLayout";
import LinkedListVisualizer   from "../../../components/LinkedListVisualizer";
import {
  generateSteps,
  generateRandomList,
  speedToMs,
  PSEUDOCODE,
} from "../../../algorithms/linkedListTraversal";

// Constants
const COMPLEXITY = {
  best:    "O(n)",
  average: "O(n)",
  worst:   "O(n)",
  space:   "O(1)",
  stable:  null,   // not applicable
};

const DEFAULT_SIZE  = 6;
const DEFAULT_SPEED = 3;   // slow default — traversal has only n+2 steps

const STATUS = { IDLE: "idle", RUNNING: "running", PAUSED: "paused", DONE: "done" };

// Component
export default function Traversal() {
  useEffect(() => { document.title = "LL Traversal — Algorithm Visualizer"; }, []);
  // Settings
  const [size,  setSize]  = useState(DEFAULT_SIZE);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  // Linked list data
  const [nodes, setNodes] = useState(() => generateRandomList(DEFAULT_SIZE));

  // Pre-computed traversal steps
  const steps = useMemo(() => generateSteps(nodes), [nodes]);

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

  // Restart interval when speed changes mid-run
  useEffect(() => {
    if (status === STATUS.RUNNING) startTimer();
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, speed]);

  // List size change → regenerate
  useEffect(() => {
    clearTimer();
    setNodes(generateRandomList(size));
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
    setNodes(generateRandomList(size));
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
    currentIdx: null, visited: new Set(), atNull: false,
  };

  // Status message shown inside the canvas
  const statusMsg = (() => {
    if (status === STATUS.IDLE || stepIdx === 0) {
      return { text: "Press ▶ Start to begin traversal", cls: "" };
    }
    if (currentFrame.atNull) {
      return { text: "✅ Reached NULL — traversal complete!", cls: "ll-status--done" };
    }
    if (currentFrame.currentIdx !== null) {
      const node = nodes[currentFrame.currentIdx];
      return {
        text: `Visiting node [${currentFrame.currentIdx}] → value: ${node?.value}`,
        cls: "ll-status--current",
      };
    }
    return { text: "", cls: "" };
  })();

  return (
    <VisualizerLayout
      title="Linked List — Traversal"
      description="Visits each node in sequence by following the next pointer from head to null. O(n) time — unlike arrays, there is no random access by index in a linked list."
      complexity={COMPLEXITY}
      stepIdx={stepIdx}
      totalSteps={Math.max(steps.length - 1, 0)}
      isRunning={status === STATUS.RUNNING}
      speed={speed}
      setSpeed={setSpeed}
      size={size}
      setSize={setSize}
      sizeMin={3}
      sizeMax={10}
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
      doneMessage="✅ Traversal complete — all nodes visited!"
      nextAlgorithm={{ name: "Push & Pop", path: "/stack/push-pop" }}
    >
      <div className="ll-canvas">
        {/* Status message */}
        <p className={`ll-status ${statusMsg.cls}`} aria-live="polite">
          {statusMsg.text}
        </p>

        {/* Linked list visualization */}
        <LinkedListVisualizer
          nodes={nodes}
          currentIdx={currentFrame.currentIdx}
          pointers={currentFrame.pointers || {}}
          visited={currentFrame.visited}
          atNull={currentFrame.atNull}
        />
      </div>
    </VisualizerLayout>
  );
}
