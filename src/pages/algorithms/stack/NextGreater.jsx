import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  generateNextGreaterSteps,
  PSEUDOCODE_NEXT_GREATER,
} from "../../../algorithms/stackNextGreater.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./NextGreater.css";

const PRESETS = [
  { label: "Mixed: [4, 5, 2, 25, 7, 18]", value: [4, 5, 2, 25, 7, 18] },
  { label: "Ascending: [1, 2, 3, 4, 5]", value: [1, 2, 3, 4, 5] },
  { label: "Descending: [5, 4, 3, 2, 1]", value: [5, 4, 3, 2, 1] },
  { label: "Valley: [13, 7, 6, 12]", value: [13, 7, 6, 12] },
];

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

export default function NextGreater() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Next Greater Element — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.nextGreaterElement;

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

  const [inputArray, setInputArray] = useState([4, 5, 2, 25, 7, 18]);

  const steps = useMemo(() => {
    return generateNextGreaterSteps(inputArray);
  }, [inputArray]);

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return steps[0] || null;
  }, [stepIdx, steps]);

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

  const handleSelectPreset = (val) => {
    setIsPlaying(false);
    setInputArray(val);
    setStepIdx(0);
  };

  const handleRandomize = () => {
    setIsPlaying(false);
    const count = 6;
    const randomized = Array.from({ length: count }, () => Math.floor(Math.random() * 50) + 1);
    setInputArray(randomized);
    setStepIdx(0);
  };

  const array = currentFrame?.array || [];
  const result = currentFrame?.result || [];
  const stack = currentFrame?.stack || [];

  return (
    <div className="nge-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Stack — Next Greater Element</h1>
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
            Scans an array right-to-left using a monotonic decreasing stack to resolve the Next Greater Element (NGE) for every item in optimal $O(n)$ time and $O(n)$ auxiliary space.
          </p>

          {/* Telemetry Strip */}
          <div className="nge-info-strip">
            <div className="nge-info-card">
              <span className="nge-info-card__label">Array Size</span>
              <span className="nge-info-card__value">{inputArray.length}</span>
            </div>
            <div className="nge-info-card">
              <span className="nge-info-card__label">Scanning Index</span>
              <span className="nge-info-card__value">
                {currentFrame?.currentIndex >= 0 ? `i = ${currentFrame.currentIndex}` : "—"}
              </span>
            </div>
            <div className="nge-info-card nge-info-card--accent">
              <span className="nge-info-card__label">Monotonic Stack Top</span>
              <span className="nge-info-card__value">
                {stack.length > 0 ? stack[stack.length - 1].val : "EMPTY"}
              </span>
            </div>
            <div className="nge-info-card">
              <span className="nge-info-card__label">Resolved Count</span>
              <span className="nge-info-card__value">
                {result.filter((r) => r !== null).length} / {inputArray.length}
              </span>
            </div>
          </div>

          {/* Visualizer Arena */}
          <div className="nge-arena">
            {/* Input Array & NGE Output Table */}
            <div className="nge-main-col">
              <div className="nge-array-block">
                <h3 className="nge-section-title">Input Array A &amp; NGE Answers</h3>
                <div className="nge-grid">
                  {array.map((cell) => (
                    <div
                      key={cell.index}
                      className={`nge-cell ${cell.isCurrent ? "nge-cell--current" : ""} ${
                        cell.isResolved ? "nge-cell--resolved" : ""
                      }`}
                    >
                      <span className="nge-cell__idx">idx: {cell.index}</span>
                      <span className="nge-cell__val">{cell.val}</span>
                      <div className="nge-cell__ans">
                        <span className="nge-cell__ans-label">NGE:</span>
                        <span className="nge-cell__ans-val">
                          {cell.nge !== null ? cell.nge : "—"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monotonic Stack */}
            <div className="nge-stack-col">
              <h3 className="nge-section-title">Monotonic Stack</h3>
              <div className="nge-stack-well">
                {stack.length === 0 ? (
                  <div className="nge-stack-empty">Stack Empty</div>
                ) : (
                  <div className="nge-stack-items">
                    {[...stack].reverse().map((item, revIdx) => (
                      <div
                        key={item.id}
                        className={`nge-stack-item ${revIdx === 0 ? "nge-stack-item--top" : ""}`}
                      >
                        <span className="nge-stack-item__val">{item.val}</span>
                        <span className="nge-stack-item__idx">i={item.index}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="nge-stack-base">Stack Base</div>
            </div>
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Step through Next Greater Element computation using the controls below."}
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

          {/* Preset & Configuration Panel */}
          <div className="ll-panel">
            <div className="ll-panel__row">
              <span className="ll-panel__label">Presets:</span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  className="ll-btn"
                  onClick={() => handleSelectPreset(p.value)}
                  disabled={isPlaying}
                >
                  {p.label}
                </button>
              ))}
              <button className="ll-btn" onClick={handleRandomize} disabled={isPlaying}>
                🎲 Randomize
              </button>
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="ll-bottom-grid">
            <div>
              <PseudocodeViewer
                code={PSEUDOCODE_NEXT_GREATER}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Monotonic Stack Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Time Complexity</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Space</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Stack Invariant</span>
                  <code className="vl-complexity__value">Monotonically Decreasing</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Max Push/Pops</span>
                  <code className="vl-complexity__value">2n Total Ops</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
