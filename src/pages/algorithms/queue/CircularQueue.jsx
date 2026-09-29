import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  createCircularQueue,
  generateEnqueueSteps,
  generateDequeueSteps,
  PSEUDOCODE_CIRCULAR_QUEUE,
} from "../../../algorithms/queueCircular.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./CircularQueue.css";

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

export default function CircularQueue() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Circular Queue — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.circularQueue;

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

  const [qState, setQState] = useState(() => createCircularQueue(6, [10, 20, 30]));
  const [enqueueVal, setEnqueueVal] = useState("40");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activePseudocode, setActivePseudocode] = useState(PSEUDOCODE_CIRCULAR_QUEUE.enqueue);

  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return null;
  }, [stepIdx, steps]);

  const displayBuffer = currentFrame?.buffer || qState.buffer.map((val, idx) => ({
    index: idx,
    value: val,
    isOccupied: val !== null,
    isFront: qState.count > 0 && idx === qState.front,
    isRear: qState.count > 0 && idx === qState.rear,
    isActive: false,
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
          if (finalState) setQState(finalState);
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps, speed]);

  const handleEnqueue = (e) => {
    if (e) e.preventDefault();
    if (isPlaying) return;
    const val = Number(enqueueVal) || Math.floor(Math.random() * 90) + 10;
    const genSteps = generateEnqueueSteps(qState, val);
    setActivePseudocode(PSEUDOCODE_CIRCULAR_QUEUE.enqueue);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
    setEnqueueVal(String(val + 10));
  };

  const handleDequeue = () => {
    if (isPlaying) return;
    const genSteps = generateDequeueSteps(qState);
    setActivePseudocode(PSEUDOCODE_CIRCULAR_QUEUE.dequeue);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    setQState(createCircularQueue(6, [10, 20, 30]));
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
        setQState(steps[next].finalState);
      }
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) setStepIdx((idx) => idx - 1);
  };

  const activeCount = currentFrame ? currentFrame.count : qState.count;
  const activeCap = currentFrame ? currentFrame.capacity : qState.capacity;
  const activeFront = currentFrame ? currentFrame.front : qState.front;
  const activeRear = currentFrame ? currentFrame.rear : qState.rear;

  return (
    <div className="cq-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Queue — Circular Queue (Ring Buffer)</h1>
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
              <span className="vl__step-idle">{activeCount} / {activeCap} Slots</span>
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
            Circular Ring Buffer utilizing modulo arithmetic <code>(index + 1) % capacity</code> to reuse memory continuously in $O(1)$ time for both Enqueue and Dequeue without array shifting.
          </p>

          {/* Telemetry Strip */}
          <div className="cq-info-strip">
            <div className="cq-info-card">
              <span className="cq-info-card__label">Ring Capacity</span>
              <span className="cq-info-card__value">{activeCap}</span>
            </div>
            <div className="cq-info-card">
              <span className="cq-info-card__label">Occupied Count</span>
              <span className="cq-info-card__value">{activeCount}</span>
            </div>
            <div className="cq-info-card cq-info-card--green">
              <span className="cq-info-card__label">FRONT Pointer</span>
              <span className="cq-info-card__value">slot [{activeFront}]</span>
            </div>
            <div className="cq-info-card cq-info-card--amber">
              <span className="cq-info-card__label">REAR Pointer</span>
              <span className="cq-info-card__value">slot [{activeRear}]</span>
            </div>
          </div>

          {/* Visualizer Arena */}
          <div className="cq-canvas-card">
            <h3 className="cq-canvas-title">Circular Memory Buffer Array</h3>
            <div className="cq-ring-slots">
              {displayBuffer.map((slot) => (
                <div
                  key={slot.index}
                  className={`cq-slot ${slot.isOccupied ? "cq-slot--occupied" : ""} ${
                    slot.isActive ? "cq-slot--active" : ""
                  }`}
                >
                  <div className="cq-slot__badges">
                    {slot.isFront && <span className="cq-badge cq-badge--front">FRONT</span>}
                    {slot.isRear && <span className="cq-badge cq-badge--rear">REAR</span>}
                  </div>
                  <span className="cq-slot__val">
                    {slot.isOccupied ? slot.value : <span className="cq-slot__null">NULL</span>}
                  </span>
                  <span className="cq-slot__idx">[{slot.index}]</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${
              currentFrame?.isTerminal
                ? currentFrame.error
                  ? "ll-narrator--error"
                  : "ll-narrator--done"
                : ""
            }`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Use the Enqueue and Dequeue operations below to observe modulo index wrap-around."}
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
              <form onSubmit={handleEnqueue} className="cq-op-form">
                <input
                  type="number"
                  value={enqueueVal}
                  onChange={(e) => setEnqueueVal(e.target.value)}
                  disabled={isPlaying || activeCount >= activeCap}
                  className="cq-input"
                  placeholder="Value"
                />
                <button
                  type="submit"
                  className="ll-btn ll-btn--primary"
                  disabled={isPlaying || activeCount >= activeCap}
                >
                  📥 Enqueue
                </button>
              </form>

              <button
                className="ll-btn"
                onClick={handleDequeue}
                disabled={isPlaying || activeCount === 0}
              >
                📤 Dequeue
              </button>

              <button
                className="ll-btn"
                onClick={() => {
                  if (isPlaying) return;
                  setQState(createCircularQueue(6, [5, 15, 25, 35, 45]));
                  setSteps([]);
                  setStepIdx(-1);
                }}
                disabled={isPlaying}
              >
                Fill Near-Capacity
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
                  <span>Circular Queue Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Enqueue Time</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Dequeue Time</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Space</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(N) Fixed</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Index Formula</span>
                  <code className="vl-complexity__value">(idx + 1) % N</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
