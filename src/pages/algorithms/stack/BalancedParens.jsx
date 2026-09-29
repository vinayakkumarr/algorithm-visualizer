import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  generateBalancedParensSteps,
  PSEUDOCODE_BALANCED_PARENS,
} from "../../../algorithms/stackBalancedParens.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./BalancedParens.css";

const PRESETS = [
  { label: "Valid Multi-Type: {[()]}", value: "{[()]}" },
  { label: "Valid Nested: (({[]}))", value: "(({[]}))" },
  { label: "Mismatched: (]", value: "(]" },
  { label: "Unclosed: {[(])}", value: "{[(])}" },
  { label: "Underflow: ())", value: "())" },
  { label: "Leftovers: ((()", value: "((()" },
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

export default function BalancedParens() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Balanced Parentheses — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.balancedParens;

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

  const [inputExpression, setInputExpression] = useState("{[()]}");
  const [customText, setCustomText] = useState("");

  const steps = useMemo(() => {
    return generateBalancedParensSteps(inputExpression);
  }, [inputExpression]);

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
    setInputExpression(val);
    setStepIdx(0);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setIsPlaying(false);
    setInputExpression(customText.trim());
    setStepIdx(0);
    setCustomText("");
  };

  const tape = currentFrame?.tape || [];
  const stack = currentFrame?.stack || [];

  return (
    <div className="bp-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Stack — Balanced Parentheses</h1>
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
            Determines whether bracket characters <code>( )</code>, <code>&#123; &#125;</code>, and <code>[ ]</code> are correctly matched and closed in LIFO order using an auxiliary Stack in $O(n)$ time and $O(n)$ space.
          </p>

          {/* Telemetry Strip */}
          <div className="bp-info-strip">
            <div className="bp-info-card">
              <span className="bp-info-card__label">Expression Length</span>
              <span className="bp-info-card__value">{inputExpression.length}</span>
            </div>
            <div className="bp-info-card">
              <span className="bp-info-card__label">Stack Depth</span>
              <span className="bp-info-card__value">{stack.length}</span>
            </div>
            <div className="bp-info-card bp-info-card--accent">
              <span className="bp-info-card__label">Stack Top</span>
              <span className="bp-info-card__value">
                {stack.length > 0 ? stack[stack.length - 1].char : "EMPTY"}
              </span>
            </div>
            <div className="bp-info-card">
              <span className="bp-info-card__label">Status</span>
              <span className="bp-info-card__value">
                {currentFrame?.isTerminal
                  ? currentFrame.isValid
                    ? "🟢 Balanced"
                    : "🔴 Invalid"
                  : "🟡 Evaluating"}
              </span>
            </div>
          </div>

          {/* Visualizer Arena */}
          <div className="bp-arena">
            {/* Expression String Tape */}
            <div className="bp-tape-section">
              <h3 className="bp-section-title">Character Tape</h3>
              <div className="bp-tape">
                {tape.map((cell) => (
                  <div
                    key={cell.index}
                    className={`bp-tape__cell bp-tape__cell--${cell.status} ${
                      cell.isCurrent ? "bp-tape__cell--current" : ""
                    }`}
                  >
                    <span className="bp-tape__index">{cell.index}</span>
                    <span className="bp-tape__char">{cell.char}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Visualizer */}
            <div className="bp-stack-section">
              <h3 className="bp-section-title">LIFO Memory Stack</h3>
              <div className="bp-stack-container">
                <div className="bp-stack-top-indicator">
                  <span>TOP</span>
                  <span className="bp-arrow-down">↓</span>
                </div>
                <div className="bp-stack-well">
                  {stack.length === 0 ? (
                    <div className="bp-stack-empty">Stack Empty</div>
                  ) : (
                    <div className="bp-stack-items">
                      {[...stack].reverse().map((item, revIdx) => (
                        <div
                          key={item.id}
                          className={`bp-stack-item ${
                            revIdx === 0 ? "bp-stack-item--top" : ""
                          }`}
                        >
                          <span className="bp-stack-item__char">{item.char}</span>
                          <span className="bp-stack-item__meta">i={item.index}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="bp-stack-base">Stack Base</div>
              </div>
            </div>
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${
              currentFrame?.isTerminal
                ? currentFrame.isValid
                  ? "ll-narrator--done"
                  : "ll-narrator--error"
                : ""
            }`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Step through bracket validation using the controls below."}
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

          {/* Preset & Custom Input Panel */}
          <div className="ll-panel">
            <div className="ll-panel__row">
              <span className="ll-panel__label">Presets:</span>
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  className={`ll-btn ${inputExpression === p.value ? "ll-btn--primary" : ""}`}
                  onClick={() => handleSelectPreset(p.value)}
                  disabled={isPlaying}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleApplyCustom} className="bp-custom-form" style={{ marginTop: "0.75rem" }}>
              <span className="ll-panel__label">Custom Expression:</span>
              <input
                type="text"
                placeholder="e.g. {[(a+b)*c]}"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                disabled={isPlaying}
                className="bp-input"
              />
              <button
                type="submit"
                className="ll-btn ll-btn--primary"
                disabled={isPlaying || !customText.trim()}
              >
                Validate Custom
              </button>
            </form>
          </div>

          {/* Bottom Grid */}
          <div className="ll-bottom-grid">
            <div>
              <PseudocodeViewer
                code={PSEUDOCODE_BALANCED_PARENS}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Balanced Parentheses Big-O</span>
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
                  <span className="vl-complexity__label">Stack Operations</span>
                  <code className="vl-complexity__value">Push, Pop, Peek O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Scan Direction</span>
                  <code className="vl-complexity__value">Left to Right (1 pass)</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
