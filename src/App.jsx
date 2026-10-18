import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import ErrorBoundary from "./components/ErrorBoundary";

import Home from "./pages/Home";

// Route-level code-split visualizer and theory pages
const BubbleSort = lazy(() => import("./pages/algorithms/sorting/BubbleSort"));
const SelectionSort = lazy(() => import("./pages/algorithms/sorting/SelectionSort"));
const InsertionSort = lazy(() => import("./pages/algorithms/sorting/InsertionSort"));
const MergeSort = lazy(() => import("./pages/algorithms/sorting/MergeSort"));
const QuickSort = lazy(() => import("./pages/algorithms/sorting/QuickSort"));
const LinearSearch = lazy(() => import("./pages/algorithms/searching/LinearSearch"));
const BinarySearch = lazy(() => import("./pages/algorithms/searching/BinarySearch"));
const PushPop = lazy(() => import("./pages/algorithms/stack/PushPop"));
const Traversal = lazy(() => import("./pages/algorithms/linkedList/Traversal"));
const BSTInsertion = lazy(() => import("./pages/algorithms/tree/BSTInsertion"));
const BFS = lazy(() => import("./pages/algorithms/graph/BFS"));
const DFS = lazy(() => import("./pages/algorithms/graph/DFS"));
const EnqueueDequeue = lazy(() => import("./pages/algorithms/queue/EnqueueDequeue"));
const SinglyInsertDelete = lazy(() => import("./pages/algorithms/linkedList/SinglyInsertDelete"));
const Reverse = lazy(() => import("./pages/algorithms/linkedList/Reverse"));
const DetectCycle = lazy(() => import("./pages/algorithms/linkedList/DetectCycle"));
const TheoryTopicPage = lazy(() => import("./pages/TheoryTopicPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

import "./App.css";

/**
 * ScrollToTop — Automatically resets scroll position to the very top on route change.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * PageFallback — Lightweight, accessible loading indicator for lazy routes.
 */
function PageFallback() {
  return (
    <div className="page-fallback" role="status" aria-label="Loading algorithm visualizer">
      <div className="page-fallback__spinner" aria-hidden="true" />
    </div>
  );
}

/**
 * Inner component — must live inside <BrowserRouter> so useLocation works.
 * Wraps <Routes> in a keyed div that re-mounts on every pathname change,
 * triggering the pageFadeIn CSS animation automatically.
 */
function RouterContent() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition" id="main-content" tabIndex={-1}>
      <Suspense fallback={<PageFallback />}>
        <Routes location={location}>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Existing Built Visualizer Routes */}
          <Route path="/sorting/bubble" element={<BubbleSort />} />
          <Route path="/sorting/selection" element={<SelectionSort />} />
          <Route path="/sorting/insertion" element={<InsertionSort />} />
          <Route path="/sorting/merge" element={<MergeSort />} />
          <Route path="/sorting/quick" element={<QuickSort />} />
          <Route path="/searching/linear" element={<LinearSearch />} />
          <Route path="/searching/binary" element={<BinarySearch />} />
          <Route path="/stack/push-pop" element={<PushPop />} />
          <Route path="/queue/enqueue-dequeue" element={<EnqueueDequeue />} />
          <Route path="/linked-list/traversal" element={<Traversal />} />
          <Route path="/linked-list/singly-insert-delete" element={<SinglyInsertDelete />} />
          <Route path="/linked-list/reverse" element={<Reverse />} />
          <Route path="/linked-list/cycle" element={<DetectCycle />} />
          <Route path="/tree/bst-insertion" element={<BSTInsertion />} />
          <Route path="/tree/inorder" element={<BSTInsertion />} />
          <Route path="/tree/preorder" element={<BSTInsertion />} />
          <Route path="/tree/postorder" element={<BSTInsertion />} />
          <Route path="/graph/bfs" element={<BFS />} />
          <Route path="/graph/dfs" element={<DFS />} />

          {/* Comprehensive Theory Routes (Visualizers Coming Soon) */}
          <Route path="/stack/balanced-parens" element={<TheoryTopicPage />} />
          <Route path="/stack/next-greater" element={<TheoryTopicPage />} />
          <Route path="/queue/circular" element={<TheoryTopicPage />} />
          <Route path="/queue/priority" element={<TheoryTopicPage />} />
          <Route path="/linked-list/doubly-insert-delete" element={<TheoryTopicPage />} />
          <Route path="/tree/min-heap" element={<TheoryTopicPage />} />
          <Route path="/tree/max-heap" element={<TheoryTopicPage />} />
          <Route path="/graph/dijkstra" element={<TheoryTopicPage />} />
          <Route path="/graph/bellman-ford" element={<TheoryTopicPage />} />

          {/* 404 Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ScrollToTop />
        <Navbar />
        <ErrorBoundary>
          <main className="relative z-10">
            <RouterContent />
          </main>
        </ErrorBoundary>
      </BrowserRouter>
    </ThemeProvider>
  );
}
