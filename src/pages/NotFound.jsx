import { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NotFound.css";

/**
 * NotFound — 404 catch-all page for invalid routes.
 */
export default function NotFound() {
  useEffect(() => {
    document.title = "404 — Page Not Found | Algorithm Visualizer";
  }, []);

  return (
    <main className="not-found" aria-labelledby="nf-title">
      <div className="not-found__card">
        <div className="not-found__badge">404 Error</div>
        <h1 id="nf-title" className="not-found__title">
          Page Not Found
        </h1>
        <p className="not-found__desc">
          The page or algorithm route you are looking for doesn't exist or has been moved.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="not-found__btn not-found__btn--primary">
            ← Go to Home Catalog
          </Link>
        </div>
      </div>
    </main>
  );
}
