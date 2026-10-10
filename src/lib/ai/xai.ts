// Minimal client for xAI's (Grok) OpenAI-compatible chat completions API.

// XAI_BASE_URL can point at xAI's regional endpoint (https://us.api.x.ai/v1)
// or a local stand-in for testing.
const xaiUrl = () =>
  `${(process.env.XAI_BASE_URL?.trim() || "https://api.x.ai/v1").replace(/\/$/, "")}/chat/completions`;
// grok-4.3 with low reasoning: fast, supports structured outputs, and the
// replacement xAI names for the retired grok-4-fast models (May 2026).
export const DEFAULT_XAI_MODEL = "grok-4.3";
const REASONING_EFFORTS = ["none", "low", "medium", "high"] as const;

export class AiError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "AiError";
  }
}

export function xaiConfig() {
  const apiKey = process.env.XAI_API_KEY?.trim();
  const effort = process.env.XAI_REASONING_EFFORT?.trim();
  return {
    apiKey,
    model: process.env.XAI_MODEL?.trim() || DEFAULT_XAI_MODEL,
    reasoningEffort: REASONING_EFFORTS.find((e) => e === effort) ?? "low",
  };
}

type Message = { role: "system" | "user"; content: string };

// Sends the messages and returns the parsed JSON reply, which the model is
// asked to shape with the given JSON schema.
export async function xaiJson<T>({
  messages,
  schemaName,
  schema,
  timeoutMs = 50_000,
}: {
  messages: Message[];
  schemaName: string;
  schema: Record<string, unknown>;
  timeoutMs?: number;
}): Promise<{ data: T; model: string }> {
  const { apiKey, model, reasoningEffort } = xaiConfig();
  if (!apiKey) {
    throw new AiError(
      "AI is not set up yet: add an XAI_API_KEY environment variable in Vercel (Settings → Environment Variables), then redeploy.",
      503,
    );
  }

  const send = (withReasoning: boolean) =>
    fetch(xaiUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages,
        // No temperature/penalties: reasoning models reject or ignore them.
        ...(withReasoning ? { reasoning_effort: reasoningEffort } : {}),
        response_format: {
          type: "json_schema",
          json_schema: { name: schemaName, schema, strict: true },
        },
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });

  let response: Response;
  try {
    response = await send(true);
    // Some models don't take reasoning_effort; retry once without it.
    if (response.status === 400) {
      const detail = await response.clone().text();
      if (/reasoning/i.test(detail)) response = await send(false);
    }
  } catch (error) {
    const timedOut = error instanceof Error && error.name === "TimeoutError";
    throw new AiError(
      timedOut
        ? "The AI took too long to answer. Please try again in a moment."
        : "Could not reach the xAI service. Please try again in a moment.",
      504,
    );
  }

  if (!response.ok) {
    // xAI errors are flat: { "code": "...", "error": "..." }.
    const detail = await response.text().catch(() => "");
    console.error(
      `xAI request failed (${response.status}):`,
      detail.slice(0, 500),
    );
    // 502: the problem is upstream, not with the signed-in editor.
    throw new AiError(friendlyError(response.status, detail, model), 502);
  }

  const body = (await response.json()) as {
    model?: string;
    choices?: {
      message?: { content?: string | null; refusal?: string | null };
    }[];
  };
  const content = body.choices?.[0]?.message?.content;
  if (!content) {
    throw new AiError(
      "The AI returned an empty answer. Please try again.",
      502,
    );
  }
  try {
    return { data: JSON.parse(content) as T, model: body.model ?? model };
  } catch {
    throw new AiError(
      "The AI answer could not be read. Please try again.",
      502,
    );
  }
}

function friendlyError(status: number, detail: string, model: string) {
  // A wrong key comes back as 400 "Incorrect API key provided".
  if (status === 401 || status === 403 || /api key|credentials/i.test(detail)) {
    return "xAI rejected the API key. Check XAI_API_KEY in Vercel, then redeploy.";
  }
  if (status === 429) {
    return "xAI rate limit or credit limit reached. Please wait a little, or check credits in the xAI console.";
  }
  if (
    status === 404 ||
    /model[^.]*(not found|does not exist|unknown|invalid)/i.test(detail)
  ) {
    return `xAI could not use the model “${model}”. Set XAI_MODEL in Vercel to a model your account can use (for example grok-4.3).`;
  }
  return `The xAI service returned an error (${status}). Please try again later.`;
}
