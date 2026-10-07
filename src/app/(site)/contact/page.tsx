import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";
import { getPageTexts, getSettings } from "@/lib/cms";

export const metadata: Metadata = { title: "Contact" };

export default async function ContactPage() {
  const [settings, texts] = await Promise.all([getSettings(), getPageTexts()]);
  const rows = [
    settings.email && {
      label: "Email",
      value: settings.email,
      href: `mailto:${settings.email}`,
    },
    settings.website && {
      label: "Website",
      value: settings.website.replace(/^https?:\/\//, ""),
      href: settings.website,
    },
    settings.linkedin && {
      label: "LinkedIn",
      value: "LinkedIn profile",
      href: settings.linkedin,
    },
    ...(settings.socialLinks ?? []).map((l) => ({
      label: l.label,
      value: l.url.replace(/^https?:\/\//, ""),
      href: l.url,
    })),
  ].filter((r): r is { label: string; value: string; href: string } =>
    Boolean(r),
  );

  return (
    <>
      <PageHeader text={texts.contact} />
      <Container>
        <div className="max-w-3xl">
          {rows.length > 0 ? (
            <dl className="border-t border-line">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-line py-5 sm:grid-cols-[10rem_1fr]"
                >
                  <dt className="text-sm text-muted">{row.label}</dt>
                  <dd>
                    <a
                      href={row.href}
                      className="font-medium break-all hover:text-primary"
                    >
                      {row.value}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="border-t border-line py-6 text-muted">
              Contact details will be added soon.
            </p>
          )}
          {texts.contact?.note && (
            <p className="mt-8 text-sm text-muted">{texts.contact.note}</p>
          )}
        </div>
      </Container>
    </>
  );
}
