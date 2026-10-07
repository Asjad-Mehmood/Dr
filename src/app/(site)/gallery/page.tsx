import type { Metadata } from "next";
import Link from "next/link";
import { CMSImage } from "@/components/media";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { asCategory, getPageTexts, list, mediaList } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata(): Promise<Metadata> {
  const texts = await getPageTexts();
  return {
    title: texts.gallery?.title ?? "Gallery",
    description: texts.gallery?.intro ?? undefined,
  };
}

export default async function GalleryPage() {
  const [texts, albums, categories] = await Promise.all([
    getPageTexts(),
    list("gallery", { sort: "-date" }),
    list("categories", {
      where: { section: { equals: "gallery" } },
      sort: "order",
      depth: 0,
    }),
  ]);
  const groups = [
    ...categories.map((c) => ({
      title: c.title,
      albums: albums.filter((a) => asCategory(a.category)?.id === c.id),
    })),
    {
      title: "Other albums",
      albums: albums.filter((a) => !asCategory(a.category)),
    },
  ].filter((g) => g.albums.length > 0);

  return (
    <>
      <PageHeader text={texts.gallery} />
      <Container className="space-y-20">
        {groups.length > 0 ? (
          groups.map((group) => (
            <section key={group.title} className="reveal">
              <h2 className="font-display text-2xl font-semibold">
                {group.title}
              </h2>
              <ul className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {group.albums.map((album) => {
                  const photos = mediaList(album.photos);
                  return (
                    <li key={album.id}>
                      <Link
                        href={`/gallery/${album.slug}`}
                        className="group block"
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                          {photos[0] && (
                            <CMSImage
                              media={photos[0]}
                              size="card"
                              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          )}
                        </div>
                        <p className="mt-4 font-medium group-hover:text-primary">
                          {album.title}
                        </p>
                        <p className="mt-1 text-sm text-muted">
                          {[
                            formatDate(album.date),
                            `${photos.length} photo${photos.length === 1 ? "" : "s"}`,
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
          <EmptyNote>Albums will appear here as they are added.</EmptyNote>
        )}
      </Container>
    </>
  );
}
