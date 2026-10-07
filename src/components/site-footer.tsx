import Link from "next/link";
import { profile } from "@/content/profile";

export function SiteFooter() {
  const { email, linkedin, instagram } = profile.contact;
  const contacts = [
    email && { href: `mailto:${email}`, label: email },
    linkedin && { href: linkedin, label: "LinkedIn" },
    instagram && { href: instagram, label: "Instagram" },
  ].filter((item): item is { href: string; label: string } => Boolean(item));

  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-semibold">{profile.name}</p>
          <p className="mt-2 max-w-sm text-sm text-muted">
            {profile.concept} — {profile.values.join(", ")}.
          </p>
          <p className="mt-4 text-sm text-muted">
            {profile.college.name} ({profile.college.short}),{" "}
            {profile.college.city}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted uppercase">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/journey" className="hover:text-primary">
                The Journey
              </Link>
            </li>
            <li>
              <Link href="/camps" className="hover:text-primary">
                Annual Free Medical Camp
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="hover:text-primary">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-primary">
                About
              </Link>
            </li>
          </ul>
        </div>
        {contacts.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-widest text-muted uppercase">
              Contact
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {contacts.map((contact) => (
                <li key={contact.href}>
                  <a href={contact.href} className="hover:text-primary">
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </footer>
  );
}
