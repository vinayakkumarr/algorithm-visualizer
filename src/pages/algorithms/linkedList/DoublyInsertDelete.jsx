import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import DoublyLinkedListVisualizer from "../../../components/DoublyLinkedListVisualizer";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  createDoublyListFromValues,
  getOrderedDoublyNodes,
} from "../../../algorithms/doublyLinkedListEngine.js";
import {
  generateDoublyInsertHeadSteps,
  generateDoublyInsertTailSteps,
  generateDoublyDeleteHeadSteps,
  generateDoublyDeleteTailSteps,
  PSEUDOCODE_DOUBLY,
} from "../../../algorithms/doublyOperations.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./LinkedListStudio.css";

const INITIAL_PRESET = [10, 20, 30, 40];

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

export default function DoublyInsertDelete() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Doubly Linked List Insertion & Deletion — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.doublyInsertDelete;

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

  const [committedList, setCommittedList] = useState(() =>
    createDoublyListFromValues(INITIAL_PRESET)
  );

  const [inputVal, setInputVal] = useState("99");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const [activePseudocode, setActivePseudocode] = useState(PSEUDOCODE_DOUBLY.insertHead);

  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return null;
  }, [stepIdx, steps]);

  const displayNodes = useMemo(() => {
    if (currentFrame && currentFrame.orderedNodes) {
      return currentFrame.orderedNodes;
    }
    return getOrderedDoublyNodes(committedList);
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
          const finalState = steps[steps.length - 1]?.finalList;
          if (finalState) setCommittedList(finalState);
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps, speed]);

  const handleInsertHead = () => {
    if (isPlaying) return;
    const val = Number(inputVal) || Math.floor(Math.random() * 90) + 10;
    const genSteps = generateDoublyInsertHeadSteps(committedList, val);
    setActivePseudocode(PSEUDOCODE_DOUBLY.insertHead);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleInsertTail = () => {
    if (isPlaying) return;
    const val = Number(inputVal) || Math.floor(Math.random() * 90) + 10;
    const genSteps = generateDoublyInsertTailSteps(committedList, val);
    setActivePseudocode(PSEUDOCODE_DOUBLY.insertTail);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleDeleteHead = () => {
    if (isPlaying || committedList.size === 0) return;
    const genSteps = generateDoublyDeleteHeadSteps(committedList);
    setActivePseudocode(PSEUDOCODE_DOUBLY.deleteHead);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleDeleteTail = () => {
    if (isPlaying || committedList.size === 0) return;
    const genSteps = generateDoublyDeleteTailSteps(committedList);
    setActivePseudocode(PSEUDOCODE_DOUBLY.deleteTail);
    setSteps(genSteps);
    setStepIdx(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    setCommittedList(createDoublyListFromValues(INITIAL_PRESET));
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
      if (next === steps.length - 1 && steps[next]?.finalList) {
        setCommittedList(steps[next].finalList);
      }
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) setStepIdx((idx) => idx - 1);
  };

  const activeSize = currentFrame ? currentFrame.orderedNodes.length : committedList.size;
  const activeHeadVal = committedList.headId && committedList.nodes[committedList.headId]
    ? committedList.nodes[committedList.headId].value
    : "—";
  const activeTailVal = committedList.tailId && committedList.nodes[committedList.tailId]
    ? committedList.nodes[committedList.tailId].value
    : "—";

  return (
    <div className="ll-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Doubly Linked List — Insertion &amp; Deletion</h1>
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
              <span className="vl__step-idle">{activeSize} Nodes</span>
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
            Doubly Linked List nodes feature bidirectional pointers (<code>prev</code> ⇦ and ⇨ <code>next</code>), enabling symmetric $O(1)$ operations at both HEAD and TAIL without full list traversal.
          </p>

          {/* Telemetry Strip */}
          <div className="ll-info-strip">
            <div className="ll-info-card">
              <span className="ll-info-card__label">List Size</span>
              <span className="ll-info-card__value">{activeSize}</span>
            </div>
            <div className="ll-info-card ll-info-card--accent">
              <span className="ll-info-card__label">HEAD Node</span>
              <span className="ll-info-card__value">{activeHeadVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">TAIL Node</span>
              <span className="ll-info-card__value">{activeTailVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">Pointers Per Node</span>
              <span className="ll-info-card__value">2 (prev, next)</span>
            </div>
          </div>

          {/* Canvas */}
          <div className="ll-canvas-card">
            <DoublyLinkedListVisualizer
              nodes={displayNodes}
              pointers={pointers}
              highlightNodes={currentFrame?.highlightNodes || {}}
              shelfNode={currentFrame?.shelfNode || null}
            />
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Choose an operation below to observe bidirectional pointer reassignment."}
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
                    aria-label="Reset List"
                    title="Reset List"
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
              <input
                type="number"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={isPlaying}
                className="ll-input"
                style={{ width: "70px" }}
                placeholder="Val"
              />
              <button
                className="ll-btn ll-btn--primary"
                onClick={handleInsertHead}
                disabled={isPlaying}
              >
                + Insert Head
              </button>
              <button
                className="ll-btn ll-btn--primary"
                onClick={handleInsertTail}
                disabled={isPlaying}
              >
                + Insert Tail
              </button>
              <button
                className="ll-btn"
                onClick={handleDeleteHead}
                disabled={isPlaying || committedList.size === 0}
              >
                - Delete Head
              </button>
              <button
                className="ll-btn"
                onClick={handleDeleteTail}
                disabled={isPlaying || committedList.size === 0}
              >
                - Delete Tail
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
                  <span>Doubly Linked List Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Insert / Delete Head</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Insert / Delete Tail</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Access / Search by Index</span>
                  <code className="vl-complexity__value">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Space</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
