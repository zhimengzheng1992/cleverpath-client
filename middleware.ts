// project/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl;

  const isPublicPath =
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/signup") ||
    url.pathname.startsWith("/public");

  if (!token && !isPublicPath) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
