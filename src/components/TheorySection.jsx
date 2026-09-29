import { useState } from "react";
import { Link } from "react-router-dom";
import { THEORY_DATA } from "../data/theoryData";
import "./TheorySection.css";

// Subtle, Professional Vector SVG Icons (1.75px stroke)
function BookIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function TargetIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function LayersIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function CompassIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function KeyIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="7.5" cy="15.5" r="4.5" />
      <path d="M10.7 12.3 20 3" />
      <path d="m16 7 2 2" />
      <path d="m19 4 2 2" />
    </svg>
  );
}

function WorkflowIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="15" y="3" width="6" height="6" rx="1.5" />
      <rect x="15" y="15" width="6" height="6" rx="1.5" />
      <rect x="3" y="15" width="6" height="6" rx="1.5" />
      <path d="M9 6h6" />
      <path d="M18 9v6" />
      <path d="M15 18H9" />
      <path d="M6 15V9" />
    </svg>
  );
}

function TerminalIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function BarChartIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}

function AlertTriangleIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ScaleIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
      <path d="M7 21h10" />
      <path d="M12 3v18" />
      <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
    </svg>
  );
}

function FlaskIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M10 2v7.31L4.1 18.57A2 2 0 0 0 5.76 21.5h12.48a2 2 0 0 0 1.66-2.93L14 9.31V2" />
      <line x1="8.5" y1="2" x2="15.5" y2="2" />
      <line x1="14" y1="9" x2="10" y2="9" />
    </svg>
  );
}

function GlobeIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function CheckCircleIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function RoadmapIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}

