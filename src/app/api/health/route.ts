import config from "@payload-config";
import { getPayload } from "payload";
import {
  BLOB_STORE_MISSING,
  explainDatabaseError,
  missingSettings,
  uploadsNeedBlobStore,
} from "@/lib/setup";

export const dynamic = "force-dynamic";

// Reports whether the site can start: settings present, database reachable.
export async function GET() {
  const missing = missingSettings();
  if (missing.length > 0) {
    return Response.json(
      { ok: false, problems: missing.map((name) => `${name} is not set.`) },
      { status: 503 },
    );
  }
  try {
    const payload = await getPayload({ config });
    await payload.count({ collection: "journey" });
    const uploads = process.env.BLOB_READ_WRITE_TOKEN
      ? "Vercel Blob"
      : "local disk";
    if (uploadsNeedBlobStore()) {
      return Response.json(
        { ok: false, database: "connected", problems: [BLOB_STORE_MISSING] },
        { status: 503 },
      );
    }
    return Response.json({ ok: true, database: "connected", uploads });
  } catch (error) {
    console.error("Health check failed:", error);
    return Response.json(
      { ok: false, problems: [explainDatabaseError(error)] },
      { status: 503 },
    );
  }
}
