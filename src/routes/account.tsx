import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export const Route = createFileRoute("/account")({ component: Account });
function Account() {
  const { data: session, isPending } = authClient.useSession();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  if (isPending)
    return (
      <div className="mx-auto max-w-3xl px-5 py-20" role="status">
        Loading your account...
      </div>
    );
  if (!session)
    return (
      <div className="mx-auto max-w-xl px-5 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Sign in required</h1>
        <Link
          to="/sign-in"
          className="mt-6 inline-block rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
        >
          Sign in
        </Link>
      </div>
    );
  async function signOut() {
    setBusy(true);
    await authClient.signOut();
    nav({ to: "/" });
  }
  return (
    <section className="mx-auto max-w-3xl px-5 py-16">
      <p className="eyebrow text-leaf">Account settings</p>
      <h1 className="font-display mt-4 text-4xl font-bold">Your account</h1>
      <div className="card mt-8 p-6">
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-bold uppercase text-ink/40">Name</dt>
            <dd className="mt-1 font-semibold">{session.user.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-ink/40">Email</dt>
            <dd className="mt-1 font-semibold">{session.user.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold uppercase text-ink/40">
              Email status
            </dt>
            <dd className="mt-1 font-semibold">
              {session.user.emailVerified
                ? "Verified"
                : "Verification required"}
            </dd>
          </div>
        </dl>
        <button
          onClick={signOut}
          disabled={busy}
          className="mt-8 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-bold"
        >
          {busy ? "Signing out..." : "Sign out"}
        </button>
      </div>
      <div className="mt-6 rounded-2xl border border-ink/10 p-6">
        <h2 className="font-display text-xl font-bold">Privacy requests</h2>
        <p className="mt-2 text-sm text-ink/60">
          Data export and account deletion request workflows will be connected
          before Phase 2 production approval.
        </p>
      </div>
    </section>
  );
}
