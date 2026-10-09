import { runHealthChecks } from "@/lib/health";

export const dynamic = "force-dynamic";

// Every check as JSON. The same report is shown as a page at /health.
export async function GET(request: Request) {
  const report = await runHealthChecks(new URL(request.url).origin);
  return Response.json(report, { status: report.ok ? 200 : 503 });
}
