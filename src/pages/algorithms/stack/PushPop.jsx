import { useState, useRef, useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import StackVisualizer from "../../../components/StackVisualizer";
import TheorySection from "../../../components/TheorySection";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import "../../../components/StackVisualizer.css";
import "../../../components/VisualizerLayout.css";

// Constants
const MAX_SIZE      = 8;      // maximum stack depth
const ANIM_DURATION = 330;    // ms — must match CSS animation duration

// Component
export default function PushPop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => { document.title = "Push & Pop — Algorithm Visualizer"; }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.stack;

  const handleTabChange = (mode) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (mode === "theory") {
        next.set("tab", "theory");
      } else {
        next.delete("tab");
      }
      return next;
    }, { replace: true });
  };

  // Stack state
  // Each element: { id: number, value: string, animating: 'push'|'pop'|null }
  const [stack,       setStack]       = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Input
  const [inputVal, setInputVal] = useState("");

  // Feedback
  const [overflow,    setOverflow]    = useState(false);
  const [underflow,   setUnderflow]   = useState(false);
  const [lastPopped,  setLastPopped]  = useState(null);
  const [lastPeeked,  setLastPeeked]  = useState(null);

  // Unique ID counter for stack items
  const nextId = useRef(0);

  // Show a timed warning
  const flashWarning = useCallback((setter) => {
    setter(true);
    setTimeout(() => setter(false), 2200);
  }, []);

  // PUSH
  const handlePush = useCallback(() => {
    if (isAnimating) return;

    const val = inputVal.trim();
    if (!val) return;

    if (stack.length >= MAX_SIZE) {
      flashWarning(setOverflow);
      return;
    }

    const id = nextId.current++;
    setIsAnimating(true);
    setLastPopped(null);
    setLastPeeked(null);

    // Add item with 'push' animation class
    setStack(prev => [...prev, { id, value: val, animating: "push" }]);
    setInputVal("");

    // Clear the animation class after animation finishes
    setTimeout(() => {
      setStack(prev =>
        prev.map(el => el.id === id ? { ...el, animating: null } : el)
      );
      setIsAnimating(false);
    }, ANIM_DURATION);
  }, [isAnimating, inputVal, stack.length, flashWarning]);

  // POP
  const handlePop = useCallback(() => {
    if (isAnimating) return;

    if (stack.length === 0) {
      flashWarning(setUnderflow);
      return;
    }

    const top = stack[stack.length - 1];
    setIsAnimating(true);
    setLastPopped(null);
    setLastPeeked(null);

    // Trigger pop animation on the top element
    setStack(prev =>
      prev.map(el => el.id === top.id ? { ...el, animating: "pop" } : el)
    );

    // After animation, remove the item and show the popped toast
    setTimeout(() => {
      setStack(prev => prev.filter(el => el.id !== top.id));
      setLastPopped(top.value);
      setIsAnimating(false);

      // Fade the toast after 2 s
      setTimeout(() => setLastPopped(null), 2100);
    }, ANIM_DURATION);
  }, [isAnimating, stack, flashWarning]);

  // PEEK
  const handlePeek = useCallback(() => {
    if (isAnimating) return;

    if (stack.length === 0) {
      flashWarning(setUnderflow);
      return;
    }

    const top = stack[stack.length - 1];
    setIsAnimating(true);
    setLastPopped(null);
    setLastPeeked(top.value);

    // Trigger peek pulse animation on the top element
    setStack(prev =>
      prev.map(el => el.id === top.id ? { ...el, animating: "peek" } : el)
    );

    setTimeout(() => {
      setStack(prev =>
        prev.map(el => el.id === top.id ? { ...el, animating: null } : el)
      );
      setIsAnimating(false);
      setTimeout(() => setLastPeeked(null), 2100);
    }, 480);
  }, [isAnimating, stack, flashWarning]);

  // CLEAR
  const handleClear = useCallback(() => {
    if (isAnimating) return;
    setStack([]);
    setLastPopped(null);
    setLastPeeked(null);
    setOverflow(false);
    setUnderflow(false);
  }, [isAnimating]);

  // Enter key triggers push
  const handleKeyDown = useCallback((e) => {
    if (e.key === "Enter") handlePush();
  }, [handlePush]);

  // Derived
  const topValue = stack.length > 0 ? stack[stack.length - 1].value : "—";
  const isFull   = stack.length >= MAX_SIZE;
  const isEmpty  = stack.length === 0;

  return (
    <div className="pp-page">
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
          <h1 className="vl__title">Stack — Push &amp; Pop</h1>
          <div className="vl__mode-nav" role="tablist" aria-label="Visualizer or Theory view mode">
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
            <span className="vl__step-idle">{stack.length} / {MAX_SIZE} items</span>
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
            A LIFO (Last In, First Out) structure — the last item pushed is the first popped. Used in function call stacks, undo systems, and expression evaluation.
          </p>

          {/* Info strip */}
          <div className="pp-info-strip">
            <div className="pp-info-card">
              <span className="pp-info-card__label">Stack Size</span>
              <span className="pp-info-card__value">{stack.length} / {MAX_SIZE}</span>
            </div>
            <div className={`pp-info-card ${!isEmpty ? "pp-info-card--accent" : ""}`}>
              <span className="pp-info-card__label">Top Element</span>
              <span className="pp-info-card__value">{topValue}</span>
            </div>
            <div className="pp-info-card">
              <span className="pp-info-card__label">Status</span>
              <span className="pp-info-card__value">
                {isFull ? "🔴 Full" : isEmpty ? "⚪ Empty" : "🟢 Active"}
              </span>
            </div>
          </div>

          {/* Main: visualizer + controls */}
          <div className="pp-main">
            {/* Stack visualization */}
            <StackVisualizer stack={stack} maxSize={MAX_SIZE} />

            {/* Controls column */}
            <div className="pp-controls">

              {/* Push section */}
              <div className="pp-controls__section">
                <span className="pp-controls__heading">Push</span>
                <div className="pp-input-row">
                  <input
                    className="pp-input"
                    type="text"
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter value…"
                    maxLength={10}
                    disabled={isAnimating || isFull}
                    aria-label="Value to push onto stack"
                  />
                  <button
                    className="pp-btn pp-btn--push"
                    onClick={handlePush}
                    disabled={isAnimating || !inputVal.trim() || isFull}
                    aria-label="Push value onto stack"
                  >
                    ↑ Push
                  </button>
                </div>
              </div>

              {/* Pop + Peek + Clear */}
              <div className="pp-controls__section">
                <span className="pp-controls__heading">Stack Operations</span>
                <div className="pp-btn-row">
                  <button
                    className="pp-btn pp-btn--pop"
                    onClick={handlePop}
                    disabled={isAnimating || isEmpty}
                    aria-label="Pop top element off stack"
                    title="Remove and return top element"
                  >
                    ↓ Pop
                  </button>
                  <button
                    className="pp-btn pp-btn--peek"
                    onClick={handlePeek}
                    disabled={isAnimating || isEmpty}
                    aria-label="Peek top element of stack"
                    title="Inspect top element without removing"
                  >
                    👁 Peek
                  </button>
                  <button
                    className="pp-btn pp-btn--clear"
                    onClick={handleClear}
                    disabled={isAnimating || isEmpty}
                    aria-label="Clear entire stack"
                    title="Reset stack to empty"
                  >
                    ✕ Clear
                  </button>
                </div>
              </div>

              {/* Popped / Peeked value toast */}
              {lastPopped !== null && (
                <div className="pp-popped" role="status" aria-live="polite">
                  Popped: <strong>{lastPopped}</strong>
                </div>
              )}
              {lastPeeked !== null && (
                <div className="pp-popped" style={{ borderColor: "rgba(0, 191, 204, 0.4)", color: "var(--accent)" }} role="status" aria-live="polite">
                  Peeked Top: <strong>{lastPeeked}</strong>
                </div>
              )}

              {/* Complexity reference */}
              <div className="pp-controls__section">
                <span className="pp-controls__heading">Complexity</span>
                <div className="pp-complexity">
                  <div className="pp-complexity__row">
                    <span className="pp-complexity__label">Push</span>
                    <span className="pp-complexity__val">O(1)</span>
                  </div>
                  <div className="pp-complexity__row">
                    <span className="pp-complexity__label">Pop</span>
                    <span className="pp-complexity__val">O(1)</span>
                  </div>
                  <div className="pp-complexity__row">
                    <span className="pp-complexity__label">Peek</span>
                    <span className="pp-complexity__val">O(1)</span>
                  </div>
                  <div className="pp-complexity__row">
                    <span className="pp-complexity__label">Space</span>
                    <span className="pp-complexity__val">O(n)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning banners */}
          {overflow && (
            <div className="pp-warning pp-warning--overflow" role="alert">
              🚫 Stack Overflow — maximum capacity ({MAX_SIZE}) reached!
            </div>
          )}
          {underflow && (
            <div className="pp-warning pp-warning--underflow" role="alert">
              ⚠️ Stack Underflow — cannot pop from an empty stack!
            </div>
          )}
        </>
      )}
    </div>
  );
}
