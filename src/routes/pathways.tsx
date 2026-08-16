import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageIntro } from "@/components/Cards";
import { pathways as fallbackPathways } from "@/data/academy";
import { useApi } from "@/lib/api";

export const Route = createFileRoute("/pathways")({ component: Pathways });

type ApiPathway = {
  id?: string;
  slug: string;
  title: string;
  description?: string;
  copy?: string;
  sortOrder?: number;
};

function Pathways() {
  const { data: apiPathways, loading } = useApi<ApiPathway[]>("/pathways");

  const list: ApiPathway[] =
    apiPathways && apiPathways.length > 0
      ? apiPathways
      : fallbackPathways.map((p, idx) => ({
          id: p.slug,
          slug: p.slug,
          title: p.title,
          description: p.copy,
          sortOrder: idx,
        }));

  return (
    <>
      <PageIntro
        eyebrow="Learning pathways"
        title="A clear route from curious to capable."
        copy="Follow a guided sequence of courses and practical work. Pick the pathway that matches the work you want to do."
      />
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        {loading && !list.length && (
          <p className="py-12 text-center text-ink/50" role="status">
            Loading pathways…
          </p>
        )}
        <div className="space-y-5">
          {list.map((pathway, i) => (
            <article
              key={pathway.id}
              className="card grid overflow-hidden lg:grid-cols-[.35fr_1fr]"
            >
              <div className="relative flex min-h-52 items-center justify-center bg-mint/40 p-8">
                <span className="font-display text-6xl font-black text-leaf/30">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <BookOpen className="absolute bottom-6 right-6 h-10 w-10 text-leaf/40" />
              </div>
              <div className="p-7 sm:p-10">
                <h2 className="font-display text-3xl font-bold">
                  {pathway.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-7 text-ink/62">
                  {pathway.description}
                </p>
                <Link
                  to="/pathways/$pathwaySlug"
                  params={{ pathwaySlug: pathway.slug }}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-ink/80"
                >
                  View pathway
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
