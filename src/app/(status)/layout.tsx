import type { Metadata } from "next";
import type React from "react";
import { themeScript } from "@/components/theme";
import "../(site)/globals.css";

// A separate root layout: the status page must work even when the database
// (which the main site's layout reads) is down.
export const metadata: Metadata = {
  title: "System status",
  robots: { index: false },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript("light") }} />
      </head>
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
