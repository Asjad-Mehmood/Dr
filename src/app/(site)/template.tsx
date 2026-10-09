import type { ReactNode } from "react";
import { Motion } from "@/components/motion";

// Templates remount on every navigation, so each page plays its entrance.
export default function SiteTemplate({ children }: { children: ReactNode }) {
  return <Motion>{children}</Motion>;
}
