import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import LinkedListVisualizer from "../../../components/LinkedListVisualizer";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import {
  PlayIcon,
  BookOpenIcon,
  PlusIcon,
  TrashIcon,
  FolderIcon,
} from "../../../components/Icons";
import {
  createListFromValues,
  cloneList,
  getOrderedNodes,
  validateInvariants,
  speedToMs,
} from "../../../algorithms/linkedListEngine";
import {
  generateInsertHeadSteps,
  generateInsertTailSteps,
  generateInsertPositionSteps,
  generateDeleteHeadSteps,
  generateDeleteTailSteps,
  generateDeleteValueSteps,
  PSEUDOCODE_INSERT_HEAD,
} from "../../../algorithms/singlyOperations";

import "../../../components/VisualizerLayout.css";
import "./LinkedListStudio.css";

const MAX_SIZE = 10;
const INITIAL_PRESET = [12, 99, 37, 45];

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

export default function SinglyInsertDelete() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Singly Linked List (Insert & Delete) — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.singlyInsertDelete;

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

  // Core Committed List State
  const [committedList, setCommittedList] = useState(() =>
    createListFromValues(INITIAL_PRESET)
  );

  // Operation Mode Tabs
  const [activeTab, setActiveTab] = useState("insert"); // "insert" | "delete" | "presets"

  // Input Fields
  const [insertVal, setInsertVal] = useState("50");
  const [insertPos, setInsertPos] = useState("1");
  const [deleteVal, setDeleteVal] = useState("37");
  const [errorMsg, setErrorMsg] = useState("");

  // Step Engine State
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const pendingListRef = useRef(null);

  // Flash Error Helper
  const showError = useCallback((msg) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3500);
  }, []);

  // Current Step Frame
  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return null;
  }, [stepIdx, steps]);

  // Derived display nodes & pointers
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
        if (next >= steps.length - 1 && pendingListRef.current) {
          setCommittedList(pendingListRef.current);
          pendingListRef.current = null;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps, speed]);

  // Execute Operation Pipeline
  const startOperation = useCallback((generatedSteps) => {
    if (!generatedSteps || generatedSteps.length === 0) return;
    const finalStep = generatedSteps[generatedSteps.length - 1];
    pendingListRef.current = finalStep.finalList || null;
    setSteps(generatedSteps);
    setStepIdx(0);
    setIsPlaying(true);
  }, []);

  // Operation Handlers
  const handleInsertHead = () => {
    if (isPlaying) return;
    const val = Number(insertVal);
    if (isNaN(val)) return showError("Please enter a valid numeric value.");
    if (committedList.size >= MAX_SIZE) {
      return showError(`Visualization capacity limit (${MAX_SIZE} nodes) reached.`);
    }
    const gen = generateInsertHeadSteps(committedList, val);
    startOperation(gen);
  };

  const handleInsertTail = () => {
    if (isPlaying) return;
    const val = Number(insertVal);
    if (isNaN(val)) return showError("Please enter a valid numeric value.");
    if (committedList.size >= MAX_SIZE) {
      return showError(`Visualization capacity limit (${MAX_SIZE} nodes) reached.`);
    }
    const gen = generateInsertTailSteps(committedList, val);
    startOperation(gen);
  };

  const handleInsertPosition = () => {
    if (isPlaying) return;
    const val = Number(insertVal);
    const pos = Number(insertPos);
    if (isNaN(val)) return showError("Please enter a valid numeric value.");
    if (isNaN(pos) || pos < 0 || pos > committedList.size) {
      return showError(`Position out of bounds (valid range: 0 to ${committedList.size}).`);
    }
    if (committedList.size >= MAX_SIZE) {
      return showError(`Visualization capacity limit (${MAX_SIZE} nodes) reached.`);
    }
    const gen = generateInsertPositionSteps(committedList, pos, val);
    startOperation(gen);
  };

  const handleDeleteHead = () => {
    if (isPlaying) return;
    if (committedList.size === 0) return showError("Cannot delete from an empty list (Underflow).");
    const gen = generateDeleteHeadSteps(committedList);
    startOperation(gen);
  };

  const handleDeleteTail = () => {
    if (isPlaying) return;
    if (committedList.size === 0) return showError("Cannot delete from an empty list (Underflow).");
    const gen = generateDeleteTailSteps(committedList);
    startOperation(gen);
  };

  const handleDeleteValue = () => {
    if (isPlaying) return;
    if (committedList.size === 0) return showError("Cannot delete from an empty list.");
    const val = Number(deleteVal);
    if (isNaN(val)) return showError("Please enter a valid numeric value.");
    const gen = generateDeleteValueSteps(committedList, val);
    startOperation(gen);
  };

  // Transport Controls
  const handlePlayPause = () => {
    if (steps.length === 0) return;
    if (stepIdx >= steps.length - 1) {
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (stepIdx < steps.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= steps.length - 1 && pendingListRef.current) {
        setCommittedList(pendingListRef.current);
        pendingListRef.current = null;
      }
    }
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
    if (steps.length > 0) {
      setStepIdx(steps.length - 1);
      if (pendingListRef.current) {
        setCommittedList(pendingListRef.current);
        pendingListRef.current = null;
      }
    }
  };

  const handleScrub = (idx) => {
    setIsPlaying(false);
    const clamped = Math.max(0, Math.min(steps.length - 1, idx));
    setStepIdx(clamped);
    if (clamped >= steps.length - 1 && pendingListRef.current) {
      setCommittedList(pendingListRef.current);
      pendingListRef.current = null;
    }
  };

  const handleResetAnimation = () => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    pendingListRef.current = null;
  };

  const handleLoadPreset = (values) => {
    handleResetAnimation();
    setCommittedList(createListFromValues(values));
  };

  // Telemetry values
  const activeSize = currentFrame ? currentFrame.orderedNodes?.length ?? committedList.size : committedList.size;
  const activeHeadVal = committedList.headId && committedList.nodes[committedList.headId]
    ? committedList.nodes[committedList.headId].value
    : "—";
  const activeTailVal = committedList.tailId && committedList.nodes[committedList.tailId]
    ? committedList.nodes[committedList.tailId].value
    : "—";
  const isEmpty = activeSize === 0;

  return (
    <div className="ll-studio-page">
      {/* Top bar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Singly Linked List — Insertion &amp; Deletion</h1>
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
              <span className="vl__step-idle">{activeSize} / {MAX_SIZE} Nodes</span>
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
            Singly linked nodes chained via forward pointers (<code>next</code>). Insertion and deletion at the head execute in constant time $O(1)$, while arbitrary position operations require $O(n)$ traversal.
          </p>

          {/* Telemetry Info Strip */}
          <div className="ll-info-strip">
            <div className="ll-info-card">
              <span className="ll-info-card__label">List Size</span>
              <span className="ll-info-card__value">{activeSize} / {MAX_SIZE}</span>
            </div>
            <div className={`ll-info-card ${!isEmpty ? "ll-info-card--accent" : ""}`}>
              <span className="ll-info-card__label">Head Node</span>
              <span className="ll-info-card__value">{activeHeadVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">Tail Node</span>
              <span className="ll-info-card__value">{activeTailVal}</span>
            </div>
            <div className="ll-info-card">
              <span className="ll-info-card__label">Status</span>
              <span className="ll-info-card__value">
                {isEmpty ? "⚪ Empty" : activeSize >= MAX_SIZE ? "🔴 Max Size" : "🟢 Active"}
              </span>
            </div>
          </div>

          {/* Visualizer Canvas */}
          <div className="ll-canvas-card">
            <LinkedListVisualizer
              nodes={displayNodes}
              pointers={pointers}
              floatingNode={currentFrame?.floatingNode || null}
              highlightNodes={currentFrame?.highlightNodes || {}}
              emptyMessage="List is empty (HEAD = NULL). Use controls below to insert nodes."
            />
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative ||
                "Select an operation below (Insert Head/Tail/Position or Delete) to visualize pointer manipulation step-by-step."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="ll-error-banner" role="alert">
              ⚠️ {errorMsg}
            </div>
          )}

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
                    value={Math.max(0, stepIdx)}
                    onChange={(e) => handleScrub(Number(e.target.value))}
                    className="vl__scrubber"
                    aria-label="Step timeline"
                    disabled={steps.length === 0}
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
                      aria-label={stepIdx <= 0 ? "Start" : "Resume"}
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
                    disabled={steps.length === 0}
                    aria-label="Reset Animation"
                    title="Reset Animation"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Workspace Tabs */}
          <div className="ll-ops-bar" role="tablist" aria-label="Linked List Operations">
            <button
              className={`ll-op-tab ${activeTab === "insert" ? "ll-op-tab--active" : ""}`}
              onClick={() => setActiveTab("insert")}
            >
              <PlusIcon size={12} />
              <span>Insertion</span>
            </button>
            <button
              className={`ll-op-tab ${activeTab === "delete" ? "ll-op-tab--active" : ""}`}
              onClick={() => setActiveTab("delete")}
            >
              <TrashIcon size={12} />
              <span>Deletion</span>
            </button>
            <button
              className={`ll-op-tab ${activeTab === "presets" ? "ll-op-tab--active" : ""}`}
              onClick={() => setActiveTab("presets")}
            >
              <FolderIcon size={12} />
              <span>Presets &amp; Reset</span>
            </button>
          </div>

          {/* Operation Panels */}
          <div className="ll-panel">
            {activeTab === "insert" && (
              <>
                <div className="ll-panel__row">
                  <span className="ll-panel__label">Value:</span>
                  <input
                    className="ll-input"
                    type="number"
                    value={insertVal}
                    onChange={(e) => setInsertVal(e.target.value)}
                    placeholder="Val"
                    disabled={isPlaying || activeSize >= MAX_SIZE}
                    aria-label="Value to insert"
                  />
                  <button
                    className="ll-btn ll-btn--primary"
                    onClick={handleInsertHead}
                    disabled={isPlaying || activeSize >= MAX_SIZE}
                  >
                    ↑ Insert at Head
                  </button>
                  <button
                    className="ll-btn"
                    onClick={handleInsertTail}
                    disabled={isPlaying || activeSize >= MAX_SIZE}
                  >
                    ↓ Insert at Tail
                  </button>
                </div>

                <div className="ll-panel__row">
                  <span className="ll-panel__label">Position:</span>
                  <input
                    className="ll-input"
                    type="number"
                    min={0}
                    max={activeSize}
                    value={insertPos}
                    onChange={(e) => setInsertPos(e.target.value)}
                    placeholder="Index"
                    disabled={isPlaying || activeSize >= MAX_SIZE}
                    aria-label="Position index to insert at"
                  />
                  <button
                    className="ll-btn"
                    onClick={handleInsertPosition}
                    disabled={isPlaying || activeSize >= MAX_SIZE}
                  >
                    ⤹ Insert at Index
                  </button>
                </div>
              </>
            )}

            {activeTab === "delete" && (
              <>
                <div className="ll-panel__row">
                  <span className="ll-panel__label">By Endpoints:</span>
                  <button
                    className="ll-btn ll-btn--danger"
                    onClick={handleDeleteHead}
                    disabled={isPlaying || isEmpty}
                  >
                    ↑ Delete Head
                  </button>
                  <button
                    className="ll-btn ll-btn--danger"
                    onClick={handleDeleteTail}
                    disabled={isPlaying || isEmpty}
                  >
                    ↓ Delete Tail
                  </button>
                </div>

                <div className="ll-panel__row">
                  <span className="ll-panel__label">By Value:</span>
                  <input
                    className="ll-input"
                    type="number"
                    value={deleteVal}
                    onChange={(e) => setDeleteVal(e.target.value)}
                    placeholder="Target"
                    disabled={isPlaying || isEmpty}
                    aria-label="Value to delete"
                  />
                  <button
                    className="ll-btn ll-btn--danger"
                    onClick={handleDeleteValue}
                    disabled={isPlaying || isEmpty}
                  >
                    ✕ Delete First Occurrence
                  </button>
                </div>
              </>
            )}

            {activeTab === "presets" && (
              <div className="ll-panel__row">
                <span className="ll-panel__label">Load List:</span>
                <button
                  className="ll-btn"
                  onClick={() => handleLoadPreset([10, 20, 30])}
                  disabled={isPlaying}
                >
                  3 Nodes
                </button>
                <button
                  className="ll-btn"
                  onClick={() => handleLoadPreset([12, 99, 37, 45, 88])}
                  disabled={isPlaying}
                >
                  5 Nodes
                </button>
                <button
                  className="ll-btn"
                  onClick={() => handleLoadPreset([5, 15, 25, 35, 45, 55, 65])}
                  disabled={isPlaying}
                >
                  7 Nodes
                </button>
                <button
                  className="ll-btn ll-btn--danger"
                  onClick={() => handleLoadPreset([])}
                  disabled={isPlaying || isEmpty}
                >
                  Clear All (Empty)
                </button>
              </div>
            )}
          </div>

          {/* Bottom Grid: Pseudocode & Complexity */}
          <div className="ll-bottom-grid">
            <div>
              <PseudocodeViewer
                code={currentFrame?.pseudocode || PSEUDOCODE_INSERT_HEAD}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Singly Linked List Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Insert Head</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Insert Tail</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Insert Pos</span>
                  <code className="vl-complexity__value vl-complexity__value--worst">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Delete Head</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(1)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Delete Tail</span>
                  <code className="vl-complexity__value vl-complexity__value--worst">O(n)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Delete Val</span>
                  <code className="vl-complexity__value vl-complexity__value--worst">O(n)</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
