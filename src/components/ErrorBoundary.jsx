import { Component } from "react";
import "./ErrorBoundary.css";

/**
 * ErrorBoundary — Catches unhandled JavaScript runtime exceptions anywhere in
 * the child component tree, logs the error, and displays a graceful, elegant fallback UI.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught runtime exception caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="eb-container" role="alert" aria-live="assertive">
          <div className="eb-card">
            <div className="eb-icon-wrap" aria-hidden="true">
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h1 className="eb-title">Something Went Wrong</h1>
            <p className="eb-desc">
              An unexpected error occurred while rendering this view. You can return to the algorithm catalog or reload.
            </p>
            {this.state.error && (
              <pre className="eb-error-details">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <div className="eb-actions">
              <button
                type="button"
                className="eb-btn eb-btn--primary"
                onClick={this.handleReset}
              >
                ← Return to Catalog
              </button>
              <button
                type="button"
                className="eb-btn eb-btn--secondary"
                onClick={() => window.location.reload()}
              >
                ↻ Reload Page
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
