import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const role = request.cookies.get("role")?.value;
    const pathname = request.nextUrl.pathname;

    // protect admin routes
    if (pathname.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/user/items", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};