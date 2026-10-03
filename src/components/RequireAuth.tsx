import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Lock, LogIn, Sparkles, UserPlus } from "lucide-react";
import React, { type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface RequireAuthProps {
  children: ReactNode;
  title?: string;
  description?: string;
  backTo?: string;
  backLabel?: string;
}

export function RequireAuth({
  children,
  title = "Account Required to Access Learning Content",
  description = "All curriculum lessons, interactive exercises, capstone projects, and AI mentors are reserved for registered academy learners.",
  backTo,
  backLabel = "Return to overview",
}: RequireAuthProps) {
  const { data: session, isPending } = authClient.useSession();
  const location = useLocation();

  if (isPending) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-5 py-20 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-leaf border-t-transparent" />
        <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wider text-ink/60">
          Verifying learner authorization...
        </p>
      </div>
    );
  }

  if (!session) {
    const currentPath = location.pathname;

    return (
      <section className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-5 py-16 text-center">
        {/* Security / Auth Badge Icon */}
        <div className="relative mb-6">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-leaf/10 border-2 border-leaf/30 text-leaf shadow-sm">
            <Lock className="h-9 w-9 text-leaf" />
          </div>
          <div className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-ink text-mint shadow">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        <p className="eyebrow text-leaf">Protected Learning Environment</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold text-ink sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-6 text-ink/75 sm:text-base">
          {description}
        </p>

        {/* Feature inclusions */}
        <div className="mt-8 grid w-full max-w-md gap-2.5 rounded-2xl border border-ink/10 bg-paper/60 p-4 text-left text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 font-medium text-ink/80">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-leaf" />
            <span>Interactive lessons & code verification checkpoints</span>
          </div>
          <div className="flex items-center gap-2.5 font-medium text-ink/80">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-leaf" />
            <span>Live AI Mentor drawer & contextual assistance</span>
          </div>
          <div className="flex items-center gap-2.5 font-medium text-ink/80">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-leaf" />
            <span>Persistent learning progress, badges & certificates</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/sign-in"
            search={{ redirect: currentPath }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-leaf"
          >
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
          <Link
            to="/register"
            search={{ redirect: currentPath }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-6 py-3.5 text-sm font-bold text-ink shadow-xs transition hover:bg-paper"
          >
            <UserPlus className="h-4 w-4" />
            Create account
          </Link>
        </div>

        {backTo && (
          <div className="mt-8">
            <Link
              to={backTo}
              className="inline-flex items-center gap-2 text-xs font-bold text-ink/60 hover:text-ink transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {backLabel}
            </Link>
          </div>
        )}
      </section>
    );
  }

  return <>{children}</>;
}
