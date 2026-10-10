import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  BookOpen,
  Layers,
  FlaskConical,
  Activity,
  ArrowRight,
  X,
} from "lucide-react";
import {
  canonicalPathways,
  canonicalCourses,
} from "@/data/canonical-curriculum";
import { labs } from "@/data/academy";

interface SearchItem {
  id: string;
  title: string;
  category: "Pathway" | "Course" | "Lab" | "Case Study" | "Navigation";
  description: string;
  url: string;
}

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (!isOpen)
          previousFocusRef.current =
            document.activeElement as HTMLElement | null;
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = previousFocusRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const elements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'input, button, [tabindex="0"]',
      );
      if (!elements?.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trapFocus);
      previousFocus?.focus();
    };
  }, [isOpen]);

  // Aggregate searchable items
  const allItems: SearchItem[] = useMemo(() => {
    const list: SearchItem[] = [
      {
        id: "nav-explore",
        title: "Explore Curriculum",
        category: "Navigation",
        description: "Browse pathways, course matrix, and interactive labs.",
        url: "/explore",
      },
      {
        id: "nav-labs",
        title: "Practical Labs",
        category: "Navigation",
        description:
          "Hands-on prompt sandboxes, claim audits, and telemetry triage.",
        url: "/labs",
      },
      {
        id: "nav-case-studies",
        title: "Living Case Studies (AI-OS)",
        category: "Navigation",
        description:
          "Training case studies and simulated telemetry from Kenyan energy, agriculture, and water contexts.",
        url: "/resources",
      },
      {
        id: "nav-my-learning",
        title: "My Learning Dashboard",
        category: "Navigation",
        description: "View your enrolments, lesson progress, and next steps.",
        url: "/my-learning",
      },
    ];

    // Pathways
    canonicalPathways.forEach((p) => {
      list.push({
        id: `p-${p.slug}`,
        title: p.title,
        category: "Pathway",
        description: p.copy || p.description,
        url: `/pathways/${p.slug}`,
      });
    });

    // Courses
    canonicalCourses.forEach((c) => {
      list.push({
        id: `c-${c.slug}`,
        title: c.title,
        category: "Course",
        description: c.summary || c.description,
        url: `/courses/${c.slug}`,
      });
    });

    // Labs
    labs.forEach((l) => {
      list.push({
        id: `l-${l.id}`,
        title: l.title,
        category: "Lab",
        description: l.copy,
        url: `/labs`,
      });
    });

    // Living Case Studies
    list.push(
      {
        id: "cs-nakuru",
        title: "Nakuru Agro-Solar Inverter Trip",
        category: "Case Study",
        description:
          "50kWp PV array inverter clipping and string anomaly post-mortem.",
        url: "/resources",
      },
      {
        id: "cs-kericho",
        title: "Kericho Tea Outgrowers Collection Failure",
        category: "Case Study",
        description:
          "Weighbridge sync failure, dead-letter queue recovery, and M-Pesa B2C.",
        url: "/resources",
      },
      {
        id: "cs-naivasha",
        title: "Naivasha Aquifer Drawdown Breach",
        category: "Case Study",
        description:
          "Groundwater regulatory compliance under the Water Act 2016.",
        url: "/resources",
      },
    );

    return list;
  }, []);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return allItems.slice(0, 10);
    const q = query.toLowerCase();
    return allItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [allItems, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  function handleSelect(item: SearchItem) {
    setIsOpen(false);
    setQuery("");
    void navigate({ to: item.url });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!filteredItems.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredItems.length) % filteredItems.length,
      );
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
      onClick={() => setIsOpen(false)}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the Academy"
        className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-zinc-200 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-zinc-200 gap-3 bg-zinc-50/50">
          <Search className="h-5 w-5 text-zinc-400 shrink-0" />
          <input
            aria-label="Search courses, labs, and pathways"
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search courses, pathways, labs, or case studies... (e.g. solar, prompting, water)"
            className="min-w-0 flex-1 bg-transparent text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Close search"
            onClick={() => setIsOpen(false)}
            className="rounded p-2 text-zinc-600"
          >
            <X className="h-4 w-4" />
          </button>
          {query && (
            <button
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="text-zinc-400 hover:text-zinc-600 rounded p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block rounded bg-zinc-200/80 px-2 py-0.5 text-[10px] font-mono text-zinc-600">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-zinc-100">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-zinc-500">
              No results found for{" "}
              <span className="font-semibold text-zinc-700">"{query}"</span>.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full text-left flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-950"
                      : "hover:bg-zinc-50 text-zinc-800"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                        item.category === "Pathway"
                          ? "bg-amber-100 text-amber-800"
                          : item.category === "Course"
                            ? "bg-blue-100 text-blue-800"
                            : item.category === "Lab"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.category === "Case Study"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {item.category === "Pathway" && (
                        <Layers className="h-4 w-4" />
                      )}
                      {item.category === "Course" && (
                        <BookOpen className="h-4 w-4" />
                      )}
                      {item.category === "Lab" && (
                        <FlaskConical className="h-4 w-4" />
                      )}
                      {item.category === "Case Study" && (
                        <Activity className="h-4 w-4" />
                      )}
                      {item.category === "Navigation" && (
                        <ArrowRight className="h-4 w-4" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`h-4 w-4 text-emerald-600 shrink-0 transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-t border-zinc-200 text-[11px] text-zinc-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px]">
                ↑
              </kbd>
              <kbd className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px] ml-1">
                ↓
              </kbd>{" "}
              navigate
            </span>
            <span>
              <kbd className="rounded bg-zinc-200 px-1.5 py-0.5 font-mono text-[10px]">
                ↵
              </kbd>{" "}
              select
            </span>
          </div>
          <span>NVIDIA LLM & Academy Search</span>
        </div>
      </div>
    </div>
  );
}
