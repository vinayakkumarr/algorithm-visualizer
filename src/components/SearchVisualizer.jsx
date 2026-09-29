import { useEffect, useRef } from "react";
import "./SearchVisualizer.css";

/**
 * SearchVisualizer — numbered-box grid for search algorithm pages.
 *
 * Props

 * array       number[]         Values to display
 * target      number | ""      Value being searched (highlights match)
 * checking    number | null    Index currently being examined    → amber
 * found       number | null    Index where target was found      → green
 * eliminated  Set<number>      Indices ruled out of the search   → gray
 *
 * Binary-search pointer props (all optional):
 * low         number | null    Left boundary pointer
 * mid         number | null    Mid pointer
 * high        number | null    Right boundary pointer
 */
export default function SearchVisualizer({
  array      = [],
  target     = "",
  checking   = null,
  found      = null,
  eliminated = new Set(),
  low        = null,
  mid        = null,
  high       = null,
}) {
  const containerRef = useRef(null);

  // Auto-track the active checking / found box if wrapping occurs
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const activeBox = container.querySelector(".sv-box--checking, .sv-box--found");
    if (activeBox) {
      const containerRect = container.getBoundingClientRect();
      const boxRect = activeBox.getBoundingClientRect();
      const margin = 30;

      if (boxRect.bottom > containerRect.bottom - margin) {
        container.scrollBy({
          top: boxRect.bottom - containerRect.bottom + margin,
          behavior: "smooth",
        });
      } else if (boxRect.top < containerRect.top + margin) {
        container.scrollBy({
          top: boxRect.top - containerRect.top - margin,
          behavior: "smooth",
        });
      }
    }
  }, [checking, found]);

  if (array.length === 0) return null;

  /**
   * Colour priority:  found > checking > eliminated > default
   * (found wins over everything — never override a confirmed match)
   */
  function stateClass(idx) {
    if (found      === idx)   return "sv-box--found";
    if (checking   === idx)   return "sv-box--checking";
    if (eliminated.has(idx))  return "sv-box--eliminated";
    return "";
  }

  const hasPointers = low !== null || mid !== null || high !== null;

  return (
    <div
      className="search-visualizer"
      ref={containerRef}
      role="list"
      aria-label={`Array of ${array.length} elements`}
    >
      {array.map((val, idx) => {
        const cls    = stateClass(idx);
        const isLow  = low  === idx;
        const isMid  = mid  === idx;
        const isHigh = high === idx;
        const isTarget = val === Number(target) && target !== "";

        return (
          <div
            key={idx}
            className="sv-cell"
            role="listitem"
            aria-label={`Index ${idx}: value ${val}`}
          >
            {/* Index label above the box */}
            <span className="sv-cell__index" aria-hidden="true">{idx}</span>

            {/* The box */}
            <div className={`sv-box ${cls} ${isTarget && cls === "" ? "sv-box--target-hint" : ""}`}>
              {val}
            </div>

            {/* Binary-search pointer labels below the box */}
            {hasPointers && (
              <div className="sv-cell__pointers" aria-hidden="true">
                {isLow  && <span className="sv-ptr sv-ptr--low"  title="Low">L</span>}
                {isMid  && <span className="sv-ptr sv-ptr--mid"  title="Mid">M</span>}
                {isHigh && <span className="sv-ptr sv-ptr--high" title="High">H</span>}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
