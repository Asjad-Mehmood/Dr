import type { Metadata } from "next";
import { EntryList } from "@/components/entry-list";
import { Container, EmptyNote, PageHeader } from "@/components/ui";
import { categories, entriesFor } from "@/content/portfolio";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Portfolio",
  description: `Academics, research, student societies, patient welfare, community outreach, academic events and awards — ${profile.name}'s portfolio.`,
};

export default function PortfolioPage() {
  const groups = categories.map((category) => ({
    ...category,
    entries: entriesFor({ category: category.id }).sort(
      (a, b) => b.year - a.year,
    ),
  }));

  return (
    <>
      <PageHeader eyebrow="Portfolio" title="Everything, in one place">
        Academics, research, student societies, patient welfare and blood
        donation, community outreach, academic events and awards — collected
        from every year of the journey.
      </PageHeader>

      <Container className="grid gap-12 lg:grid-cols-[14rem_1fr]">
        <nav
          aria-label="Categories"
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            {groups.map((group) => (
              <li key={group.id}>
                <a
                  href={`#${group.id}`}
                  className="flex items-center justify-between gap-3 rounded-full border border-line px-4 py-1.5 text-sm hover:border-primary hover:text-primary lg:rounded-lg lg:border-transparent"
                >
                  {group.title}
                  <span className="text-xs text-muted">
                    {group.entries.length}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <h2 className="font-display text-2xl font-semibold">
                {group.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{group.description}</p>
              <div className="mt-5">
                {group.entries.length > 0 ? (
                  <EntryList entries={group.entries} show="year" />
                ) : (
                  <EmptyNote>Nothing added here yet.</EmptyNote>
                )}
              </div>
            </section>
          ))}
        </div>
      </Container>
    </>
  );
}
