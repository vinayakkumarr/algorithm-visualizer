import { useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { THEORY_DATA, PATH_TO_THEORY_KEY } from "../data/theoryData";
import TheorySection from "../components/TheorySection";
import "../components/VisualizerLayout.css";
import "./TheoryTopicPage.css";

function PlayIcon({ size = 11, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function BookIcon({ size = 12, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function ClockIcon({ size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckIcon({ size = 13, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/**
 * TheoryTopicPage
 *
 * Standalone page for algorithms and data structures that feature complete,
 * academically rigorous theory content while their interactive visualizer
 * canvas is in active development.
 */
export default function TheoryTopicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const theoryKey = PATH_TO_THEORY_KEY[location.pathname];
  const theoryData = THEORY_DATA[theoryKey];

  // Default to theory view since visualizer is upcoming
  const isVisualizerTab = searchParams.get("tab") === "visualizer";
  const isTheoryTab = !isVisualizerTab;

  useEffect(() => {
    if (theoryData) {
      document.title = `${theoryData.title} Theory — Algorithm Visualizer`;
    }
  }, [theoryData]);

  if (!theoryData) {
    return (
      <main className="vl">
        <div className="vl__topbar">
          <button
            className="vl__back"
            onClick={() => navigate("/")}
            aria-label="Back to home"
          >
            <span aria-hidden="true">←</span> Back
          </button>
          <div className="vl__title-area">
            <h1 className="vl__title">Topic Not Found</h1>
          </div>
        </div>
        <div className="ttp-not-found">
          <p>We could not locate theory notes for this path.</p>
          <button
            className="ttp-coming-soon-btn"
            onClick={() => navigate("/")}
            style={{ marginTop: "1rem" }}
          >
            ← Return to All Topics
          </button>
        </div>
      </main>
    );
  }

  const handleTabChange = (mode) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (mode === "visualizer") {
          next.set("tab", "visualizer");
        } else {
          next.delete("tab");
        }
        return next;
      },
      { replace: true }
    );
  };

  return (
    <main className="vl">
      {/* Top row: back + title + mode switcher + status badge */}
      <div className="vl__topbar">
        <button
          className="vl__back"
          onClick={() => navigate("/")}
          aria-label="Back to home"
        >
          <span aria-hidden="true">←</span> Back
        </button>

        <div className="vl__title-area">
          <h1 className="vl__title">{theoryData.title}</h1>
          <div
            className="vl__mode-nav"
            role="tablist"
            aria-label="Visualizer or Theory view mode"
          >
            <button
              type="button"
              role="tab"
              aria-selected={isVisualizerTab}
              className={`vl__mode-btn ${
                isVisualizerTab ? "vl__mode-btn--active" : ""
              }`}
              onClick={() => handleTabChange("visualizer")}
            >
              <PlayIcon size={11} />
              <span>Visualizer (Soon)</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isTheoryTab}
              className={`vl__mode-btn ${
                isTheoryTab ? "vl__mode-btn--active" : ""
              }`}
              onClick={() => handleTabChange("theory")}
            >
              <BookIcon size={12} />
              <span>Theory &amp; Notes</span>
            </button>
          </div>
        </div>

        <div className="vl__step-counter" aria-live="polite">
          <span className="ttp-mode-badge">
            <BookIcon size={12} />
            <span>{isTheoryTab ? "Concept Guide" : "Visualizer Upcoming"}</span>
          </span>
        </div>
      </div>

      {/* Content View */}
      {isTheoryTab ? (
        <TheorySection
          data={theoryData}
          onSwitchToVisualizer={() => handleTabChange("visualizer")}
        />
      ) : (
        <div className="ttp-coming-soon-card">
          <div className="ttp-coming-soon-icon" aria-hidden="true">
            <ClockIcon size={36} />
          </div>
          <div className="ttp-coming-soon-badge">Canvas in Development</div>
          <h2 className="ttp-coming-soon-title">
            Interactive Animation for {theoryData.title} Coming Soon
          </h2>
          <p className="ttp-coming-soon-desc">
            The step-by-step interactive canvas animation for{" "}
            <strong>{theoryData.title}</strong> is currently being crafted with
            frame-by-frame memory state rendering and algorithm stepping.
          </p>
          <div className="ttp-coming-soon-features">
            <div className="ttp-feature-item">
              <span className="ttp-feature-icon">
                <CheckIcon size={12} />
              </span>
              <span>100% Comprehensive Theory &amp; Notes Available</span>
            </div>
            <div className="ttp-feature-item">
              <span className="ttp-feature-icon">
                <CheckIcon size={12} />
              </span>
              <span>Mathematical Proofs &amp; Complexity Derivations</span>
            </div>
            <div className="ttp-feature-item">
              <span className="ttp-feature-icon">
                <CheckIcon size={12} />
              </span>
              <span>Step-by-Step Worked Execution Trace</span>
            </div>
          </div>
          <button
            type="button"
            className="ttp-coming-soon-btn"
            onClick={() => handleTabChange("theory")}
          >
            <BookIcon size={14} />
            <span>Read Complete {theoryData.title} Theory</span>
          </button>
        </div>
      )}
    </main>
  );
}
