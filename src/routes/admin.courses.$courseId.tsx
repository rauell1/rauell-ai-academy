import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { apiRequest, type ApiCourse, type ApiModule, useApi } from "@/lib/api";
import { fieldClass } from "@/components/AuthCard";
type AdminLesson = ApiModule["lessons"][number] & {
  blocks: Array<{ id: string; type: string; title: string | null }>;
};
type AdminModule = Omit<ApiModule, "lessons"> & { lessons: AdminLesson[] };
type AdminCourse = Omit<ApiCourse, "modules"> & { modules: AdminModule[] };
export const Route = createFileRoute("/admin/courses/$courseId")({
  component: Editor,
});
function Editor() {
  const { courseId } = Route.useParams();
  const query = useApi<AdminCourse>(`/admin/courses/${courseId}`);
  const [message, setMessage] = useState("");
  async function post(path: string, body: unknown) {
    setMessage("");
    try {
      await apiRequest(path, { method: "POST", body: JSON.stringify(body) });
      setMessage("Saved successfully.");
      await query.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    }
  }
  if (query.loading)
    return (
      <div className="p-10" role="status">
        Loading editor...
      </div>
    );
  if (query.error || !query.data)
    return (
      <div className="p-10" role="alert">
        {query.error}
      </div>
    );
  const course = query.data;
  return (
    <section className="mx-auto max-w-6xl px-5 py-14">
      <Link to="/admin" className="text-sm font-bold">
        ← Administration
      </Link>
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-leaf">{course.state}</p>
          <h1 className="font-display mt-3 text-4xl font-bold">
            {course.title}
          </h1>
        </div>
        <select
          aria-label="Change editorial state"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value)
              void post(`/admin/courses/${course.id}/transition`, {
                state: e.target.value,
              });
          }}
          className="rounded-xl border border-ink/15 bg-white px-4 py-3 text-sm font-bold"
        >
          <option value="" disabled>
            Change state
          </option>
          {[
            "in_review",
            "changes_requested",
            "approved",
            "published",
            "archived",
            "draft",
            "retired",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      </div>
      {message && (
        <p role="status" className="mt-5 rounded-xl bg-mint/20 p-3 text-sm">
          {message}
        </p>
      )}
      <ModuleForm
        onSave={(body) => post(`/admin/courses/${course.id}/modules`, body)}
        order={course.modules.length}
      />
      <div className="mt-8 space-y-5">
        {course.modules.map((module) => (
          <div key={module.id} className="card p-6">
            <h2 className="font-display text-2xl font-bold">{module.title}</h2>
            <LessonForm
              onSave={(body) =>
                post(`/admin/modules/${module.id}/lessons`, body)
              }
              order={module.lessons.length}
            />
            <div className="mt-5 space-y-3">
              {module.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="rounded-xl border border-ink/10 p-4"
                >
                  <h3 className="font-bold">{lesson.title}</h3>
                  <p className="mt-1 text-xs text-ink/45">
                    {lesson.blocks.length} blocks
                  </p>
                  <BlockForm
                    onSave={(body) =>
                      post(`/admin/lessons/${lesson.id}/blocks`, body)
                    }
                    order={lesson.blocks.length}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
function ModuleForm({
  onSave,
  order,
}: {
  onSave: (x: unknown) => void;
  order: number;
}) {
  return (
    <form
      className="card mt-8 flex flex-wrap items-end gap-3 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        onSave({ title: d.get("title"), sortOrder: order });
        e.currentTarget.reset();
      }}
    >
      <label className="flex-1 text-sm font-bold">
        New module
        <input name="title" className={fieldClass} required />
      </label>
      <button className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white">
        Add module
      </button>
    </form>
  );
}
function LessonForm({
  onSave,
  order,
}: {
  onSave: (x: unknown) => void;
  order: number;
}) {
  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const title = String(d.get("title"));
        onSave({
          title,
          slug: title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
          estimatedMinutes: 10,
          sortOrder: order,
        });
        e.currentTarget.reset();
      }}
    >
      <label className="flex-1 text-xs font-bold">
        New lesson
        <input name="title" className={fieldClass} required />
      </label>
      <button className="rounded-full border border-ink/20 px-4 py-3 text-xs font-bold">
        Add lesson
      </button>
    </form>
  );
}
function BlockForm({
  onSave,
  order,
}: {
  onSave: (x: unknown) => void;
  order: number;
}) {
  return (
    <form
      className="mt-4 grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        onSave({
          type: d.get("type"),
          title: d.get("title"),
          plainText: d.get("text"),
          config: {},
          sortOrder: order,
        });
        e.currentTarget.reset();
      }}
    >
      <div className="flex gap-2">
        <select name="type" className="rounded-lg border px-3 text-xs">
          <option>paragraph</option>
          <option>heading</option>
          <option>callout</option>
          <option>citation</option>
          <option>key_takeaway</option>
        </select>
        <input
          name="title"
          placeholder="Block title"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      <textarea
        name="text"
        placeholder="Block content"
        className="rounded-lg border p-3 text-sm"
        required
      />
      <button className="justify-self-start rounded-full bg-mint px-4 py-2 text-xs font-bold">
        Add block
      </button>
    </form>
  );
}
