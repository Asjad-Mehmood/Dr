import { access, mkdir } from "node:fs/promises";
import path from "node:path";
import config from "@payload-config";
import { list as listBlobs } from "@vercel/blob";
import { getPayload, type CollectionSlug, type GlobalSlug } from "payload";
import {
  BLOB_STORE_MISSING,
  explainDatabaseError,
  missingSettings,
  uploadsNeedBlobStore,
} from "./setup";

export type Check = {
  name: string;
  ok: boolean;
  detail: string;
  ms?: number;
  optional?: boolean;
};
export type CheckGroup = { title: string; checks: Check[] };
export type HealthReport = {
  ok: boolean;
  checkedAt: string;
  deployment: string;
  groups: CheckGroup[];
  problems: string[];
};

const TIMEOUT_MS = 15_000;

async function timed(
  name: string,
  run: () => Promise<string>,
  explain: (error: unknown) => string = (e) =>
    e instanceof Error ? e.message : String(e),
): Promise<Check> {
  const start = performance.now();
  try {
    const detail = await Promise.race([
      run(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("Timed out after 15 seconds")),
          TIMEOUT_MS,
        ),
      ),
    ]);
    return {
      name,
      ok: true,
      detail,
      ms: Math.round(performance.now() - start),
    };
  } catch (error) {
    console.error(`Health check "${name}" failed:`, error);
    return {
      name,
      ok: false,
      detail: explain(error),
      ms: Math.round(performance.now() - start),
    };
  }
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function labelOf(label: unknown, fallback: string) {
  return typeof label === "string" ? label : fallback;
}

function configurationChecks(): Check[] {
  const missing = missingSettings();
  const set = (
    name: string,
    ok: boolean,
    detail: string,
    optional = false,
  ) => ({
    name,
    ok,
    detail,
    optional,
  });
  return [
    set(
      "Database connection string",
      !missing.includes("DATABASE_URL"),
      missing.includes("DATABASE_URL") ? "DATABASE_URL is not set." : "Set",
    ),
    set(
      "Secret key",
      !missing.includes("PAYLOAD_SECRET"),
      missing.includes("PAYLOAD_SECRET") ? "PAYLOAD_SECRET is not set." : "Set",
    ),
    set(
      "File storage token",
      !uploadsNeedBlobStore(),
      process.env.BLOB_READ_WRITE_TOKEN
        ? "Set"
        : uploadsNeedBlobStore()
          ? "BLOB_READ_WRITE_TOKEN is not set — uploads won't work on Vercel."
          : "Not set — uploads are saved to the local disk.",
    ),
    set(
      "Site address",
      true,
      process.env.NEXT_PUBLIC_SERVER_URL
        ? process.env.NEXT_PUBLIC_SERVER_URL
        : "Not set — links use the current address (fine until a domain is connected).",
      true,
    ),
  ];
}

async function storageCheck(): Promise<Check> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return timed(
      "Vercel Blob storage",
      async () => {
        const { blobs, hasMore } = await listBlobs({ limit: 100 });
        return `Connected · ${hasMore ? "100+" : plural(blobs.length, "file")} stored`;
      },
      () =>
        "The Blob token was rejected. Reconnect the Blob store in Vercel → Storage, then redeploy.",
    );
  }
  if (uploadsNeedBlobStore()) {
    return { name: "File storage", ok: false, detail: BLOB_STORE_MISSING };
  }
  return timed("Local disk storage", async () => {
    const dir = path.resolve(process.cwd(), "media");
    await mkdir(dir, { recursive: true });
    await access(dir);
    return "Writable";
  });
}

function endpointChecks(origin: string): Promise<Check>[] {
  const probe = (
    name: string,
    url: string,
    init: RequestInit = {},
    accept: (res: Response, body: string) => string | null = () => null,
  ) =>
    timed(name, async () => {
      const res = await fetch(origin + url, {
        ...init,
        cache: "no-store",
        redirect: "follow",
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      const body = await res.text();
      if (!res.ok) throw new Error(`Responded with status ${res.status}`);
      return accept(res, body) ?? `Responding (${res.status})`;
    });

  return [
    probe("REST API", "/api/journey?limit=1&depth=0", {}, (_res, body) => {
      const data = JSON.parse(body) as { totalDocs?: number };
      if (typeof data.totalDocs !== "number")
        throw new Error("Unexpected response");
      return "Responding with data";
    }),
    probe(
      "GraphQL API",
      "/api/graphql",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ query: "{ __typename }" }),
      },
      (_res, body) => {
        const data = JSON.parse(body) as { data?: unknown; errors?: unknown };
        if (!data.data) throw new Error("GraphQL returned errors");
        return "Responding with data";
      },
    ),
    probe("Admin panel", "/admin/login"),
    probe("Website home page", "/"),
  ];
}

export async function runHealthChecks(origin: string): Promise<HealthReport> {
  const configuration = configurationChecks();
  const settingsMissing = missingSettings().length > 0;
  const groups: CheckGroup[] = [
    { title: "Configuration", checks: configuration },
  ];

  if (settingsMissing) {
    groups.push({
      title: "Database",
      checks: [
        {
          name: "Connection",
          ok: false,
          detail: "Skipped — finish the configuration above first.",
        },
      ],
    });
  } else {
    let payload: Awaited<ReturnType<typeof getPayload>> | undefined;
    const connection = await timed(
      "Connection",
      async () => {
        payload = await getPayload({ config });
        await payload.count({ collection: "journey", overrideAccess: true });
        return "Connected";
      },
      explainDatabaseError,
    );
    groups.push({ title: "Database", checks: [connection] });

    if (payload) {
      const p = payload;
      const collections = p.config.collections.filter(
        (c) => !c.slug.startsWith("payload-") && c.slug !== "users",
      );
      const [collectionChecks, globalChecks] = await Promise.all([
        Promise.all(
          collections.map((c) =>
            timed(labelOf(c.labels?.plural, c.slug), async () => {
              const { totalDocs } = await p.count({
                collection: c.slug as CollectionSlug,
                overrideAccess: false,
              });
              return `${plural(totalDocs, "public record")}`;
            }),
          ),
        ),
        Promise.all(
          p.config.globals.map((g) =>
            timed(labelOf(g.label, g.slug), async () => {
              await p.findGlobal({
                slug: g.slug as GlobalSlug,
                overrideAccess: false,
                depth: 0,
              });
              return "Readable";
            }),
          ),
        ),
      ]);
      groups.push({ title: "Content collections", checks: collectionChecks });
      groups.push({ title: "Site settings & pages", checks: globalChecks });
    }
  }

  const [storage, ...endpoints] = await Promise.all([
    storageCheck(),
    ...(settingsMissing ? [] : endpointChecks(origin)),
  ]);
  groups.push({ title: "File storage", checks: [storage] });
  if (endpoints.length) groups.push({ title: "Endpoints", checks: endpoints });

  const failed = groups
    .flatMap((g) => g.checks)
    .filter((c) => !c.ok && !c.optional);
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  return {
    ok: failed.length === 0,
    checkedAt: new Date().toISOString(),
    deployment: [
      process.env.VERCEL_ENV ?? process.env.NODE_ENV,
      commit && `commit ${commit}`,
    ]
      .filter(Boolean)
      .join(" · "),
    groups,
    problems: failed.map((c) => `${c.name}: ${c.detail}`),
  };
}
