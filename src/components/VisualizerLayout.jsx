import { useState, useMemo, lazy, Suspense } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import PseudocodeViewer from "./PseudocodeViewer";
import CustomArrayModal from "./CustomArrayModal";
import StepNarrator from "./StepNarrator";
import { resolveTheoryKey } from "../data/theoryManifest";
import { CustomArrayIcon, SlidersIcon, PlayIcon, BookOpenIcon } from "./Icons";
import { VisualizerContext, useVisualizer } from "../context/VisualizerContext";
import "./VisualizerLayout.css";

// Re-export for backward compatibility
export { VisualizerContext, useVisualizer };

// Lazy-loaded TheorySection: chunk is requested ONLY when user opens "Theory & Notes" tab
const TheorySection = lazy(() => import("./TheorySection"));

// Complexity panel
function ComplexityPanel({ complexity }) {
  const {
    best = "—",
    average = "—",
    worst = "—",
    space = "—",
    stable = null,
  } = complexity ?? {};

  return (
    <div className="vl-complexity" aria-label="Time and Space Complexity Analysis">
      <div className="vl-complexity__header">
        <span className="vl-complexity__title">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </svg>
          <span>Time &amp; Space Complexity (Big-O)</span>
        </span>
      </div>

      <div className="vl-complexity__grid">
        <div className="vl-complexity__item">
          <span className="vl-complexity__label">Best Time</span>
          <code className="vl-complexity__value vl-complexity__value--best" title="Best-Case Time Complexity">
            {best}
          </code>
        </div>
        <div className="vl-complexity__item">
          <span className="vl-complexity__label">Avg Time</span>
          <code className="vl-complexity__value vl-complexity__value--avg" title="Average-Case Time Complexity">
            {average}
          </code>
        </div>
        <div className="vl-complexity__item">
          <span className="vl-complexity__label">Worst Time</span>
          <code className="vl-complexity__value vl-complexity__value--worst" title="Worst-Case Time Complexity">
            {worst}
          </code>
        </div>
        <div className="vl-complexity__item">
          <span className="vl-complexity__label">Aux Space</span>
          <code className="vl-complexity__value" title="Auxiliary Space Complexity">
            {space}
          </code>
        </div>
        {stable !== null && (
          <div className="vl-complexity__item">
            <span className="vl-complexity__label">Stability</span>
            <span
              className={`vl-complexity__badge ${
                stable ? "vl-complexity__badge--yes" : "vl-complexity__badge--no"
              }`}
              title={
                stable
                  ? "Preserves relative order of duplicate elements"
                  : "Does not preserve relative order of duplicate elements"
              }
            >
              {stable ? "Stable" : "Unstable"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Color legend
const LEGEND = [
  { color: "var(--viz-default)",   label: "Default" },
  { color: "var(--viz-comparing)", label: "Comparing" },
  { color: "var(--viz-swapping)",  label: "Swapping" },
  { color: "var(--viz-sorted)",    label: "Sorted" },
];

function Legend() {
  return (
    <div className="vl-legend" role="list" aria-label="Color legend">
      {LEGEND.map(({ color, label }) => (
        <div key={label} className="vl-legend__item" role="listitem">
          <span
            className="vl-legend__dot"
            style={{ background: color }}
            aria-hidden="true"
          />
          <span className="vl-legend__label">{label}</span>
        </div>
      ))}
    </div>
  );
}

// Slider
function LabelledSlider({ label, min, max, value, onChange, leftHint, rightHint, actionButton = null }) {
  return (
    <div className="vl-slider">
      <div className="vl-slider__top">
        <span className="vl-slider__label">{label}</span>
        {actionButton}
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

// Speed display helper (ms → label)
// speed prop is 1–10 (user-facing), mapped by parent to actual ms.
// We just show the slider value as a speed level.

// Main Layout
/**
 * VisualizerLayout — shared shell for every algorithm page.
 */
export default function VisualizerLayout({
  title,
  theoryKey     = null,
  description   = null,
  complexity,
  stepIdx       = 0,
  totalSteps    = 0,
  isRunning     = false,
  speed,
  setSpeed,
  size,
  setSize,
  sizeMin       = 10,
  sizeMax       = 100,
  sizeLabel     = "Array Size",
  onStart,
  onPause,
  onReset,
  onStepBack    = null,
  onStepForward = null,
  onJumpStart   = null,
  onJumpEnd     = null,
  onScrub       = null,
  pseudocode    = null,
  activeLine    = -1,
  narrative     = "",
  onCustomArray = null,
  currentArray  = [],
  requireSorted = false,
  doneMessage   = "✅ Sorting complete!",
  customLegend  = undefined,   // if provided, replaces the default colour legend
  nextAlgorithm = null,        // { name, path } | null — shown in done banner
  children,
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const resolvedTheoryKey = useMemo(() => resolveTheoryKey(title, theoryKey), [title, theoryKey]);

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

  const isDone = totalSteps > 0 && stepIdx >= totalSteps;

  const contextValue = useMemo(() => ({
    openCustomModal: () => setIsCustomModalOpen(true),
    isCustomArrayAvailable: Boolean(onCustomArray),
    isRunning,
  }), [onCustomArray, isRunning]);

  return (
    <VisualizerContext.Provider value={contextValue}>
      <main className="vl">
        {/* Top row: back + title + mode switcher + step counter */}
        <div className="vl__topbar">
          <button
            className="vl__back"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            <span aria-hidden="true">←</span> Back
          </button>

          <div className="vl__title-area">
            <h1 className="vl__title">{title}</h1>
            {resolvedTheoryKey && (
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
            )}
          </div>

          {/* Step counter / Status — right-aligned */}
          <div className="vl__step-counter" aria-live="polite" aria-atomic="true">
            {!isTheoryTab ? (
              totalSteps > 0 ? (
                <>
                  Step{" "}
                  <strong>{Math.min(stepIdx, totalSteps)}</strong>
                  {" / "}
                  <strong>{totalSteps}</strong>
                </>
              ) : (
                <span className="vl__step-idle">Press Start</span>
              )
            ) : (
              <span className="vl__theory-badge">
                <BookOpenIcon size={12} />
                <span>Concept Guide</span>
              </span>
            )}
          </div>
        </div>

        {/* Tab Views */}
        {isTheoryTab && resolvedTheoryKey ? (
          <Suspense
            fallback={
              <div className="page-fallback" role="status" aria-label="Loading theory">
                <div className="page-fallback__spinner" aria-hidden="true" />
              </div>
            }
          >
            <TheorySection
              theoryKey={resolvedTheoryKey}
              onSwitchToVisualizer={() => handleTabChange("visualizer")}
            />
          </Suspense>
        ) : (
          <>
            {description && (
              <p className="vl__description">{description}</p>
            )}

            <ComplexityPanel complexity={complexity} />

            <div className="vl__canvas-row">
              <div className="vl__canvas">
                {children}
              </div>
              {pseudocode && pseudocode.length > 0 && (
                <PseudocodeViewer
                  code={pseudocode}
                  activeLine={activeLine}
                />
              )}
            </div>

            {narrative && (
              <StepNarrator
                narrative={narrative}
                stepIdx={stepIdx}
                totalSteps={totalSteps}
              />
            )}

            {customLegend !== undefined ? customLegend : <Legend />}

            <div className="vl__controls">
              {/* Controls Header: Label & Custom Array Trigger */}
              {onCustomArray && (
                <div className="vl__controls-header">
                  <div className="vl__controls-title-group">
                    <SlidersIcon size={14} className="vl__controls-icon" />
                    <span className="vl__controls-title">Configuration & Playback</span>
                  </div>
                  <button
                    type="button"
                    className="vl__btn-custom-arr"
                    onClick={() => setIsCustomModalOpen(true)}
                    disabled={isRunning}
                    title="Create or paste a custom array"
                  >
                    <CustomArrayIcon size={14} className="vl__btn-custom-icon" />
                    <span>Custom Array</span>
                  </button>
                </div>
              )}

              <div className="vl__controls-body">
                {/* Sliders */}
                <div className="vl__sliders">
                  {/* Size slider — hidden when setSize is not provided (e.g. graph pages) */}
                  {setSize !== undefined && (
                    <LabelledSlider
                      label={sizeLabel}
                      min={sizeMin}
                      max={sizeMax}
                      value={size}
                      onChange={(v) => { if (!isRunning) setSize(v); }}
                      leftHint={String(sizeMin)}
                      rightHint={String(sizeMax)}
                    />
                  )}
                  <LabelledSlider
                    label="Speed"
                    min={1}
                    max={10}
                    value={speed}
                    onChange={setSpeed}
                    leftHint="Slow"
                    rightHint="Fast"
                  />
                </div>

                {/* Transport */}
                <div className="vl__transport">
                  {/* Row 1 — Timeline scrubber */}
                  <div className="vl__scrubber-row">
                    <input
                      type="range"
                      min={0}
                      max={totalSteps || 1}
                      value={Math.min(stepIdx, totalSteps)}
                      onChange={(e) => {
                        if (onPause) onPause();
                        if (onScrub) onScrub(Number(e.target.value));
                      }}
                      className="vl__scrubber"
                      aria-label="Step timeline"
                      disabled={totalSteps === 0}
                    />
                  </div>

                  {/* Row 2 — Button row */}
                  <div className="vl__buttons">
                    {/* ⏮ First */}
                    <button
                      className="vl__btn vl__btn--nav"
                      onClick={onJumpStart}
                      disabled={!onJumpStart || stepIdx === 0 || totalSteps === 0}
                      aria-label="Jump to first step"
                      title="First"
                    >⏮</button>

                    {/* ◀ Prev */}
                    <button
                      className="vl__btn vl__btn--nav"
                      onClick={() => { if (isRunning && onPause) onPause(); if (onStepBack) onStepBack(); }}
                      disabled={!onStepBack || stepIdx === 0 || totalSteps === 0}
                      aria-label="Previous step"
                      title="Previous"
                    >◀</button>

                    {/* ▶ Play / ⏸ Pause */}
                    {!isRunning ? (
                      <button
                        className="vl__btn vl__btn--start"
                        onClick={onStart}
                        disabled={isDone}
                        aria-label={stepIdx === 0 ? "Start" : "Resume"}
                      >
                        {stepIdx === 0 ? "▶ Start" : "▶ Resume"}
                      </button>
                    ) : (
                      <button
                        className="vl__btn vl__btn--pause"
                        onClick={onPause}
                        aria-label="Pause"
                      >
                        ⏸ Pause
                      </button>
                    )}

                    {/* Next ▶ */}
                    <button
                      className="vl__btn vl__btn--nav"
                      onClick={() => { if (isRunning && onPause) onPause(); if (onStepForward) onStepForward(); }}
                      disabled={!onStepForward || stepIdx >= totalSteps || totalSteps === 0}
                      aria-label="Next step"
                      title="Next"
                    >▶</button>

                    {/* ⏭ Last */}
                    <button
                      className="vl__btn vl__btn--nav"
                      onClick={onJumpEnd}
                      disabled={!onJumpEnd || stepIdx >= totalSteps || totalSteps === 0}
                      aria-label="Jump to last step"
                      title="Last"
                    >⏭</button>

                    {/* ↺ Reset */}
                    <button
                      className="vl__btn vl__btn--reset"
                      onClick={onReset}
                      aria-label="Reset"
                    >
                      ↺ Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Done banner */}
            {isDone && (
              <div
                className={`vl__done-banner ${
                  doneMessage.startsWith("❌") ? "vl__done-banner--fail" : ""
                }`}
                role="status"
              >
                <span className="vl__done-message">{doneMessage}</span>
                <span className="vl__done-steps">
                  Completed in <strong>{totalSteps}</strong> steps
                </span>
                {nextAlgorithm && (
                  <Link to={nextAlgorithm.path} className="vl__done-next">
                    Try {nextAlgorithm.name} →
                  </Link>
                )}
              </div>
            )}
          </>
        )}

        {/* Custom Array Modal Dialog (stays accessible across tabs) */}
        {onCustomArray && (
          <CustomArrayModal
            isOpen={isCustomModalOpen}
            onClose={() => setIsCustomModalOpen(false)}
            onApply={onCustomArray}
            currentArray={currentArray}
            requireSorted={requireSorted}
            minSize={sizeMin}
            maxSize={sizeMax}
          />
        )}
      </main>
    </VisualizerContext.Provider>
  );
}
