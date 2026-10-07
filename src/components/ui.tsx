import type { ReactNode } from "react";
import type { JourneyStatus } from "@/content/journey";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {children && <p className="mt-4 text-muted text-pretty">{children}</p>}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Container className="pt-14 pb-10 sm:pt-20">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </h1>
      {children && (
        <p className="mt-5 max-w-2xl text-lg text-muted text-pretty">
          {children}
        </p>
      )}
    </Container>
  );
}

const statusStyles: Record<
  JourneyStatus,
  { label: string; className: string }
> = {
  completed: { label: "Completed", className: "bg-primary-soft text-primary" },
  current: { label: "In progress", className: "bg-accent-soft text-accent" },
  upcoming: { label: "Upcoming", className: "bg-background text-muted" },
};

export function StatusBadge({ status }: { status: JourneyStatus }) {
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

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-4 py-5 text-sm text-muted">
      {children}
    </p>
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
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
