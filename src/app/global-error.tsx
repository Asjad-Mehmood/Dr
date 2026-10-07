"use client";

// Shown when a page fails on the server. In production the real error stays in
// the server logs, so point to the health check, which explains setup problems.
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#faf7f1",
          color: "#16243d",
          font: "16px/1.6 system-ui, sans-serif",
        }}
      >
        <title>Something went wrong</title>
        <main
          style={{
            maxWidth: "40rem",
            margin: "0 auto",
            padding: "3rem 1.25rem",
          }}
        >
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.9rem",
              lineHeight: 1.2,
            }}
          >
            This page couldn&apos;t load
          </h1>
          <p>
            Please try again in a moment. If the website was just deployed, open{" "}
            {/* An API route returning JSON, not a page, so a plain link is right. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/health" style={{ color: "#0d6d78" }}>
              /api/health
            </a>{" "}
            to see whether its setup is complete.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.4rem",
              borderRadius: "999px",
              border: 0,
              background: "#16243d",
              color: "#fff",
              font: "inherit",
            }}
          >
            Try again
          </button>
          {error.digest && (
            <p
              style={{
                marginTop: "2rem",
                fontSize: "0.8rem",
                color: "#5e6a7c",
              }}
            >
              Error reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
