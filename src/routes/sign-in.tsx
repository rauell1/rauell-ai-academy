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
export const Route = createFileRoute("/sign-in")({ component: SignIn });
function SignIn() {
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: SubmitEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const result = await authClient.signIn.email({
      email: String(data.get("email")),
      password: String(data.get("password")),
      callbackURL: "/my-learning",
    });
    setBusy(false);
    if (result.error)
      setError(result.error.message || "Sign in failed. Please try again.");
    else nav({ to: "/my-learning" });
  }
  return (
    <AuthCard
      title="Welcome back"
      copy="Sign in to continue your learning on any device."
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
        <label className="mt-4 block text-sm font-bold">
          Password
          <input
            className={fieldClass}
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={10}
            required
          />
        </label>
        <div className="mt-3 text-right">
          <Link to="/forgot-password" className="text-xs font-bold text-leaf">
            Forgot password?
          </Link>
        </div>
        <FormStatus error={error} />
        <button className={buttonClass} disabled={busy}>
          {busy ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-ink/60">
        New to the Academy?{" "}
        <Link to="/register" className="font-bold text-ink">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
