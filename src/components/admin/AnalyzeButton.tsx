"use client";

import { useConfig } from "@payloadcms/ui";
import { CircleAlert, CircleCheck, LoaderCircle, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Status =
  | { state: "idle" }
  | { state: "running" }
  | { state: "success"; message: string; notice?: string }
  | { state: "error"; message: string };

const FALLBACK_ERROR =
  "The analysis could not be completed. Please try again in a moment.";

// Runs the Grok analysis from the top of the AI highlights edit form, then
// reloads the page so the form shows the new picks. If Grok can't be used,
// the server picks with its built-in ranking and says why.
export function AnalyzeButton() {
  const { config } = useConfig();
  const api = config?.routes?.api || "/api";
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const reloadTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (reloadTimer.current) window.clearTimeout(reloadTimer.current);
    },
    [],
  );

  const running = status.state === "running";

  async function analyze() {
    if (running) return;
    setStatus({ state: "running" });
    try {
      const response = await fetch(`${api}/ai-highlights/analyze`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        picks?: number;
        model?: string;
        source?: "ai" | "local";
        notice?: string | null;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setStatus({
          state: "error",
          message: data?.error || FALLBACK_ERROR,
        });
        return;
      }

      const picks = data.picks ?? 0;
      const count = `${picks} ${picks === 1 ? "highlight" : "highlights"}`;
      setStatus({
        state: "success",
        message:
          data.source === "local"
            ? `Done — ${count} picked with the built-in ranking. Reloading…`
            : `Done — ${count} suggested${data.model ? ` by ${data.model}` : ""}. Reloading…`,
        notice: data.notice || undefined,
      });
      // Leave time to read why the built-in ranking was used.
      reloadTimer.current = window.setTimeout(
        () => window.location.reload(),
        data.notice ? 4000 : 1000,
      );
    } catch {
      setStatus({
        state: "error",
        message:
          "Could not reach the server. Check your connection and try again.",
      });
    }
  }

  return (
    <div className="dr-panel dr-ai-panel">
      <div className="dr-ai-head">
        <span className="dr-badge" aria-hidden="true">
          <Sparkles />
        </span>
        <div className="dr-ai-copy">
          <h2 className="dr-h2 dr-ai-title">Analyse with AI</h2>
          <span className="dr-muted">
            Grok reads every published, public record and suggests the strongest
            ones. If Grok is unavailable, a built-in ranking picks them instead.
            Review the picks below before showing them on the home page.
          </span>
        </div>
      </div>

      <div className="dr-ai-actions">
        <button
          type="button"
          className="dr-btn dr-btn--primary dr-ai-button"
          onClick={analyze}
          disabled={running || status.state === "success"}
          aria-busy={running}
        >
          {running ? (
            <LoaderCircle className="dr-ai-spin" aria-hidden="true" />
          ) : (
            <Sparkles aria-hidden="true" />
          )}
          Analyze records with AI
        </button>
        {running && (
          <span className="dr-muted" role="status">
            Analysing… this can take up to a minute
          </span>
        )}
      </div>

      {status.state === "success" && (
        <p className="dr-ai-message dr-ai-message--success" role="status">
          <CircleCheck aria-hidden="true" />
          {status.message}
        </p>
      )}
      {status.state === "success" && status.notice && (
        <p className="dr-ai-message dr-ai-message--warning" role="status">
          <CircleAlert aria-hidden="true" />
          {status.notice}
        </p>
      )}
      {status.state === "error" && (
        <p className="dr-ai-message dr-ai-message--error" role="alert">
          <CircleAlert aria-hidden="true" />
          {status.message}
        </p>
      )}
    </div>
  );
}
