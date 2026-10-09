import Link from "next/link";
import { displayName } from "@/lib/cms";
import type { SiteSetting } from "@/payload-types";
import { CrossMark, DotGrid } from "./vectors";

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const explore = [
    ...(settings.navigation ?? []),
    ...(settings.footerLinks ?? []),
  ];
  const contacts = [
    settings.email && {
      href: `mailto:${settings.email}`,
      label: settings.email,
    },
    settings.linkedin && { href: settings.linkedin, label: "LinkedIn" },
    ...(settings.socialLinks ?? []).map((link) => ({
      href: link.url,
      label: link.label,
    })),
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-line bg-surface">
      <DotGrid
        className="pointer-events-none absolute right-6 bottom-6 hidden w-28 opacity-70 md:block"
        rows={3}
        cols={7}
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_2fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5 font-display text-xl font-semibold">
            <CrossMark className="size-7" />
            {displayName(settings)}
          </p>
          {settings.role && (
            <p className="mt-1 text-sm text-muted">{settings.role}</p>
          )}
          {settings.tagline && (
            <p className="mt-4 max-w-xs text-sm text-muted">
              {settings.tagline}
            </p>
          )}
          <p className="mt-4 text-sm text-muted">
            {settings.institution}
            {settings.city ? `, ${settings.city}` : ""}
          </p>
        </div>
        <nav aria-label="Footer">
          <p className="text-xs font-semibold tracking-widest text-muted uppercase">
            Explore
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
            {explore.map((link) => (
              <li key={`${link.href}-${link.label}`}>
                <Link href={link.href} className="hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {contacts.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a
                    href={contact.href}
                    className="break-all hover:text-primary"
                  >
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {settings.footerNote && (
        <p className="mx-auto max-w-6xl px-4 pb-10 text-xs text-muted sm:px-6">
          {settings.footerNote}
        </p>
      )}
    </footer>
  );
}
