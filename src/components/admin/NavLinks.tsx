import { Activity, ExternalLink, LayoutDashboard } from "lucide-react";
import Link from "next/link";

// Extra links at the bottom of the admin navigation.
export function NavLinks() {
  return (
    <div className="dr-navlinks">
      <Link href="/admin" className="dr-navlinks__link">
        <LayoutDashboard aria-hidden="true" />
        Dashboard
      </Link>
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="dr-navlinks__link"
      >
        <ExternalLink aria-hidden="true" />
        View website
      </a>
      <a
        href="/health"
        target="_blank"
        rel="noreferrer"
        className="dr-navlinks__link"
      >
        <Activity aria-hidden="true" />
        System status
      </a>
    </div>
  );
}
