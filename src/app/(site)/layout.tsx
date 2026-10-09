import type { Metadata } from "next";
import { Geist, Source_Serif_4 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { motionScript } from "@/components/motion-script";
import { themeScript } from "@/components/theme";
import { asMedia, displayName, getSettings } from "@/lib/cms";
import "./globals.css";

// Every page reads the CMS on each request, so edits in the admin show at once.
export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const serif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const image = asMedia(settings.shareImage);
  return {
    title: {
      default: settings.metaTitle || displayName(settings),
      template: `%s · ${displayName(settings)}`,
    },
    description: settings.metaDescription ?? undefined,
    metadataBase: process.env.NEXT_PUBLIC_SERVER_URL
      ? new URL(process.env.NEXT_PUBLIC_SERVER_URL)
      : undefined,
    openGraph: image?.url ? { images: [image.url] } : undefined,
  };
}

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${serif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: themeScript(
              settings.defaultTheme === "dark" ? "dark" : "light",
            ),
          }}
        />
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SiteHeader
          name={displayName(settings)}
          nav={settings.navigation ?? []}
        />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
