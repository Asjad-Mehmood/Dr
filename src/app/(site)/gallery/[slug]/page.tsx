import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailHeader } from "@/components/detail";
import { PhotoGrid } from "@/components/media";
import { Container } from "@/components/ui";
import { asCategory, findBySlug, mediaList } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/gallery/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const album = await findBySlug("gallery", slug, 0);
  return album
    ? { title: album.title, description: album.description ?? undefined }
    : {};
}

export default async function AlbumPage({
  params,
}: PageProps<"/gallery/[slug]">) {
  const { slug } = await params;
  const album = await findBySlug("gallery", slug);
  if (!album) notFound();

  return (
    <>
      <DetailHeader
        back={{ href: "/gallery", label: "Gallery" }}
        eyebrow={asCategory(album.category)?.title}
        title={album.title}
        meta={[formatDate(album.date)]}
      >
        {album.description && (
          <p className="mt-5 max-w-2xl text-lg text-muted text-pretty">
            {album.description}
          </p>
        )}
      </DetailHeader>
      <Container>
        <PhotoGrid photos={mediaList(album.photos)} />
      </Container>
    </>
  );
}
