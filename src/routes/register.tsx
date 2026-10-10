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

type RegisterSearch = {
  redirect?: string;
};

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: Register,
});

function Register() {
  const { redirect } = Route.useSearch();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const target =
    redirect && redirect.startsWith("/") ? redirect : "/my-learning";

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
      callbackURL: target,
    });
    setBusy(false);
    if (result.error) {
      const msg = result.error.message || "";
      const isDuplicate =
        msg.toLowerCase().includes("exist") ||
        msg.toLowerCase().includes("duplicate") ||
        msg.toLowerCase().includes("already");
      setError(
        isDuplicate
          ? "An account with this email address already exists. Please sign in below."
          : msg ||
              "We could not create the account. Please check your details and try again.",
      );
    } else {
      setSuccess(
        "Account created successfully! Redirecting to your learning...",
      );
      setTimeout(() => {
        nav({ to: target as any });
      }, 650);
    }
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
        <Link
          to="/sign-in"
          search={{ redirect }}
          className="font-bold text-ink hover:underline"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
