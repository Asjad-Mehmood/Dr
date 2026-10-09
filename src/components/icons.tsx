import {
  Award,
  BookOpen,
  CalendarDays,
  GraduationCap,
  HeartHandshake,
  HeartPulse,
  Microscope,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export const icons: Record<string, LucideIcon> = {
  graduation: GraduationCap,
  book: BookOpen,
  community: HeartHandshake,
  research: Microscope,
  stethoscope: Stethoscope,
  heart: HeartPulse,
  award: Award,
  calendar: CalendarDays,
};

const fallback = ["graduation", "book", "community", "research"];

export function iconFor(name: string | null | undefined, index = 0) {
  return icons[name ?? ""] ?? icons[fallback[index % fallback.length]];
}

export function IconBadge({
  icon: Icon,
  className = "",
  size = "md",
}: {
  icon: LucideIcon;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary ring-1 ring-primary/10 ${
        size === "lg" ? "size-16" : "size-12"
      } ${className}`}
    >
      <Icon
        className={size === "lg" ? "size-7" : "size-5"}
        strokeWidth={1.75}
      />
    </span>
  );
}
