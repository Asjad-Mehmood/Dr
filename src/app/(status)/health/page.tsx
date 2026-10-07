import { headers } from "next/headers";
import Link from "next/link";
import { runHealthChecks, type Check } from "@/lib/health";

export const dynamic = "force-dynamic";

function Dot({ check }: { check: Check }) {
  const color = check.ok
    ? "bg-emerald-500"
    : check.optional
      ? "bg-amber-400"
      : "bg-red-500";
  return (
    <span
      aria-hidden="true"
      className={`mt-1.5 size-2.5 shrink-0 rounded-full ${color}`}
    />
  );
}

export default async function HealthPage() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto =
    h.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const report = await runHealthChecks(`${proto}://${host}`);
  const all = report.groups.flatMap((g) => g.checks);
  const passed = all.filter((c) => c.ok).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
        System status
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
        {report.ok ? "Everything is working" : "Something needs attention"}
      </h1>
      <div
        className={`mt-6 rounded-2xl border px-5 py-4 ${
          report.ok
            ? "border-emerald-500/30 bg-emerald-500/10"
            : "border-red-500/30 bg-red-500/10"
        }`}
      >
        <p className="font-medium">
          {passed} of {all.length} checks passed
        </p>
        {report.problems.length > 0 && (
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {report.problems.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-10 space-y-10">
        {report.groups.map((group) => (
          <section key={group.title}>
            <h2 className="text-xs font-semibold tracking-widest text-muted uppercase">
              {group.title}
            </h2>
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
              {group.checks.map((check) => (
                <li key={check.name} className="flex gap-3 px-4 py-3.5">
                  <Dot check={check} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-medium">{check.name}</p>
                      <p
                        className={`text-sm ${check.ok ? "text-muted" : check.optional ? "text-amber-600" : "text-red-600"}`}
                      >
                        {check.ok
                          ? "Working"
                          : check.optional
                            ? "Optional"
                            : "Failing"}
                        {check.ms !== undefined && (
                          <span className="text-muted tabular-nums">
                            {" "}
                            · {check.ms} ms
                          </span>
                        )}
                      </p>
                    </div>
                    <p className="mt-0.5 text-sm break-words text-muted">
                      {check.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-6 text-sm text-muted">
        <span>
          Checked{" "}
          {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "medium",
            timeStyle: "medium",
            timeZone: "Asia/Karachi",
          }).format(new Date(report.checkedAt))}{" "}
          (Pakistan time)
        </span>
        {report.deployment && <span>{report.deployment}</span>}
        <a href="/health" className="text-primary hover:underline">
          Check again
        </a>
        <Link href="/" className="text-primary hover:underline">
          Website
        </Link>
        <Link href="/admin" className="text-primary hover:underline">
          Admin
        </Link>
        {/* A JSON route, not a page. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/health" className="text-primary hover:underline">
          JSON
        </a>
      </div>
    </main>
  );
}
