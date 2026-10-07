import type { Metadata } from "next";
import Link from "next/link";
import { CMSImage } from "@/components/media";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { asCategory, asMedia, getPageTexts, list } from "@/lib/cms";
import { formatDate, groupBy } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.certificates?.title ?? "Certificates",
    description: texts.certificates?.intro ?? undefined,
  };
}

export default async function CertificatesPage() {
  const [texts, certificates] = await Promise.all([
    getPageTexts(),
    list("certificates", { sort: "-date" }),
  ]);

  return (
    <>
      <PageHeader text={texts.certificates} />
      <Container className="space-y-20">
        {certificates.length > 0 ? (
          groupBy(certificates, (c) => c.year ?? 0).map(([year, items]) => (
            <section key={year} className="reveal">
              <h2 className="font-display text-4xl font-semibold text-primary">
                {year || "Undated"}
              </h2>
              <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => {
                  const preview = asMedia(c.preview);
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/certificates/${c.slug}`}
                        className="group block"
                      >
                        <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl border border-line bg-surface">
                          {preview ? (
                            <CMSImage
                              media={preview}
                              size="card"
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="size-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.02]"
                            />
                          ) : (
                            <span
                              className="font-display text-5xl text-line"
                              aria-hidden="true"
                            >
                              ✦
                            </span>
                          )}
                        </div>
                        <p className="mt-4 font-medium group-hover:text-primary">
                          {c.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {[
                            c.issuer,
                            formatDate(c.date),
                            asCategory(c.category)?.title,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        ) : (
          <EmptyNote>
            Certificates will appear here as they are added.
          </EmptyNote>
        )}
      </Container>
    </>
  );
}
