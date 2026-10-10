import type { Endpoint } from "payload";
import { analyzeHighlights } from "./highlights";
import { AiError } from "./client";

// POST /api/ai-highlights/analyze — signed-in editors only. Runs the AI
// analysis and stores the suggested highlights for review in the admin.
export const analyzeHighlightsEndpoint: Endpoint = {
  path: "/ai-highlights/analyze",
  method: "post",
  handler: async (req) => {
    if (!req.user) {
      return Response.json(
        { ok: false, error: "Please log in to the admin first." },
        { status: 401 },
      );
    }
    try {
      const result = await analyzeHighlights(req.payload);
      return Response.json({ ok: true, ...result });
    } catch (error) {
      const message =
        error instanceof AiError
          ? error.message
          : "Something went wrong while analysing the records. Please try again.";
      if (!(error instanceof AiError)) {
        req.payload.logger.error({ err: error }, "AI highlights failed");
      }
      await req.payload
        .updateGlobal({
          slug: "ai-highlights",
          overrideAccess: true,
          data: { lastError: message },
        })
        .catch(() => undefined);
      const status = error instanceof AiError ? error.status : 500;
      return Response.json(
        { ok: false, error: message },
        { status: status >= 400 && status < 600 ? status : 500 },
      );
    }
  },
};
