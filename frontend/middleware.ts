import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const role = request.cookies.get("role")?.value;

  const { pathname } = request.nextUrl;

  // Admin trying to visit home
  if (role === "admin" && pathname === "/") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*"],
};