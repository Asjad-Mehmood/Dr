import Image from "next/image";
import { fileUrl } from "@/lib/cms";
import type { Media } from "@/payload-types";

type Size = "thumbnail" | "card" | "large";

function sizeOf(media: Media, size: Size) {
  const s = media.sizes?.[size];
  if (s?.url && s.width && s.height) {
    return { src: fileUrl(s.url), width: s.width, height: s.height };
  }
  return {
    src: fileUrl(media.url),
    width: media.width ?? 1200,
    height: media.height ?? 800,
  };
}

export function isImage(media: Media) {
  return Boolean(media.mimeType?.startsWith("image/"));
}

export function CMSImage({
  media,
  size = "card",
  className = "",
  sizes,
  priority,
}: {
  media: Media;
  size?: Size;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const { src, width, height } = sizeOf(media, size);
  if (!src) return null;
  return (
    <Image
      src={src}
      alt={media.alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}

export function PhotoGrid({ photos }: { photos: Media[] }) {
  const images = photos.filter(isImage);
  if (images.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {images.map((photo) => (
        <li key={photo.id}>
          <a
            href={fileUrl(photo.url) || "#"}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-xl bg-surface"
          >
            <CMSImage
              media={photo}
              size="card"
              sizes="(min-width: 640px) 33vw, 50vw"
              className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </a>
          {photo.caption && (
            <p className="mt-2 text-xs text-muted">{photo.caption}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

function youTubeId(url: string) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match?.[1];
}

export function Video({
  url,
  file,
  title,
}: {
  url?: string | null;
  file?: Media | null;
  title: string;
}) {
  if (file?.url) {
    return (
      <video controls preload="metadata" className="w-full rounded-xl bg-black">
        <source src={fileUrl(file.url)} type={file.mimeType ?? undefined} />
      </video>
    );
  }
  if (!url) return null;
  const id = youTubeId(url);
  if (id) {
    return (
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full"
        />
      </div>
    );
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-primary underline"
    >
      Watch the video
    </a>
  );
}

export function FileLinks({
  files,
}: {
  files: { label: string; media: Media | null }[];
}) {
  const shown = files.filter((f) => f.media?.url);
  if (shown.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-3">
      {shown.map((f) => (
        <li key={f.label}>
          <a
            href={fileUrl(f.media!.url)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <path d="M14 3v6h6" />
            </svg>
            {f.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
