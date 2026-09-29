import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

// SVG Icons

const SVG_PROPS = {
  viewBox: "0 0 24 24",
  width: "20",
  height: "20",
  stroke: "currentColor",
  fill: "none",
  strokeWidth: "1.75",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

function ArrayIcon() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  );
}

function QueueIcon() {
  return (
    <svg {...SVG_PROPS}>
      <line x1="3" y1="8"  x2="15" y2="8"  />
      <line x1="3" y1="12" x2="15" y2="12" />
      <line x1="3" y1="16" x2="15" y2="16" />
      <polyline points="17 8 21 12 17 16" />
    </svg>
  );
}

function LinkedListIcon() {
  return (
    <svg {...SVG_PROPS}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  );
}

function TreeIcon() {
  return (
    <svg {...SVG_PROPS}>
      <line x1="6" y1="3" x2="6" y2="15" />
      <circle cx="18" cy="6"  r="3" />
      <circle cx="6"  cy="18" r="3" />
      <circle cx="6"  cy="6"  r="3" />
      <path d="M18 9a9 9 0 01-9 9" />
    </svg>
  );
}

function GraphIcon() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="18" cy="5"  r="3" />
      <circle cx="6"  cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" />
    </svg>
  );
}

function BookOpenIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="12"
      height="12"
      stroke="currentColor"
      fill="none"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="algo-card__theory-icon"
      aria-hidden="true"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

// Category Data

const CATEGORIES = [
  {
    id: "array",
    name: "Array",
    icon: <ArrayIcon />,
    sections: [
      {
        name: "Searching",
        items: [
          { name: "Linear Search",  path: "/searching/linear",  built: true, worstCase: "O(n)"       },
          { name: "Binary Search",  path: "/searching/binary",  built: true, worstCase: "O(log n)"   },
        ],
      },
      {
        name: "Sorting",
        items: [
          { name: "Bubble Sort",    path: "/sorting/bubble",    built: true, worstCase: "O(n²)"      },
          { name: "Selection Sort", path: "/sorting/selection", built: true, worstCase: "O(n²)"      },
          { name: "Insertion Sort", path: "/sorting/insertion", built: true, worstCase: "O(n²)"      },
          { name: "Merge Sort",     path: "/sorting/merge",     built: true, worstCase: "O(n log n)" },
          { name: "Quick Sort",     path: "/sorting/quick",     built: true, worstCase: "O(n²)"      },
        ],
      },
    ],
  },
  {
    id: "stack",
    name: "Stack",
    icon: <StackIcon />,
    sections: [
      {
        name: "Operations",
        items: [
          { name: "Push & Pop",           path: "/stack/push-pop",          built: true, worstCase: "O(1)" },
          { name: "Balanced Parentheses", path: "/stack/balanced-parens" },
          { name: "Next Greater Element", path: "/stack/next-greater" },
        ],
      },
    ],
  },
  {
    id: "queue",
    name: "Queue",
    icon: <QueueIcon />,
    sections: [
      {
        name: "Operations",
        items: [
          { name: "Enqueue & Dequeue", path: "/queue/enqueue-dequeue", built: true, worstCase: "O(1)" },
          { name: "Circular Queue",    path: "/queue/circular" },
          { name: "Priority Queue",    path: "/queue/priority" },
        ],
      },
    ],
  },
  {
    id: "linked-list",
    name: "Linked List",
    icon: <LinkedListIcon />,
    sections: [
      {
        name: "Traversal",
        items: [
          { name: "Traversal", path: "/linked-list/traversal", built: true, worstCase: "O(n)" },
        ],
      },
      {
        name: "Singly Linked List",
        items: [
          { name: "Insertion & Deletion", path: "/linked-list/singly-insert-delete", built: true, worstCase: "O(n)" },
          { name: "Reverse List",         path: "/linked-list/reverse",              built: true, worstCase: "O(n)" },
          { name: "Detect Cycle",         path: "/linked-list/cycle",                built: true, worstCase: "O(n)" },
        ],
      },
      {
        name: "Doubly Linked List",
        items: [
          { name: "Insertion & Deletion", path: "/linked-list/doubly-insert-delete" },
        ],
      },
    ],
  },
  {
    id: "tree",
    name: "Tree",
    icon: <TreeIcon />,
    sections: [
      {
        name: "Binary Search Tree",
        items: [
          { name: "BST Operations",      path: "/tree/bst-insertion", built: true, worstCase: "O(n)"  },
          { name: "Inorder Traversal",   path: "/tree/inorder",       built: true, worstCase: "O(n)"  },
          { name: "Preorder Traversal",  path: "/tree/preorder",      built: true, worstCase: "O(n)"  },
          { name: "Postorder Traversal", path: "/tree/postorder",     built: true, worstCase: "O(n)"  },
        ],
      },
      {
        name: "Heaps",
        items: [
          { name: "Min Heap", path: "/tree/min-heap" },
          { name: "Max Heap", path: "/tree/max-heap" },
        ],
      },
    ],
  },
  {
    id: "graph",
    name: "Graph",
    icon: <GraphIcon />,
    sections: [
      {
        name: "Traversal",
        items: [
          { name: "BFS", path: "/graph/bfs", built: true, worstCase: "O(V+E)" },
          { name: "DFS", path: "/graph/dfs", built: true, worstCase: "O(V+E)" },
        ],
      },
      {
        name: "Shortest Path",
        items: [
          { name: "Dijkstra's",   path: "/graph/dijkstra" },
          { name: "Bellman-Ford", path: "/graph/bellman-ford" },
        ],
      },
    ],
  },
];



// Search highlight helper

/**
 * Splits `text` around case-insensitive occurrences of `query` and
 * returns a React node array with matching substrings wrapped in <mark>.
 * Returns plain text when query is empty.
 */
