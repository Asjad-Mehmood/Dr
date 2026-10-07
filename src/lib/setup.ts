// Setup checks that explain, in plain words, why a fresh deployment can't
// start. They name settings and problems but never reveal their values.

export function missingSettings() {
  const missing: string[] = [];
  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    missing.push("DATABASE_URL");
  }
  if (!process.env.PAYLOAD_SECRET) missing.push("PAYLOAD_SECRET");
  return missing;
}

// Vercel's servers can't keep uploaded files, so uploads there need a Blob
// store; elsewhere they are saved to the local disk.
export function uploadsNeedBlobStore() {
  return Boolean(process.env.VERCEL) && !process.env.BLOB_READ_WRITE_TOKEN;
}

export const BLOB_STORE_MISSING =
  "Photo and file storage isn't connected yet. In Vercel, open the project → Storage → connect a Blob store, then redeploy from Deployments. After that, uploads will work.";

export function explainDatabaseError(error: unknown) {
  const text = String(
    error instanceof Error ? `${error.message} ${error.cause ?? ""}` : error,
  );
  if (/missing secret/i.test(text)) {
    return "PAYLOAD_SECRET is not set.";
  }
  if (/ECONNREFUSED|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|getaddrinfo/i.test(text)) {
    return "The database server could not be reached. Check that DATABASE_URL is the full connection string copied from your database provider.";
  }
  if (/password authentication failed/i.test(text)) {
    return "The database rejected the username or password in DATABASE_URL.";
  }
  if (/database .* does not exist/i.test(text)) {
    return "The database named in DATABASE_URL does not exist.";
  }
  if (/ssl|pg_hba\.conf/i.test(text)) {
    return "The database requires a secure connection. Add ?sslmode=require to the end of DATABASE_URL.";
  }
  return "The database could not be opened. The full error is in the Vercel project's Logs.";
}

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export function setupPage(problems: string[]) {
  const items = problems.map((p) => `<li>${escape(p)}</li>`).join("");
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Website setup needed</title><style>
body{margin:0;background:#faf7f1;color:#16243d;font:16px/1.6 system-ui,sans-serif}
main{max-width:40rem;margin:0 auto;padding:3rem 1.25rem}
h1{font-family:Georgia,serif;font-size:1.9rem;line-height:1.2;margin:0 0 1rem}
li{margin:.4rem 0}code{background:#e3eff0;padding:.1rem .35rem;border-radius:4px}
ol{padding-left:1.3rem}.box{border:1px solid #e5dfd4;border-radius:12px;background:#fff;padding:1rem 1.25rem;margin:1.5rem 0}
</style></head><body><main>
<h1>Website setup is not finished</h1>
<div class="box"><strong>What's wrong</strong><ul>${items}</ul></div>
<p><strong>How to fix it on Vercel</strong></p>
<ol>
<li>Open the project → <b>Storage</b> and connect a Postgres database (e.g. Neon). This adds <code>DATABASE_URL</code>.</li>
<li>Open <b>Settings → Environment Variables</b> and add <code>PAYLOAD_SECRET</code> with a long random value (at least 32 characters).</li>
<li>Optional: connect a <b>Blob</b> store in Storage so photos and PDFs can be uploaded.</li>
<li>Open <b>Deployments</b>, choose the latest one → <b>Redeploy</b>. New settings only apply after a redeploy.</li>
</ol>
<p>Then reload this page. You can check the setup at any time at <code>/api/health</code>.</p>
</main></body></html>`;
}
