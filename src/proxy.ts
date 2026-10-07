import { NextResponse } from "next/server";
import { missingSettings, setupPage } from "@/lib/setup";

// Until the database and secret are configured, answer every page with a
// setup page that says what is missing, instead of a bare server error.
export function proxy() {
  const missing = missingSettings();
  if (missing.length === 0) return NextResponse.next();
  return new NextResponse(
    setupPage(missing.map((name) => `${name} is not set.`)),
    {
      status: 503,
      headers: { "content-type": "text/html; charset=utf-8" },
    },
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/health|health|icon).*)"],
};
