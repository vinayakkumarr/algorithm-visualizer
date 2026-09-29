import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TheorySection from "../../../components/TheorySection";
import PseudocodeViewer from "../../../components/PseudocodeViewer";
import { THEORY_DATA } from "../../../data/theoryData";
import { PlayIcon, BookOpenIcon } from "../../../components/Icons";
import {
  WEIGHTED_GRAPH,
  WEIGHTED_EDGES,
  generateDijkstraSteps,
  PSEUDOCODE_DIJKSTRA,
} from "../../../algorithms/dijkstra.js";
import { speedToMs } from "../../../algorithms/linkedListEngine.js";

import "../../../components/VisualizerLayout.css";
import "./WeightedGraphStudio.css";

const NODE_POS = {
  0: { x: 280, y: 45 },
  1: { x: 130, y: 155 },
  2: { x: 430, y: 155 },
  3: { x: 60, y: 285 },
  4: { x: 260, y: 285 },
  5: { x: 460, y: 285 },
};

function LabelledSlider({ label, min, max, value, onChange, leftHint, rightHint }) {
  return (
    <div className="vl-slider">
      <div className="vl-slider__top">
        <span className="vl-slider__label">{label}</span>
        <span className="vl-slider__value">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="vl-slider__input"
        aria-label={label}
      />
      {(leftHint || rightHint) && (
        <div className="vl-slider__hints">
          {leftHint && <span>{leftHint}</span>}
          {rightHint && <span>{rightHint}</span>}
        </div>
      )}
    </div>
  );
}

