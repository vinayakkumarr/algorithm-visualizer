import "./QueueVisualizer.css";

/**
 * QueueVisualizer — animated horizontal FIFO pipeline component.
 *
 * Visual Invariants:
 * - FRONT (Exit / Dequeue) is on the left at index 0.
 * - REAR (Entry / Enqueue) is on the right at index (length - 1).
 * - Elements strictly enter at REAR and exit from FRONT.
 *
 * Props:
 *   queue    Array<{ id: number, value: string|number, animating: 'enqueue'|'dequeue'|'front'|null }>
 *   maxSize  number (default 8)
 */
export default function QueueVisualizer({ queue = [], maxSize = 8 }) {
  const isEmpty = queue.length === 0;
  const isFull = queue.length >= maxSize;

  return (
    <div
      className="qv-container"
      role="figure"
      aria-label={`Queue containing ${queue.length} element${queue.length !== 1 ? "s" : ""}`}
    >
      {/* Capacity indicator bar (horizontal slot dots) */}
      <div className="qv__capacity-wrap">
        <span className="qv__capacity-label">Buffer Capacity</span>
        <div
          className="qv__capacity-dots"
          aria-label={`${queue.length} of ${maxSize} slots used`}
        >
          {Array.from({ length: maxSize }, (_, i) => (
            <div
              key={i}
              className={`qv__slot ${
                i < queue.length ? "qv__slot--used" : ""
              } ${i === maxSize - 1 && isFull ? "qv__slot--full" : ""}`}
            />
          ))}
        </div>
      </div>

      {/* Pipeline Track Card */}
      <div className="qv__track-card">
        {/* Direction of flow guidance */}
        <div className="qv__flow-banner">
          <span className="qv__flow-front">↲ DEQUEUE (Front)</span>
          <span className="qv__flow-rear">ENQUEUE ↳ (Rear)</span>
        </div>

        <div className="qv__pipeline">
          {/* Pointers Row */}
          {!isEmpty && (
            <div className="qv__pointers-row">
              {queue.map((item, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;
                const isSingle = queue.length === 1;

                return (
                  <div key={`ptr-${item.id}`} className="qv__pointer-cell">
                    {isSingle ? (
                      <span className="qv__pointer-badge qv__pointer-badge--single">
                        F &amp; R ↓
                      </span>
                    ) : isFront ? (
                      <span className="qv__pointer-badge qv__pointer-badge--front">
                        FRONT ↓
                      </span>
                    ) : isRear ? (
                      <span className="qv__pointer-badge qv__pointer-badge--rear">
                        REAR ↓
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}

          {/* Items Row */}
          <div className="qv__items-row">
            {isEmpty ? (
              <div className="qv__empty" aria-live="polite">
                Queue is empty (Front = null, Rear = null)
              </div>
            ) : (
              queue.map((item, idx) => {
                const isFront = idx === 0;
                const isRear = idx === queue.length - 1;
                const isSingle = queue.length === 1;

                let stateClass = "";
                if (isSingle) stateClass = "qv__item--single";
                else if (isFront) stateClass = "qv__item--front";
                else if (isRear) stateClass = "qv__item--rear";

                const animClass = item.animating
                  ? item.animating === "front"
                    ? "qv__item--front-pulse"
                    : `qv__item--${item.animating}`
                  : "";

                return (
                  <div
                    key={item.id}
                    className={`qv__item ${stateClass} ${animClass}`}
                    aria-label={`Index ${idx}: ${item.value}`}
                  >
                    <span className="qv__item-idx" aria-hidden="true">
                      [{idx}]
                    </span>
                    <span className="qv__item-val">{item.value}</span>
                    <span
                      className={`qv__item-tag ${
                        isFront
                          ? "qv__item-tag--front"
                          : isRear
                          ? "qv__item-tag--rear"
                          : ""
                      }`}
                    >
                      {isSingle
                        ? "front/rear"
                        : isFront
                        ? "front"
                        : isRear
                        ? "rear"
                        : ""}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
