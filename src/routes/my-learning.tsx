import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, BookOpenCheck, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { apiRequest, type DashboardData, useApi } from "@/lib/api";
import { parseLocalProgress } from "@/lib/progress";
export const Route = createFileRoute("/my-learning")({ component: Dashboard });
function Dashboard() {
  const { data: session, isPending } = authClient.useSession();
  const query = useApi<DashboardData>(session ? "/dashboard" : null);
  const items = useMemo(
    () => (session ? parseLocalProgress(localStorage) : []),
    [session],
  );
  const [state, setState] = useState({ busy: false, done: false, error: "" });
  if (isPending)
    return (
      <div className="mx-auto max-w-7xl px-5 py-20" role="status">
        Loading your account...
      </div>
    );
  if (!session)
    return (
      <section className="mx-auto max-w-xl px-5 py-20 text-center">
        <p className="eyebrow text-leaf">Protected learning</p>
        <h1 className="font-display mt-4 text-4xl font-bold">
          Sign in to view your progress.
        </h1>
        <Link
          to="/sign-in"
          className="mt-7 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white"
        >
          Sign in
        </Link>
      </section>
    );
  async function importProgress() {
    setState({ busy: true, done: false, error: "" });
    const importKey =
      localStorage.getItem("academy-progress-import-key") ||
      crypto.randomUUID();
    localStorage.setItem("academy-progress-import-key", importKey);
    try {
      await apiRequest("/progress/import", {
        method: "POST",
        body: JSON.stringify({
          importKey,
          items: items.map(({ courseSlug, lessonKey }) => ({
            courseSlug,
            lessonKey,
          })),
        }),
      });
      items.forEach((x) => localStorage.removeItem(x.key));
      setState({ busy: false, done: true, error: "" });
      await query.reload();
    } catch (e) {
      setState({
        busy: false,
        done: false,
        error: e instanceof Error ? e.message : "Import failed.",
      });
    }
  }
  return (
    <>
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <p className="eyebrow text-mint">My learning</p>
          <h1 className="font-display mt-4 text-4xl font-bold md:text-5xl">
            Welcome back, {session.user.name}.
          </h1>
          <p className="mt-3 text-white/55">
            Your progress is securely connected to your account.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {items.length > 0 && !state.done && (
          <div className="card mb-8 border-leaf/30 bg-mint/10 p-6">
            <h2 className="font-display text-2xl font-bold">
              Import progress from this device?
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              We found {items.length} completed lesson records. Nothing will be
              imported without your confirmation.
            </p>
            <ul className="mt-4 text-sm">
              {items.map((x) => (
                <li key={x.key}>
                  • {x.courseSlug}, lesson {x.lessonKey}
                </li>
              ))}
            </ul>
            {state.error && (
              <p role="alert" className="mt-3 text-sm text-red-700">
                {state.error}
              </p>
            )}
            <button
              onClick={importProgress}
              disabled={state.busy}
              className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
            >
              {state.busy ? "Importing..." : "Confirm import"}
            </button>
          </div>
        )}
        {query.loading && <p role="status">Loading your learning...</p>}
        {query.error && (
          <div className="card p-6" role="alert">
            <h2 className="font-display text-xl font-bold">
              Your dashboard could not be loaded.
            </h2>
            <p className="mt-2 text-sm">{query.error}</p>
            <button
              onClick={query.reload}
              className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-bold text-white"
            >
              Try again
            </button>
          </div>
        )}
        {query.data && <DashboardContent data={query.data} />}
      </section>
    </>
  );
}
function CertificateButton({ courseId }: { courseId: string }) {
  const [message, setMessage] = useState("");
  async function issue() {
    try {
      const result = await apiRequest<{
        certificate: { certificateNumber: string };
      }>(`/courses/${courseId}/certificate`, { method: "POST" });
      setMessage(result.certificate.certificateNumber);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Certificate check failed.");
    }
  }
  return (
    <span>
      <button onClick={issue} className="text-xs font-bold text-leaf">
        Check certificate eligibility
      </button>
      {message && (
        <span
          role="status"
          className="mt-1 block max-w-52 text-[11px] text-ink/50"
        >
          {message}
        </span>
      )}
    </span>
  );
}
function DashboardContent({ data }: { data: DashboardData }) {
  const completed = data.enrolled.filter(
    (x) => x.status === "completed",
  ).length;
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [BookOpenCheck, String(data.enrolled.length), "Courses"],
          [Award, String(completed), "Completed"],
          [Target, String(data.recent.length), "Recent activities"],
        ].map(([Icon, n, label]) => {
          const I = Icon as typeof Award;
          return (
            <div key={label as string} className="card p-5">
              <I className="h-5 w-5 text-leaf" />
              <p className="font-display mt-4 text-3xl font-bold">
                {n as string}
              </p>
              <p className="mt-1 text-xs font-bold uppercase text-ink/45">
                {label as string}
              </p>
            </div>
          );
        })}
      </div>
      <h2 className="font-display mt-10 text-3xl font-bold">
        Continue learning
      </h2>
      {data.enrolled.length === 0 ? (
        <div className="card mt-5 p-8 text-center">
          <Target className="mx-auto text-leaf" />
          <h3 className="font-display mt-4 text-2xl font-bold">
            Choose your first course.
          </h3>
          <Link
            to="/courses"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
          >
            Explore courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {data.enrolled.map((item) => (
            <article key={item.enrolmentId} className="card p-6">
              <p className="eyebrow text-leaf">{item.status}</p>
              <h3 className="font-display mt-3 text-2xl font-bold">
                {item.title}
              </h3>
              <div className="mt-5 h-2 rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-leaf"
                  style={{
                    width: `${(item.completionBasisPoints ?? 0) / 100}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-ink/45">
                {((item.completionBasisPoints ?? 0) / 100).toFixed(0)}% complete
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  to="/courses/$courseSlug"
                  params={{ courseSlug: item.slug }}
                  className="inline-flex items-center gap-2 text-sm font-bold"
                >
                  Resume course <ArrowRight className="h-4 w-4" />
                </Link>
                <CertificateButton courseId={item.courseId} />
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
