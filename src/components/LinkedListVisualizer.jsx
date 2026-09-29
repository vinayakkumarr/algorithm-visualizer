import { useEffect, useRef } from "react";
import "./LinkedListVisualizer.css";

/**
 * LinkedListVisualizer — Unified horizontal linked list of [data|next] boxes.
 *
 * Supports:
 * - Traversal (HEAD, CURR, NULL highlight)
 * - Insertion & Deletion (NEW_NODE floating card, PREV, CURR, TARGET highlight)
 * - Reversal (PREV, CURR, NEXT tracking & pointer flipping)
 * - Cycle Detection (SLOW, FAST pointers & SVG cycle loopback connector)
 * - Full backward compatibility with legacy props
 */
export default function LinkedListVisualizer({
  nodes = [],
  listState = null,
  pointers = {},
  currentIdx = null,
  visited = new Set(),
  atNull = false,
  highlightNodes = {},
  floatingNode = null,
  cycleEdge = null,
  emptyMessage = "List is empty (HEAD = NULL)",
}) {
  const wrapperRef = useRef(null);

  // Normalize nodes array if listState is provided
  const displayNodes = nodes && nodes.length > 0
    ? nodes
    : listState && listState.nodes && listState.headId
    ? Object.values(listState.nodes) // or ordered
    : [];

  // Smooth container-scoped viewport tracking of active node / NULL / floating node
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    if (currentIdx === null || currentIdx === 0) {
      wrapper.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }

    const activeEl = wrapper.querySelector(".ll-node--current, .ll-null--active, .ll-node--target");
    if (activeEl) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const elRect = activeEl.getBoundingClientRect();
      const margin = 90;

      if (elRect.right > wrapperRect.right - margin) {
        wrapper.scrollBy({
          left: elRect.right - wrapperRect.right + margin,
          behavior: "smooth",
        });
      } else if (elRect.left < wrapperRect.left + margin) {
        wrapper.scrollBy({
          left: elRect.left - wrapperRect.left - margin,
          behavior: "smooth",
        });
      }
    }
  }, [currentIdx, atNull, displayNodes]);

  // If list is completely empty and no floating node, show empty placeholder
  if (displayNodes.length === 0 && !floatingNode) {
    return (
      <div className="ll-wrapper" ref={wrapperRef}>
        <div className="ll-empty" role="status" aria-label="Empty linked list">
          <span className="ll-empty__icon">∅</span>
          <span className="ll-empty__text">{emptyMessage}</span>
        </div>
      </div>
    );
  }

  /** Resolve CSS class for a node */
  function getNodeClass(node, idx) {
    const classes = ["ll-node"];
    const id = node.id;

    // Check specific highlight states
    if (highlightNodes[id]) {
      classes.push(`ll-node--${highlightNodes[id]}`);
    } else if (currentIdx === idx) {
      classes.push("ll-node--current");
    } else if (visited.has(idx) || visited.has(id)) {
      classes.push("ll-node--visited");
    }

    if (pointers.CURR === id || pointers.CURR === idx) {
      if (!classes.includes("ll-node--current")) classes.push("ll-node--current");
    }
    if (pointers.SLOW === id || pointers.SLOW === idx) {
      classes.push("ll-node--slow");
    }
    if (pointers.FAST === id || pointers.FAST === idx) {
      classes.push("ll-node--fast");
    }

    return classes.join(" ");
  }

  /** CSS class for the connector arrow after node idx */
  function getArrowClass(idx, node) {
    const isLast = idx === displayNodes.length - 1;
    if (cycleEdge && isLast) {
      return "ll-connector ll-connector--cycle";
    }

    const leftDone =
      visited.has(idx) ||
      visited.has(node.id) ||
      currentIdx === idx ||
      pointers.CURR === node.id;
    const rightDone = !isLast
      ? visited.has(idx + 1) ||
        visited.has(displayNodes[idx + 1]?.id) ||
        currentIdx === idx + 1 ||
        pointers.CURR === displayNodes[idx + 1]?.id
      : atNull;

    if (leftDone && rightDone) return "ll-connector ll-connector--active";
    if (leftDone) return "ll-connector ll-connector--partial";
    return "ll-connector";
  }

  /** Render pointer badges for a given node */
  function renderPointerBadges(node, idx) {
    const badges = [];
    const isHead = idx === 0 || pointers.HEAD === node.id || pointers.HEAD === idx;
    const isTail = idx === displayNodes.length - 1 || pointers.TAIL === node.id || pointers.TAIL === idx;
    const isCurr = currentIdx === idx || pointers.CURR === node.id || pointers.CURR === idx;
    const isPrev = pointers.PREV === node.id || pointers.PREV === idx;
    const isNext = pointers.NEXT === node.id || pointers.NEXT === idx;
    const isSlow = pointers.SLOW === node.id || pointers.SLOW === idx;
    const isFast = pointers.FAST === node.id || pointers.FAST === idx;
    const isVisited = (visited.has(idx) || visited.has(node.id)) && !isCurr && !isHead;

    if (isHead) badges.push({ key: "head", label: "HEAD", cls: "ll-lbl--head" });
    if (isPrev) badges.push({ key: "prev", label: "PREV", cls: "ll-lbl--prev" });
    if (isSlow) badges.push({ key: "slow", label: "SLOW 🐢", cls: "ll-lbl--slow" });
    if (isFast) badges.push({ key: "fast", label: "FAST 🐇", cls: "ll-lbl--fast" });
    if (isCurr && !isSlow && !isFast) badges.push({ key: "curr", label: "CURR ▼", cls: "ll-lbl--curr" });
    if (isNext) badges.push({ key: "next", label: "NEXT", cls: "ll-lbl--next" });
    if (isTail && !isHead) badges.push({ key: "tail", label: "TAIL", cls: "ll-lbl--tail" });
    if (isVisited && badges.length === 0) badges.push({ key: "done", label: "✓", cls: "ll-lbl--done" });

    return (
      <div className="ll-labels" aria-hidden="true">
        {badges.map((b) => (
          <span key={b.key} className={`ll-lbl ${b.cls}`}>
            {b.label}
          </span>
        ))}
        {badges.length === 0 && <span className="ll-lbl" />}
      </div>
    );
  }

  return (
    <div className="ll-wrapper" ref={wrapperRef}>
      {/* Floating newly-allocated node display (during insertion) */}
      {floatingNode && (
        <div className="ll-floating-shelf">
          <span className="ll-floating-title">New Node (Memory Allocated):</span>
          <div className="ll-cell ll-cell--floating">
            <div className="ll-labels" aria-hidden="true">
              <span className="ll-lbl ll-lbl--new">NEW NODE</span>
            </div>
            <div className="ll-node ll-node--new">
              <div className="ll-node__data">{floatingNode.value}</div>
              <div className="ll-node__ptr">
                <span className="ll-ptr-dot" />
                <span className="ll-ptr-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main horizontal node list */}
      <div
        className="ll-list"
        role="img"
        aria-label={`Linked list with ${displayNodes.length} nodes`}
      >
        {displayNodes.map((node, idx) => {
          const isLast = idx === displayNodes.length - 1;

          return (
            <div key={node.id || idx} className="ll-cell">
              {/* Pointer badges above node */}
              {renderPointerBadges(node, idx)}

              {/* [data | next] node box */}
              <div
                className={getNodeClass(node, idx)}
                aria-label={`Node ${idx}: value ${node.value}`}
              >
                <div className="ll-node__data">{node.value}</div>
                <div className="ll-node__ptr" aria-hidden="true">
                  <span className="ll-ptr-dot" />
                  <span className="ll-ptr-arrow">→</span>
                </div>
              </div>

              {/* Connector arrow */}
              <div className={getArrowClass(idx, node)} aria-hidden="true">
                <div className="ll-connector__line" />
                <div className="ll-connector__head">▶</div>
              </div>

              {/* NULL terminal (only rendered if list is acyclic) */}
              {isLast && !cycleEdge && (
                <div className="ll-null-cell">
                  <div className="ll-labels" aria-hidden="true">
                    {atNull && <span className="ll-lbl ll-lbl--curr">CURR ▼</span>}
                    {!atNull && <span className="ll-lbl" />}
                  </div>
                  <div
                    className={`ll-null ${atNull ? "ll-null--active" : ""}`}
                    aria-label="NULL — end of list"
                  >
                    NULL
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cycle loopback indicator */}
      {cycleEdge && displayNodes.length > 0 && (
        <div className="ll-cycle-banner" role="status" aria-live="polite">
          <span className="ll-cycle-loop-icon">↺</span>
          <span>
            Cycle Connection: Tail points back to node <strong>{cycleEdge.toValue !== undefined ? cycleEdge.toValue : "cycle entry"}</strong>
          </span>
        </div>
      )}
    </div>
  );
}
