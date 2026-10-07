import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DetailBody, DetailHeader } from "@/components/detail";
import { CMSImage } from "@/components/media";
import { RichText } from "@/components/rich-text";
import { asMedia, findBySlug, getPageTexts } from "@/lib/cms";
import { formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBySlug("journal", slug, 0);
  return post
    ? { title: post.title, description: post.excerpt ?? undefined }
    : {};
}

export default async function JournalPostPage({
  params,
}: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const [post, texts] = await Promise.all([
    findBySlug("journal", slug),
    getPageTexts(),
  ]);
  if (!post) notFound();
  const cover = asMedia(post.cover);

  return (
    <>
      <DetailHeader
        back={{ href: "/journal", label: "Journal" }}
        title={post.title}
        meta={[formatDate(post.date)]}
      />
      <DetailBody>
        {cover && (
          <CMSImage
            media={cover}
            size="large"
            sizes="(min-width: 768px) 768px, 100vw"
            className="w-full rounded-3xl object-cover"
          />
        )}
        <RichText data={post.content} className="text-lg" />
        {texts.journal?.disclaimer && (
          <p className="border-t border-line pt-6 text-sm text-muted">
            {texts.journal.disclaimer}
          </p>
        )}
      </DetailBody>
    </>
  );
}
