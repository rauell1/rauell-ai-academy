import { AcademyLogo } from "./AcademyLogo";
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
        <AcademyLogo className="mb-5 h-14 w-14" />
        <p className="eyebrow text-leaf">Secure account</p>
        <h1 className="font-display mt-4 text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-ink/60">{copy}</p>
        <div className="mt-7">{children}</div>
      </div>
    </section>
  );
}
export const fieldClass =
  "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm text-[#0b1830] outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/20 dark:border-white/15 dark:bg-[#121927] dark:text-[#f3f5fa]";
export const buttonClass =
  "mt-5 w-full rounded-full bg-[#0b1830] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#162746] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-mint dark:text-[#0b1830] dark:hover:brightness-105";
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
      className={`mt-4 rounded-xl p-3 text-sm font-medium ${
        error
          ? "bg-red-50 text-red-800 dark:border dark:border-red-800/40 dark:bg-red-950/60 dark:text-red-200"
          : "bg-mint/25 text-[#0b1830] dark:bg-mint/20 dark:text-white"
      }`}
    >
      {error || success}
    </div>
  );
}
export type SubmitEvent = FormEvent<HTMLFormElement>;
