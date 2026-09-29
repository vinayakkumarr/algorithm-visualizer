import { useMemo } from "react";
import "./DoublyLinkedListVisualizer.css";

export default function DoublyLinkedListVisualizer({
  nodes = [],
  pointers = {},
  highlightNodes = {},
  shelfNode = null,
  emptyMessage = "List is empty (HEAD = TAIL = NULL).",
}) {
  const pointerMap = useMemo(() => {
    const map = {};
    if (!pointers) return map;
    Object.entries(pointers).forEach(([name, id]) => {
      if (id) {
        if (!map[id]) map[id] = [];
        map[id].push(name);
      }
    });
    return map;
  }, [pointers]);

  return (
    <div className="dll-canvas" role="region" aria-label="Doubly Linked List Visualizer Canvas">
      {/* Optional Floating Memory Shelf */}
      {shelfNode && (
        <div className="dll-shelf-container">
          <div className="dll-shelf-label">Memory Allocation Shelf</div>
          <div className="dll-shelf-node-wrap">
            <div className="dll-node-card dll-node-card--shelf">
              <div className="dll-node-card__prev-box">prev: {shelfNode.prev ? "ID" : "NULL"}</div>
              <div className="dll-node-card__val">{shelfNode.value}</div>
              <div className="dll-node-card__next-box">next: {shelfNode.next ? "ID" : "NULL"}</div>
            </div>
            {pointerMap[shelfNode.id] && (
              <div className="dll-badges">
                {pointerMap[shelfNode.id].map((badge) => (
                  <span key={badge} className={`dll-badge dll-badge--${badge.toLowerCase()}`}>
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main List Track */}
      {nodes.length === 0 ? (
        <div className="dll-empty-state">
          <div className="dll-null-badge">HEAD → NULL</div>
          <p className="dll-empty-text">{emptyMessage}</p>
          <div className="dll-null-badge">TAIL → NULL</div>
        </div>
      ) : (
        <div className="dll-track">
          {/* Leading NULL */}
          <div className="dll-null-node">NULL ⇦</div>

          {nodes.map((node, index) => {
            const isHighlighted = highlightNodes[node.id];
            const badges = pointerMap[node.id] || [];

            return (
              <div key={node.id} className="dll-node-unit">
                {/* Pointer Badges */}
                <div className="dll-badges-area">
                  {badges.map((badge) => (
                    <span key={badge} className={`dll-badge dll-badge--${badge.toLowerCase()}`}>
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Node Box */}
                <div
                  className={`dll-node-card ${
                    isHighlighted ? `dll-node-card--${isHighlighted}` : ""
                  }`}
                >
                  <div className="dll-node-card__prev-box">
                    <span>prev</span>
                    <span className="dll-arrow-icon">⇦</span>
                  </div>
                  <div className="dll-node-card__val">{node.value}</div>
                  <div className="dll-node-card__next-box">
                    <span>next</span>
                    <span className="dll-arrow-icon">⇨</span>
                  </div>
                </div>

                {/* Bidirectional Link to next node */}
                {index < nodes.length - 1 ? (
                  <div className="dll-link">
                    <div className="dll-link__forward">⇨</div>
                    <div className="dll-link__backward">⇦</div>
                  </div>
                ) : (
                  <div className="dll-null-node">⇨ NULL</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
