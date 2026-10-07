import Link from "next/link";
import { PageHeader } from "@/components/ui";

export default function NotFound() {
  return (
    <PageHeader
      text={{ eyebrow: "404", title: "This page isn't part of the journey" }}
    >
      <p className="mt-6">
        <Link href="/" className="text-primary hover:underline">
          Return to the home page →
        </Link>
      </p>
    </PageHeader>
  );
}
