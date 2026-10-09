"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { CrossMark } from "./vectors";

export type NavItem = { label: string; href: string };

export function SiteHeader({ name, nav }: { name: string; nav: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="mr-auto flex items-center gap-3"
          onClick={() => setOpen(false)}
        >
          <CrossMark className="size-8 shrink-0" />
          <span className="font-display text-xl font-semibold tracking-tight">
            {name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center">
            {nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className="relative px-3 py-2 text-sm text-muted transition-colors after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform hover:text-primary aria-[current=page]:font-medium aria-[current=page]:text-primary aria-[current=page]:after:scale-x-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Main"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line lg:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {nav.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-muted aria-[current=page]:bg-primary-soft aria-[current=page]:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