function Highlight({ text, query }) {
  if (!query) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="algo-mark">{part}</mark>
      : part
  );
}

// Card Components

function AlgoCard({ item, query }) {
  const { name, path, built, worstCase } = item;

  // Unbuilt / Coming soon items
  if (!built) {
    return (
      <div className="algo-card-group">
        <Link
          to={path}
          className="algo-card algo-card--soon"
          title={`Theory available for ${name} (visualizer coming soon)`}
        >
          <span className="algo-card__name">
            <span className="algo-card__label">
              <Highlight text={name} query={query} />
            </span>
          </span>
          <span className="algo-card__soon-badge" aria-label="Visualizer coming soon">
            SOON
          </span>
        </Link>
        <Link
          to={`${path}?tab=theory`}
          className="algo-card__theory-link"
          title={`Read comprehensive theoretical notes & concepts for ${name}`}
          aria-label={`Read theory for ${name}`}
        >
          <BookOpenIcon />
          <span>Theory</span>
        </Link>
      </div>
    );
  }

  // Built items
  return (
    <div className="algo-card-group">
      <Link to={path} className="algo-card" title={`Visualize ${name}`}>
        <span className="algo-card__name">
          <span className="algo-card__label">
            <Highlight text={name} query={query} />
          </span>
        </span>
        <span className="algo-card__arrow" aria-hidden="true">→</span>
      </Link>
      <Link
        to={`${path}?tab=theory`}
        className="algo-card__theory-link"
        title={`Read theoretical notes & concepts for ${name}`}
        aria-label={`Read theory for ${name}`}
      >
        <BookOpenIcon />
        <span>Theory</span>
      </Link>
    </div>
  );
}

function CategorySection({ name, items, query }) {
  return (
    <div className="cat-section">
      <h3 className="cat-section__name">{name}</h3>
      <div className="cat-section__grid">
        {items.map((item) => (
          <AlgoCard
            key={item.path}
            item={item}
            query={query}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryCard({ category, query, index }) {
  // Derive filtered sections (memoised for performance)
  const filteredSections = useMemo(() => {
    if (!query) return category.sections;

    const q = query.toLowerCase();
    return category.sections
      .map((sec) => ({
        ...sec,
        items: sec.items.filter((item) =>
          item.name.toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.items.length > 0);
  }, [category, query]);

  // Hide entire card if no section has matches
  if (query && filteredSections.length === 0) return null;

  return (
    <article
      className="cat-card"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <header className="cat-card__header">
        <span className="cat-card__icon" aria-hidden="true">
          {category.icon}
        </span>
        <h2 className="cat-card__name">{category.name}</h2>
      </header>

      <div className="cat-card__sections">
        {filteredSections.map((sec) => (
          <CategorySection
            key={sec.name}
            name={sec.name}
            items={sec.items}
            query={query}
          />
        ))}
      </div>
    </article>
  );
}

// Search Icon

function SearchIcon() {
  return (
    <svg
      className="search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// Home Component

export default function Home() {
  const [query, setQuery] = useState("");

  useEffect(() => { document.title = "Algorithm Visualizer"; }, []);

  // True if at least one algorithm matches the current query
  const anyVisible = useMemo(() => {
    if (!query) return true;
    const q = query.toLowerCase();
    return CATEGORIES.some((cat) =>
      cat.sections.some((sec) =>
        sec.items.some((item) => item.name.toLowerCase().includes(q))
      )
    );
  }, [query]);

  return (
    <main className="home">
      {/* Hero */}
      <section className="home__hero">
        <div className="hero-text-container">
          <h1 className="hero-title">
            <span className="hero-title-bold">Algorithm</span>
            <span className="hero-title-light">Visualizer</span>
          </h1>
          <div className="hero-subtitle-container">
            <p className="hero-tagline">
              Where algorithmic logic meets visual intuition.
            </p>
            <p className="hero-description">
              Explore step-by-step interactive animations and comprehensive theory across core data structures and algorithms.
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="home__search-wrap" aria-label="Search algorithms">
        <div className="search-bar">
          <SearchIcon />
          <input
            type="search"
            className="search-bar__input"
            placeholder="Search for algorithms…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search algorithms"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              className="search-bar__clear"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live result count */}
        {query && anyVisible && (
          <p className="search-count" aria-live="polite">
            Showing results for <strong>&ldquo;{query}&rdquo;</strong>
          </p>
        )}
      </section>

      {/* Category Grid */}
      <section className="home__grid" aria-label="Algorithm categories">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            query={query}
            index={i}
          />
        ))}

        {/* Empty state */}
        {!anyVisible && (
          <div className="home__empty" role="status" aria-live="polite">
            <span className="home__empty-icon">🔍</span>
            <p>
              No results for &ldquo;<strong>{query}</strong>&rdquo;
            </p>
            <p className="home__empty-hint">
              Try &ldquo;sort&rdquo;, &ldquo;search&rdquo;, &ldquo;bfs&rdquo;, or &ldquo;tree&rdquo;
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="home__footer">
        <span className="home__footer-brand">
          <span className="home__footer-bold">Algorithm</span>
          <span className="home__footer-light">Visualizer</span>
        </span>
        <span className="home__footer-sep" aria-hidden="true">·</span>
        <span className="home__footer-author">
          Crafted by{" "}
          <a
            href="https://vinayakkumarr.github.io/Portfolio/"
            target="_blank"
            rel="noopener noreferrer"
            className="home__footer-author-link"
          >
            Vinayak
          </a>
        </span>
        <span className="home__footer-sep" aria-hidden="true">·</span>
        <span className="home__footer-copy">© {new Date().getFullYear()}</span>
      </footer>
    </main>
  );
}
