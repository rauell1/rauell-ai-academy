import { Link, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

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
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-cream/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-3"
          aria-label="Rauell AI Academy home"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-9 w-9 rounded-lg object-contain"
          />
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
              className={`rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${location.pathname.startsWith(to) ? "bg-ink text-white" : "text-ink/65 hover:bg-white hover:text-ink"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://rauell.systems"
            className="inline-flex items-center gap-1 text-xs font-bold text-ink/60 hover:text-ink"
          >
            Rauell Systems <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          {!isPending &&
            (session ? (
              <Link
                to="/my-learning"
                className="rounded-full bg-mint px-5 py-2.5 text-sm font-extrabold text-ink transition hover:brightness-95"
              >
                My learning
              </Link>
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
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-ink/10 bg-paper p-5 lg:hidden">
          {nav.map(([to, label]) => (
            <Link
              key={to}
              to={to}
              className="block border-b border-ink/10 py-3 text-base font-bold"
            >
              {label}
            </Link>
          ))}
          <Link
            to={session ? "/my-learning" : "/sign-in"}
            className="mt-4 block rounded-full bg-mint px-5 py-3 text-center font-bold"
          >
            {session ? "My learning" : "Sign in"}
          </Link>
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
              <img src="/logo.png" alt="" className="h-10 w-10 rounded-lg" />
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

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid place-items-center rounded-2xl bg-ink text-mint ${className}`}
    >
      <BookOpen className="h-1/2 w-1/2" />
    </div>
  );
}
