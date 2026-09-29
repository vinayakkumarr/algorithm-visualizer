import { useMemo, useEffect, useRef } from "react";
import "./TreeVisualizer.css";

// Layout constants
const NODE_R    = 22;    // circle radius (px)
const H_SPACING = 58;    // horizontal gap between in-order positions
const V_SPACING = 74;    // vertical gap between depth levels
const PAD       = 40;    // canvas padding

// Layout computation
/**
 * Assign pixel positions to every node using in-order traversal index.
 * In-order index == sorted rank, so left subtree is always visually left.
 * Scales dynamically to any tree depth without arbitrary height limits.
 */
function computeLayout(root) {
  if (!root) return { positions: {}, svgW: 300, svgH: 120 };

  const positions = {};
  let xIdx    = 0;
  let maxDepth = 0;

  function inorder(node, depth) {
    if (!node) return;
    inorder(node.left,  depth + 1);
    positions[node.id] = { xIdx, depth };
    xIdx++;
    maxDepth = Math.max(maxDepth, depth);
    inorder(node.right, depth + 1);
  }

  inorder(root, 0);

  const svgW = Math.max(xIdx * H_SPACING + PAD * 2, 340);
  const svgH = Math.max((maxDepth + 1) * V_SPACING + PAD * 2, 180);

  // Convert indices to pixel coordinates
  for (const id in positions) {
    const { xIdx: xi, depth } = positions[id];
    positions[id] = {
      cx: PAD + xi * H_SPACING + H_SPACING / 2,
      cy: PAD + depth * V_SPACING,
    };
  }

  return { positions, svgW, svgH };
}

// Tree traversal helpers
function collectEdges(root) {
  const edges = [];
  function walk(node) {
    if (!node) return;
    if (node.left)  { edges.push({ from: node.id, to: node.left.id  }); walk(node.left);  }
    if (node.right) { edges.push({ from: node.id, to: node.right.id }); walk(node.right); }
  }
  walk(root);
  return edges;
}

function collectNodes(root) {
  const nodes = [];
  function walk(node) {
    if (!node) return;
    nodes.push(node);
    walk(node.left);
    walk(node.right);
  }
  walk(root);
  return nodes;
}

// Component
/**
 * TreeVisualizer — Dynamic SVG binary search tree canvas with full state rendering.
 *
 * Props:
 * - root: BST root node (or null)
 * - pathNodeIds: Set<id> | Array<id> — nodes in the traversal path so far (amber)
 * - currentId: id | null — node currently being examined (bright amber, pulsing)
 * - newNodeId: id | null — newly inserted/highlighted node (green, pop animation)
 * - foundNodeId: id | null — node successfully found in search (emerald glow)
 * - deleteNodeId: id | null — node targeted for deletion (crimson/red glow)
 * - successorNodeId: id | null — in-order successor node during 2-child delete (purple glow)
 * - visitedNodeIds: Set<id> | Array<id> — nodes visited in traversal (cyan/green)
 * - inQueueNodeIds: Set<id> | Array<id> — nodes currently in BFS queue (cyan ring)
 * - pathEdges: Set<str> | Array<str> — "fromId-toId" strings of lit edges (amber lines)
 */