export default function Dijkstra() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    document.title = "Dijkstra's Shortest Path — Algorithm Visualizer";
  }, []);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA.dijkstra;

  const handleTabChange = (mode) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (mode === "theory") next.set("tab", "theory");
        else next.delete("tab");
        return next;
      },
      { replace: true }
    );
  };

  const [startNode, setStartNode] = useState(0);

  const steps = useMemo(() => {
    return generateDijkstraSteps(WEIGHTED_GRAPH, startNode);
  }, [startNode]);

  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);

  const currentFrame = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return steps[0] || null;
  }, [stepIdx, steps]);

  // Auto-Playback Effect
  useEffect(() => {
    if (!isPlaying) return;

    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setStepIdx((idx) => {
        const next = idx + 1;
        if (next >= steps.length - 1) {
          setIsPlaying(false);
          return steps.length - 1;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps.length, speed]);

  const handlePlayPause = () => {
    if (steps.length === 0) return;
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (stepIdx >= steps.length - 1) {
        setStepIdx(0);
      }
      setIsPlaying(true);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (stepIdx < steps.length - 1) setStepIdx((idx) => idx + 1);
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) setStepIdx((idx) => idx - 1);
  };

  const handleJumpStart = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const handleJumpEnd = () => {
    setIsPlaying(false);
    if (steps.length > 0) setStepIdx(steps.length - 1);
  };

  const handleScrub = (idx) => {
    setIsPlaying(false);
    setStepIdx(Math.max(0, Math.min(steps.length - 1, idx)));
  };

  const handleResetAnimation = () => {
    setIsPlaying(false);
    setStepIdx(0);
  };

  const distances = currentFrame?.dist || {};
  const visited = currentFrame?.visited || new Set();
  const currentNode = currentFrame?.current;
  const activeEdge = currentFrame?.activeEdge;

  return (
    <div className="wg-studio-page">
      {/* Topbar */}
      <div className="vl__topbar" style={{ marginBottom: "1.5rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">Graph — Dijkstra&apos;s Shortest Path</h1>
          <div className="vl__mode-nav" role="tablist" aria-label="View mode">
            <button
              type="button"
              role="tab"
              aria-selected={!isTheoryTab}
              className={`vl__mode-btn ${!isTheoryTab ? "vl__mode-btn--active" : ""}`}
              onClick={() => handleTabChange("visualizer")}
            >
              <PlayIcon size={11} />
              <span>Visualizer</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isTheoryTab}
              className={`vl__mode-btn ${isTheoryTab ? "vl__mode-btn--active" : ""}`}
              onClick={() => handleTabChange("theory")}
            >
              <BookOpenIcon size={12} />
              <span>Theory &amp; Notes</span>
            </button>
          </div>
        </div>

        <div className="vl__step-counter" aria-live="polite" aria-atomic="true">
          {!isTheoryTab ? (
            <span className="vl__step-active">
              Step <strong>{stepIdx + 1}</strong> / <strong>{steps.length}</strong>
            </span>
          ) : (
            <span className="vl__theory-badge">
              <BookOpenIcon size={12} />
              <span>Concept Guide</span>
            </span>
          )}
        </div>
      </div>

      {isTheoryTab ? (
        <TheorySection
          data={theoryData}
          onSwitchToVisualizer={() => handleTabChange("visualizer")}
        />
      ) : (
        <>
          <p className="vl__description">
            Greedy single-source shortest path algorithm on graphs with non-negative edge weights. Settles closest nodes monotonically in $O((V + E) \log V)$ time using a Priority Queue.
          </p>

          {/* Telemetry Strip */}
          <div className="wg-info-strip">
            <div className="wg-info-card">
              <span className="wg-info-card__label">Source Node</span>
              <span className="wg-info-card__value">Node [{startNode}]</span>
            </div>
            <div className="wg-info-card wg-info-card--accent">
              <span className="wg-info-card__label">Active Visiting</span>
              <span className="wg-info-card__value">
                {currentNode !== null ? `Node [${currentNode}]` : "—"}
              </span>
            </div>
            <div className="wg-info-card">
              <span className="wg-info-card__label">Settled Nodes</span>
              <span className="wg-info-card__value">{visited.size} / 6</span>
            </div>
            <div className="wg-info-card">
              <span className="wg-info-card__label">Auxiliary Memory</span>
              <code className="wg-info-card__value">O(V) Distances</code>
            </div>
          </div>

          {/* Visualizer Arena */}
          <div className="wg-arena">
            {/* SVG Weighted Graph Canvas */}
            <div className="wg-canvas-box">
              <svg viewBox="0 0 520 330" className="wg-svg">
                {/* Edges with weights */}
                {WEIGHTED_EDGES.map((e, idx) => {
                  const p1 = NODE_POS[e.u];
                  const p2 = NODE_POS[e.v];
                  const midX = (p1.x + p2.x) / 2;
                  const midY = (p1.y + p2.y) / 2;
                  const isActive =
                    activeEdge &&
                    ((activeEdge.u === e.u && activeEdge.v === e.v) ||
                      (activeEdge.u === e.v && activeEdge.v === e.u));

                  return (
                    <g key={idx}>
                      <line
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        className={`wg-edge ${isActive ? "wg-edge--active" : ""}`}
                      />
                      <rect
                        x={midX - 10}
                        y={midY - 9}
                        width="20"
                        height="18"
                        rx="4"
                        className="wg-weight-badge-bg"
                      />
                      <text x={midX} y={midY + 4} textAnchor="middle" className="wg-weight-text">
                        {e.weight}
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {Object.keys(NODE_POS).map((idStr) => {
                  const id = Number(idStr);
                  const pos = NODE_POS[id];
                  const isCur = id === currentNode;
                  const isVis = visited.has(id);
                  const dVal = distances[id] === Infinity ? "∞" : distances[id];

                  return (
                    <g key={id} transform={`translate(${pos.x}, ${pos.y})`}>
                      <circle
                        r="24"
                        className={`wg-node ${isCur ? "wg-node--current" : ""} ${
                          isVis ? "wg-node--visited" : ""
                        }`}
                      />
                      <text textAnchor="middle" dy="-3" className="wg-node-id">
                        {id}
                      </text>
                      <text textAnchor="middle" dy="12" className="wg-node-dist">
                        d={dVal}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Distance Table */}
            <div className="wg-hud-box">
              <h3 className="wg-section-title">Distance &amp; Predecessor Table</h3>
              <table className="wg-table">
                <thead>
                  <tr>
                    <th>Node</th>
                    <th>Distance</th>
                    <th>Prev</th>
                    <th>Settled</th>
                  </tr>
                </thead>
                <tbody>
                  {[0, 1, 2, 3, 4, 5].map((id) => (
                    <tr key={id} className={id === currentNode ? "wg-tr--active" : ""}>
                      <td><strong>[{id}]</strong></td>
                      <td>{distances[id] === Infinity ? "∞" : distances[id]}</td>
                      <td>{currentFrame?.prev?.[id] !== null ? `[${currentFrame.prev[id]}]` : "—"}</td>
                      <td>{visited.has(id) ? "✔" : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Step Narrator */}
          <div
            className={`ll-narrator ${currentFrame?.isTerminal ? "ll-narrator--done" : ""}`}
            aria-live="polite"
          >
            <p className="ll-narrator__text">
              {currentFrame?.narrative || "Step through Dijkstra's shortest path relaxation using the transport controls above."}
            </p>
          </div>

          {/* Transport Controls */}
          <div className="vl__controls" style={{ marginBottom: "1.25rem" }}>
            <div className="vl__controls-body">
              <div className="vl__sliders">
                <LabelledSlider
                  label="Speed"
                  min={1}
                  max={5}
                  value={speed}
                  onChange={setSpeed}
                  leftHint="Slow"
                  rightHint="Fast"
                />
              </div>

              <div className="vl__transport">
                <div className="vl__scrubber-row">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(steps.length - 1, 1)}
                    value={stepIdx}
                    onChange={(e) => handleScrub(Number(e.target.value))}
                    className="vl__scrubber"
                    aria-label="Step timeline"
                    disabled={steps.length <= 1}
                  />
                </div>

                <div className="vl__buttons">
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleJumpStart}
                    disabled={stepIdx <= 0 || steps.length === 0}
                    aria-label="First step"
                    title="First"
                  >
                    ⏮
                  </button>
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleStepBackward}
                    disabled={stepIdx <= 0 || steps.length === 0}
                    aria-label="Previous step"
                    title="Previous"
                  >
                    ◀
                  </button>
                  {!isPlaying ? (
                    <button
                      className="vl__btn vl__btn--start"
                      onClick={handlePlayPause}
                      disabled={steps.length === 0}
                      aria-label={stepIdx <= 0 ? "Start" : stepIdx >= steps.length - 1 ? "Replay" : "Resume"}
                    >
                      {stepIdx <= 0 ? "▶ Start" : stepIdx >= steps.length - 1 ? "↺ Replay" : "▶ Resume"}
                    </button>
                  ) : (
                    <button
                      className="vl__btn vl__btn--pause"
                      onClick={handlePlayPause}
                      aria-label="Pause"
                    >
                      ⏸ Pause
                    </button>
                  )}
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleStepForward}
                    disabled={stepIdx >= steps.length - 1 || steps.length === 0}
                    aria-label="Next step"
                    title="Next"
                  >
                    ▶
                  </button>
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleJumpEnd}
                    disabled={stepIdx >= steps.length - 1 || steps.length === 0}
                    aria-label="Last step"
                    title="Last"
                  >
                    ⏭
                  </button>
                  <button
                    className="vl__btn vl__btn--reset"
                    onClick={handleResetAnimation}
                    disabled={stepIdx === 0 && !isPlaying}
                    aria-label="Reset Animation"
                    title="Reset Animation"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Start Node Selection Panel */}
          <div className="ll-panel">
            <div className="ll-panel__row">
              <span className="ll-panel__label">Select Starting Node:</span>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  className={`ll-btn ${startNode === n ? "ll-btn--primary" : ""}`}
                  onClick={() => {
                    setIsPlaying(false);
                    setStartNode(n);
                    setStepIdx(0);
                  }}
                  disabled={isPlaying}
                >
                  Node [{n}]
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Grid */}
          <div className="ll-bottom-grid">
            <div>
              <PseudocodeViewer
                code={PSEUDOCODE_DIJKSTRA}
                activeLine={currentFrame?.activeLine ?? -1}
              />
            </div>

            <div className="vl-complexity" aria-label="Complexity Reference">
              <div className="vl-complexity__header">
                <span className="vl-complexity__title">
                  <span>Dijkstra&apos;s Algorithm Big-O</span>
                </span>
              </div>
              <div className="vl-complexity__grid">
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Time (Binary Heap)</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O((V+E) log V)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Time (Dense Array)</span>
                  <code className="vl-complexity__value">O(V²)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Auxiliary Space</span>
                  <code className="vl-complexity__value vl-complexity__value--best">O(V)</code>
                </div>
                <div className="vl-complexity__item">
                  <span className="vl-complexity__label">Weight Constraint</span>
                  <code className="vl-complexity__value">w(u, v) ≥ 0</code>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
