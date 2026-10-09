import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import type { StageStatus } from "@/lib/cms";
import { HeaderBackdrop } from "./vectors";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string | null;
  title: string;
  children?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {title}
        </h2>
        {children && <p className="mt-4 text-muted text-pretty">{children}</p>}
      </div>
      {action && <ArrowLink href={action.href}>{action.label}</ArrowLink>}
    </div>
  );
}

export function Divider({ center = false }: { center?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-6 block h-0.5 w-14 rounded-full bg-primary/70 ${center ? "mx-auto" : ""}`}
    />
  );
}

export function PageHeader({
  text,
  children,
}: {
  text?: {
    eyebrow?: string | null;
    title?: string | null;
    intro?: string | null;
  } | null;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate mb-6 border-b border-line/70">
      <HeaderBackdrop />
      <Container className="pt-16 pb-14 sm:pt-24 sm:pb-20">
        {text?.eyebrow && <Eyebrow>{text.eyebrow}</Eyebrow>}
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          {text?.title}
        </h1>
        <Divider />
        {text?.intro && (
          <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
            {text.intro}
          </p>
        )}
        {children}
      </Container>
    </section>
  );
}

// The decorated band at the top of every inner page.
export function HeaderShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className="relative isolate mb-12 border-b border-line/70">
      <HeaderBackdrop />
      <Container className={`pt-14 pb-12 sm:pt-20 sm:pb-16 ${className}`}>
        {children}
      </Container>
    </section>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "soft";
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 ${
        variant === "primary"
          ? "bg-primary text-primary-ink shadow-[0_8px_20px_-6px] shadow-primary/50 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-6px] hover:shadow-primary/60"
          : "bg-primary-soft text-primary ring-1 ring-primary/15 hover:bg-primary hover:text-primary-ink"
      }`}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className="size-4 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 text-sm font-medium text-primary"
    >
      <span className="underline-offset-4 group-hover:underline">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="transition-transform group-hover:translate-x-0.5"
      >
        →
      </span>
    </Link>
  );
}

export function BackLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="text-sm text-muted hover:text-primary">
      ← {children}
    </Link>
  );
}

const statusStyles: Record<StageStatus, { label: string; className: string }> =
  {
    completed: {
      label: "Completed",
      className: "bg-primary-soft text-primary",
    },
    current: { label: "In progress", className: "bg-accent-soft text-accent" },
    upcoming: { label: "Upcoming", className: "text-muted" },
  };

export function StatusBadge({ status }: { status: StageStatus }) {
  const style = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-0.5 text-xs font-medium ${style.className}`}
    >
      {status === "current" && (
        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      )}
      {style.label}
    </span>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line px-3 py-1 text-sm">
      {children}
    </span>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="border-t border-line py-6 text-sm text-muted">{children}</p>
  );
}

export function Facts({
  items,
  className = "",
}: {
  items: { label: string; value?: ReactNode }[];
  className?: string;
}) {
  const shown = items.filter(
    (item) =>
      item.value !== undefined && item.value !== null && item.value !== "",
  );
  if (shown.length === 0) return null;
  return (
    <dl
      className={`grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-4 ${className}`}
    >
      {shown.map((item) => (
        <div key={item.label}>
          <dt className="text-xs tracking-wide text-muted uppercase">
            {item.label}
          </dt>
          <dd className="mt-1 font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`reveal ${className}`}>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function PulseLine({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 80"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
    >
      <path
        className="pulse-line"
        d="M0 50 H170 L190 50 L205 20 L225 72 L245 8 L262 50 H330 L345 38 L360 50 H600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
