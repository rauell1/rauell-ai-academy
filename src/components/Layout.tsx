import { AcademyLogo } from "./AcademyLogo";
import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Component, type ReactNode, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRbac } from "@/lib/use-rbac";
import { CommandPalette } from "./CommandPalette";

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
          <h1 className="font-display text-3xl font-bold text-ink">
            Something went wrong
          </h1>
          <p className="mt-4 text-sm leading-7 text-ink/60">
            {this.state.message}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, message: "" });
              window.location.reload();
            }}
            className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
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
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Rauell AI Academy home"
        >
          <AcademyLogo decorative className="h-10 w-10" />
          <div className="leading-none">
            <div className="font-display text-[18px] font-bold">Rauell</div>
            <div className="mt-1 text-[9px] font-bold uppercase tracking-[.23em] text-ink/55">
              AI Academy
            </div>
          </div>
        </Link>
        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Main navigation"
        >
          {nav.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              aria-current={
                location.pathname.startsWith(to) ? "page" : undefined
              }
              className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${location.pathname.startsWith(to) ? "bg-ink text-white" : "text-ink/65 hover:bg-white hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => {
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              );
            }}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-3 py-1.5 text-xs font-medium text-ink/70 hover:border-ink/20 hover:text-ink transition"
            title="Search courses, pathways, and labs"
          >
            <span>Search</span>
            <kbd className="rounded bg-ink/5 px-1.5 py-0.5 font-mono text-[10px] text-ink/50">
              ⌘K
            </kbd>
          </button>
          <a
            href="https://rauell.systems"
            className="inline-flex items-center gap-1 text-xs font-bold text-ink/60 hover:text-ink"
          >
            Rauell Systems <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {!isPending &&
            (session ? (
              <div className="flex items-center gap-2">
                {rbac?.isAdmin && (
                  <Link
                    to="/admin"
                    className="rounded-full border border-ink/20 px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-white transition"
                  >
                    Admin
                  </Link>
                )}
                {rbac?.isInstructor && !rbac?.isAdmin && (
                  <Link
                    to="/instructor"
                    className="rounded-full border border-ink/20 px-3.5 py-1.5 text-xs font-bold text-ink hover:bg-white transition"
                  >
                    Instructor
                  </Link>
                )}
                <Link
                  to="/my-learning"
                  className="rounded-full bg-mint px-4 py-2 text-xs font-extrabold text-ink transition hover:brightness-95"
                >
                  My learning
                </Link>
                <Link
                  to="/account"
                  className="rounded-full border border-ink/20 bg-white/70 px-3.5 py-2 text-xs font-bold text-ink transition hover:bg-white"
                  title="Your account"
                >
                  Account
                </Link>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="rounded-full bg-mint px-5 py-2.5 text-sm font-extrabold text-ink transition hover:brightness-95"
              >
                Sign in
              </Link>
            ))}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 lg:hidden"
          id="navigation-toggle"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-ink/10 bg-paper p-5 lg:hidden"
        >
          <button
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", ctrlKey: true }),
              );
            }}
            className="secondary-action mb-3 w-full"
          >
            Search the Academy
          </button>
          {nav.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              aria-current={
                location.pathname.startsWith(to) ? "page" : undefined
              }
              className="block border-b border-ink/10 py-3 text-base font-bold"
            >
              {label}
            </Link>
          ))}
          {session ? (
            <div className="mt-4 space-y-2">
              {rbac?.isAdmin && (
                <Link
                  to="/admin"
                  className="block rounded-full border border-ink/20 bg-white px-5 py-2.5 text-center font-bold text-ink"
                >
                  Course Administration
                </Link>
              )}
              {rbac?.isSuperAdmin && (
                <Link
                  to="/admin/access"
                  className="block rounded-full border border-ink/20 bg-white px-5 py-2.5 text-center font-bold text-ink"
                >
                  Access Management
                </Link>
              )}
              {rbac?.isInstructor && (
                <Link
                  to="/instructor"
                  className="block rounded-full border border-ink/20 bg-white px-5 py-2.5 text-center font-bold text-ink"
                >
                  Instructor Workspace
                </Link>
              )}
              <Link
                to="/my-learning"
                className="block rounded-full bg-mint px-5 py-3 text-center font-bold"
              >
                My learning
              </Link>
              <Link
                to="/account"
                className="block rounded-full border border-ink/15 bg-white px-5 py-3 text-center font-bold"
              >
                Account settings
              </Link>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="mt-4 block rounded-full bg-mint px-5 py-3 text-center font-bold"
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <AcademyLogo
                decorative
                className="h-11 w-11 rounded-xl bg-paper p-1"
              />
              <div>
                <p className="font-display text-xl font-bold">
                  Rauell AI Academy
                </p>
                <p className="text-xs text-white/55">
                  Part of the Rauell ecosystem
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/65">
              Practical AI education for people building better engineering,
              energy, agriculture, water, business, and community systems.
            </p>
          </div>
          <div>
            <p className="eyebrow text-mint">Learn</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <Link to="/pathways" className="block hover:text-white">
                Learning paths
              </Link>
              <Link to="/courses" className="block hover:text-white">
                Courses
              </Link>
              <Link to="/labs" className="block hover:text-white">
                Practical labs
              </Link>
              <Link to="/resources" className="block hover:text-white">
                Resources
              </Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-mint">Ecosystem</p>
            <div className="mt-4 space-y-3 text-sm text-white/70">
              <a
                href="https://rauell.systems"
                className="block hover:text-white"
              >
                Rauell Systems
              </a>
              <a
                href="https://rauell.systems/ai-lab"
                className="block hover:text-white"
              >
                AI Lab
              </a>
              <a
                href="mailto:contact@rauell.systems"
                className="block hover:text-white"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Rauell AI Academy</p>
          <p>Built for systems that matter</p>
        </div>
      </div>
    </footer>
  );
}

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
      <CommandPalette />
    </>
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
