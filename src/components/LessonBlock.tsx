import { useState } from "react";
import {
  Lightbulb,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  Code2,
  Download,
  BookOpen,
  Check,
  Volume2,
} from "lucide-react";

export type Block = {
  id: string;
  type: string;
  title: string | null;
  plainText: string | null;
  config: unknown;
};

function cfg<T>(block: Block): T {
  return ((block.config as Record<string, unknown>) ?? {}) as T;
}

function getVideoEmbed(url: string): { iframe: boolean; src: string } {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  if (yt) return { iframe: true, src: `https://www.youtube.com/embed/${yt[1]}` };
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo)
    return { iframe: true, src: `https://player.vimeo.com/video/${vimeo[1]}` };
  return { iframe: false, src: url };
}

export function LessonBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "heading": {
      const { level = 2 } = cfg<{ level?: number }>(block);
      const text = block.title || block.plainText || "";
      if (level === 3)
        return (
          <h3 className="font-display mt-2 text-xl font-bold">{text}</h3>
        );
      if (level === 4)
        return (
          <h4 className="font-display mt-2 text-lg font-bold">{text}</h4>
        );
      return (
        <h2 className="font-display mt-2 text-2xl font-bold">{text}</h2>
      );
    }

    case "paragraph":
      return (
        <p className="whitespace-pre-line leading-8 text-ink/80">
          {block.plainText}
        </p>
      );

    case "rich_text": {
      const { html } = cfg<{ html?: string }>(block);
      if (html)
        return (
          <div
            className="prose prose-ink max-w-none leading-8"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      return (
        <p className="whitespace-pre-line leading-8 text-ink/80">
          {block.plainText}
        </p>
      );
    }

    case "image": {
      const { url, alt, caption } =
        cfg<{ url?: string; alt?: string; caption?: string }>(block);
      if (!url) return null;
      return (
        <figure className="my-2">
          <img
            src={url}
            alt={alt || block.title || ""}
            className="w-full rounded-2xl object-cover"
          />
          {(caption || block.title) && (
            <figcaption className="mt-2 text-center text-sm text-ink/50">
              {caption || block.title}
            </figcaption>
          )}
        </figure>
      );
    }

    case "video": {
      const { url, caption } = cfg<{ url?: string; caption?: string }>(block);
      const src = url || "";
      if (!src) return null;
      const { iframe, src: embedSrc } = getVideoEmbed(src);
      return (
        <figure className="my-2">
          <div
            className="relative overflow-hidden rounded-2xl bg-black"
            style={{ paddingBottom: "56.25%" }}
          >
            {iframe ? (
              <iframe
                src={embedSrc}
                title={block.title || "Video"}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <video
                src={embedSrc}
                controls
                className="absolute inset-0 h-full w-full"
              />
            )}
          </div>
          {(caption || block.title) && (
            <figcaption className="mt-2 text-center text-sm text-ink/50">
              {caption || block.title}
            </figcaption>
          )}
        </figure>
      );
    }

    case "audio": {
      const { url, caption } = cfg<{ url?: string; caption?: string }>(block);
      if (!url) return null;
      return (
        <figure className="rounded-2xl border border-ink/10 bg-paper p-4">
          <div className="mb-3 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-ink/40" />
            <span className="text-sm font-bold">
              {block.title || caption || "Audio"}
            </span>
          </div>
          <audio src={url} controls className="w-full" />
          {caption && block.title && (
            <figcaption className="mt-2 text-xs text-ink/50">{caption}</figcaption>
          )}
        </figure>
      );
    }

    case "code": {
      const { language } = cfg<{ language?: string }>(block);
      return (
        <div className="overflow-hidden rounded-2xl border border-ink/10">
          {(block.title || language) && (
            <div className="flex items-center gap-2 border-b border-ink/10 bg-ink/5 px-4 py-2">
              <Code2 className="h-4 w-4 text-ink/40" />
              <span className="font-mono text-xs font-bold text-ink/50">
                {block.title || language}
              </span>
            </div>
          )}
          <pre className="overflow-x-auto bg-ink p-5 text-sm leading-6 text-white/85">
            <code>{block.plainText}</code>
          </pre>
        </div>
      );
    }

    case "table": {
      const { headers, rows } = cfg<{
        headers?: string[];
        rows?: string[][];
      }>(block);
      const tableRows = rows || [];
      return (
        <div className="overflow-x-auto rounded-2xl border border-ink/10">
          {block.title && (
            <div className="border-b border-ink/10 bg-ink/3 px-4 py-3 text-sm font-bold">
              {block.title}
            </div>
          )}
          <table className="w-full text-sm">
            {headers && headers.length > 0 && (
              <thead className="bg-ink/5">
                <tr>
                  {headers.map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left font-bold text-ink/65"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-ink/5">
              {tableRows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-4 py-3 text-ink/75">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "callout": {
      const { variant = "info" } = cfg<{
        variant?: "info" | "warning" | "tip" | "danger";
      }>(block);
      const styles = {
        info: {
          wrap: "bg-sky-50 border-sky-200",
          icon: <Info className="h-5 w-5 shrink-0 text-sky-500" />,
          title: "text-sky-900",
        },
        warning: {
          wrap: "bg-amber-50 border-amber-200",
          icon: <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />,
          title: "text-amber-900",
        },
        tip: {
          wrap: "bg-mint/20 border-leaf/25",
          icon: <Lightbulb className="h-5 w-5 shrink-0 text-leaf" />,
          title: "text-ink",
        },
        danger: {
          wrap: "bg-red-50 border-red-200",
          icon: <XCircle className="h-5 w-5 shrink-0 text-red-500" />,
          title: "text-red-900",
        },
      };
      const s = styles[variant] ?? styles.info;
      return (
        <div className={`flex gap-4 rounded-2xl border p-5 ${s.wrap}`}>
          {s.icon}
          <div>
            {block.title && (
              <p className={`font-bold ${s.title}`}>{block.title}</p>
            )}
            <p className="mt-1 text-sm leading-6 text-ink/70">
              {block.plainText}
            </p>
          </div>
        </div>
      );
    }

    case "checklist": {
      const { items } =
        cfg<{ items?: Array<string | { text: string }> }>(block);
      const normalized = (items || []).map((item) =>
        typeof item === "string" ? { text: item } : item,
      );
      return <ChecklistBlock title={block.title} items={normalized} />;
    }

    case "download": {
      const { url, filename, size } = cfg<{
        url?: string;
        filename?: string;
        size?: string;
      }>(block);
      if (!url) return null;
      return (
        <a
          href={url}
          download={filename || true}
          className="flex items-center gap-4 rounded-2xl border border-ink/15 bg-paper p-4 transition hover:bg-ink/3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink/8">
            <Download className="h-5 w-5 text-ink/60" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">
              {filename || block.title || "Download file"}
            </p>
            {size && <p className="text-xs text-ink/45">{size}</p>}
          </div>
          <span className="shrink-0 text-xs font-bold text-leaf">Download</span>
        </a>
      );
    }

    case "citation":
      return (
        <blockquote className="border-l-[3px] border-leaf pl-5">
          {block.plainText && (
            <p className="text-sm italic leading-7 text-ink/65">
              &ldquo;{block.plainText}&rdquo;
            </p>
          )}
          {block.title && (
            <cite className="mt-2 block text-xs font-bold not-italic text-ink/45">
              &mdash; {block.title}
            </cite>
          )}
        </blockquote>
      );

    case "knowledge_check": {
      const kc = cfg<{
        question?: string;
        options?: string[];
        correctIndex?: number;
        explanation?: string;
      }>(block);
      return (
        <KnowledgeCheck
          question={kc.question || block.title || ""}
          options={kc.options || []}
          correctIndex={kc.correctIndex ?? -1}
          explanation={kc.explanation || block.plainText || ""}
        />
      );
    }

    case "key_takeaway":
      return (
        <div className="flex gap-4 rounded-2xl border border-leaf/25 bg-mint/20 p-5">
          <BookOpen className="h-6 w-6 shrink-0 text-leaf" />
          <div>
            <p className="font-bold">{block.title || "Key Takeaway"}</p>
            <p className="mt-1 text-sm leading-6 text-ink/65">
              {block.plainText}
            </p>
          </div>
        </div>
      );

    default:
      if (!block.plainText && !block.title) return null;
      return (
        <div>
          {block.title && <p className="font-bold">{block.title}</p>}
          {block.plainText && (
            <p className="mt-1 whitespace-pre-line leading-7 text-ink/75">
              {block.plainText}
            </p>
          )}
        </div>
      );
  }
}

function ChecklistBlock({
  title,
  items,
}: {
  title: string | null;
  items: Array<{ text: string }>;
}) {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  return (
    <div className="rounded-2xl border border-ink/10 p-5">
      {title && <p className="mb-3 font-bold">{title}</p>}
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <button
              onClick={() => toggle(i)}
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition ${
                checked.has(i)
                  ? "border-leaf bg-leaf text-white"
                  : "border-ink/25 bg-white"
              }`}
              aria-label={checked.has(i) ? "Uncheck" : "Check"}
            >
              {checked.has(i) && <Check className="h-3 w-3" />}
            </button>
            <span
              className={`text-sm leading-6 ${
                checked.has(i) ? "text-ink/40 line-through" : "text-ink/75"
              }`}
            >
              {item.text}
            </span>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <p className="mt-3 text-xs text-ink/35">
          {checked.size} / {items.length} completed
        </p>
      )}
    </div>
  );
}

function KnowledgeCheck({
  question,
  options,
  correctIndex,
  explanation,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setReveal] = useState(false);
  const isCorrect = selected === correctIndex;
  return (
    <div className="rounded-2xl border border-ink/15 p-5">
      <p className="eyebrow mb-3 text-leaf">Knowledge check</p>
      <p className="font-bold">{question}</p>
      <ul className="mt-4 space-y-2">
        {options.map((opt, i) => {
          let cls =
            "border-ink/15 bg-white text-ink/75 hover:border-ink/40 hover:bg-ink/3";
          if (revealed) {
            if (i === correctIndex)
              cls = "border-leaf bg-mint/20 text-ink font-bold";
            else if (i === selected) cls = "border-red-300 bg-red-50 text-red-700";
            else cls = "border-ink/10 bg-white text-ink/40";
          } else if (i === selected) {
            cls = "border-ink bg-ink text-white";
          }
          return (
            <li key={i}>
              <button
                onClick={() => !revealed && setSelected(i)}
                disabled={revealed}
                className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${cls}`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>
      {selected !== null && !revealed && (
        <button
          onClick={() => setReveal(true)}
          className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-bold text-white"
        >
          Check answer
        </button>
      )}
      {revealed && (
        <div
          className={`mt-4 rounded-xl p-4 text-sm ${
            isCorrect ? "bg-mint/20 text-ink" : "bg-red-50 text-red-800"
          }`}
        >
          <p className="flex items-center gap-2 font-bold">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-leaf" /> Correct!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" /> Not quite
              </>
            )}
          </p>
          {explanation && (
            <p className="mt-1 text-ink/70">{explanation}</p>
          )}
        </div>
      )}
    </div>
  );
}
