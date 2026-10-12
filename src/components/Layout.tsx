import { AcademyLogo } from "./AcademyLogo";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X, Sparkles, Terminal } from "lucide-react";
import { Component, type ReactNode, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRbac } from "@/lib/use-rbac";
import { CommandPalette } from "./CommandPalette";
import { ThemeToggle } from "./ThemeToggle";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; message: string }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }
  static getDerivedStateFromError(error: unknown) {
    return {
      hasError: true,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
    };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-2xl px-5 py-24 text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-mint/20 text-leaf">
            <Terminal className="h-6 w-6" />
          </div>
          <h1 className="font-display mt-6 text-3xl font-bold text-ink">
            Something went wrong
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            {this.state.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, message: "" });
              window.location.reload();
            }}
            className="primary-action mt-8"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const nav = [
  ["/explore", "Explore"],
  ["/pathways", "Learning paths"],
  ["/courses", "Courses"],
  ["/labs", "Practical labs"],
  ["/resources", "Resources"],
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { data: session, isPending } = authClient.useSession();
  const { data: rbac } = useRbac();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        document.getElementById("navigation-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-cream/85 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-cream/80">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="Rauell AI Academy home"
        >
          <AcademyLogo decorative className="h-10 w-10 transition-transform group-hover:scale-105" />
          <div className="leading-none">
            <div className="font-display text-[19px] font-bold tracking-tight text-ink">
              Rauell
            </div>
            <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[.24em] text-ink/55 dark:text-ink/65">
              <span>AI Academy</span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden items-center gap-1 rounded-full border border-line/70 bg-paper/60 p-1 backdrop-blur-sm dark:border-white/10 dark:bg-paper/40 lg:flex"
          aria-label="Main navigation"
        >
          {nav.map(([to, label]) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition ${
                  isActive
                    ? "bg-ink text-paper shadow-xs dark:bg-white/15 dark:text-white"
                    : "text-ink/65 hover:bg-paper hover:text-ink dark:text-ink/75 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Utilities */}
        <div className="hidden items-center gap-2.5 lg:flex">
          {/* Quick Search Trigger */}
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              );
            }}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-line bg-paper/80 px-3 text-xs font-medium text-ink/70 transition hover:border-ink/20 hover:text-ink dark:border-white/10 dark:bg-paper/60 dark:hover:border-white/25"
            title="Search courses, pathways, and labs (⌘K)"
          >
            <span>Search</span>
            <kbd className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[10px] text-ink/50 dark:bg-white/10 dark:text-ink/60">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher Toggle */}
          <ThemeToggle compact />

          {/* Ecosystem Link */}
          <a
            href="https://rauell.systems"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1 rounded-full px-3 text-xs font-bold text-ink/60 transition hover:bg-paper/60 hover:text-ink dark:text-ink/70 dark:hover:text-white"
          >
            <span>Hub</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
          </a>

          {/* Auth State */}
          {!isPending &&
            (session ? (
              <div className="flex items-center gap-2 pl-1">
                {rbac?.isAdmin && (
                  <Link
                    to="/admin"
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-bold text-ink transition hover:border-ink/30 dark:border-white/15"
                  >
                    Admin
                  </Link>
                )}
                {rbac?.isInstructor && !rbac?.isAdmin && (
                  <Link
                    to="/instructor"
                    className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-bold text-ink transition hover:border-ink/30 dark:border-white/15"
                  >
                    Instructor
                  </Link>
                )}
                <Link
                  to="/my-learning"
                  className="rounded-full bg-mint px-4 py-2 text-xs font-extrabold text-[#0b1830] transition hover:brightness-105 shadow-xs"
                >
                  My learning
                </Link>
                <Link
                  to="/account"
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-xs font-bold text-ink transition hover:border-ink/30 dark:border-white/15"
                  title="Your account"
                >
                  Account
                </Link>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="rounded-full bg-mint px-4.5 py-2 text-xs font-extrabold text-[#0b1830] transition hover:brightness-105 shadow-xs"
              >
                Sign in
              </Link>
            ))}
        </div>

        {/* Mobile menu and theme toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle compact />
          <button
            onClick={() => setOpen(!open)}
            className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-ink transition dark:border-white/15"
            id="navigation-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-line bg-paper p-5 transition-colors dark:border-white/10 lg:hidden"
        >
          <button
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
              );
            }}
            className="secondary-action mb-4 w-full"
          >
            Search the Academy (⌘K)
          </button>
          <div className="space-y-1">
            {nav.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                aria-current={
                  location.pathname.startsWith(to) ? "page" : undefined
                }
                className="block rounded-xl px-4 py-3 text-base font-bold text-ink hover:bg-cream dark:hover:bg-white/5"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t border-line pt-4 dark:border-white/10">
            {session ? (
              <div className="space-y-2">
                {rbac?.isAdmin && (
                  <Link
                    to="/admin"
                    className="block rounded-full border border-line bg-paper px-5 py-2.5 text-center font-bold text-ink"
                  >
                    Course Administration
                  </Link>
                )}
                {rbac?.isSuperAdmin && (
                  <Link
                    to="/admin/access"
                    className="block rounded-full border border-line bg-paper px-5 py-2.5 text-center font-bold text-ink"
                  >
                    Access Management
                  </Link>
                )}
                {rbac?.isInstructor && (
                  <Link
                    to="/instructor"
                    className="block rounded-full border border-line bg-paper px-5 py-2.5 text-center font-bold text-ink"
                  >
                    Instructor Workspace
                  </Link>
                )}
                <Link
                  to="/my-learning"
                  className="block rounded-full bg-mint px-5 py-3 text-center font-bold text-[#0b1830]"
                >
                  My learning
                </Link>
                <Link
                  to="/account"
                  className="block rounded-full border border-line bg-paper px-5 py-3 text-center font-bold text-ink"
                >
                  Account settings
                </Link>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="block rounded-full bg-mint px-5 py-3 text-center font-bold text-[#0b1830]"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-ink text-white dark:border-white/10 dark:bg-[#070b12]">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <AcademyLogo
                decorative
                className="h-11 w-11 rounded-2xl bg-paper p-1.5 shadow-sm"
              />
              <div>
                <p className="font-display text-xl font-bold tracking-tight">
                  Rauell AI Academy
                </p>
                <p className="font-mono text-xs text-white/50">
                  Part of the Rauell Systems Ecosystem
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/65">
              Practical AI education for engineers, developers, and builders creating
              real solutions across energy, agriculture, water, business, and community systems.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-mint animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-white/60">
                Academy Runtime Operational
              </span>
            </div>
          </div>
          <div>
            <p className="eyebrow text-mint">Curriculum</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <Link to="/pathways" className="block transition hover:text-white">
                Learning paths
              </Link>
              <Link to="/courses" className="block transition hover:text-white">
                Courses
              </Link>
              <Link to="/labs" className="block transition hover:text-white">
                Practical labs
              </Link>
              <Link to="/resources" className="block transition hover:text-white">
                Resource library
              </Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-mint">Ecosystem</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <a
                href="https://rauell.systems"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition hover:text-white"
              >
                Rauell Systems <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="https://rauell.systems/ai-lab"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 transition hover:text-white"
              >
                AI Lab <ArrowUpRight className="h-3 w-3" />
              </a>
              <a
                href="mailto:contact@rauell.systems"
                className="block transition hover:text-white"
              >
                Contact & Support
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Rauell AI Academy · All rights reserved</p>
          <p className="font-mono">Built for systems that matter</p>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-cream text-ink transition-colors">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl bg-paper ${className}`}
    >
      <AcademyLogo className="h-4/5 w-4/5" />
    </div>
  );
}
