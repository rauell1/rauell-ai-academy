import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
export const Route = createFileRoute("/account")({ component: Account });
function Account() {
  const { data: session, isPending } = authClient.useSession();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
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
      <form
        className="mt-6 rounded-2xl border border-ink/10 p-6"
        onSubmit={async (e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const result = await authClient.changePassword({
            currentPassword: String(d.get("current")),
            newPassword: String(d.get("next")),
            revokeOtherSessions: true,
          });
          setAccountMessage(
            result.error
              ? result.error.message || "Password change failed."
              : "Password changed and other sessions revoked.",
          );
          if (!result.error) e.currentTarget.reset();
        }}
      >
        <h2 className="font-display text-xl font-bold">Change password</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            name="current"
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            className="rounded-xl border p-3"
            required
          />
          <input
            name="next"
            type="password"
            autoComplete="new-password"
            minLength={10}
            placeholder="New password"
            className="rounded-xl border p-3"
            required
          />
        </div>
        {accountMessage && (
          <p role="status" className="mt-3 text-sm">
            {accountMessage}
          </p>
        )}
        <button className="mt-4 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">
          Update password
        </button>
      </form>
      <div className="mt-6 rounded-2xl border border-ink/10 p-6">
        <h2 className="font-display text-xl font-bold">Privacy requests</h2>
        <p className="mt-2 text-sm text-ink/60">
          Download a copy of core account and learning records, or request
          account deletion.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={async () => {
              const data = await apiRequest<unknown>("/account/export");
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = "rauell-academy-data.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="rounded-full border border-ink/20 px-4 py-2 text-xs font-bold"
          >
            Export my data
          </button>
          <button
            onClick={async () => {
              if (
                confirm(
                  "Request account deletion? Access will be restricted while the request is reviewed.",
                )
              ) {
                await apiRequest("/account/delete-request", { method: "POST" });
                await authClient.signOut();
                nav({ to: "/" });
              }
            }}
            className="rounded-full border border-red-300 px-4 py-2 text-xs font-bold text-red-700"
          >
            Request deletion
          </button>
        </div>
      </div>
    </section>
  );
}
