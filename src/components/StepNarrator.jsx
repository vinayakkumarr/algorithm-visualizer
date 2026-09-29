import { useMemo } from "react";
import { CompareIcon, SwapIcon, CheckCircleIcon, TargetIcon, ActivityIcon } from "./Icons";

/**
 * Classify the narrative into an action theme, label badge, and icon
 */
function classifyNarrative(text = "") {
  const lower = text.toLowerCase();
  if (/pivot/i.test(lower)) {
    return { type: "PIVOT", theme: "pivot", Icon: TargetIcon };
  }
  if (/swap|writ|mov|replac|shift|insert/i.test(lower)) {
    return { type: "SWAP", theme: "swapping", Icon: SwapIcon };
  }
  if (/scan|compar|check|inspect|look/i.test(lower)) {
    return { type: "COMPARE", theme: "comparing", Icon: CompareIcon };
  }
  if (/sorted|complete|done|finish|success|found/i.test(lower)) {
    return { type: "COMPLETE", theme: "sorted", Icon: CheckCircleIcon };
  }
  return { type: "STEP", theme: "default", Icon: ActivityIcon };
}

/**
 * Tokenize narrative text to syntax-highlight array indexing and numeric values
 */
function renderTokenizedText(text = "") {
  if (!text) return null;

  // Split on array indexing like arr[8], A[i] and parenthesized values like (30)
  const parts = text.split(/([a-zA-Z0-9_$]+\[[^\]]+\]|\(\d+\))/g);

  return parts.map((part, index) => {
    if (!part) return null;
    if (/^\(\d+\)$/.test(part)) {
      return (
        <span key={index} className="vl-token vl-token--val">
          {part}
        </span>
      );
    }
    if (/^[a-zA-Z0-9_$]+\[[^\]]+\]$/.test(part)) {
      return (
        <code key={index} className="vl-token vl-token--code">
          {part}
        </code>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

export default function StepNarrator({ narrative, stepIdx = 0, totalSteps = 0 }) {
  const { type, theme, Icon } = useMemo(() => classifyNarrative(narrative), [narrative]);
  const progressPct = totalSteps > 0 ? Math.min(100, Math.round((Math.min(stepIdx, totalSteps) / totalSteps) * 100)) : 0;

  if (!narrative) return null;

  return (
    <div
      className={`vl__narrator vl__narrator--${theme}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="vl__narrator-left">
        <div className={`vl__narrator-icon-wrap vl__narrator-icon-wrap--${theme}`} aria-hidden="true">
          <Icon size={13} className="vl__narrator-icon" />
        </div>

        <span className={`vl__narrator-pill vl__narrator-pill--${theme}`}>
          {type}
        </span>

        <span className="vl__narrator-text">
          {renderTokenizedText(narrative)}
        </span>
      </div>

      {totalSteps > 0 && (
        <div className="vl__narrator-telemetry">
          <div className="vl__narrator-step-badge">
            <span className="vl__narrator-step-label">Step</span>
            <span className="vl__narrator-step-val">
              <strong>{Math.min(stepIdx, totalSteps)}</strong>
              <span className="vl__narrator-sep">/</span>
              {totalSteps}
            </span>
          </div>

          <div
            className="vl__narrator-progress-track"
            title={`Execution Progress: ${progressPct}%`}
            aria-hidden="true"
          >
            <div
              className={`vl__narrator-progress-bar vl__narrator-progress-bar--${theme}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