export default function TreeVisualizer({
  root            = null,
  pathNodeIds     = new Set(),
  currentId       = null,
  newNodeId       = null,
  foundNodeId     = null,
  deleteNodeId    = null,
  successorNodeId = null,
  visitedNodeIds  = new Set(),
  inQueueNodeIds  = new Set(),
  pathEdges       = new Set(),
}) {
  const wrapperRef = useRef(null);
  const { positions, svgW, svgH } = useMemo(() => computeLayout(root), [root]);
  const allEdges = useMemo(() => collectEdges(root), [root]);
  const allNodes = useMemo(() => collectNodes(root), [root]);

  // Convert sets / arrays for safe O(1) checks
  const pathSet    = useMemo(() => (pathNodeIds instanceof Set ? pathNodeIds : new Set(pathNodeIds)), [pathNodeIds]);
  const edgeSet    = useMemo(() => (pathEdges instanceof Set ? pathEdges : new Set(pathEdges)), [pathEdges]);
  const visitedSet = useMemo(() => (visitedNodeIds instanceof Set ? visitedNodeIds : new Set(visitedNodeIds)), [visitedNodeIds]);
  const inQueueSet = useMemo(() => (inQueueNodeIds instanceof Set ? inQueueNodeIds : new Set(inQueueNodeIds)), [inQueueNodeIds]);

  // Auto-track the active node
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const activeTargetId = currentId || newNodeId || foundNodeId || deleteNodeId || successorNodeId;
    if (!wrapper || !activeTargetId || !positions[activeTargetId]) return;

    const nodeEl = wrapper.querySelector(
      ".tv-node--current, .tv-node--new, .tv-node--found, .tv-node--delete, .tv-node--successor"
    );
    if (nodeEl) {
      const wrapperRect = wrapper.getBoundingClientRect();
      const nodeRect = nodeEl.getBoundingClientRect();
      const margin = 70;

      let deltaX = 0;
      let deltaY = 0;

      if (nodeRect.right > wrapperRect.right - margin) {
        deltaX = nodeRect.right - wrapperRect.right + margin;
      } else if (nodeRect.left < wrapperRect.left + margin) {
        deltaX = nodeRect.left - wrapperRect.left - margin;
      }

      if (nodeRect.bottom > wrapperRect.bottom - margin) {
        deltaY = nodeRect.bottom - wrapperRect.bottom + margin;
      } else if (nodeRect.top < wrapperRect.top + margin) {
        deltaY = nodeRect.top - wrapperRect.top - margin;
      }

      if (deltaX !== 0 || deltaY !== 0) {
        wrapper.scrollBy({
          left: deltaX,
          top: deltaY,
          behavior: "smooth",
        });
      }
    }
  }, [currentId, newNodeId, foundNodeId, deleteNodeId, successorNodeId, positions]);

  if (!root) {
    return (
      <div className="tv-empty" role="status" aria-label="Tree is empty">
        <div className="tv-empty__icon-wrap" aria-hidden="true">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="5" r="3" />
            <circle cx="6" cy="19" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M12 8v3M12 11l-4.5 5.5M12 11l4.5 5.5" />
          </svg>
        </div>
        <div className="tv-empty__content">
          <p className="tv-empty__title">Binary Search Tree is Empty</p>
          <p className="tv-empty__subtitle">
            Insert a whole number above or select an educational preset to begin visualizing.
          </p>
        </div>
      </div>
    );
  }

  /** Resolve CSS modifier class for a node id */
  function nodeStateClass(id) {
    if (id === deleteNodeId)    return "tv-node--delete";
    if (id === successorNodeId) return "tv-node--successor";
    if (id === foundNodeId)     return "tv-node--found";
    if (id === newNodeId)       return "tv-node--new";
    if (id === currentId)       return "tv-node--current";
    if (visitedSet.has(id))     return "tv-node--visited";
    if (inQueueSet.has(id))     return "tv-node--queue";
    if (pathSet.has(id))        return "tv-node--path";
    return "";
  }

  return (
    <div className="tv-wrapper" ref={wrapperRef} role="img" aria-label="Binary Search Tree">
      <svg
        className="tv-svg"
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
      >
        {/* Edges (drawn first so nodes appear on top) */}
        {allEdges.map(({ from, to }) => {
          const p1 = positions[from];
          const p2 = positions[to];
          if (!p1 || !p2) return null;

          // Clip line to circle boundaries
          const angle = Math.atan2(p2.cy - p1.cy, p2.cx - p1.cx);
          const x1 = p1.cx + NODE_R * Math.cos(angle);
          const y1 = p1.cy + NODE_R * Math.sin(angle);
          const x2 = p2.cx - NODE_R * Math.cos(angle);
          const y2 = p2.cy - NODE_R * Math.sin(angle);

          const edgeKey = `${from}-${to}`;
          const isLit   = edgeSet.has(edgeKey);

          return (
            <line
              key={edgeKey}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              className={`tv-edge${isLit ? " tv-edge--lit" : ""}`}
            />
          );
        })}

        {/* Nodes */}
        {allNodes.map((node) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const stateClass = nodeStateClass(node.id);

          return (
            <g
              key={node.id}
              className={`tv-node ${stateClass}`}
              aria-label={`Node value ${node.value}`}
            >
              <circle cx={pos.cx} cy={pos.cy} r={NODE_R} />
              <text
                x={pos.cx}
                y={pos.cy}
                textAnchor="middle"
                dominantBaseline="central"
                className="tv-node__text"
              >
                {node.value}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
