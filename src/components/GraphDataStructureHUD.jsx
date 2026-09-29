import { CheckCircleIcon } from "./Icons";
import "./GraphDataStructureHUD.css";

/**
 * GraphDataStructureHUD
 * High-clarity visualizer for Graph Auxiliary Data Structures (Queue / Stack)
 * and Visited Sequence.
 */
export default function GraphDataStructureHUD({
  type = "queue", // "queue" | "stack"
  items = [],
  visitedOrder = [],
  totalNodes = 6,
}) {
  const isQueue = type === "queue";
  const displayItems = isQueue ? items : [...items].reverse();

  return (
    <div className="gdsh" role="region" aria-label="Graph Data Structure Status">
      {/* Card 1: Active Data Structure Pipeline */}
      <div className="gdsh__card gdsh__card--pipeline">
        <div className="gdsh__header">
          <div className="gdsh__title-group">
            <span className="gdsh__icon" aria-hidden="true">
              {isQueue ? "⚡" : "📚"}
            </span>
            <span className="gdsh__title">
              {isQueue ? "Queue" : "Call Stack"}
            </span>
            <span className="gdsh__badge gdsh__badge--sub">
              {isQueue ? "FIFO" : "LIFO"}
            </span>
          </div>

          <span className="gdsh__count">
            {items.length} {items.length === 1 ? "element" : "elements"}
          </span>
        </div>

        <div className="gdsh__track" aria-label={`Current ${isQueue ? "queue" : "stack"} items`}>
          {isQueue && (
            <span className="gdsh__flow-hint gdsh__flow-hint--in" title="New nodes enqueue at rear">
              IN ➔
            </span>
          )}

          <div className="gdsh__cells">
            {displayItems.length > 0 ? (
              displayItems.map((nodeId, idx) => {
                const isPrimary = idx === 0;
                return (
                  <div
                    key={`${nodeId}-${idx}`}
                    className={`gdsh__cell ${isPrimary ? "gdsh__cell--primary" : ""}`}
                    title={isPrimary ? (isQueue ? "Front element (Next to dequeue)" : "Top of stack (Next to pop)") : undefined}
                  >
                    <div className="gdsh__cell-box">{nodeId}</div>
                    {isPrimary && (
                      <span className="gdsh__cell-label">
                        {isQueue ? "FRONT" : "TOP"}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="gdsh__empty">
                <span>{isQueue ? "Queue is empty" : "Stack is empty"}</span>
              </div>
            )}
          </div>

          {isQueue && (
            <span className="gdsh__flow-hint gdsh__flow-hint--out" title="Processed nodes dequeue from front">
              ➔ OUT
            </span>
          )}

          {!isQueue && (
            <span className="gdsh__flow-hint gdsh__flow-hint--stack" title="Push and pop operations occur at top">
              ↕ TOP
            </span>
          )}
        </div>
      </div>

      {/* Card 2: Visited Order Sequence */}
      <div className="gdsh__card gdsh__card--visited">
        <div className="gdsh__header">
          <div className="gdsh__title-group">
            <CheckCircleIcon size={13} className="gdsh__icon gdsh__icon--visited" />
            <span className="gdsh__title">Visited Sequence</span>
          </div>

          <span className="gdsh__count gdsh__count--visited">
            {visitedOrder.length} / {totalNodes} Visited
          </span>
        </div>

        <div className="gdsh__visited-track" aria-label="Visited node order">
          {visitedOrder.length > 0 ? (
            <div className="gdsh__visited-list">
              {visitedOrder.map((nodeId, idx) => (
                <div key={nodeId} className="gdsh__visited-step">
                  {idx > 0 && <span className="gdsh__arrow" aria-hidden="true">→</span>}
                  <div
                    className="gdsh__visited-node"
                    title={`Step #${idx + 1}: Visited Node ${nodeId}`}
                  >
                    <span className="gdsh__visited-num">{nodeId}</span>
                    <span className="gdsh__visited-order-tag">#{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="gdsh__empty">
              <span>No nodes visited yet</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
