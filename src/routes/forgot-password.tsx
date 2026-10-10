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
  const [error, setError] = useState("");
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData(e.currentTarget);
    setError("");
    try {
      const result = await authClient.requestPasswordReset({
        email: String(data.get("email")),
        redirectTo: "/reset-password",
      });
      if (result.error)
        setError("We could not process your reset request. Please try again.");
      else setSent(true);
    } catch {
      setError(
        "We could not connect to the Academy account service. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <AuthCard
      title="Reset your password"
      copy="Enter the email address for your Rauell AI Academy account to request a secure password reset link."
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
          error={error}
          success={
            sent
              ? "If an eligible account exists, look for a Rauell AI Academy email with reset instructions. Check your spam folder if needed."
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
