import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  createPriorityQueue,
  generatePQInsertSteps,
  generatePQExtractMinSteps,
  PSEUDOCODE_PRIORITY_QUEUE,
} from "../../../algorithms/queuePriority.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./PriorityQueue.css";

function LabelledSlider({ label, min, max, value, onChange, leftHint, rightHint }) {
  return (
    <div className="vl-slider">
      <div className="vl-slider__top">
        <span className="vl-slider__label">{label}</span>
        <span className="vl-slider__value">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vl-slider__input"
        aria-label={label}
      />
      {(leftHint || rightHint) && (
        <div className="vl-slider__hints">
          {leftHint && <span>{leftHint}</span>}
          {rightHint && <span>{rightHint}</span>}
        </div>
      )}
    </div>
  );
}

export default function PriorityQueue() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Priority Queue (Binary Min-Heap) — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.priorityQueue;

  const handleTabChange = (mode) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (mode === "theory") next.set("tab", "theory");
        else next.delete("tab");
        return next;
      },
      { replace: true }
    );
  };

  const [pqState, setPqState] = useState(() => createPriorityQueue());
  const [insertVal, setInsertVal] = useState("Task Emergency");
  const [insertPri, setInsertPri] = useState("0");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activePseudocode, setActivePseudocode] = useState(PSEUDOCODE_PRIORITY_QUEUE.insert);

  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return null;
  }, [stepIdx, steps]);

  const displayHeap = currentFrame?.heap || pqState.heap.map((item, idx) => ({
    ...item,
    index: idx,
    isActive: false,
    isSwap: false,
  }));

  // Auto-Playback Effect
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIdx((idx) => {
        const next = idx + 1;
        if (next >= steps.length - 1) {
          setIsPlaying(false);
          const finalState = steps[steps.length - 1]?.finalState;
          if (finalState) setPqState(finalState);
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps, speed]);

  const handleInsert = (e) => {
    if (e) e.preventDefault();
    if (isPlaying) return;
    const val = insertVal.trim() || `Item ${pqState.heap.length + 1}`;
    const pri = Number(insertPri) || 1;
    const genSteps = generatePQInsertSteps(pqState, val, pri);
    setActivePseudocode(PSEUDOCODE_PRIORITY_QUEUE.insert);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
    setInsertVal(`Task ${String.fromCharCode(65 + (pqState.heap.length % 26))}`);
  };

  const handleExtractMin = () => {
    if (isPlaying) return;
    const genSteps = generatePQExtractMinSteps(pqState);
    setActivePseudocode(PSEUDOCODE_PRIORITY_QUEUE.extractMin);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    setPqState(createPriorityQueue());
  };

  const handlePlayPause = () => {
    if (steps.length === 0) return;
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (stepIdx >= steps.length - 1) {
        setStepIdx(0);
      }
      setIsPlaying(true);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (stepIdx < steps.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next === steps.length - 1 && steps[next]?.finalState) {
        setPqState(steps[next].finalState);
      }
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) setStepIdx((idx) => idx - 1);
  };

  const highestPriorityItem = pqState.heap.length > 0 ? pqState.heap[0] : null;

  return (
    <div className="pq-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Queue — Priority Queue (Binary Min-Heap)</h1>
          <div className="vl__mode-nav" role="tablist" aria-label="View mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isTheoryTab}
              className={`vl__mode-btn ${!isTheoryTab ? "vl__mode-btn--active" : ""}`}
              onClick={() => handleTabChange("visualizer")}
            >
              <PlayIcon size={11} />
              <span>Visualizer</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isTheoryTab}
              className={`vl__mode-btn ${isTheoryTab ? "vl__mode-btn--active" : ""}`}
              onClick={() => handleTabChange("theory")}
            >
              <BookOpenIcon size={12} />
              <span>Theory &amp; Notes</span>
            </button>
          </div>
        </div>

        <div className="vl__step-counter" aria-live="polite" aria-atomic="true">
          {!isTheoryTab ? (
            stepIdx >= 0 ? (
              <span className="vl__step-active">
                Step <strong>{stepIdx + 1}</strong> / <strong>{steps.length}</strong>
              </span>
            ) : (
              <span className="vl__step-idle">{pqState.heap.length} Items in Heap</span>
            )
          ) : (
            <span className="vl__theory-badge">
              <BookOpenIcon size={12} />
              <span>Concept Guide</span>
            </span>
          )}
        </div>
      </div>

      {isTheoryTab ? (
        <TheorySection
          data={theoryData}
          onSwitchToVisualizer={() => handleTabChange("visualizer")}
        />
      ) : (
        <>
          <p className="vl__description">
            Maintains elements arranged by priority using a Binary Min-Heap (where lowest number = highest urgency). Offers $O(\log n)$ insertion, $O(\log n)$ extraction of highest priority item, and $O(1)$ peek.
          </p>

          {/* Telemetry Strip */}
          <div className="pq-info-strip">
            <div className="pq-info-card">
              <span className="pq-info-card__label">Heap Size</span>
              <span className="pq-info-card__value">{pqState.heap.length}</span>
            </div>
            <div className="pq-info-card pq-info-card--accent">
              <span className="pq-info-card__label">Highest Priority (Root)</span>
              <span className="pq-info-card__value">
                {highestPriorityItem ? `${highestPriorityItem.value} [pri: ${highestPriorityItem.priority}]` : "EMPTY"}
              </span>
            </div>
            <div className="pq-info-card">
              <span className="pq-info-card__label">Tree Height</span>
              <span className="pq-info-card__value">
                {pqState.heap.length > 0 ? Math.floor(Math.log2(pqState.heap.length)) + 1 : 0}
              </span>
            </div>
            <div className="pq-info-card">
              <span className="pq-info-card__label">Invariant</span>
              <span className="pq-info-card__value">Parent ≤ Children</span>
            </div>
          </div>

          {/* Visualizer Arena */}
          <div className="pq-canvas-card">
            <h3 className="pq-canvas-title">Binary Min-Heap Array &amp; Priority Queue Table</h3>
            {displayHeap.length === 0 ? (
              <div className="pq-empty">Priority Queue is Empty</div>
            ) : (
              <div className="pq-cards-grid">
                {displayHeap.map((item) => (
                  <div
                    key={item.id}
                    className={`pq-node-card ${item.index === 0 ? "pq-node-card--root" : ""} ${
                      item.isActive ? "pq-node-card--active" : ""
                    } ${item.isSwap ? "pq-node-card--swap" : ""}`}
                  >
                    <div className="pq-node-card__top">
                      <span className="pq-node-card__idx">[{item.index}]</span>
                      <span className="pq-node-card__pri">Pri: {item.priority}</span>
                    </div>
                    <span className="pq-node-card__val">{item.value}</span>
                    <div className="pq-node-card__family">
                      {item.index > 0 && <span>P: [{Math.floor((item.index - 1) / 2)}]</span>}
                      {2 * item.index + 1 < displayHeap.length && <span>L: [{2 * item.index + 1}]</span>}
                      {2 * item.index + 2 < displayHeap.length && <span>R: [{2 * item.index + 2}]</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Insert tasks with priorities or extract the top-priority element below."}
            </p>
          </div>

          {/* Transport Controls */}
          <div className="vl__controls" style={{ marginBottom: "1.25rem" }}>
            <div className="vl__controls-body">
              <div className="vl__sliders">
                <LabelledSlider
                  label="Speed"
                  min={1}
                  max={5}
                  value={speed}
                  onChange={setSpeed}
                  leftHint="Slow"
                  rightHint="Fast"
                />
              </div>

              <div className="vl__transport">
                <div className="vl__buttons">
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleStepBackward}
                    disabled={stepIdx <= 0 || steps.length === 0}
                    aria-label="Previous step"
                    title="Previous"
                  >
                    ◀
                  </button>
                  {!isPlaying ? (
                    <button
                      className="vl__btn vl__btn--start"
                      onClick={handlePlayPause}
                      disabled={steps.length === 0}
                      aria-label={stepIdx <= 0 ? "Start" : stepIdx >= steps.length - 1 ? "Replay" : "Resume"}
                    >
                      {stepIdx <= 0 ? "▶ Start" : stepIdx >= steps.length - 1 ? "↺ Replay" : "▶ Resume"}
                    </button>
                  ) : (
                    <button
                      className="vl__btn vl__btn--pause"
                      onClick={handlePlayPause}
                      aria-label="Pause"
                    >
                      ⏸ Pause
                    </button>
                  )}
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleStepForward}
                    disabled={stepIdx >= steps.length - 1 || steps.length === 0}
                    aria-label="Next step"
                    title="Next"
                  >
                    ▶
                  </button>
                  <button
                    className="vl__btn vl__btn--reset"
                    onClick={handleReset}
                    disabled={isPlaying}
                    aria-label="Reset Queue"
                    title="Reset Queue"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Panel */}
          <div className="ll-panel">
            <div className="ll-panel__row">
              <form onSubmit={handleInsert} className="pq-op-form">
                <input
                  type="text"
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  disabled={isPlaying}
                  className="pq-input pq-input--name"
                  placeholder="Task Name"
                />
                <input
                  type="number"
                  value={insertPri}
                  onChange={(e) => setInsertPri(e.target.value)}
                  disabled={isPlaying}
                  className="pq-input pq-input--pri"
                  placeholder="Priority"
                  title="Priority Number (Lower = Higher Urgency)"
                />
                <button
                  type="submit"
                  className="ll-btn ll-btn--primary"
                  disabled={isPlaying || !insertVal.trim()}
                >
                  📥 Insert Task
                </button>
              </form>

              <button
                className="ll-btn ll-btn--accent"
                onClick={handleExtractMin}
                disabled={isPlaying || pqState.heap.length === 0}
              >
                ⚡ Extract Min Priority
              </button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="ll-bottom-grid">
            <div>
              <PseudocodeViewer
                code={activePseudocode}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Priority Queue Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Insert (Sift-Up)</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(log n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Extract Min (Sift-Down)</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(log n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Peek Min</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Space</span>
                  <code className="vl-complexity__value">O(n)</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
