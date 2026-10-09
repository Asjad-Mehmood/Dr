import type { Metadata } from "next";
import { CMSImage } from "@/components/media";
import {
  Container,
  Divider,
  Eyebrow,
  HeaderShell,
  Section,
  Tag,
} from "@/components/ui";
import { asMedia, displayName, getAbout, getSettings } from "@/lib/cms";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const [settings, about] = await Promise.all([getSettings(), getAbout()]);
  const portrait = asMedia(about.portrait);

  return (
    <>
      <HeaderShell className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-6xl">
            {displayName(settings)}
          </h1>
          <Divider />
          <p className="mt-5 text-lg">
            <span className="font-medium text-primary">{settings.role}</span>
            <span className="text-muted">
              {" "}
              · {settings.institution}
              {settings.city ? `, ${settings.city}` : ""}
            </span>
          </p>
          {about.introduction && (
            <p className="mt-8 max-w-2xl text-lg text-pretty">
              {about.introduction}
            </p>
          )}
          {about.positioning && (
            <p className="mt-6 max-w-2xl font-display text-2xl text-muted italic text-balance">
              “{about.positioning}”
            </p>
          )}
        </div>
        {portrait && (
          <CMSImage
            media={portrait}
            size="large"
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft"
          />
        )}
      </HeaderShell>

      <Container className="grid gap-16 lg:grid-cols-2">
        {about.education && about.education.length > 0 && (
          <Section title="Medical education">
            <ul className="space-y-5 border-t border-line pt-5">
              {about.education.map((e) => (
                <li key={e.id}>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-muted">
                    {[e.institution, e.period].filter(Boolean).join(" · ")}
                  </p>
                  {e.description && (
                    <p className="mt-1 text-sm text-muted">{e.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {about.values && about.values.length > 0 && (
          <Section title="Values">
            <ul className="space-y-5 border-t border-line pt-5">
              {about.values.map((v) => (
                <li key={v.id}>
                  <p className="font-display text-lg font-semibold text-primary">
                    {v.title}
                  </p>
                  {v.text && <p className="text-sm text-muted">{v.text}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {about.interests && about.interests.length > 0 && (
          <Section title="Medical interests">
            <ul className="space-y-4 border-t border-line pt-5">
              {about.interests.map((i) => (
                <li key={i.id}>
                  <p className="font-medium">{i.title}</p>
                  {i.text && <p className="text-sm text-muted">{i.text}</p>}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {about.researchInterests && about.researchInterests.length > 0 && (
          <Section title="Research interests">
            <ul className="flex flex-wrap gap-2">
              {about.researchInterests.map((i) => (
                <li key={i.id}>
                  <Tag>{i.title}</Tag>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {about.skills && about.skills.length > 0 && (
          <Section title="Skills">
            <ul className="flex flex-wrap gap-2">
              {about.skills.map((s) => (
                <li key={s.id}>
                  <Tag>{s.title}</Tag>
                </li>
              ))}
            </ul>
          </Section>
        )}
        {about.languages && about.languages.length > 0 && (
          <Section title="Languages">
            <ul className="space-y-2">
              {about.languages.map((l) => (
                <li key={l.id}>
                  {l.title}
                  {l.level && <span className="text-muted"> — {l.level}</span>}
                </li>
              ))}
            </ul>
          </Section>
        )}
        {about.communityVision && (
          <Section title="Community-service vision">
            <p className="text-muted text-pretty">{about.communityVision}</p>
          </Section>
        )}
        {about.careerGoals && (
          <Section title="Future goals">
            <p className="text-muted text-pretty">{about.careerGoals}</p>
          </Section>
        )}
      </Container>
    </>
  );
}
