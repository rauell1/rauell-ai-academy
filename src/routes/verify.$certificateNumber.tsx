import { createFileRoute } from "@tanstack/react-router";
import { Award, CheckCircle2, XCircle } from "lucide-react";
import { useApi } from "@/lib/api";
type Verification = {
  status: "valid" | "revoked" | "expired";
  certificateNumber: string;
  learnerName: string;
  courseName: string;
  skills: string[];
  issuer: string;
  issuedAt: string;
  qrSvg: string;
};
export const Route = createFileRoute("/verify/$certificateNumber")({
  component: Verify,
});
function Verify() {
  const { certificateNumber } = Route.useParams();
  const query = useApi<Verification>(
    `/verify/${encodeURIComponent(certificateNumber)}`,
  );
  if (query.loading)
    return (
      <div className="mx-auto max-w-2xl px-5 py-20" role="status">
        Verifying certificate...
      </div>
    );
  if (query.error || !query.data)
    return (
      <section className="mx-auto max-w-2xl px-5 py-20 text-center">
        <XCircle className="mx-auto h-14 w-14 text-red-600" />
        <h1 className="font-display mt-5 text-4xl font-bold">
          Certificate not found
        </h1>
        <p className="mt-3 text-ink/60">
          No certificate matches this verification number.
        </p>
      </section>
    );
  const v = query.data;
  return (
    <section className="mx-auto max-w-2xl px-5 py-20">
      <div className="card overflow-hidden">
        <div
          className={`p-7 text-white ${v.status === "valid" ? "bg-ink" : "bg-red-800"}`}
        >
          <div className="flex items-center gap-3">
            {v.status === "valid" ? (
              <CheckCircle2 className="text-mint" />
            ) : (
              <XCircle />
            )}
            <p className="eyebrow">Certificate {v.status}</p>
          </div>
          <h1 className="font-display mt-5 text-4xl font-bold">
            {v.courseName}
          </h1>
        </div>
        <div className="p-7">
          <dl className="grid gap-5 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-bold uppercase text-ink/40">
                Learner
              </dt>
              <dd className="mt-1 font-bold">{v.learnerName}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-ink/40">
                Issued
              </dt>
              <dd className="mt-1 font-bold">
                {new Date(v.issuedAt).toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-ink/40">
                Certificate number
              </dt>
              <dd className="mt-1 font-mono text-sm">{v.certificateNumber}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold uppercase text-ink/40">
                Issuer
              </dt>
              <dd className="mt-1 font-bold">{v.issuer}</dd>
            </div>
          </dl>
          <div className="mt-7 flex flex-wrap items-end justify-between gap-6 border-t border-ink/10 pt-6">
            <div>
              <p className="text-xs font-bold uppercase text-ink/40">
                Skills achieved
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {v.skills.map((x) => (
                  <span
                    key={x}
                    className="rounded-full bg-mint/30 px-3 py-1 text-xs font-bold"
                  >
                    {x}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="h-28 w-28"
              aria-label="Certificate verification QR code"
              dangerouslySetInnerHTML={{ __html: v.qrSvg }}
            />
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink/50">
        <Award className="h-4 w-4" />
        Rauell AI Academy public verification
      </div>
    </section>
  );
}
