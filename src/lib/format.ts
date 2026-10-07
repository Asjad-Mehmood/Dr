const TZ = "Asia/Karachi";

export function formatDate(
  value: string | null | undefined,
  style: "long" | "month" = "long",
) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: style === "long" ? "numeric" : undefined,
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(value));
}

export function formatRange(start?: string | null, end?: string | null) {
  if (!start) return "";
  if (!end || formatDate(end) === formatDate(start)) return formatDate(start);
  return `${formatDate(start)} – ${formatDate(end)}`;
}

export function isUpcoming(date: string | null | undefined) {
  if (!date) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return new Date(date) >= today;
}

export function ordinal(n: number) {
  const suffix = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]);
}

export function formatNumber(n: number) {
  return n.toLocaleString("en-US");
}

// Group records by a key while keeping their order.
export function groupBy<T, K extends string | number>(
  items: T[],
  key: (item: T) => K,
) {
  const groups = new Map<K, T[]>();
  for (const item of items) {
    const k = key(item);
    groups.set(k, [...(groups.get(k) ?? []), item]);
  }
  return [...groups.entries()];
}
