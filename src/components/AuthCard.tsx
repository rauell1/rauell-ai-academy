import type { FormEvent, ReactNode } from "react";

export function AuthCard({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-md px-5 py-16 sm:py-24">
      <div className="card p-6 sm:p-8">
        <p className="eyebrow text-leaf">Secure account</p>
        <h1 className="font-display mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">{copy}</p>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}
export const fieldClass =
  "mt-2 w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20";
export const buttonClass =
  "mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50";
export function FormStatus({
  error,
  success,
}: {
  error?: string;
  success?: string;
}) {
  if (!error && !success) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={`mt-4 rounded-xl p-3 text-sm ${error ? "bg-red-50 text-red-800" : "bg-mint/25 text-ink"}`}
    >
      {error || success}
    </div>
  );
}
export type SubmitEvent = FormEvent<HTMLFormElement>;
