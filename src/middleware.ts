import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/dashboard", "/calories"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  // kick unauthenticated users away from protected pages
  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // if already logged in, don't show auth pages
  if (authRoutes.some((r) => pathname.startsWith(r)) && token) {
    const dashUrl = new URL("/calories", request.url);
    return NextResponse.redirect(dashUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/calories/:path*", "/login", "/register"],
};