function CheckIcon({ size = 12, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ size = 12, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function PlayIcon({ size = 13, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function CodeIcon({ size = 16, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function CopyIcon({ size = 14, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function PseudocodeViewer({ pseudocode, defaultTitle }) {
  const [activeOpIdx, setActiveOpIdx] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!pseudocode) return null;

  const hasOperations =
    Array.isArray(pseudocode.operations) && pseudocode.operations.length > 0;

  const currentOp = hasOperations
    ? pseudocode.operations[Math.min(activeOpIdx, pseudocode.operations.length - 1)]
    : null;

  const codeText = currentOp ? currentOp.code : pseudocode.code || "";
  const complexityBadge = currentOp?.complexity || pseudocode.complexity;
  const opDescription = currentOp?.description || pseudocode.description;
  const opName = currentOp?.name || pseudocode.title || `${defaultTitle} Procedure`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback if clipboard API is not available
    }
  };

  return (
    <section className="ts-section">
      <h2 className="ts-section-title">
        <span className="ts-section-icon-wrap">
          <CodeIcon size={16} />
        </span>
        <span>Pseudocode &amp; Algorithmic Specification</span>
      </h2>

      {pseudocode.intro && (
        <p className="ts-pseudocode-intro">{pseudocode.intro}</p>
      )}

      {/* If multi-operation, show operation selector tabs */}
      {hasOperations && (
        <div
          className="ts-pseudo-tabs"
          role="tablist"
          aria-label="Algorithm Operations"
        >
          {pseudocode.operations.map((op, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={activeOpIdx === idx}
              className={`ts-pseudo-tab ${
                activeOpIdx === idx ? "ts-pseudo-tab--active" : ""
              }`}
              onClick={() => {
                setActiveOpIdx(idx);
                setCopied(false);
              }}
            >
              {op.name}
            </button>
          ))}
        </div>
      )}

      {/* Code Container */}
      <div className="ts-pseudo-container">
        <div className="ts-pseudo-header">
          <div className="ts-diagram-dots" aria-hidden="true">
            <span className="ts-diagram-dot red" />
            <span className="ts-diagram-dot yellow" />
            <span className="ts-diagram-dot green" />
          </div>
          <div className="ts-pseudo-header-info">
            <span className="ts-pseudo-title">{opName}</span>
            {complexityBadge && (
              <span className="ts-pseudo-complexity">{complexityBadge}</span>
            )}
          </div>
          <button
            type="button"
            className={`ts-pseudo-copy-btn ${
              copied ? "ts-pseudo-copy-btn--copied" : ""
            }`}
            onClick={handleCopy}
            title="Copy Pseudocode"
          >
            {copied ? (
              <>
                <CheckIcon size={12} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {opDescription && (
          <div className="ts-pseudo-desc">
            <span>{opDescription}</span>
          </div>
        )}

        <pre className="ts-pseudo-code">
          <code>{codeText}</code>
        </pre>
      </div>
    </section>
  );
}

/**
 * TheorySection — Educational concept and theory guide reader.
 *
 * Props:
 *   data                  Object — theory payload from theoryData.js
 *   theoryKey             string — topic key in THEORY_DATA
 *   onSwitchToVisualizer  fn()   — callback to toggle back to visualizer
 */
export default function TheorySection({ data, theoryKey, onSwitchToVisualizer }) {
  const resolvedData = data || (theoryKey && THEORY_DATA ? THEORY_DATA[theoryKey] : null);
  if (!resolvedData) return null;

  const {
    title,
    category,
    tagline,
    whatIsIt,
    whyItMatters,
    mentalModel,
    coreConcepts = [],
    howItWorks = [],
    pseudocode,
    workedExample,
    complexity = {},
    pitfalls = [],
    prosAndCons = { pros: [], cons: [], edgeCases: [] },
    realWorldApplications = [],
    keyTakeaways = [],
    nextTopics = [],
  } = resolvedData;

  const { best, average, worst, space, stable, mathematicalIntuition } =
    complexity;
  const edgeCases = prosAndCons.edgeCases || [];

  return (
    <div
      className="ts-container"
      role="region"
      aria-label={`${title} Theory & Concepts`}
    >
      {/* 1. Hero & Core Introduction */}
      <section className="ts-hero">
        <div className="ts-hero__top">
          <div className="ts-hero__badges">
            <span className="ts-badge">{category}</span>
            <span className="ts-badge ts-badge--secondary">Comprehensive Guide</span>
          </div>
          {onSwitchToVisualizer && (
            <button
              type="button"
              className="ts-btn-switch"
              onClick={onSwitchToVisualizer}
              title="Launch Interactive Visualization"
            >
              <PlayIcon size={12} />
              <span>Open Visualizer</span>
            </button>
          )}
        </div>

        {tagline && <p className="ts-tagline">{tagline}</p>}

        <div className="ts-hero__cards">
          <div className="ts-intro-card">
            <div className="ts-intro-card__header">
              <span className="ts-intro-icon-wrap">
                <BookIcon size={15} />
              </span>
              <h2 className="ts-intro-card__title">What is {title}?</h2>
            </div>
            <p className="ts-intro-card__text">{whatIsIt}</p>
          </div>

          {whyItMatters && (
            <div className="ts-intro-card ts-intro-card--accent">
              <div className="ts-intro-card__header">
                <span className="ts-intro-icon-wrap ts-intro-icon-wrap--accent">
                  <TargetIcon size={15} />
                </span>
                <h2 className="ts-intro-card__title">Why Does It Matter?</h2>
              </div>
              <p className="ts-intro-card__text">{whyItMatters}</p>
            </div>
          )}
        </div>
      </section>

      {/* 2. Mental Model & Visual Diagram */}
      {mentalModel && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <LayersIcon size={16} />
            </span>
            <span>Mental Model &amp; Visual Representation</span>
          </h2>

          {mentalModel.analogy && (
            <div className="ts-analogy-box">
              <div className="ts-analogy-box__title">
                <CompassIcon size={14} />
                <span>Real-World Intuition</span>
              </div>
              <p className="ts-analogy-box__text">{mentalModel.analogy}</p>
            </div>
          )}

          {mentalModel.diagram && (
            <div className="ts-diagram-container">
              <div className="ts-diagram-header">
                <div className="ts-diagram-dots" aria-hidden="true">
                  <span className="ts-diagram-dot red" />
                  <span className="ts-diagram-dot yellow" />
                  <span className="ts-diagram-dot green" />
                </div>
                <span className="ts-diagram-title">Visual State Representation</span>
              </div>
              <pre className="ts-diagram-content">{mentalModel.diagram}</pre>
            </div>
          )}
        </section>
      )}

      {/* 3. Core Concepts & Invariants */}
      {coreConcepts.length > 0 && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <KeyIcon size={16} />
            </span>
            <span>Core Invariants &amp; Principles</span>
          </h2>
          <div className="ts-concepts-grid">
            {coreConcepts.map((concept, idx) => (
              <div key={idx} className="ts-concept-card">
                <h3 className="ts-concept-title">{concept.title}</h3>
                <p className="ts-concept-text">{concept.explanation}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Algorithmic Mechanics (Step-by-Step) */}
      {howItWorks.length > 0 && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <WorkflowIcon size={16} />
            </span>
            <span>Step-by-Step Execution Mechanics</span>
          </h2>
          <div className="ts-steps-list">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="ts-step-item">
                <span className="ts-step-num">{String(idx + 1).padStart(2, "0")}</span>
                <span className="ts-step-text">{step}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Pseudocode & Algorithmic Specification */}
      {pseudocode && (
        <PseudocodeViewer pseudocode={pseudocode} defaultTitle={title} />
      )}

      {/* 6. Concrete Worked Trace Example */}
      {workedExample && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <TerminalIcon size={16} />
            </span>
            <span>Worked Execution Trace</span>
          </h2>
          <div className="ts-example-card">
            <div className="ts-example-header">
              <div className="ts-example-meta">
                <span className="ts-example-label">Input</span>
                <code className="ts-example-input">{workedExample.input}</code>
              </div>
              <div className="ts-example-meta">
                <span className="ts-example-label">Objective</span>
                <span className="ts-example-goal">{workedExample.goal}</span>
              </div>
            </div>

            <div className="ts-example-trace-list">
              {workedExample.steps.map((st, idx) => (
                <div key={idx} className="ts-trace-step">
                  <div className="ts-trace-step__header">
                    <span className="ts-trace-step__name">{st.step}</span>
                    <code className="ts-trace-step__state">{st.state}</code>
                  </div>
                  <p className="ts-trace-step__desc">{st.explanation}</p>
                </div>
              ))}
            </div>

            <div className="ts-example-result">
              <span className="ts-example-result__badge">
                <CheckIcon size={12} />
              </span>
              <div className="ts-example-result__body">
                <span className="ts-example-result__label">Final Verified State</span>
                <span className="ts-example-result__text">{workedExample.result}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. Complexity & Mathematical Analysis */}
      {complexity && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <BarChartIcon size={16} />
            </span>
            <span>Complexity &amp; Mathematical Analysis</span>
          </h2>
          <div className="ts-complexity-grid">
            {best && (
              <div className="ts-comp-card">
                <div className="ts-comp-header">
                  <span className="ts-comp-label">Best Case</span>
                  <code className="ts-comp-val ts-comp-val--best">{best.time}</code>
                </div>
                <p className="ts-comp-desc">{best.condition}</p>
              </div>
            )}
            {average && (
              <div className="ts-comp-card">
                <div className="ts-comp-header">
                  <span className="ts-comp-label">Average Case</span>
                  <code className="ts-comp-val ts-comp-val--avg">{average.time}</code>
                </div>
                <p className="ts-comp-desc">{average.condition}</p>
              </div>
            )}
            {worst && (
              <div className="ts-comp-card">
                <div className="ts-comp-header">
                  <span className="ts-comp-label">Worst Case</span>
                  <code className="ts-comp-val ts-comp-val--worst">{worst.time}</code>
                </div>
                <p className="ts-comp-desc">{worst.condition}</p>
              </div>
            )}
            {space && (
              <div className="ts-comp-card">
                <div className="ts-comp-header">
                  <span className="ts-comp-label">Auxiliary Space</span>
                  <code className="ts-comp-val ts-comp-val--space">{space.memory}</code>
                </div>
                <p className="ts-comp-desc">{space.explanation}</p>
              </div>
            )}
          </div>

          {/* Stability badge & Math intuition */}
          <div className="ts-comp-extras">
            {stable && typeof stable.isStable === "boolean" && (
              <div className="ts-stability-box">
                <div className="ts-stability-title">
                  <span>Stability Invariant:</span>
                  <span
                    className={`ts-stability-badge ${
                      stable.isStable
                        ? "ts-stability-badge--yes"
                        : "ts-stability-badge--no"
                    }`}
                  >
                    {stable.isStable ? "Stable Invariant Preserved" : "Unstable Invariant"}
                  </span>
                </div>
                <p className="ts-stability-desc">{stable.reason}</p>
              </div>
            )}

            {mathematicalIntuition && (
              <div className="ts-math-box">
                <div className="ts-math-title">
                  <WorkflowIcon size={14} />
                  <span>Mathematical Derivation &amp; Recurrence</span>
                </div>
                <p className="ts-math-text">{mathematicalIntuition}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 7. Common Pitfalls & Misconceptions */}
      {pitfalls.length > 0 && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap ts-section-icon-wrap--warning">
              <AlertTriangleIcon size={16} />
            </span>
            <span>Common Pitfalls &amp; Misconceptions</span>
          </h2>
          <div className="ts-pitfalls-grid">
            {pitfalls.map((item, idx) => (
              <div key={idx} className="ts-pitfall-card">
                <div className="ts-pitfall-myth">
                  <span className="ts-pitfall-tag myth">
                    <XIcon size={11} />
                    <span>Common Misconception</span>
                  </span>
                  <p className="ts-pitfall-text">{item.myth}</p>
                </div>
                <div className="ts-pitfall-reality">
                  <span className="ts-pitfall-tag reality">
                    <CheckIcon size={11} />
                    <span>Technical Reality</span>
                  </span>
                  <p className="ts-pitfall-text">{item.reality}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 8. Trade-offs (Pros & Cons) */}
      {(prosAndCons.pros?.length > 0 || prosAndCons.cons?.length > 0) && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <ScaleIcon size={16} />
            </span>
            <span>Engineering Trade-Offs</span>
          </h2>
          <div className="ts-pros-cons-grid">
            <div className="ts-pro-box">
              <div className="ts-pro-title">
                <span className="ts-icon-pill ts-icon-pill--pro">
                  <CheckIcon size={11} />
                </span>
                <span>Advantages &amp; Strengths</span>
              </div>
              <ul className="ts-bullet-list">
                {prosAndCons.pros.map((pro, idx) => (
                  <li key={idx} className="ts-bullet-item">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="ts-con-box">
              <div className="ts-con-title">
                <span className="ts-icon-pill ts-icon-pill--con">
                  <XIcon size={11} />
                </span>
                <span>Limitations &amp; Drawbacks</span>
              </div>
              <ul className="ts-bullet-list">
                {prosAndCons.cons.map((con, idx) => (
                  <li key={idx} className="ts-bullet-item">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* 9. Edge Cases */}
      {edgeCases.length > 0 && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <FlaskIcon size={16} />
            </span>
            <span>Input Scenarios &amp; Edge Cases</span>
          </h2>
          <div className="ts-table-container">
            <table className="ts-edge-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }}>Scenario</th>
                  <th>Algorithmic Behavior</th>
                </tr>
              </thead>
              <tbody>
                {edgeCases.map((ec, idx) => (
                  <tr key={idx}>
                    <td className="ts-edge-name">{ec.name}</td>
                    <td className="ts-edge-desc">{ec.behavior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 10. Real-World Applications */}
      {realWorldApplications.length > 0 && (
        <section className="ts-section">
          <h2 className="ts-section-title">
            <span className="ts-section-icon-wrap">
              <GlobeIcon size={16} />
            </span>
            <span>Real-World Systems Applications</span>
          </h2>
          <div className="ts-apps-grid">
            {realWorldApplications.map((app, idx) => (
              <div key={idx} className="ts-app-card">
                <h3 className="ts-app-title">{app.title}</h3>
                <p className="ts-app-desc">{app.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 11. Key Takeaways & What to Learn Next */}
      <section className="ts-section ts-section--summary">
        {keyTakeaways.length > 0 && (
          <div className="ts-takeaways-card">
            <h2 className="ts-takeaways-title">
              <CheckCircleIcon size={18} />
              <span>Key Takeaways</span>
            </h2>
            <ul className="ts-bullet-list">
              {keyTakeaways.map((item, idx) => (
                <li key={idx} className="ts-bullet-item">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {nextTopics.length > 0 && (
          <div className="ts-next-card">
            <h2 className="ts-next-title">
              <RoadmapIcon size={18} />
              <span>Recommended Next Topics</span>
            </h2>
            <div className="ts-next-grid">
              {nextTopics.map((topic, idx) => (
                <Link key={idx} to={topic.path} className="ts-next-item">
                  <div className="ts-next-item__top">
                    <span className="ts-next-name">{topic.name}</span>
                    <span className="ts-next-arrow" aria-hidden="true">→</span>
                  </div>
                  <p className="ts-next-reason">{topic.reason}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
