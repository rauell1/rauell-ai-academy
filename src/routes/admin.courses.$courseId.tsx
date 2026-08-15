import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, Pencil, Trash2, X } from "lucide-react";
import { apiRequest, type ApiCourse, type ApiModule, useApi } from "@/lib/api";
import { fieldClass } from "@/components/AuthCard";

type AdminBlock = {
  id: string;
  type: string;
  title: string | null;
  plainText: string | null;
  config: unknown;
  sortOrder: number;
  state: string;
};
type AdminLesson = ApiModule["lessons"][number] & {
  blocks: AdminBlock[];
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
      setMessage("Saved.");
      await query.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    }
  }
  async function patch(path: string, body: unknown) {
    setMessage("");
    try {
      await apiRequest(path, { method: "PATCH", body: JSON.stringify(body) });
      setMessage("Saved.");
      await query.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed.");
    }
  }
  async function del(path: string) {
    setMessage("");
    try {
      await apiRequest(path, { method: "DELETE" });
      setMessage("Deleted.");
      await query.reload();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete failed.");
    }
  }

  if (query.loading)
    return <div className="p-10" role="status">Loading editor…</div>;
  if (query.error || !query.data)
    return <div className="p-10" role="alert">{query.error}</div>;

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
          <option value="" disabled>Change state</option>
          {["in_review","changes_requested","approved","published","archived","draft","retired"].map(
            (x) => <option key={x}>{x}</option>,
          )}
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
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-display text-2xl font-bold">{module.title}</h2>
            </div>

            <div className="mt-5 space-y-3">
              {module.lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  moduleId={module.id}
                  onAddBlock={(body) =>
                    post(`/admin/lessons/${lesson.id}/blocks`, body)
                  }
                  onEditBlock={(blockId, body) =>
                    patch(`/admin/blocks/${blockId}`, body)
                  }
                  onDeleteBlock={(blockId) => del(`/admin/blocks/${blockId}`)}
                />
              ))}
            </div>

            <LessonForm
              onSave={(body) => post(`/admin/modules/${module.id}/lessons`, body)}
              order={module.lessons.length}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function LessonCard({
  lesson,
  onAddBlock,
  onEditBlock,
  onDeleteBlock,
}: {
  lesson: AdminLesson;
  moduleId: string;
  onAddBlock: (body: unknown) => void;
  onEditBlock: (blockId: string, body: unknown) => void;
  onDeleteBlock: (blockId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="rounded-xl border border-ink/10 p-4">
      <button
        onClick={() => setExpanded((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div>
          <h3 className="font-bold">{lesson.title}</h3>
          <p className="mt-0.5 text-xs text-ink/45">
            {lesson.blocks.length} block{lesson.blocks.length !== 1 ? "s" : ""}
            {" · "}
            {lesson.estimatedMinutes} min
          </p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-ink/40" />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-ink/40" />
        )}
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {lesson.blocks.map((block) =>
            editingId === block.id ? (
              <EditBlockForm
                key={block.id}
                block={block}
                onSave={(body) => {
                  onEditBlock(block.id, body);
                  setEditingId(null);
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <BlockRow
                key={block.id}
                block={block}
                onEdit={() => setEditingId(block.id)}
                onDelete={() => onDeleteBlock(block.id)}
              />
            ),
          )}

          <div className="mt-3 border-t border-ink/8 pt-3">
            <BlockForm
              onSave={(body) => onAddBlock(body)}
              order={lesson.blocks.length}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BlockRow({
  block,
  onEdit,
  onDelete,
}: {
  block: AdminBlock;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-ink/8 bg-ink/2 px-3 py-2">
      <span className="mt-0.5 rounded bg-ink/8 px-1.5 py-0.5 font-mono text-[10px] text-ink/50">
        {block.type}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">
          {block.title || block.plainText?.slice(0, 60) || "(no content)"}
        </p>
        {block.title && block.plainText && (
          <p className="truncate text-xs text-ink/45">
            {block.plainText.slice(0, 80)}
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          onClick={onEdit}
          className="rounded p-1 text-ink/40 transition hover:bg-ink/10 hover:text-ink"
          aria-label="Edit block"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this block?")) onDelete();
          }}
          className="rounded p-1 text-ink/40 transition hover:bg-red-50 hover:text-red-500"
          aria-label="Delete block"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

const BLOCK_TYPES = [
  "paragraph",
  "heading",
  "callout",
  "key_takeaway",
  "citation",
  "rich_text",
  "image",
  "video",
  "audio",
  "code",
  "table",
  "checklist",
  "download",
  "knowledge_check",
] as const;

type BlockType = (typeof BLOCK_TYPES)[number];

function blockHasConfig(type: BlockType) {
  return [
    "heading",
    "callout",
    "image",
    "video",
    "audio",
    "code",
    "table",
    "checklist",
    "download",
    "knowledge_check",
  ].includes(type);
}

function BlockConfigFields({ type }: { type: BlockType }) {
  switch (type) {
    case "heading":
      return (
        <label className="text-xs font-bold">
          Heading level
          <select name="config.level" className={fieldClass}>
            <option value="2">H2 (large)</option>
            <option value="3">H3 (medium)</option>
            <option value="4">H4 (small)</option>
          </select>
        </label>
      );
    case "callout":
      return (
        <label className="text-xs font-bold">
          Variant
          <select name="config.variant" className={fieldClass}>
            <option value="tip">Tip</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </label>
      );
    case "image":
      return (
        <>
          <label className="text-xs font-bold">
            Image URL
            <input name="config.url" placeholder="https://…" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Alt text
            <input name="config.alt" placeholder="Describe the image" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Caption
            <input name="config.caption" placeholder="Optional caption" className={fieldClass} />
          </label>
        </>
      );
    case "video":
      return (
        <>
          <label className="text-xs font-bold">
            Video URL (YouTube, Vimeo, or direct)
            <input name="config.url" placeholder="https://youtube.com/watch?v=…" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Caption
            <input name="config.caption" placeholder="Optional caption" className={fieldClass} />
          </label>
        </>
      );
    case "audio":
      return (
        <>
          <label className="text-xs font-bold">
            Audio URL
            <input name="config.url" placeholder="https://…/audio.mp3" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Caption
            <input name="config.caption" placeholder="Optional caption" className={fieldClass} />
          </label>
        </>
      );
    case "code":
      return (
        <label className="text-xs font-bold">
          Language
          <input name="config.language" placeholder="javascript, python, bash…" className={fieldClass} />
        </label>
      );
    case "download":
      return (
        <>
          <label className="text-xs font-bold">
            File URL
            <input name="config.url" placeholder="https://…" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Filename
            <input name="config.filename" placeholder="document.pdf" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            File size (optional)
            <input name="config.size" placeholder="2.4 MB" className={fieldClass} />
          </label>
        </>
      );
    case "checklist":
      return (
        <label className="text-xs font-bold">
          Items (one per line)
          <textarea
            name="config.items"
            rows={4}
            placeholder={"Step one\nStep two\nStep three"}
            className={fieldClass}
          />
        </label>
      );
    case "knowledge_check":
      return (
        <>
          <label className="text-xs font-bold">
            Question
            <input name="config.question" placeholder="What is…?" className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Options (one per line)
            <textarea
              name="config.options"
              rows={4}
              placeholder={"Option A\nOption B\nOption C\nOption D"}
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-bold">
            Correct option number (1-based)
            <input
              name="config.correctIndex"
              type="number"
              min="1"
              placeholder="1"
              className={fieldClass}
            />
          </label>
          <label className="text-xs font-bold">
            Explanation (shown after answer)
            <textarea name="config.explanation" rows={2} className={fieldClass} />
          </label>
        </>
      );
    default:
      return null;
  }
}

function parseBlockConfig(type: BlockType, form: FormData): Record<string, unknown> {
  const config: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (!key.startsWith("config.")) continue;
    const field = key.slice("config.".length);
    const val = String(value).trim();
    if (!val) continue;
    if (field === "level") config.level = Number(val);
    else if (field === "correctIndex") config.correctIndex = Number(val) - 1;
    else if (field === "items")
      config.items = val.split("\n").filter(Boolean).map((t) => ({ text: t.trim() }));
    else if (field === "options")
      config.options = val.split("\n").filter(Boolean).map((t) => t.trim());
    else config[field] = val;
  }
  return config;
}

function BlockForm({
  onSave,
  order,
}: {
  onSave: (x: unknown) => void;
  order: number;
}) {
  const [type, setType] = useState<BlockType>("paragraph");
  const needsConfig = blockHasConfig(type);

  return (
    <form
      className="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const config = parseBlockConfig(type, d);
        onSave({
          type,
          title: String(d.get("title") || "").trim() || undefined,
          plainText: String(d.get("text") || "").trim() || undefined,
          config,
          sortOrder: order,
        });
        e.currentTarget.reset();
        setType("paragraph");
      }}
    >
      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as BlockType)}
          className="rounded-lg border px-3 py-2 text-xs"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          name="title"
          placeholder="Block title (optional)"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      {needsConfig && (
        <div className="grid gap-2 rounded-lg border border-ink/8 bg-ink/3 p-3">
          <BlockConfigFields type={type} />
        </div>
      )}
      {!["image", "video", "audio"].includes(type) && (
        <textarea
          name="text"
          placeholder={
            type === "knowledge_check"
              ? "Explanation text (optional)"
              : "Block content"
          }
          rows={3}
          className="rounded-lg border p-3 text-sm"
        />
      )}
      <button className="justify-self-start rounded-full bg-mint px-4 py-2 text-xs font-bold">
        Add block
      </button>
    </form>
  );
}

function EditBlockForm({
  block,
  onSave,
  onCancel,
}: {
  block: AdminBlock;
  onSave: (body: unknown) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<BlockType>(block.type as BlockType);
  const needsConfig = blockHasConfig(type);
  const existingConfig = (block.config as Record<string, unknown>) ?? {};

  return (
    <form
      className="grid gap-2 rounded-xl border border-leaf/30 bg-mint/10 p-3"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        const config = parseBlockConfig(type, d);
        onSave({
          type,
          title: String(d.get("title") || "").trim() || undefined,
          plainText: String(d.get("text") || "").trim() || undefined,
          config,
        });
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-leaf">Editing block</span>
        <button type="button" onClick={onCancel} className="text-ink/40 hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as BlockType)}
          className="rounded-lg border px-3 py-2 text-xs"
        >
          {BLOCK_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <input
          name="title"
          defaultValue={block.title ?? ""}
          placeholder="Block title"
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
      </div>
      {needsConfig && (
        <div className="grid gap-2 rounded-lg border border-ink/8 bg-white p-3">
          <EditConfigFields type={type} config={existingConfig} />
        </div>
      )}
      {!["image", "video", "audio"].includes(type) && (
        <textarea
          name="text"
          defaultValue={block.plainText ?? ""}
          rows={3}
          className="rounded-lg border p-3 text-sm"
        />
      )}
      <div className="flex gap-2">
        <button className="rounded-full bg-leaf px-4 py-2 text-xs font-bold text-white">
          Save changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border px-4 py-2 text-xs font-bold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function EditConfigFields({
  type,
  config,
}: {
  type: BlockType;
  config: Record<string, unknown>;
}) {
  switch (type) {
    case "heading":
      return (
        <label className="text-xs font-bold">
          Heading level
          <select
            name="config.level"
            defaultValue={String(config.level ?? "2")}
            className={fieldClass}
          >
            <option value="2">H2</option>
            <option value="3">H3</option>
            <option value="4">H4</option>
          </select>
        </label>
      );
    case "callout":
      return (
        <label className="text-xs font-bold">
          Variant
          <select
            name="config.variant"
            defaultValue={String(config.variant ?? "tip")}
            className={fieldClass}
          >
            <option value="tip">Tip</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="danger">Danger</option>
          </select>
        </label>
      );
    case "image":
      return (
        <>
          <label className="text-xs font-bold">
            Image URL
            <input name="config.url" defaultValue={String(config.url ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Alt text
            <input name="config.alt" defaultValue={String(config.alt ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Caption
            <input name="config.caption" defaultValue={String(config.caption ?? "")} className={fieldClass} />
          </label>
        </>
      );
    case "video":
      return (
        <>
          <label className="text-xs font-bold">
            Video URL
            <input name="config.url" defaultValue={String(config.url ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Caption
            <input name="config.caption" defaultValue={String(config.caption ?? "")} className={fieldClass} />
          </label>
        </>
      );
    case "audio":
      return (
        <>
          <label className="text-xs font-bold">
            Audio URL
            <input name="config.url" defaultValue={String(config.url ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Caption
            <input name="config.caption" defaultValue={String(config.caption ?? "")} className={fieldClass} />
          </label>
        </>
      );
    case "code":
      return (
        <label className="text-xs font-bold">
          Language
          <input name="config.language" defaultValue={String(config.language ?? "")} className={fieldClass} />
        </label>
      );
    case "download":
      return (
        <>
          <label className="text-xs font-bold">
            File URL
            <input name="config.url" defaultValue={String(config.url ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Filename
            <input name="config.filename" defaultValue={String(config.filename ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            File size
            <input name="config.size" defaultValue={String(config.size ?? "")} className={fieldClass} />
          </label>
        </>
      );
    case "checklist": {
      const items = (config.items as Array<{ text: string }> | undefined) ?? [];
      return (
        <label className="text-xs font-bold">
          Items (one per line)
          <textarea
            name="config.items"
            rows={4}
            defaultValue={items.map((i) => i.text).join("\n")}
            className={fieldClass}
          />
        </label>
      );
    }
    case "knowledge_check": {
      const opts = (config.options as string[] | undefined) ?? [];
      const ci = typeof config.correctIndex === "number" ? config.correctIndex + 1 : 1;
      return (
        <>
          <label className="text-xs font-bold">
            Question
            <input name="config.question" defaultValue={String(config.question ?? "")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Options (one per line)
            <textarea name="config.options" rows={4} defaultValue={opts.join("\n")} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Correct option number
            <input name="config.correctIndex" type="number" min="1" defaultValue={ci} className={fieldClass} />
          </label>
          <label className="text-xs font-bold">
            Explanation
            <textarea name="config.explanation" rows={2} defaultValue={String(config.explanation ?? "")} className={fieldClass} />
          </label>
        </>
      );
    }
    default:
      return null;
  }
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
