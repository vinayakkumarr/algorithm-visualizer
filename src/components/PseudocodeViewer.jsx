import { useEffect, useRef } from "react";
import "./PseudocodeViewer.css";

/**
 * PseudocodeViewer — Synchronized code tracer panel.
 *
 * Props:
 *   code        string[]  — array of pseudocode lines
 *   activeLine  number    — index of currently active line (0-indexed, -1 if none)
 *   title       string    — panel title (default: "Pseudocode")
 */
export default function PseudocodeViewer({
  code = [],
  activeLine = -1,
  title = "Pseudocode",
}) {
  const activeLineRef = useRef(null);
  const containerRef  = useRef(null);

  useEffect(() => {
    if (activeLine >= 0 && activeLineRef.current && containerRef.current) {
      const container = containerRef.current;
      const lineEl = activeLineRef.current;
      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;
      const lineTop = lineEl.offsetTop;
      const lineBottom = lineTop + lineEl.offsetHeight;

      if (lineTop < containerTop) {
        container.scrollTo({ top: lineTop, behavior: "smooth" });
      } else if (lineBottom > containerBottom) {
        container.scrollTo({
          top: lineBottom - container.clientHeight,
          behavior: "smooth",
        });
      }
    }
  }, [activeLine]);

  if (!Array.isArray(code) || code.length === 0) return null;

  return (
    <div className="vl-pseudocode pv" aria-label={`${title} tracer`}>
      <div className="pv__header">
        <span className="pv__title">{title}</span>
        {activeLine >= 0 && (
          <span className="pv__badge" aria-label={`Line ${activeLine + 1} active`}>
            Line {activeLine + 1}
          </span>
        )}
      </div>

      <div className="pv__content" ref={containerRef}>
        <ol className="pv__list" role="list">
          {code.map((line, idx) => {
            const isActive = idx === activeLine;
            return (
              <li
                key={idx}
                ref={isActive ? activeLineRef : null}
                className={`pv__line ${isActive ? "pv__line--active" : ""}`}
                aria-current={isActive ? "true" : undefined}
              >
                <span className="pv__line-num" aria-hidden="true">
                  {idx + 1}
                </span>
                <code className="pv__line-code">{line}</code>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
