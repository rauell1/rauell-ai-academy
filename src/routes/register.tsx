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
export const Route = createFileRoute("/register")({ component: Register });
function Register() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const password = String(data.get("password"));
    if (password !== String(data.get("confirm"))) {
      setError("Passwords do not match.");
      setBusy(false);
      return;
    }
    const result = await authClient.signUp.email({
      name: String(data.get("name")),
      email: String(data.get("email")),
      password,
      callbackURL: "/my-learning",
    });
    setBusy(false);
    if (result.error)
      setError(result.error.message || "We could not create the account.");
    else
      setSuccess(
        "Account created. Check your email to verify your address before signing in.",
      );
  }
  return (
    <AuthCard
      title="Create your account"
      copy="Start learning at your pace and keep your progress securely linked to you."
    >
      <form onSubmit={submit}>
        <label className="text-sm font-bold">
          Full name
          <input
            className={fieldClass}
            name="name"
            autoComplete="name"
            required
          />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Email
          <input
            className={fieldClass}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <label className="mt-4 block text-sm font-bold">
          Password
          <input
            className={fieldClass}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            maxLength={128}
            required
          />
          <span className="mt-1 block text-[11px] font-normal text-ink/45">
            Use at least 10 characters.
          </span>
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
        <FormStatus error={error} success={success} />
        <button className={buttonClass} disabled={busy || !!success}>
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        Already registered?{" "}
        <Link to="/sign-in" className="font-bold text-ink">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
