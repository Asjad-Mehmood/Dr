// Minimal client for OpenAI-compatible chat completions APIs: Groq (free
// plan) or xAI's Grok. Groq keys start with "gsk_" and are recognised in
// GROQ_API_KEY or XAI_API_KEY; Groq wins if both providers have a key.

const REASONING_EFFORTS = ["none", "low", "medium", "high"] as const;

type Provider = {
  id: "groq" | "xai";
  name: string;
  keyName: string;
  console: string;
  apiKey?: string;
  model: string;
  reasoningEffort: (typeof REASONING_EFFORTS)[number];
  url: string;
  // Roughly how much record text fits one request. Groq's free plan allows
  // about 8,000 tokens a minute, prompt and answer together.
  maxInputChars: number;
};

const env = (name: string) => process.env[name]?.trim() || undefined;
const effort = (name: string) =>
  REASONING_EFFORTS.find((e) => e === env(name)) ?? "low";
const chatUrl = (base: string) => `${base.replace(/\/$/, "")}/chat/completions`;

export class AiError extends Error {
  constructor(
    message: string,
    readonly status = 500,
  ) {
    super(message);
    this.name = "AiError";
  }
}

// The *_BASE_URL settings can point at a regional endpoint or a local
// stand-in for testing.
export function aiConfig(): Provider {
  const groqKeyName = ["GROQ_API_KEY", "XAI_API_KEY"].find(
    (name) =>
      env(name) &&
      (name === "GROQ_API_KEY" || env(name)!.toLowerCase().startsWith("gsk_")),
  );
  if (groqKeyName) {
    return {
      id: "groq",
      name: "Groq",
      keyName: groqKeyName,
      console: "console.groq.com",
      apiKey: env(groqKeyName),
      // Free, and one of the models Groq runs with strict structured outputs.
      model: env("GROQ_MODEL") ?? "openai/gpt-oss-120b",
      reasoningEffort: effort("GROQ_REASONING_EFFORT"),
      url: chatUrl(env("GROQ_BASE_URL") ?? "https://api.groq.com/openai/v1"),
      maxInputChars: 14_000,
    };
  }
  return {
    id: "xai",
    name: "xAI",
    keyName: "XAI_API_KEY",
    console: "console.x.ai",
    apiKey: env("XAI_API_KEY"),
    // grok-4.3 with low reasoning: fast, supports structured outputs, and the
    // replacement xAI names for the retired grok-4-fast models (May 2026).
    model: env("XAI_MODEL") ?? "grok-4.3",
    reasoningEffort: effort("XAI_REASONING_EFFORT"),
    url: chatUrl(env("XAI_BASE_URL") ?? "https://api.x.ai/v1"),
    maxInputChars: 60_000,
  };
}

type Message = { role: "system" | "user"; content: string };

// Sends the messages and returns the parsed JSON reply, which the model is
// asked to shape with the given JSON schema.
export async function aiJson<T>({
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
  const provider = aiConfig();
  const { apiKey, model, reasoningEffort } = provider;
  if (!apiKey) {
    throw new AiError(
      "AI is not set up yet: add a GROQ_API_KEY (free, from console.groq.com) environment variable in Vercel (Settings → Environment Variables), then redeploy.",
      503,
    );
  }

  const send = (withReasoning: boolean) =>
    fetch(provider.url, {
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
        : `Could not reach the ${provider.name} service. Please try again in a moment.`,
      504,
    );
  }

  if (!response.ok) {
    // xAI errors are flat ({ code, error }); Groq's are OpenAI-style
    // ({ error: { message } }). The text is matched either way.
    const detail = await response.text().catch(() => "");
    console.error(
      `${provider.name} request failed (${response.status}):`,
      detail.slice(0, 500),
    );
    // 502: the problem is upstream, not with the signed-in editor.
    throw new AiError(friendlyError(provider, response.status, detail), 502);
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

function friendlyError(provider: Provider, status: number, detail: string) {
  const { name, keyName, model } = provider;
  // A wrong xAI key comes back as 400 "Incorrect API key provided"; Groq
  // answers 401 "Invalid API Key".
  if (status === 401 || status === 403 || /api key|credentials/i.test(detail)) {
    return `${name} rejected the API key. Check ${keyName} in Vercel, then redeploy.`;
  }
  if (status === 413 || status === 429) {
    return `${name} usage limit reached (the free plan allows a few requests a minute). Please wait a minute and try again, or check the limits at ${provider.console}.`;
  }
  if (
    status === 404 ||
    /model[^.]*(not found|does not exist|unknown|invalid|decommissioned)/i.test(
      detail,
    )
  ) {
    return `${name} could not use the model “${model}”. Set ${provider.id === "groq" ? "GROQ_MODEL" : "XAI_MODEL"} in Vercel to a model your account can use.`;
  }
  return `The ${name} service returned an error (${status}). Please try again later.`;
}
