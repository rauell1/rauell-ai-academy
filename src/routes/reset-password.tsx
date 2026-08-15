import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  AuthCard,
  buttonClass,
  fieldClass,
  FormStatus,
  type SubmitEvent,
} from "@/components/AuthCard";
import { authClient } from "@/lib/auth-client";
export const Route = createFileRoute("/reset-password")({
  validateSearch: (s: Record<string, unknown>) => ({
    token: typeof s.token === "string" ? s.token : "",
  }),
  component: ResetPassword,
});
function ResetPassword() {
  const { token } = Route.useSearch();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setBusy(true);
    const data = new FormData(e.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirm"))) {
      setError("Passwords do not match.");
      setBusy(false);
      return;
    }
    const result = await authClient.resetPassword({
      newPassword: password,
      token,
    });
    setBusy(false);
    if (result.error)
      setError(
        result.error.message || "This reset link is invalid or expired.",
      );
    else nav({ to: "/sign-in" });
  }
  return (
    <AuthCard
      title="Choose a new password"
      copy="Reset links are time limited and can only be used once."
    >
      {token ? (
        <form onSubmit={submit}>
          <label className="text-sm font-bold">
            New password
            <input
              className={fieldClass}
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Confirm password
            <input
              className={fieldClass}
              name="confirm"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
            />
          </label>
          <FormStatus error={error} />
          <button className={buttonClass} disabled={busy}>
            {busy ? "Saving..." : "Save new password"}
          </button>
        </form>
      ) : (
        <>
          <FormStatus error="This reset link is missing or invalid." />
          <Link
            to="/forgot-password"
            className="mt-5 block text-center text-sm font-bold"
          >
            Request another link
          </Link>
        </>
      )}
    </AuthCard>
  );
}
