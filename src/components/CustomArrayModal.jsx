import { useState, useEffect, useRef } from "react";
import { PRESETS, parseCustomArray } from "../algorithms/arrayPresets";
import { CustomArrayIcon } from "./Icons";
import "./CustomArrayModal.css";

/**
 * CustomArrayModal — Dialog for entering custom array data with real-time validation.
 *
 * Props:
 *   isOpen         boolean   Whether the modal is visible
 *   onClose        fn()      Callback to close the modal
 *   onApply        fn(arr)   Callback receiving the validated number[]
 *   currentArray   number[]  Existing array to populate initial text
 *   requireSorted  boolean   If true, offers auto-sort button for Binary Search
 *   minSize        number    Minimum elements allowed (default 3)
 *   maxSize        number    Maximum elements allowed (default 80)
 */
export default function CustomArrayModal({
  isOpen,
  onClose,
  onApply,
  currentArray = [],
  requireSorted = false,
  minSize = 3,
  maxSize = 80,
}) {
  const [text, setText] = useState("");
  const [autoSort, setAutoSort] = useState(requireSorted);
  const textareaRef = useRef(null);
  const modalRef = useRef(null);

  // Sync initial text when modal opens
  useEffect(() => {
    if (isOpen) {
      setText(currentArray.length > 0 ? currentArray.join(", ") : "45, 12, 85, 32, 89, 39, 67, 24, 53, 19");
      setAutoSort(requireSorted);
      setTimeout(() => {
        textareaRef.current?.focus();
        textareaRef.current?.select();
      }, 50);
    }
  }, [isOpen, currentArray, requireSorted]);

  // Handle Escape key and Tab focus containment (WAI-ARIA Dialog Pattern)
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Real-time validation
  const validation = parseCustomArray(text, minSize, maxSize);
  const isValid = validation.values !== null;

  // Check if sorted for binary search
  const isSorted = isValid
    ? validation.values.every((v, i, arr) => i === 0 || arr[i - 1] <= v)
    : false;

  function handlePreset(key) {
    const generator = PRESETS[key];
    if (generator) {
      const generated = generator(currentArray.length || 20);
      setText(generated.join(", "));
    }
  }

  function handleApply() {
    if (!isValid) return;
    let finalValues = [...validation.values];
    if (requireSorted || autoSort) {
      finalValues.sort((a, b) => a - b);
    }
    onApply(finalValues);
    onClose();
  }

  return (
    <div
      className="cam-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cam-title"
    >
      <div className="cam-modal" ref={modalRef}>
        {/* Header */}
        <div className="cam-header">
          <div className="cam-title-group">
            <div className="cam-icon-box" aria-hidden="true">
              <CustomArrayIcon size={20} className="cam-header-icon" />
            </div>
            <div>
              <h2 id="cam-title" className="cam-title">Custom Array Builder</h2>
              <p className="cam-subtitle">
                Enter {minSize}–{maxSize} numbers separated by commas or spaces (1–999)
              </p>
            </div>
          </div>
          <button
            type="button"
            className="cam-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets */}
        <div className="cam-presets-row">
          <span className="cam-presets-label">Presets:</span>
          <button type="button" className="cam-preset-btn" onClick={() => handlePreset("random")}>
            Random
          </button>
          <button type="button" className="cam-preset-btn" onClick={() => handlePreset("sorted")}>
            Sorted
          </button>
          <button type="button" className="cam-preset-btn" onClick={() => handlePreset("reverseSorted")}>
            Reversed
          </button>
          <button type="button" className="cam-preset-btn" onClick={() => handlePreset("nearSorted")}>
            Near Sorted
          </button>
          <button type="button" className="cam-preset-btn" onClick={() => handlePreset("duplicates")}>
            Duplicates
          </button>
        </div>

        {/* Textarea Input */}
        <div className="cam-input-group">
          <textarea
            ref={textareaRef}
            className={`cam-textarea ${!isValid && text.trim() ? "cam-textarea--error" : ""}`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. 45, 12, 85, 32, 89, 39, 67, 24, 53, 19"
            rows={4}
            aria-describedby="cam-validation-msg"
          />
        </div>

        {/* Real-time Status / Validation pill */}
        <div id="cam-validation-msg" className="cam-status-row" aria-live="polite">
          {isValid ? (
            <div className="cam-pill cam-pill--valid">
              <span className="cam-pill-icon">✓</span>
              <span>
                <strong>{validation.stats.count}</strong> elements • Range:{" "}
                <strong>[{validation.stats.min} .. {validation.stats.max}]</strong>
              </span>
              {requireSorted && !isSorted && (
                <span className="cam-pill-note">(will be sorted ascending)</span>
              )}
            </div>
          ) : (
            <div className="cam-pill cam-pill--invalid" role="alert">
              <span className="cam-pill-icon">⚠</span>
              <span>{validation.error}</span>
            </div>
          )}
        </div>

        {/* Auto-sort Option for Searching */}
        {requireSorted && isValid && !isSorted && (
          <div className="cam-sort-prompt">
            <label className="cam-checkbox-label">
              <input
                type="checkbox"
                checked={autoSort}
                onChange={(e) => setAutoSort(e.target.checked)}
              />
              <span>Auto-sort array ascending (required for Binary Search)</span>
            </label>
          </div>
        )}

        {/* Footer Actions */}
        <div className="cam-footer">
          <button
            type="button"
            className="cam-btn cam-btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cam-btn cam-btn--primary"
            onClick={handleApply}
            disabled={!isValid || (requireSorted && !autoSort && !isSorted)}
          >
            Apply to Visualizer →
          </button>
        </div>
      </div>
    </div>
  );
}
