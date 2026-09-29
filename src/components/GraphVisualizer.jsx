import "./GraphVisualizer.css";

// Fixed graph data
export const GRAPH = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 5],
  5: [2, 4],
};

// Fixed pixel positions for the 6-node layout:
//
//        0
//       / \
//      1   2
//     /|    \
//    3  4 -- 5
//
const NODE_POS = {
  0: { x: 280, y: 55  },
  1: { x: 135, y: 175 },
  2: { x: 425, y: 175 },
  3: { x: 65,  y: 305 },
  4: { x: 260, y: 305 },
  5: { x: 455, y: 305 },
};

// Unique undirected edges (derived from GRAPH, no duplicates)
const EDGES = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 5]];

const NODE_R  = 26;   // circle radius
const SVG_W   = 560;
const SVG_H   = 360;

// Component
/**
 * GraphVisualizer — SVG graph diagram with node state colouring.
 *
 * Props

 * visited   Set<nodeId>   fully processed nodes         → green
 * pending   Set<nodeId>   in queue / on stack            → amber
 * current   nodeId|null   node being processed right now → bright amber
 */
export default function GraphVisualizer({
  visited = new Set(),
  pending = new Set(),
  current = null,
}) {
  /** CSS modifier class for a node. */
  function nodeStateClass(id) {
    if (id === current)   return "gv-node--current";
    if (visited.has(id))  return "gv-node--visited";
    if (pending.has(id))  return "gv-node--pending";
    return "";
  }

  /** Whether to highlight an edge (both endpoints visited or one is current). */
  function edgeClass(a, b) {
    const aGreen = visited.has(a) || a === current;
    const bGreen = visited.has(b) || b === current;
    if (aGreen && bGreen) return "gv-edge--visited";
    return "";
  }

  return (
    <div className="gv-wrapper">
      <svg
        className="gv-svg"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        role="img"
        aria-label="Graph with 6 nodes"
      >
        {/* Edges (drawn first so nodes appear on top) */}
        {EDGES.map(([a, b]) => {
          const p1 = NODE_POS[a];
          const p2 = NODE_POS[b];
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          // Clip line at circle edges
          const x1 = p1.x + NODE_R * Math.cos(angle);
          const y1 = p1.y + NODE_R * Math.sin(angle);
          const x2 = p2.x - NODE_R * Math.cos(angle);
          const y2 = p2.y - NODE_R * Math.sin(angle);

          return (
            <line
              key={`${a}-${b}`}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              className={`gv-edge ${edgeClass(a, b)}`}
            />
          );
        })}

        {/* Nodes */}
        {Object.entries(NODE_POS).map(([idStr, { x, y }]) => {
          const id = Number(idStr);
          return (
            <g
              key={id}
              className={`gv-node ${nodeStateClass(id)}`}
              aria-label={`Node ${id}`}
            >
              <circle cx={x} cy={y} r={NODE_R} />
              <text
                x={x} y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="gv-node__text"
              >
                {id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
