import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  createInitialHeap,
  generateHeapInsertSteps,
  generateHeapExtractSteps,
  PSEUDOCODE_MIN_HEAP,
} from "../../../algorithms/heapAlgorithms.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./HeapStudio.css";

const PRESET_HEAP = [5, 12, 8, 25, 19, 15, 30];

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

export default function MinHeap() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Binary Min Heap — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.minHeap;

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

  const [heap, setHeap] = useState(() => createInitialHeap(PRESET_HEAP, "min"));
  const [insertVal, setInsertVal] = useState("3");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activePseudocode, setActivePseudocode] = useState(PSEUDOCODE_MIN_HEAP.insert);

  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return null;
  }, [stepIdx, steps]);

  const displayHeap = currentFrame?.heap || heap.map((v, idx) => ({
    index: idx,
    value: v,
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
          const finalHeap = steps[steps.length - 1]?.finalHeap;
          if (finalHeap) setHeap(finalHeap);
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
    const val = Number(insertVal) || Math.floor(Math.random() * 50) + 1;
    const genSteps = generateHeapInsertSteps(heap, val, "min");
    setActivePseudocode(PSEUDOCODE_MIN_HEAP.insert);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
    setInsertVal(String(Math.floor(Math.random() * 40) + 1));
  };

  const handleExtractMin = () => {
    if (isPlaying || heap.length === 0) return;
    const genSteps = generateHeapExtractSteps(heap, "min");
    setActivePseudocode(PSEUDOCODE_MIN_HEAP.extract);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    setHeap(createInitialHeap(PRESET_HEAP, "min"));
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
      if (next === steps.length - 1 && steps[next]?.finalHeap) {
        setHeap(steps[next].finalHeap);
      }
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) setStepIdx((idx) => idx - 1);
  };

  return (
    <div className="heap-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Tree — Binary Min Heap</h1>
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
              <span className="vl__step-idle">{heap.length} Nodes in Heap</span>
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
            Complete Binary Tree where each parent is smaller than or equal to its children (<code>parent ≤ children</code>). Root holds the global minimum in $O(1)$ time with $O(\log n)$ insert and extract.
          </p>

          {/* Telemetry Strip */}
          <div className="heap-info-strip">
            <div className="heap-info-card">
              <span className="heap-info-card__label">Heap Size</span>
              <span className="heap-info-card__value">{heap.length}</span>
            </div>
            <div className="heap-info-card heap-info-card--accent">
              <span className="heap-info-card__label">Root (Min Value)</span>
              <span className="heap-info-card__value">{heap.length > 0 ? heap[0] : "EMPTY"}</span>
            </div>
            <div className="heap-info-card">
              <span className="heap-info-card__label">Tree Height</span>
              <span className="heap-info-card__value">
                {heap.length > 0 ? Math.floor(Math.log2(heap.length)) + 1 : 0}
              </span>
            </div>
            <div className="heap-info-card">
              <span className="heap-info-card__label">Property</span>
              <span className="heap-info-card__value">Parent ≤ Children</span>
            </div>
          </div>

          {/* Visualizer Arena */}
          <div className="heap-canvas-card">
            <h3 className="heap-canvas-title">Complete Binary Tree Nodes &amp; 1D Array Map</h3>
            <div className="heap-nodes-grid">
              {displayHeap.map((item) => (
                <div
                  key={item.index}
                  className={`heap-node ${item.index === 0 ? "heap-node--root" : ""} ${
                    item.isActive ? "heap-node--active" : ""
                  } ${item.isSwap ? "heap-node--swap" : ""}`}
                >
                  <span className="heap-node__idx">idx: [{item.index}]</span>
                  <span className="heap-node__val">{item.value}</span>
                  <div className="heap-node__meta">
                    {item.index > 0 && <span>P: [{Math.floor((item.index - 1) / 2)}]</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Insert a number or extract the minimum root element below."}
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
                    aria-label="Reset Heap"
                    title="Reset Heap"
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
              <form onSubmit={handleInsert} className="heap-op-form">
                <input
                  type="number"
                  value={insertVal}
                  onChange={(e) => setInsertVal(e.target.value)}
                  disabled={isPlaying}
                  className="heap-input"
                  placeholder="Value"
                />
                <button type="submit" className="ll-btn ll-btn--primary" disabled={isPlaying}>
                  📥 Insert
                </button>
              </form>

              <button
                className="ll-btn ll-btn--accent"
                onClick={handleExtractMin}
                disabled={isPlaying || heap.length === 0}
              >
                ⚡ Extract Min (Root)
              </button>

              <button
                className="ll-btn"
                onClick={() => {
                  if (isPlaying) return;
                  const randomized = Array.from({ length: 7 }, () => Math.floor(Math.random() * 60) + 1);
                  setHeap(createInitialHeap(randomized, "min"));
                  setSteps([]);
                  setStepIdx(-1);
                }}
                disabled={isPlaying}
              >
                🎲 Randomize
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
                  <span>Min Heap Big-O</span>
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
                  <span className="vl-complexity__label">Build Heap (Heapify)</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(n)</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
