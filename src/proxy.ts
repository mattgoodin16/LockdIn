import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PROTECTED = [
  "/home",
  "/plan-studio",
  "/nutrition-lab",
  "/progress-vault",
  "/check-in-hub",
  "/social-circle",
  "/logbook",
  "/settings",
  "/onboarding",
];

export async function proxy(req: NextRequest) {
  const shouldProtect = PROTECTED.some((path) =>
    req.nextUrl.pathname.startsWith(path),
  );

  if (!shouldProtect) return NextResponse.next();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/plan-studio/:path*",
    "/nutrition-lab/:path*",
    "/progress-vault/:path*",
    "/check-in-hub/:path*",
    "/social-circle/:path*",
    "/logbook/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
};
