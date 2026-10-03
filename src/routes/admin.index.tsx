import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { apiRequest, type ApiCourse, useApi } from "@/lib/api";
import { fieldClass, FormStatus } from "@/components/AuthCard";
import { RequireAuth } from "@/components/RequireAuth";
import { useRbac } from "@/lib/use-rbac";

export const Route = createFileRoute("/admin/")({
  component: () => (
    <RequireAuth>
      <Admin />
    </RequireAuth>
  ),
});

function Admin() {
  const { data: rbac } = useRbac();
  const query = useApi<ApiCourse[]>("/admin/courses");
  const [state, setState] = useState({ busy: false, error: "", success: "" });

  if (rbac && !rbac.isAdmin) {
    return (
      <section className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="eyebrow text-red-600">Access Restricted</p>
        <h1 className="font-display mt-3 text-3xl font-bold">Administrator Access Required</h1>
        <p className="mt-4 text-sm leading-6 text-ink/70">
          Your account is verified with the{" "}
          <strong>{rbac.roles.map((r) => r.name).join(", ") || "Learner"}</strong> role, which
          does not have course administration permissions.
        </p>
        <Link
          to="/my-learning"
          className="mt-8 inline-block rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/90 transition"
        >
          Return to My Learning
        </Link>
      </section>
    );
  }
  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({ busy: true, error: "", success: "" });
    const data = new FormData(e.currentTarget);
    try {
      await apiRequest("/admin/courses", {
        method: "POST",
        body: JSON.stringify({
          title: data.get("title"),
          slug: data.get("slug"),
          summary: data.get("summary"),
          level: data.get("level"),
          estimatedMinutes: Number(data.get("minutes")),
          learningOutcomes: [String(data.get("outcome"))],
        }),
      });
      setState({ busy: false, error: "", success: "Draft course created." });
      e.currentTarget.reset();
      await query.reload();
    } catch (error) {
      setState({
        busy: false,
        error: error instanceof Error ? error.message : "Creation failed.",
        success: "",
      });
    }
  }
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
      <p className="eyebrow text-leaf">Protected administration</p>
      <h1 className="font-display mt-4 text-4xl font-bold">
        Course administration
      </h1>
      <div className="mt-10 grid gap-8 lg:grid-cols-[.75fr_1fr]">
        <form onSubmit={create} className="card p-6">
          <h2 className="font-display text-2xl font-bold">
            Create a draft course
          </h2>
          <label className="mt-5 block text-sm font-bold">
            Title
            <input name="title" className={fieldClass} required />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Slug
            <input
              name="slug"
              className={fieldClass}
              pattern="[a-z0-9-]+"
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Summary
            <textarea
              name="summary"
              className={fieldClass}
              minLength={20}
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            Level
            <select name="level" className={fieldClass}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>
          <label className="mt-4 block text-sm font-bold">
            Estimated minutes
            <input
              name="minutes"
              type="number"
              min="15"
              defaultValue="120"
              className={fieldClass}
              required
            />
          </label>
          <label className="mt-4 block text-sm font-bold">
            First learning outcome
            <input name="outcome" className={fieldClass} required />
          </label>
          <FormStatus error={state.error} success={state.success} />
          <button
            disabled={state.busy}
            className="mt-5 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white"
          >
            {state.busy ? "Creating..." : "Create draft"}
          </button>
        </form>
        <div>
          <h2 className="font-display text-2xl font-bold">Courses</h2>
          {query.loading && (
            <p className="mt-5" role="status">
              Loading courses...
            </p>
          )}
          {query.error && (
            <div className="card mt-5 p-5" role="alert">
              {query.error}
            </div>
          )}
          <div className="mt-5 space-y-3">
            {query.data?.map((course) => (
              <Link
                key={course.id}
                to="/admin/courses/$courseId"
                params={{ courseId: course.id }}
                className="card card-lift block p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="eyebrow text-leaf">{course.state}</p>
                    <h3 className="font-display mt-2 text-xl font-bold">
                      {course.title}
                    </h3>
                  </div>
                  <span className="text-sm font-bold">Edit</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
