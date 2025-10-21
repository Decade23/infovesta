import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();

    const token = req.cookies.get("access_token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", req.url));

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev");
        const { payload } = await jwtVerify(token, secret);
        // opsional: cek role
        const roles = (payload.roles as string[] | undefined) ?? [];
        if (!roles.includes("admin")) {
            return NextResponse.redirect(new URL("/login", req.url));
        }
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL("/login", req.url));
    }
}
export const config = { matcher: ["/admin/:path*"] };
