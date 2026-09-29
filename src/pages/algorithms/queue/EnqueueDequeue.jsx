import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import QueueVisualizer from "../../../components/QueueVisualizer";
import TheorySection from "../../../components/TheorySection";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import "../../../components/QueueVisualizer.css";
import "../../../components/VisualizerLayout.css";

// Constants
const MAX_SIZE = 8; // Visualizer capacity buffer
const ANIM_DURATION = 330; // ms — matches CSS animation duration

// Component
export default function EnqueueDequeue() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Queue — Enqueue & Dequeue — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.enqueueDequeue;

  const handleTabChange = (mode) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (mode === "theory") {
          next.set("tab", "theory");
        } else {
          next.delete("tab");
        }
        return next;
      },
      { replace: true }
    );
  };

  // Queue State
  // Each element: { id: number, value: string, animating: 'enqueue'|'dequeue'|'front'|null }
  const [queue, setQueue] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Input
  const [inputVal, setInputVal] = useState("");

  // Feedback Telemetry & Warnings
  const [overflow, setOverflow] = useState(false);
  const [underflow, setUnderflow] = useState(false);
  const [lastDequeued, setLastDequeued] = useState(null);
  const [lastFront, setLastFront] = useState(null);

  // Unique ID counter for queue items
  const nextId = useRef(0);

  // Timed warning helper
  const flashWarning = useCallback((setter) => {
    setter(true);
    setTimeout(() => setter(false), 2200);
  }, []);

  // ENQUEUE (Add to Rear)
  const handleEnqueue = useCallback(() => {
    if (isAnimating) return;

    const val = inputVal.trim();
    if (!val) return;

    if (queue.length >= MAX_SIZE) {
      flashWarning(setOverflow);
      return;
    }

    const id = nextId.current++;
    setIsAnimating(true);
    setLastDequeued(null);
    setLastFront(null);

    // Add item at the rear with 'enqueue' animation
    setQueue((prev) => [...prev, { id, value: val, animating: "enqueue" }]);
    setInputVal("");

    // Clear animation class when animation completes
    setTimeout(() => {
      setQueue((prev) =>
        prev.map((el) => (el.id === id ? { ...el, animating: null } : el))
      );
      setIsAnimating(false);
    }, ANIM_DURATION);
  }, [isAnimating, inputVal, queue.length, flashWarning]);

  // DEQUEUE (Remove from Front)
  const handleDequeue = useCallback(() => {
    if (isAnimating) return;

    if (queue.length === 0) {
      flashWarning(setUnderflow);
      return;
    }

    const front = queue[0];
    setIsAnimating(true);
    setLastDequeued(null);
    setLastFront(null);

    // Trigger dequeue animation on the front element
    setQueue((prev) =>
      prev.map((el) =>
        el.id === front.id ? { ...el, animating: "dequeue" } : el
      )
    );

    // Remove item after animation completes
    setTimeout(() => {
      setQueue((prev) => prev.filter((el) => el.id !== front.id));
      setLastDequeued(front.value);
      setIsAnimating(false);

      // Fade toast after 2.1 s
      setTimeout(() => setLastDequeued(null), 2100);
    }, ANIM_DURATION);
  }, [isAnimating, queue, flashWarning]);

  // FRONT / PEEK (Inspect Front)
  const handleFront = useCallback(() => {
    if (isAnimating) return;

    if (queue.length === 0) {
      flashWarning(setUnderflow);
      return;
    }

    const front = queue[0];
    setIsAnimating(true);
    setLastDequeued(null);
    setLastFront(front.value);

    // Trigger front pulse animation on the front element
    setQueue((prev) =>
      prev.map((el) => (el.id === front.id ? { ...el, animating: "front" } : el))
    );

    setTimeout(() => {
      setQueue((prev) =>
        prev.map((el) => (el.id === front.id ? { ...el, animating: null } : el))
      );
      setIsAnimating(false);
      setTimeout(() => setLastFront(null), 2100);
    }, 480);
  }, [isAnimating, queue, flashWarning]);

  // CLEAR
  const handleClear = useCallback(() => {
    if (isAnimating) return;
    setQueue([]);
    setLastDequeued(null);
    setLastFront(null);
    setOverflow(false);
    setUnderflow(false);
  }, [isAnimating]);

  // Enter key triggers Enqueue
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleEnqueue();
    },
    [handleEnqueue]
  );

  // Derived Telemetry
  const frontValue = queue.length > 0 ? queue[0].value : "—";
  const rearValue = queue.length > 0 ? queue[queue.length - 1].value : "—";
  const isFull = queue.length >= MAX_SIZE;
  const isEmpty = queue.length === 0;

  return (
    <div className="ed-page">
      {/* Top bar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button
          className="vl__back"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          <span aria-hidden="true">←</span> Back
        </button>
        <div className="vl__title-area">
          <h1 className="vl__title">Queue — Enqueue &amp; Dequeue</h1>
          <div
            className="vl__mode-nav"
            role="tablist"
            aria-label="Visualizer or Theory view mode"
          >
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
            <span className="vl__step-idle">
              {queue.length} / {MAX_SIZE} items
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
            A FIFO (First In, First Out) structure — elements are enqueued at the
            Rear and dequeued from the Front. Used in task schedulers, Breadth-First
            Search (BFS), and event-driven buffers.
          </p>

          {/* Info strip */}
          <div className="ed-info-strip">
            <div className="ed-info-card">
              <span className="ed-info-card__label">Queue Size</span>
              <span className="ed-info-card__value">
                {queue.length} / {MAX_SIZE}
              </span>
            </div>
            <div
              className={`ed-info-card ${!isEmpty ? "ed-info-card--green" : ""}`}
            >
              <span className="ed-info-card__label">Front Element</span>
              <span className="ed-info-card__value">{frontValue}</span>
            </div>
            <div
              className={`ed-info-card ${!isEmpty ? "ed-info-card--amber" : ""}`}
            >
              <span className="ed-info-card__label">Rear Element</span>
              <span className="ed-info-card__value">{rearValue}</span>
            </div>
            <div className="ed-info-card">
              <span className="ed-info-card__label">Status</span>
              <span className="ed-info-card__value">
                {isFull ? "🔴 Full" : isEmpty ? "⚪ Empty" : "🟢 Active"}
              </span>
            </div>
          </div>

          {/* Main Workspace: Visualizer + Controls */}
          <div className="ed-main">
            {/* Visualizer Column */}
            <div className="ed-visualizer-col">
              <QueueVisualizer queue={queue} maxSize={MAX_SIZE} />
            </div>

            {/* Controls Column */}
            <div className="ed-controls-col">
              {/* Enqueue Section */}
              <div className="ed-controls__section">
                <span className="ed-controls__heading">Enqueue (To Rear)</span>
                <div className="ed-input-row">
                  <input
                    className="ed-input"
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter value…"
                    maxLength={10}
                    disabled={isAnimating || isFull}
                    aria-label="Value to enqueue into queue"
                  />
                  <button
                    className="ed-btn ed-btn--enqueue"
                    onClick={handleEnqueue}
                    disabled={isAnimating || !inputVal.trim() || isFull}
                    aria-label="Enqueue value at rear"
                    title="Add element to rear of queue"
                  >
                    → Enqueue
                  </button>
                </div>
              </div>

              {/* Queue Operations Section */}
              <div className="ed-controls__section">
                <span className="ed-controls__heading">Queue Operations</span>
                <div className="ed-btn-row">
                  <button
                    className="ed-btn ed-btn--dequeue"
                    onClick={handleDequeue}
                    disabled={isAnimating || isEmpty}
                    aria-label="Dequeue front element"
                    title="Remove and return front element"
                  >
                    ← Dequeue
                  </button>
                  <button
                    className="ed-btn ed-btn--front"
                    onClick={handleFront}
                    disabled={isAnimating || isEmpty}
                    aria-label="Inspect front element"
                    title="Inspect front element without removing"
                  >
                    👁 Front
                  </button>
                  <button
                    className="ed-btn ed-btn--clear"
                    onClick={handleClear}
                    disabled={isAnimating || isEmpty}
                    aria-label="Clear entire queue"
                    title="Reset queue to empty"
                  >
                    ✕ Clear
                  </button>
                </div>
              </div>

              {/* Dequeued / Front Value Toast */}
              {lastDequeued !== null && (
                <div className="ed-toast" role="status" aria-live="polite">
                  Dequeued from Front: <strong>{lastDequeued}</strong>
                </div>
              )}
              {lastFront !== null && (
                <div
                  className="ed-toast"
                  style={{
                    borderColor: "rgba(0, 191, 204, 0.4)",
                    color: "var(--accent)",
                  }}
                  role="status"
                  aria-live="polite"
                >
                  Front Element: <strong>{lastFront}</strong>
                </div>
              )}

              {/* Complexity Reference */}
              <div className="ed-controls__section">
                <span className="ed-controls__heading">Complexity</span>
                <div className="ed-complexity">
                  <div className="ed-complexity__item">
                    <span className="ed-complexity__label">Enqueue</span>
                    <span className="ed-complexity__val">O(1)</span>
                  </div>
                  <div className="ed-complexity__item">
                    <span className="ed-complexity__label">Dequeue</span>
                    <span className="ed-complexity__val">O(1)</span>
                  </div>
                  <div className="ed-complexity__item">
                    <span className="ed-complexity__label">Front</span>
                    <span className="ed-complexity__val">O(1)</span>
                  </div>
                  <div className="ed-complexity__item">
                    <span className="ed-complexity__label">Space</span>
                    <span className="ed-complexity__val">O(n)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Banners */}
          {overflow && (
            <div className="ed-warning ed-warning--overflow" role="alert">
              🚫 Queue Overflow — maximum buffer capacity ({MAX_SIZE}) reached!
            </div>
          )}
          {underflow && (
            <div className="ed-warning ed-warning--underflow" role="alert">
              ⚠️ Queue Underflow — cannot dequeue or inspect an empty queue!
            </div>
          )}
        </>
      )}
    </div>
  );
}
