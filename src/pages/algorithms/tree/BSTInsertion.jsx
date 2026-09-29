import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import TreeVisualizer from "../../../components/TreeVisualizer";
import TheorySection from "../../../components/TheorySection";
import { THEORY_DATA } from "../../../data/theoryData";
import {
  PlayIcon,
  BookOpenIcon,
  PlusIcon,
  SearchMiniIcon,
  TrashIcon,
  TreeIcon,
  FolderIcon,
  RotateCcwIcon,
} from "../../../components/Icons";
import {
  getBSTHeight,
  countNodes,
  isBSTBalanced,
  PRESETS,
  buildTreeFromValues,
  generateRandomValues,
  generateInsertSteps,
  generateSearchSteps,
  generateDeleteSteps,
  generateInorderSteps,
  generatePreorderSteps,
  generatePostorderSteps,
  generateBFSSteps,
} from "../../../algorithms/bstAlgorithms";
import "../../../components/TreeVisualizer.css";
import "../../../components/VisualizerLayout.css";

// Speed mapping
const SPEED_MS = [850, 520, 300, 160, 70];
const speedToMs = (lvl) => SPEED_MS[Math.max(0, Math.min(4, lvl - 1))];

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

// Component
export default function BSTInsertion() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Determine Active Theory Topic based on Route
  const pathname = location.pathname;
  const topicConfig = useMemo(() => {
    if (pathname.includes("inorder")) {
      return {
        title: "BST — Inorder Traversal",
        theoryKey: "inorderTraversal",
        defaultOp: "inorder",
      };
    }
    if (pathname.includes("preorder")) {
      return {
        title: "BST — Preorder Traversal",
        theoryKey: "preorderTraversal",
        defaultOp: "preorder",
      };
    }
    if (pathname.includes("postorder")) {
      return {
        title: "BST — Postorder Traversal",
        theoryKey: "postorderTraversal",
        defaultOp: "postorder",
      };
    }
    return {
      title: "Binary Search Tree (BST Studio)",
      theoryKey: "bstInsertion",
      defaultOp: "insert",
    };
  }, [pathname]);

  useEffect(() => {
    document.title = `${topicConfig.title} — Algorithm Visualizer`;
  }, [topicConfig]);

  const isTheoryTab = searchParams.get("tab") === "theory";
  const theoryData = THEORY_DATA[topicConfig.theoryKey] || THEORY_DATA.bstInsertion;

  const handleTabChange = (mode) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (mode === "theory") {
          next.set("tab", "theory");
        } else {
          next.delete("tab");
        }
        return next;
      },
      { replace: true }
    );
  };

  // Core Persistent BST State
  const nextId = useRef(0);
  const [root, setRoot] = useState(() => {
    // Initial standard balanced educational BST
    const initialPreset = [50, 25, 75, 12, 37, 62, 87];
    return buildTreeFromValues(initialPreset, nextId);
  });

  // Active Operation Mode
  const [activeOp, setActiveOp] = useState(topicConfig.defaultOp);

  // Sync active operation if topicConfig changes
  useEffect(() => {
    setActiveOp(topicConfig.defaultOp);
  }, [topicConfig]);

  // Input Fields
  const [insertVal, setInsertVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [deleteVal, setDeleteVal] = useState("");
  const [errorMsg, setErrorMsg]   = useState("");

  // Stepper / Animation Engine State
  const [steps, setSteps]               = useState([]);
  const [stepIdx, setStepIdx]           = useState(-1);
  const [isPlaying, setIsPlaying]       = useState(false);
  const [speed, setSpeed]               = useState(3);
  const [lastActionStatus, setLastActionStatus] = useState("Tree initialized with Balanced preset");

  // Keep final resulting tree pending till animation settles or user jumps
  const pendingTreeRef = useRef(null);

  // Live Traversal Output & Auxiliary Structures State
  const [traversalOutput, setTraversalOutput] = useState([]);
  const [traversalQueue, setTraversalQueue]   = useState([]);
  const [traversalStack, setTraversalStack]   = useState([]);

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
        // If final step reached in playback, apply pending tree
        if (next >= steps.length - 1 && pendingTreeRef.current !== null) {
          setRoot(pendingTreeRef.current);
          pendingTreeRef.current = null;
        }
        return next;
      });
    }, speedToMs(speed));

    return () => clearTimeout(timer);
  }, [isPlaying, stepIdx, steps, speed]);

  // Sync Step Details into Active Display
  const currentStep = useMemo(() => {
    if (stepIdx >= 0 && stepIdx < steps.length) {
      return steps[stepIdx];
    }
    return null;
  }, [stepIdx, steps]);

  // Sync traversal output / queue / stack from current step
  useEffect(() => {
    if (currentStep) {
      if (currentStep.output !== undefined) setTraversalOutput(currentStep.output);
      if (currentStep.queue !== undefined)  setTraversalQueue(currentStep.queue);
      if (currentStep.callStack !== undefined) setTraversalStack(currentStep.callStack);
    }
  }, [currentStep]);

  // Visual tree resolution
  const displayTree = currentStep && currentStep.tree !== undefined ? currentStep.tree : root;

  // Statistics
  const nodeCount = countNodes(displayTree);
  const treeHeight = getBSTHeight(displayTree);
  const isBalanced = isBSTBalanced(displayTree);

  // Stepper Controls
  const handlePlayPause = () => {
    if (steps.length === 0) return;
    if (stepIdx >= steps.length - 1) {
      // Replay from beginning
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    if (stepIdx < steps.length - 1) {
      const next = stepIdx + 1;
      setStepIdx(next);
      if (next >= steps.length - 1 && pendingTreeRef.current !== null) {
        setRoot(pendingTreeRef.current);
        pendingTreeRef.current = null;
      }
    }
  };

  const handleStepBackward = () => {
    setIsPlaying(false);
    if (stepIdx > 0) {
      setStepIdx((idx) => idx - 1);
    }
  };

  const handleJumpStart = () => {
    setIsPlaying(false);
    if (steps.length > 0) {
      setStepIdx(0);
    }
  };

  const handleJumpEnd = () => {
    setIsPlaying(false);
    if (steps.length > 0) {
      const end = steps.length - 1;
      setStepIdx(end);
      if (pendingTreeRef.current !== null) {
        setRoot(pendingTreeRef.current);
        pendingTreeRef.current = null;
      }
    }
  };

  const handleScrub = (targetIdx) => {
    setIsPlaying(false);
    if (steps.length === 0) return;
    const clamped = Math.max(0, Math.min(steps.length - 1, targetIdx));
    setStepIdx(clamped);
    if (clamped >= steps.length - 1 && pendingTreeRef.current !== null) {
      setRoot(pendingTreeRef.current);
      pendingTreeRef.current = null;
    }
  };

  const handleResetAnimation = () => {
    setIsPlaying(false);
    if (pendingTreeRef.current !== null) {
      setRoot(pendingTreeRef.current);
      pendingTreeRef.current = null;
    }
    setSteps([]);
    setStepIdx(-1);
    setTraversalOutput([]);
    setTraversalQueue([]);
    setTraversalStack([]);
    setErrorMsg("");
  };

  // Operation Handlers
  // 1. Insert Handler
  const handleInsert = useCallback(() => {
    const raw = insertVal.trim();
    if (!raw) return;
    const val = Number(raw);
    if (!Number.isFinite(val) || !Number.isInteger(val)) {
      setErrorMsg("Please enter a valid whole integer.");
      return;
    }

    setErrorMsg("");
    const newId = nextId.current++;
    const { steps: insertSteps, newRoot, isDuplicate } = generateInsertSteps(root, val, newId);

    if (isDuplicate) {
      nextId.current--;
      setErrorMsg(`Value ${val} already exists in the BST. Duplicates are not inserted.`);
      setSteps(insertSteps);
      setStepIdx(0);
      setIsPlaying(false);
      return;
    }

    pendingTreeRef.current = newRoot;
    setSteps(insertSteps);
    setStepIdx(0);
    setIsPlaying(false); // Do not auto-start
    setInsertVal("");
    setLastActionStatus(`Prepared Insert for ${val} — click Start to run`);
  }, [insertVal, root]);

  // 2. Search Handler
  const handleSearch = useCallback(() => {
    const raw = searchVal.trim();
    if (!raw) return;
    const val = Number(raw);
    if (!Number.isFinite(val) || !Number.isInteger(val)) {
      setErrorMsg("Please enter a valid whole integer.");
      return;
    }

    setErrorMsg("");
    const { steps: searchSteps, found } = generateSearchSteps(root, val);
    pendingTreeRef.current = null;
    setSteps(searchSteps);
    setStepIdx(0);
    setIsPlaying(false); // Do not auto-start
    setLastActionStatus(found ? `Prepared Search for ${val} (In Tree) — click Start to run` : `Prepared Search for ${val} (Not Found) — click Start to run`);
  }, [searchVal, root]);

  // 3. Delete Handler
  const handleDelete = useCallback(() => {
    const raw = deleteVal.trim();
    if (!raw) return;
    const val = Number(raw);
    if (!Number.isFinite(val) || !Number.isInteger(val)) {
      setErrorMsg("Please enter a valid whole integer.");
      return;
    }

    setErrorMsg("");
    const { steps: deleteSteps, newRoot, deleted } = generateDeleteSteps(root, val);

    if (!deleted) {
      setErrorMsg(`Node with value ${val} does not exist in the BST.`);
      setSteps(deleteSteps);
      setStepIdx(0);
      setIsPlaying(false);
      return;
    }

    pendingTreeRef.current = newRoot;
    setSteps(deleteSteps);
    setStepIdx(0);
    setIsPlaying(false); // Do not auto-start
    setDeleteVal("");
    setLastActionStatus(`Prepared Delete for ${val} — click Start to run`);
  }, [deleteVal, root]);

  // 4. Traversal Handlers
  const handleRunTraversal = useCallback((type) => {
    setErrorMsg("");
    let traversalSteps = [];
    if (type === "inorder") {
      traversalSteps = generateInorderSteps(root);
      setLastActionStatus("Prepared Inorder Traversal (LNR) — click Start to run");
    } else if (type === "preorder") {
      traversalSteps = generatePreorderSteps(root);
      setLastActionStatus("Prepared Preorder Traversal (NLR) — click Start to run");
    } else if (type === "postorder") {
      traversalSteps = generatePostorderSteps(root);
      setLastActionStatus("Prepared Postorder Traversal (LRN) — click Start to run");
    } else if (type === "bfs") {
      traversalSteps = generateBFSSteps(root);
      setLastActionStatus("Prepared Level-Order Traversal (BFS) — click Start to run");
    }

    pendingTreeRef.current = null;
    setSteps(traversalSteps);
    setStepIdx(0);
    setIsPlaying(false); // Do not auto-start
    setTraversalOutput([]);
    setTraversalQueue([]);
    setTraversalStack([]);
  }, [root]);

  // 5. Preset Loader
  const handleLoadPreset = useCallback((presetId) => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    setErrorMsg("");
    setTraversalOutput([]);
    setTraversalQueue([]);
    setTraversalStack([]);

    let values = [];
    if (presetId === "random") {
      values = generateRandomValues(6);
    } else {
      const p = PRESETS.find((item) => item.id === presetId);
      if (p) values = p.values;
    }

    nextId.current = 0;
    const newRoot = buildTreeFromValues(values, nextId);
    setRoot(newRoot);
    pendingTreeRef.current = null;
    setLastActionStatus(`Loaded Preset: ${presetId}`);
  }, []);

  // 6. Clear Tree
  const handleClearTree = useCallback(() => {
    setIsPlaying(false);
    setSteps([]);
    setStepIdx(-1);
    setErrorMsg("");
    setTraversalOutput([]);
    setTraversalQueue([]);
    setTraversalStack([]);
    setRoot(null);
    pendingTreeRef.current = null;
    nextId.current = 0;
    setLastActionStatus("Tree cleared");
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = (e, action) => {
    if (e.key === "Enter") {
      action();
    }
  };

  return (
    <div className="bst-page">
      {/* Top Bar */}
      <div className="vl__topbar" style={{ marginBottom: "1.25rem" }}>
        <button className="vl__back" onClick={() => navigate("/")} aria-label="Back to home">
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">{topicConfig.title}</h1>
          <div className="vl__mode-nav" role="tablist" aria-label="Visualizer or Theory view mode">
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

        <div className="vl__step-counter" aria-live="polite">
          {!isTheoryTab ? (
            steps.length > 0 ? (
              <span>
                Step <strong>{stepIdx + 1}</strong> / <strong>{steps.length}</strong>
              </span>
            ) : (
              <span className="vl__step-idle">{nodeCount} Nodes (h={treeHeight})</span>
            )
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
          {/* Info Strip */}
          <div className="bst-info-strip">
            <div className="bst-info-card">
              <span className="bst-info-card__label">Total Nodes</span>
              <span className="bst-info-card__value">{nodeCount}</span>
            </div>
            <div className="bst-info-card">
              <span className="bst-info-card__label">Tree Height (h)</span>
              <span className="bst-info-card__value">{treeHeight}</span>
            </div>
            <div className={`bst-info-card ${isBalanced ? "bst-info-card--green" : "bst-info-card--amber"}`}>
              <span className="bst-info-card__label">Balance Invariant</span>
              <span className="bst-info-card__value">{isBalanced ? "Balanced" : "Skewed"}</span>
            </div>
            <div className="bst-info-card bst-info-card--accent">
              <span className="bst-info-card__label">Last Action</span>
              <span className="bst-info-card__value" style={{ fontSize: "0.92rem" }}>
                {lastActionStatus}
              </span>
            </div>
          </div>

          {/* Canvas Card */}
          <div className="bst-canvas-card">
            <div className="bst-canvas">
              <TreeVisualizer
                root={displayTree}
                currentId={currentStep?.currentId ?? null}
                newNodeId={currentStep?.newNodeId ?? null}
                foundNodeId={currentStep?.foundNodeId ?? null}
                deleteNodeId={currentStep?.deleteNodeId ?? null}
                successorNodeId={currentStep?.successorNodeId ?? null}
                pathNodeIds={currentStep?.pathNodeIds ?? []}
                pathEdges={currentStep?.pathEdges ?? []}
                visitedNodeIds={currentStep?.visitedIds ?? []}
                inQueueNodeIds={currentStep?.inQueueIds ?? []}
              />
            </div>

            {/* Traversal Output and Live Data Structure Bar */}
            {(traversalOutput.length > 0 || traversalQueue.length > 0 || traversalStack.length > 0) && (
              <div className="bst-traversal-strip">
                {traversalOutput.length > 0 && (
                  <div className="bst-traversal-row">
                    <span className="bst-traversal-label">Output Sequence:</span>
                    <div className="bst-chips-wrap">
                      {traversalOutput.map((val, idx) => (
                        <span key={idx} className="bst-chips-wrap">
                          <span className="bst-chip">{val}</span>
                          {idx < traversalOutput.length - 1 && <span className="bst-arrow-sep">→</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {traversalQueue.length > 0 && (
                  <div className="bst-traversal-row">
                    <span className="bst-traversal-label">FIFO Queue (Front → Back):</span>
                    <div className="bst-chips-wrap">
                      {traversalQueue.map((val, idx) => (
                        <span key={idx} className="bst-chip bst-chip--queue">{val}</span>
                      ))}
                    </div>
                  </div>
                )}

                {traversalStack.length > 0 && (
                  <div className="bst-traversal-row">
                    <span className="bst-traversal-label">Recursion Stack (Call Depth):</span>
                    <div className="bst-chips-wrap">
                      {traversalStack.map((val, idx) => (
                        <span key={idx} className="bst-chips-wrap">
                          <span className="bst-chip bst-chip--stack">{val}</span>
                          {idx < traversalStack.length - 1 && <span className="bst-arrow-sep">/</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step Narrator / Status Bar */}
          <div
            className={`bst-narrator ${
              currentStep?.status === "done"
                ? "bst-narrator--done"
                : currentStep?.status === "error"
                ? "bst-narrator--error"
                : ""
            }`}
            aria-live="polite"
          >
            <p className="bst-narrator__text">
              {currentStep?.description ||
                "Select an operation below (Insert, Search, Delete, or Traversals) to visualize the BST algorithm step-by-step."}
            </p>
          </div>

          {/* Error Banner */}
          {errorMsg && <div className="bst-error" role="alert">{errorMsg}</div>}

          {/* Transport & Playback Controls */}
          <div className="vl__controls" style={{ marginBottom: "1.25rem" }}>
            <div className="vl__controls-body">
              {/* Sliders */}
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

              {/* Transport */}
              <div className="vl__transport">
                {/* Row 1 — Timeline scrubber */}
                <div className="vl__scrubber-row">
                  <input
                    type="range"
                    min={0}
                    max={Math.max(steps.length - 1, 1)}
                    value={Math.max(0, stepIdx)}
                    onChange={(e) => handleScrub(Number(e.target.value))}
                    className="vl__scrubber"
                    aria-label="Step timeline"
                    disabled={steps.length === 0}
                  />
                </div>

                {/* Row 2 — Button row */}
                <div className="vl__buttons">
                  {/* ⏮ First */}
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleJumpStart}
                    disabled={stepIdx <= 0 || steps.length === 0}
                    aria-label="Jump to first step"
                    title="First"
                  >
                    ⏮
                  </button>

                  {/* ◀ Prev */}
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleStepBackward}
                    disabled={stepIdx <= 0 || steps.length === 0}
                    aria-label="Previous step"
                    title="Previous"
                  >
                    ◀
                  </button>

                  {/* ▶ Play / ⏸ Pause */}
                  {!isPlaying ? (
                    <button
                      className="vl__btn vl__btn--start"
                      onClick={handlePlayPause}
                      disabled={steps.length === 0}
                      aria-label={stepIdx <= 0 ? "Start" : "Resume"}
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

                  {/* Next ▶ */}
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleStepForward}
                    disabled={stepIdx >= steps.length - 1 || steps.length === 0}
                    aria-label="Next step"
                    title="Next"
                  >
                    ▶
                  </button>

                  {/* ⏭ Last */}
                  <button
                    className="vl__btn vl__btn--nav"
                    onClick={handleJumpEnd}
                    disabled={stepIdx >= steps.length - 1 || steps.length === 0}
                    aria-label="Jump to last step"
                    title="Last"
                  >
                    ⏭
                  </button>

                  {/* ↺ Reset */}
                  <button
                    className="vl__btn vl__btn--reset"
                    onClick={handleResetAnimation}
                    disabled={steps.length === 0}
                    aria-label="Reset Animation"
                    title="Reset Animation"
                  >
                    ↺ Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Operations Workspace Selector */}
          <div className="bst-ops-bar" role="tablist" aria-label="Tree Operations">
            <button
              className={`bst-op-tab ${activeOp === "insert" ? "bst-op-tab--active" : ""}`}
              onClick={() => setActiveOp("insert")}
            >
              <PlusIcon size={12} />
              <span>Insert</span>
            </button>
            <button
              className={`bst-op-tab ${activeOp === "search" ? "bst-op-tab--active" : ""}`}
              onClick={() => setActiveOp("search")}
            >
              <SearchMiniIcon size={12} />
              <span>Search</span>
            </button>
            <button
              className={`bst-op-tab ${activeOp === "delete" ? "bst-op-tab--active" : ""}`}
              onClick={() => setActiveOp("delete")}
            >
              <TrashIcon size={12} />
              <span>Delete</span>
            </button>
            <button
              className={`bst-op-tab ${activeOp === "traversals" || activeOp === "inorder" || activeOp === "preorder" || activeOp === "postorder" || activeOp === "bfs" ? "bst-op-tab--active" : ""}`}
              onClick={() => setActiveOp("traversals")}
            >
              <TreeIcon size={12} />
              <span>Traversals</span>
            </button>
            <button
              className={`bst-op-tab ${activeOp === "presets" ? "bst-op-tab--active" : ""}`}
              onClick={() => setActiveOp("presets")}
            >
              <FolderIcon size={12} />
              <span>Presets &amp; Reset</span>
            </button>
          </div>

          {/* Active Operation Control Panel */}
          <div className="bst-panel">
            {/* 1. INSERT PANEL */}
            {activeOp === "insert" && (
              <div className="bst-panel__row">
                <div className="bst-input-group">
                  <input
                    className="bst-input"
                    type="number"
                    value={insertVal}
                    onChange={(e) => { setInsertVal(e.target.value); setErrorMsg(""); }}
                    onKeyDown={(e) => handleKeyDown(e, handleInsert)}
                    placeholder="e.g. 42"
                    aria-label="Value to insert"
                  />
                  <button
                    className="bst-btn bst-btn--primary"
                    onClick={handleInsert}
                    disabled={!insertVal.trim()}
                  >
                    <PlusIcon size={13} />
                    <span>Insert Node</span>
                  </button>
                </div>
                <span className="bst-speed-hint">
                  Values &lt; node go Left, &gt; node go Right. Duplicates rejected.
                </span>
              </div>
            )}

            {/* 2. SEARCH PANEL */}
            {activeOp === "search" && (
              <div className="bst-panel__row">
                <div className="bst-input-group">
                  <input
                    className="bst-input"
                    type="number"
                    value={searchVal}
                    onChange={(e) => { setSearchVal(e.target.value); setErrorMsg(""); }}
                    onKeyDown={(e) => handleKeyDown(e, handleSearch)}
                    placeholder="e.g. 37"
                    aria-label="Value to search"
                  />
                  <button
                    className="bst-btn bst-btn--search"
                    onClick={handleSearch}
                    disabled={!searchVal.trim() || !root}
                  >
                    <SearchMiniIcon size={13} />
                    <span>Search Value</span>
                  </button>
                </div>
                <span className="bst-speed-hint">
                  Branch elimination at each comparison step ($O(\log n)$ average).
                </span>
              </div>
            )}

            {/* 3. DELETE PANEL */}
            {activeOp === "delete" && (
              <div className="bst-panel__row">
                <div className="bst-input-group">
                  <input
                    className="bst-input"
                    type="number"
                    value={deleteVal}
                    onChange={(e) => { setDeleteVal(e.target.value); setErrorMsg(""); }}
                    onKeyDown={(e) => handleKeyDown(e, handleDelete)}
                    placeholder="e.g. 25"
                    aria-label="Value to delete"
                  />
                  <button
                    className="bst-btn bst-btn--delete"
                    onClick={handleDelete}
                    disabled={!deleteVal.trim() || !root}
                  >
                    <TrashIcon size={13} />
                    <span>Delete Node</span>
                  </button>
                </div>
                <span className="bst-speed-hint">
                  Handles Case 1 (Leaf), Case 2 (1 Child), and Case 3 (2 Children with In-order Successor).
                </span>
              </div>
            )}

            {/* 4. TRAVERSALS PANEL */}
            {(activeOp === "traversals" || activeOp === "inorder" || activeOp === "preorder" || activeOp === "postorder" || activeOp === "bfs") && (
              <div className="bst-panel__row" style={{ gap: "0.6rem" }}>
                <button
                  className="bst-btn bst-btn--traversal"
                  onClick={() => handleRunTraversal("inorder")}
                  disabled={!root}
                  title="Left -> Root -> Right (Produces sorted sequence on BST)"
                >
                  Inorder (LNR)
                </button>
                <button
                  className="bst-btn bst-btn--traversal"
                  onClick={() => handleRunTraversal("preorder")}
                  disabled={!root}
                  title="Root -> Left -> Right (Tree cloning / serialization)"
                >
                  Preorder (NLR)
                </button>
                <button
                  className="bst-btn bst-btn--traversal"
                  onClick={() => handleRunTraversal("postorder")}
                  disabled={!root}
                  title="Left -> Right -> Root (Bottom-up evaluation / cleanup)"
                >
                  Postorder (LRN)
                </button>
                <button
                  className="bst-btn bst-btn--traversal"
                  onClick={() => handleRunTraversal("bfs")}
                  disabled={!root}
                  title="Level-by-level using explicit FIFO Queue"
                >
                  Level Order (BFS)
                </button>
              </div>
            )}

            {/* 5. PRESETS & RESET PANEL */}
            {activeOp === "presets" && (
              <div className="bst-panel__row" style={{ justifyContent: "space-between", width: "100%" }}>
                <div className="bst-input-group">
                  <span className="bst-speed-hint">Load Tree Preset:</span>
                  <select
                    className="bst-select"
                    onChange={(e) => {
                      if (e.target.value) handleLoadPreset(e.target.value);
                    }}
                    defaultValue=""
                  >
                    <option value="" disabled>Select a Preset...</option>
                    <option value="balanced">Balanced BST (7 nodes)</option>
                    <option value="small">Small Tree (7 nodes)</option>
                    <option value="leftSkewed">Left Skewed (Degenerate)</option>
                    <option value="rightSkewed">Right Skewed (Degenerate)</option>
                    <option value="random">Random Tree (6 unique nodes)</option>
                  </select>
                </div>

                <button
                  className="bst-btn bst-btn--reset"
                  onClick={handleClearTree}
                  disabled={!root}
                >
                  <RotateCcwIcon size={13} />
                  <span>Clear Entire Tree</span>
                </button>
              </div>
            )}
          </div>

          {/* Legend Strip */}
          <div className="bst-legend" aria-label="Color Legend">
            {[
              { cls: "default",   label: "Default Node" },
              { cls: "current",   label: "Examining" },
              { cls: "new",       label: "Inserted" },
              { cls: "found",     label: "Search Match" },
              { cls: "delete",    label: "Delete Target" },
              { cls: "successor", label: "In-order Successor" },
              { cls: "visited",   label: "Traversal Visited" },
              { cls: "queue",     label: "In Queue (BFS)" },
            ].map(({ cls, label }) => (
              <div key={cls} className="bst-legend__item">
                <div className={`bst-legend__dot bst-legend__dot--${cls}`} aria-hidden="true" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          {/* Complexity Analysis */}
          <div className="bst-complexity-grid" aria-label="BST Complexity Analysis">
            <div className="bst-cx-card">
              <span className="bst-cx-label">Search (Avg)</span>
              <span className="bst-cx-val">O(log n)</span>
            </div>
            <div className="bst-cx-card">
              <span className="bst-cx-label">Insert (Avg)</span>
              <span className="bst-cx-val">O(log n)</span>
            </div>
            <div className="bst-cx-card">
              <span className="bst-cx-label">Delete (Avg)</span>
              <span className="bst-cx-val">O(log n)</span>
            </div>
            <div className="bst-cx-card">
              <span className="bst-cx-label">Traversals</span>
              <span className="bst-cx-val">O(n)</span>
            </div>
            <div className="bst-cx-card">
              <span className="bst-cx-label">Worst-case Time</span>
              <span className="bst-cx-val" style={{ color: "var(--viz-comparing)" }}>O(n) Skewed</span>
            </div>
            <div className="bst-cx-card">
              <span className="bst-cx-label">Auxiliary Space</span>
              <span className="bst-cx-val">O(h) Stack</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
