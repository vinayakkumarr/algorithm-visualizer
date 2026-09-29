import { useState, useMemo, useEffect, useRef } from "react";
import { useVisualizer } from "../context/VisualizerContext";
import { CustomArrayIcon } from "./Icons";
import "./ArrayBars.css";

/**
 * ArrayBars — Enhanced array visualizer for sorting algorithms.
 *
 * Features:
 *   1. Dynamic Bounded Normalization (14%–94% height)
 *   2. Interactive Hover Inspection Badge (shows Index, Value, State)
 *   3. Intelligent Index Axis with highlighted active markers
 *   4. Subarray / Partition Range Highlighting & Pivot Pin Marker
 *   5. Dual-Mode Switcher: Bars 📊 vs. Memory Cells 🧱
 *   6. Swap Connection Indicator for active pairs
 *
 * Props:
 *   array      number[]        Current state of array
 *   comparing  number[]        Indices being compared (amber)
 *   swapped    number[]        Indices being swapped / written (red)
 *   done       Set<number>     Indices in final sorted position (green)
 *   pivot      number | null   Current pivot index (accent/purple)
 *   range      [number,number] Active subarray boundary [low, high]
 *   className  string          Optional container class
 */
export default function ArrayBars({
  array = [],
  comparing = [],
  swapped = [],
  done = new Set(),
  pivot = null,
  range = null,
  onOpenCustom = null,
  className = "",
}) {
  const { openCustomModal, isCustomArrayAvailable, isRunning } = useVisualizer();
  const handleOpenCustom = onOpenCustom || (isCustomArrayAvailable ? openCustomModal : null);
  const [viewMode, setViewMode] = useState("bars"); // 'bars' | 'cells'
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const stageRef = useRef(null);

  // When in Cells mode, track active comparing / swapping cells
  useEffect(() => {
    if (viewMode !== "cells") return;
    const stage = stageRef.current;
    if (!stage) return;

    const activeCell = stage.querySelector(".ab-cell--comparing, .ab-cell--swapping");
    if (activeCell) {
      const stageRect = stage.getBoundingClientRect();
      const cellRect = activeCell.getBoundingClientRect();
      const margin = 30;
      const scrollBehavior = isRunning ? "auto" : "smooth";

      if (cellRect.bottom > stageRect.bottom - margin) {
        stage.scrollBy({
          top: cellRect.bottom - stageRect.bottom + margin,
          behavior: scrollBehavior,
        });
      } else if (cellRect.top < stageRect.top + margin) {
        stage.scrollBy({
          top: cellRect.top - stageRect.top - margin,
          behavior: scrollBehavior,
        });
      }
    }
  }, [comparing, swapped, viewMode, isRunning]);

  const n = array.length;
  const minVal = useMemo(() => (array.length > 0 ? Math.min(...array, 0) : 0), [array]);
  const maxVal = useMemo(() => (array.length > 0 ? Math.max(...array, 1) : 1), [array]);
  const rangeSpan = maxVal - minVal || 1;

  // Show top value labels on bars if count allows
  const showBarLabels = n <= 24;

  /**
   * Determine semantic state for an index
   */
  function getState(idx) {
    if (pivot === idx) return "pivot";
    if (swapped.includes(idx)) return "swapping";
    if (comparing.includes(idx)) return "comparing";
    if (done.has(idx)) return "sorted";
    if (range && (idx < range[0] || idx > range[1])) return "dimmed";
    return "default";
  }

  function getStateLabel(state) {
    switch (state) {
      case "pivot": return "Pivot Element";
      case "swapping": return "Swapping / Writing";
      case "comparing": return "Comparing";
      case "sorted": return "Sorted (Locked)";
      case "dimmed": return "Inactive Partition";
      default: return "Unsorted";
    }
  }

  // Calculate normalized height in percentage (14% to 94%)
  function getBarHeight(val) {
    return 14 + ((val - minVal) / rangeSpan) * 80;
  }

  // Determine which indices get an axis label
  const axisIndices = useMemo(() => {
    if (n === 0) return new Set();
    const indices = [];
    let step = 1;
    if (n > 45) step = 10;
    else if (n > 24) step = 5;

    for (let i = 0; i < n; i += step) {
      indices.push(i);
    }
    if (indices[indices.length - 1] !== n - 1) {
      indices.push(n - 1);
    }
    return new Set(indices);
  }, [n]);

  if (n === 0) return null;

  return (
    <div
      className={`array-view-container${className ? ` ${className}` : ""}`}
      onMouseLeave={() => setHoveredIdx(null)}
    >
      {/* Top Bar: Partition info + Hover Card + Mode Switcher */}
      <div className="ab-header-row">
        {/* Partition / Subarray Badge & Custom Array button */}
        <div className="ab-meta-left">
          {handleOpenCustom && (
            <button
              type="button"
              className="ab-custom-btn"
              onClick={handleOpenCustom}
              disabled={isRunning}
              title="Create or paste a custom array"
            >
              <CustomArrayIcon size={13} className="ab-custom-icon" />
              <span>Custom Array</span>
            </button>
          )}
          {range && (
            <span className="ab-range-badge" title="Active recursive partition range">
              Subarray [{range[0]}..{range[1]}]
              <span className="ab-range-len">({range[1] - range[0] + 1} items)</span>
            </span>
          )}
        </div>

        {/* Live Hover Inspection Card */}
        <div className="ab-inspect-center">
          {hoveredIdx !== null && hoveredIdx < n ? (
            <div className={`ab-inspect-pill ab-inspect--${getState(hoveredIdx)}`}>
              <span className="ab-inspect-idx">Index <strong>[{hoveredIdx}]</strong></span>
              <span className="ab-inspect-val">Value: <strong>{array[hoveredIdx]}</strong></span>
              <span className="ab-inspect-status">{getStateLabel(getState(hoveredIdx))}</span>
            </div>
          ) : (
            <span className="ab-inspect-hint">Hover over elements to inspect</span>
          )}
        </div>

        {/* View Mode Switcher (Bars vs Cells) */}
        <div className="ab-view-toggle">
          <button
            type="button"
            className={`ab-toggle-btn ${viewMode === "bars" ? "ab-toggle-btn--active" : ""}`}
            onClick={() => setViewMode("bars")}
            title="Vertical Bar View"
            aria-label="Bar View"
          >
            📊 Bars
          </button>
          <button
            type="button"
            className={`ab-toggle-btn ${viewMode === "cells" ? "ab-toggle-btn--active" : ""}`}
            onClick={() => setViewMode("cells")}
            title="Memory Cell View"
            aria-label="Cell View"
          >
            🧱 Cells
          </button>
        </div>
      </div>

      {/* MODE 1: Vertical Bar Chart */}
      {viewMode === "bars" ? (
        <div
          className="array-bars-stage"
          role="img"
          aria-label={`Array visualization of ${n} elements`}
        >
          {/* Active Partition Highlight Box (if range is defined) */}
          {range && n > 0 && (
            <div
              className="ab-partition-overlay"
              style={{
                left: `${(range[0] / n) * 100}%`,
                width: `${((range[1] - range[0] + 1) / n) * 100}%`,
              }}
              aria-hidden="true"
            />
          )}

          {/* Bar wrappers */}
          <div className="array-bars">
            {array.map((val, idx) => {
              const state = getState(idx);
              const heightPct = getBarHeight(val);
              const isHovered = hoveredIdx === idx;
              const isPivot = pivot === idx;

              return (
                <div
                  key={idx}
                  className={`bar-wrapper ${showBarLabels ? "bar-wrapper--labeled" : ""} ${
                    isHovered ? "bar-wrapper--hovered" : ""
                  }`}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  aria-label={`Element ${idx}: ${val} (${getStateLabel(state)})`}
                >
                  {/* Pivot pin badge */}
                  {isPivot && (
                    <span className="bar-pivot-tag" title="Pivot element" aria-hidden="true">
                      ▼ P
                    </span>
                  )}

                  {/* Value label on top (when array size permits) */}
                  {showBarLabels && (
                    <span className={`bar-label bar-label--${state}`} aria-hidden="true">
                      {val}
                    </span>
                  )}

                  {/* The bar element */}
                  <div
                    className={`bar bar--${state} ${isHovered ? "bar--hover" : ""}`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Index Axis Baseline */}
          <div className="ab-axis" aria-hidden="true">
            {array.map((_, idx) => {
              const state = getState(idx);
              const isHighlighted = state === "comparing" || state === "swapping" || state === "pivot";
              const shouldShowLabel = axisIndices.has(idx) || isHighlighted;

              return (
                <div
                  key={idx}
                  className={`ab-axis-tick ${isHighlighted ? `ab-axis-tick--${state}` : ""}`}
                  style={{ flex: 1 }}
                >
                  {shouldShowLabel && (
                    <span className="ab-axis-num">{idx}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* MODE 2: Memory Cells Grid (Search-style boxes for sorting) */
        <div className="array-cells-stage" ref={stageRef}>
          <div className="array-cells-grid" role="list" aria-label="Array memory cells">
            {array.map((val, idx) => {
              const state = getState(idx);
              const isHovered = hoveredIdx === idx;
              const isPivot = pivot === idx;

              return (
                <div
                  key={idx}
                  className={`ab-cell ${isHovered ? "ab-cell--hovered" : ""}`}
                  role="listitem"
                  onMouseEnter={() => setHoveredIdx(idx)}
                >
                  <span className="ab-cell__idx">{idx}</span>
                  <div className={`ab-cell__box ab-cell--${state}`}>
                    {val}
                    {isPivot && <span className="ab-cell__pivot-badge">P</span>}
                  </div>
                  <span className="ab-cell__status-dot" />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
