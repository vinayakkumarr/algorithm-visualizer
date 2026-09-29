import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import VisualizerLayout from "../../../components/VisualizerLayout";
import GraphVisualizer  from "../../../components/GraphVisualizer";
import GraphDataStructureHUD from "../../../components/GraphDataStructureHUD";
import { GRAPH, generateSteps, speedToMs, PSEUDOCODE } from "../../../algorithms/dfs";

// Constants
const COMPLEXITY = {
  best:    "O(V + E)",
  average: "O(V + E)",
  worst:   "O(V + E)",
  space:   "O(V)",
  stable:  null,
};

const DEFAULT_START = 0;
const DEFAULT_SPEED = 3;
const STATUS = { IDLE: "idle", RUNNING: "running", PAUSED: "paused", DONE: "done" };

// Custom legend for graph traversal
const GRAPH_LEGEND = (
  <div className="graph-legend" style={{ margin: "0.25rem auto 0" }}>
    {[
      { cls: "default", label: "Unvisited"           },
      { cls: "pending", label: "On Stack"             },
      { cls: "current", label: "Currently Processing" },
      { cls: "visited", label: "Visited"              },
    ].map(({ cls, label }) => (
      <div key={cls} className="graph-legend__item">
        <div className={`graph-legend__dot graph-legend__dot--${cls}`} aria-hidden="true" />
        <span>{label}</span>
      </div>
    ))}
  </div>
);

// Component
export default function DFS() {
  useEffect(() => { document.title = "DFS — Algorithm Visualizer"; }, []);
  const [startNode, setStartNode] = useState(DEFAULT_START);
  const [speed,     setSpeed]     = useState(DEFAULT_SPEED);

  const steps = useMemo(() => generateSteps(GRAPH, startNode), [startNode]);

  const [stepIdx, setStepIdx] = useState(0);
  const [status,  setStatus]  = useState(STATUS.IDLE);

  const timerRef = useRef(null);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

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

  useEffect(() => {
    if (status === STATUS.RUNNING) startTimer();
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, speed]);

  useEffect(() => {
    clearTimer();
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [startNode, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

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
    setStepIdx(0);
    setStatus(STATUS.IDLE);
  }, [clearTimer]);

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

  // Derived
  const frame = steps[stepIdx] ?? { visited: new Set(), stack: [], current: null };
  const pending = new Set(frame.stack);
  const visitedOrder = [...frame.visited];

  const doneMessage =
    frame.visited.size === Object.keys(GRAPH).length
      ? `✅ DFS complete — visited all ${frame.visited.size} nodes!`
      : "✅ DFS complete — some nodes unreachable from start";

  return (
    <VisualizerLayout
      title="Graph — DFS"
      description="Explores as far as possible down each branch before backtracking. Uses a stack — useful for detecting cycles, topological sorting, and exploring all reachable nodes in a graph."
      nextAlgorithm={{ name: "Bubble Sort", path: "/sorting/bubble" }}
      complexity={COMPLEXITY}
      stepIdx={stepIdx}
      totalSteps={Math.max(steps.length - 1, 0)}
      isRunning={status === STATUS.RUNNING}
      speed={speed}
      setSpeed={setSpeed}
      onStart={handleStart}
      onPause={handlePause}
      onReset={handleReset}
      onStepBack={handleStepBack}
      onStepForward={handleStepForward}
      onJumpStart={handleJumpStart}
      onJumpEnd={handleJumpEnd}
      onScrub={handleScrub}
      pseudocode={PSEUDOCODE}
      activeLine={frame.activeLine ?? -1}
      narrative={frame.narrative ?? ""}
      doneMessage={doneMessage}
      customLegend={GRAPH_LEGEND}
    >
      <div className="graph-canvas">

        {/* Start node selector */}
        <div className="gv-start-row">
          <span className="gv-start-label">Start Node</span>
          {Object.keys(GRAPH).map(n => (
            <button
              key={n}
              className={`gv-start-btn ${Number(n) === startNode ? "gv-start-btn--active" : ""}`}
              onClick={() => { if (status !== STATUS.RUNNING) setStartNode(Number(n)); }}
              disabled={status === STATUS.RUNNING}
              aria-label={`Start DFS from node ${n}`}
            >
              {n}
            </button>
          ))}
        </div>

        {/* Graph */}
        <GraphVisualizer
          visited={frame.visited}
          pending={pending}
          current={frame.current}
        />

        {/* Data Structure Pipeline & Visited Sequence */}
        <GraphDataStructureHUD
          type="stack"
          items={frame.stack}
          visitedOrder={visitedOrder}
          totalNodes={Object.keys(GRAPH).length}
        />

      </div>
    </VisualizerLayout>
  );
}
