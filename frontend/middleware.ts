import { NextRequest, NextResponse } from "next/server";

// Real authorization happens in the API (JWT + DB role check) and in the
// admin layout. Here we only keep the panel out of search engines and caches.
export function middleware(_request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Frame-Options", "DENY");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};