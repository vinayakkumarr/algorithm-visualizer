import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LinkedListVisualizer from "../../../components/LinkedListVisualizer";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  createListFromValues,
  getOrderedNodes,
  speedToMs,
} from "../../../algorithms/linkedListEngine.js";
import {
  createCyclicList,
  generateCycleSteps,
  PSEUDOCODE_CYCLE,
} from "../../../algorithms/linkedListCycle.js";

import "../../../components/VisualizerLayout.css";
import "./LinkedListStudio.css";

const PRESET_CYCLE_MID = [10, 20, 30, 40, 50]; // cycle from 50 -> 20 (index 1)
const PRESET_CYCLE_HEAD = [15, 25, 35, 45];     // cycle from 45 -> 15 (index 0)
const PRESET_NO_CYCLE = [10, 20, 30, 40, 50];   // linear acyclic list

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

export default function DetectCycle() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Detect Cycle (Floyd's Algorithm) — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.detectCycle;

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

  // Core Committed State
  const [committedList, setCommittedList] = useState(() =>
    createCyclicList(PRESET_CYCLE_MID, 1)
  );
  const [activePresetName, setActivePresetName] = useState("cycleMid");

  // Step Engine State (Pre-computed on committedList)
  const steps = useMemo(() => {
    return generateCycleSteps(committedList);
  }, [committedList]);

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  // Current Step Frame
  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return steps[0] || null;
  }, [stepIdx, steps]);

  const displayNodes = useMemo(() => {
    if (currentFrame && currentFrame.orderedNodes) {
      return currentFrame.orderedNodes;
    }
    return getOrderedNodes(committedList);
  }, [currentFrame, committedList]);

  const pointers = useMemo(() => {
    if (currentFrame && currentFrame.pointers) {
      return currentFrame.pointers;
    }
    return {
      HEAD: committedList.headId,
      SLOW: committedList.headId,
      FAST: committedList.headId,
    };
  }, [currentFrame, committedList]);

  const cycleEdge = useMemo(() => {
    if (currentFrame && currentFrame.cycleEdge !== undefined) {
      return currentFrame.cycleEdge;
    }
    // Static cycle calculation for idle display
    return activePresetName !== "noCycle"
      ? { fromId: committedList.tailId, toValue: committedList.nodes[committedList.nodes[committedList.tailId]?.next]?.value }
      : null;
  }, [currentFrame, activePresetName, committedList]);

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
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speed]);

  // Transport Controls
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
    if (stepIdx < steps.length - 1) setStepIdx((idx) => idx + 1);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) setStepIdx((idx) => idx - 1);
  };

  const handleJumpStart = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleJumpEnd = () => {
    setIsPlaying(false);
    if (steps.length > 0) setStepIdx(steps.length - 1);
  };

  const handleScrub = (idx) => {
    setIsPlaying(false);
    setStepIdx(Math.max(0, Math.min(steps.length - 1, idx)));
  };

  const handleResetAnimation = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleSelectPreset = (type) => {
    setIsPlaying(false);
    setActivePresetName(type);
    setStepIdx(0);

    if (type === "cycleMid") {
      setCommittedList(createCyclicList(PRESET_CYCLE_MID, 1));
    } else if (type === "cycleHead") {
      setCommittedList(createCyclicList(PRESET_CYCLE_HEAD, 0));
    } else {
      setCommittedList(createListFromValues(PRESET_NO_CYCLE));
    }
  };

  const activeSlowVal = currentFrame?.pointers?.SLOW
    ? committedList.nodes[currentFrame.pointers.SLOW]?.value ?? "—"
    : committedList.nodes[committedList.headId]?.value ?? "—";

  const activeFastVal = currentFrame?.pointers?.FAST
    ? committedList.nodes[currentFrame.pointers.FAST]?.value ?? "—"
    : committedList.nodes[committedList.headId]?.value ?? "—";

  return (
    <div className="ll-studio-page">
      {/* Top bar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Linked List — Detect Cycle (Floyd&apos;s Algorithm)</h1>
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
            <span className="vl__step-active">
              Step <strong>{stepIdx + 1}</strong> / <strong>{steps.length}</strong>
            </span>
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
            Floyd&apos;s Cycle-Finding Algorithm (Tortoise and Hare) uses two pointers moving at different speeds: <code>slow</code> advances 1 step (1x), <code>fast</code> advances 2 steps (2x). If a cycle exists, collision is mathematically guaranteed in $O(n)$ time and $O(1)$ memory.
          </p>

          {/* Telemetry Info Strip */}
          <div className="ll-info-strip">
            <div className="ll-info-card">
              <span className="ll-info-card__label">List Nodes</span>
              <span className="ll-info-card__value">{displayNodes.length}</span>
            </div>
            <div className="ll-info-card ll-info-card--green">
              <span className="ll-info-card__label">Slow Pointer 🐢</span>
              <span className="ll-info-card__value">{activeSlowVal}</span>
            </div>
            <div className="ll-info-card ll-info-card--amber">
              <span className="ll-info-card__label">Fast Pointer 🐇</span>
              <span className="ll-info-card__value">{activeFastVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">Cycle Status</span>
              <span className="ll-info-card__value">
                {currentFrame?.isTerminal
                  ? currentFrame.hasCycle
                    ? "🔴 Loop Detected"
                    : "🟢 Acyclic (NULL)"
                  : activePresetName !== "noCycle"
                  ? "⚠️ Cyclic Graph"
                  : "Linear"}
              </span>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="ll-canvas-card">
            <LinkedListVisualizer
              nodes={displayNodes}
              pointers={pointers}
              highlightNodes={currentFrame?.highlightNodes || {}}
              cycleEdge={cycleEdge}
              emptyMessage="List is empty."
            />
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${
              currentFrame?.isTerminal
                ? currentFrame.hasCycle
                  ? "ll-narrator--error"
                  : "ll-narrator--done"
                : ""
            }`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative ||
                "Step through Floyd's Tortoise and Hare cycle detection algorithm using the transport controls above."}
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
                <div className="vl__scrubber-row">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(steps.length - 1, 1)}
                    value={stepIdx}
                    onChange={(e) => handleScrub(Number(e.target.value))}
                    className="vl__scrubber"
                    aria-label="Step timeline"
                    disabled={steps.length <= 1}
                  />
                </div>

                <div className="vl__buttons">
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleJumpStart}
                    disabled={stepIdx <= 0 || steps.length === 0}
                    aria-label="First step"
                    title="First"
                  >
                    ⏮
                  </button>
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
                    className="vl__btn vl__btn--nav"
                    onClick={handleJumpEnd}
                    disabled={stepIdx >= steps.length - 1 || steps.length === 0}
                    aria-label="Last step"
                    title="Last"
                  >
                    ⏭
                  </button>
                  <button
                    className="vl__btn vl__btn--reset"
                    onClick={handleResetAnimation}
                    disabled={stepIdx === 0 && !isPlaying}
                    aria-label="Reset Animation"
                    title="Reset Animation"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preset & Scenario Panel */}
          <div className="ll-panel">
            <div className="ll-panel__row">
              <span className="ll-panel__label">Presets / Scenarios:</span>
              <button
                className={`ll-btn ${activePresetName === "cycleMid" ? "ll-btn--primary" : ""}`}
                onClick={() => handleSelectPreset("cycleMid")}
                disabled={isPlaying}
              >
                Loop to Node [20]
              </button>
              <button
                className={`ll-btn ${activePresetName === "cycleHead" ? "ll-btn--primary" : ""}`}
                onClick={() => handleSelectPreset("cycleHead")}
                disabled={isPlaying}
              >
                Loop to Head [15]
              </button>
              <button
                className={`ll-btn ${activePresetName === "noCycle" ? "ll-btn--primary" : ""}`}
                onClick={() => handleSelectPreset("noCycle")}
                disabled={isPlaying}
              >
                No Cycle (Acyclic)
              </button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="ll-bottom-grid">
            <div>
              <PseudocodeViewer
                code={PSEUDOCODE_CYCLE}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Floyd&apos;s Algorithm Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Time Complexity</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Memory</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Slow Speed</span>
                  <code className="vl-complexity__value">1 node / iteration</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Fast Speed</span>
                  <code className="vl-complexity__value">2 nodes / iteration</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
