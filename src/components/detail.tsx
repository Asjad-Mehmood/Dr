import type { ReactNode } from "react";
import { BackLink, Container, Eyebrow } from "./ui";

export function DetailHeader({
  back,
  eyebrow,
  title,
  meta,
  children,
}: {
  back: { href: string; label: string };
  eyebrow?: string | null;
  title: string;
  meta?: (string | null | undefined)[];
  children?: ReactNode;
}) {
  const metaLine = meta?.filter(Boolean).join(" · ");
  return (
    <Container className="pt-14 pb-12 sm:pt-20">
      <BackLink href={back.href}>{back.label}</BackLink>
      {eyebrow && (
        <div className="mt-8">
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
        {title}
      </h1>
      {metaLine && <p className="mt-5 text-muted">{metaLine}</p>}
      {children}
    </Container>
  );
}

export function DetailBody({ children }: { children: ReactNode }) {
  return (
    <Container>
      <div className="max-w-3xl space-y-14">{children}</div>
    </Container>
  );
}
