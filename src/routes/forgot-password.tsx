import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthCard,
  buttonClass,
  fieldClass,
  FormStatus,
  type SubmitEvent,
} from "@/components/AuthCard";
import { authClient } from "@/lib/auth-client";
export const Route = createFileRoute("/forgot-password")({
  component: ForgotPassword,
});
function ForgotPassword() {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData(e.currentTarget);
    await authClient.requestPasswordReset({
      email: String(data.get("email")),
      redirectTo: "/reset-password",
    });
    setBusy(false);
    setSent(true);
  }
  return (
    <AuthCard
      title="Reset your password"
      copy="Enter your email. If an account is eligible, we will send password reset instructions."
    >
      <form onSubmit={submit}>
        <label className="text-sm font-bold">
          Email
          <input
            className={fieldClass}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <FormStatus
          success={
            sent
              ? "If an eligible account exists, reset instructions have been sent."
              : undefined
          }
        />
        <button className={buttonClass} disabled={busy || sent}>
          {busy ? "Requesting..." : "Send reset instructions"}
        </button>
      </form>
      <Link to="/sign-in" className="mt-6 block text-center text-sm font-bold">
        Return to sign in
      </Link>
    </AuthCard>
  );
}
