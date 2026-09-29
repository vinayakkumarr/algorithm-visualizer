import "./StackVisualizer.css";

/**
 * StackVisualizer — animated vertical stack of boxes.
 *
 * Props

 * stack    Array<{ id, value, animating: 'push'|'pop'|null }>
 * maxSize  number   maximum capacity (default 8)
 */
export default function StackVisualizer({ stack = [], maxSize = 8 }) {
  // Render in reverse so the top-of-stack element is first in the DOM
  // (visually at the top of the column)
  const displayStack = [...stack].reverse();
  const isEmpty = stack.length === 0;
  const isFull  = stack.length >= maxSize;

  return (
    <div className="sv" role="figure" aria-label={`Stack containing ${stack.length} element${stack.length !== 1 ? "s" : ""}`}>

      {/* Capacity bar (dots on the left) */}
      <div className="sv__capacity" aria-label={`${stack.length} of ${maxSize} slots used`}>
        {Array.from({ length: maxSize }, (_, i) => (
          <div
            key={i}
            className={`sv__slot ${i < stack.length ? "sv__slot--used" : ""} ${i === maxSize - 1 && isFull ? "sv__slot--full" : ""}`}
          />
        ))}
      </div>

      {/* Stack column */}
      <div className="sv__column">

        {/* TOP pointer — floats above the top item */}
        <div className={`sv__top-pointer ${isEmpty ? "sv__top-pointer--hidden" : ""}`} aria-hidden="true">
          <span className="sv__top-pointer-label">TOP</span>
          <span className="sv__top-pointer-arrow">↓</span>
        </div>

        {/* Stack items */}
        <div className="sv__items">
          {displayStack.map((item, displayIdx) => {
            const isTop       = displayIdx === 0;
            const originalIdx = stack.length - 1 - displayIdx;
            const animClass   = item.animating ? `sv__item--${item.animating}` : "";

            return (
              <div
                key={item.id}
                className={`sv__item ${animClass} ${isTop ? "sv__item--top" : ""}`}
                aria-label={`Index ${originalIdx}: ${item.value}`}
              >
                {/* Left: stack index */}
                <span className="sv__item-idx" aria-hidden="true">[{originalIdx}]</span>

                {/* Center: value */}
                <span className="sv__item-val">{item.value}</span>

                {/* Right: TOP badge on the top element */}
                {isTop
                  ? <span className="sv__item-badge sv__item-badge--top" aria-hidden="true">top</span>
                  : <span className="sv__item-badge" aria-hidden="true" />
                }
              </div>
            );
          })}

          {/* Empty placeholder so the floor is always visible */}
          {isEmpty && (
            <div className="sv__empty" aria-live="polite">
              Stack is empty
            </div>
          )}
        </div>

        {/* Stack floor */}
        <div className="sv__floor" aria-hidden="true">
          <span className="sv__floor-label">BOTTOM</span>
        </div>
      </div>
    </div>
  );
}
