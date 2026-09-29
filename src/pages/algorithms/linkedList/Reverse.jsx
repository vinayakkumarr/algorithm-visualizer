import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LinkedListVisualizer from "../../../components/LinkedListVisualizer";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  createListFromValues,
  generateRandomList,
  getOrderedNodes,
  speedToMs,
} from "../../../algorithms/linkedListEngine.js";
import {
  generateReverseSteps,
  PSEUDOCODE_REVERSE,
} from "../../../algorithms/linkedListReverse.js";

import "../../../components/VisualizerLayout.css";
import "./LinkedListStudio.css";

const INITIAL_PRESET = [10, 20, 30, 40, 50];

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

export default function Reverse() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Reverse Linked List — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.reverseList;

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
    createListFromValues(INITIAL_PRESET)
  );

  // Step Engine State (Pre-computed on committedList)
  const steps = useMemo(() => {
    return generateReverseSteps(committedList);
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
      TAIL: committedList.tailId,
    };
  }, [currentFrame, committedList]);

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
    if (stepIdx < steps.length - 1) {
      setStepIdx((idx) => idx + 1);
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) {
      setStepIdx((idx) => idx - 1);
    }
  };

  const handleJumpStart = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleJumpEnd = () => {
    setIsPlaying(false);
    if (steps.length > 0) {
      setStepIdx(steps.length - 1);
    }
  };

  const handleScrub = (idx) => {
    setIsPlaying(false);
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    setStepIdx(clamped);
  };

  const handleResetAnimation = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleLoadPreset = (values) => {
    setIsPlaying(false);
    setCommittedList(createListFromValues(values));
    setStepIdx(0);
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    setCommittedList(generateRandomList(5));
    setStepIdx(0);
  };

  const activeSize = committedList.size;
  const activeHeadVal = currentFrame?.pointers?.HEAD && currentFrame?.nodes?.[currentFrame.pointers.HEAD]
    ? currentFrame.nodes[currentFrame.pointers.HEAD].value
    : committedList.headId && committedList.nodes[committedList.headId]
    ? committedList.nodes[committedList.headId].value
    : "—";
  const activeTailVal = currentFrame?.pointers?.TAIL && currentFrame?.nodes?.[currentFrame.pointers.TAIL]
    ? currentFrame.nodes[currentFrame.pointers.TAIL].value
    : committedList.tailId && committedList.nodes[committedList.tailId]
    ? committedList.nodes[committedList.tailId].value
    : "—";

  return (
    <div className="ll-studio-page">
      {/* Top bar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Linked List — Reverse List</h1>
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
            In-place iterative list reversal using 3 pointers: <code>prev</code> (reversed portion), <code>curr</code> (active node), and <code>next</code> (unreversed remainder). Reverses directional flow in $O(n)$ time and $O(1)$ auxiliary space.
          </p>

          {/* Telemetry Strip */}
          <div className="ll-info-strip">
            <div className="ll-info-card">
              <span className="ll-info-card__label">List Size</span>
              <span className="ll-info-card__value">{activeSize}</span>
            </div>
            <div className="ll-info-card ll-info-card--accent">
              <span className="ll-info-card__label">Head Node</span>
              <span className="ll-info-card__value">{activeHeadVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">Tail Node</span>
              <span className="ll-info-card__value">{activeTailVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">Aux Space</span>
              <span className="ll-info-card__value">O(1)</span>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="ll-canvas-card">
            <LinkedListVisualizer
              nodes={displayNodes}
              pointers={pointers}
              highlightNodes={currentFrame?.highlightNodes || {}}
              emptyMessage="List is empty (HEAD = NULL). Load a preset below."
            />
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative ||
                "Step through the 3-pointer in-place reversal algorithm using the transport controls above."}
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

          {/* Action Panel */}
          <div className="ll-panel">
            <div className="ll-panel__row">
              <span className="ll-panel__label">Presets:</span>
              <button
                className="ll-btn"
                onClick={() => handleLoadPreset([10, 20, 30])}
                disabled={isPlaying}
              >
                3 Nodes
              </button>
              <button
                className="ll-btn"
                onClick={() => handleLoadPreset([10, 20, 30, 40, 50])}
                disabled={isPlaying}
              >
                5 Nodes
              </button>
              <button
                className="ll-btn"
                onClick={() => handleLoadPreset([1, 2, 3, 4, 5, 6, 7])}
                disabled={isPlaying}
              >
                7 Nodes
              </button>
              <button
                className="ll-btn"
                onClick={handleRandomize}
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
                code={PSEUDOCODE_REVERSE}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Reversal Complexity</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Time Complexity</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Space</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Pointers Used</span>
                  <code className="vl-complexity__value">3 (prev, curr, next)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Passes</span>
                  <code className="vl-complexity__value">1 Single Pass</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
