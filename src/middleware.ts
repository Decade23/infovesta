import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const {pathname} = req.nextUrl;

    // if (!req.nextUrl.pathname.startsWith("/admin")) return NextResponse.next();
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        pathname.startsWith("/favicon.ico")) {
        return NextResponse.next();
    }

    const token = req.cookies.get("access_token")?.value;

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev");
            const { payload } = await jwtVerify(token, secret);

            const roles = (payload.roles as string[] | undefined) ?? [];

            // ✅ Jika user mengakses "/" atau "/login" tapi sudah login → redirect ke /admin
            if (pathname === "/" || pathname.startsWith("/login")) {
                return NextResponse.redirect(new URL("/admin", req.url));
            }

            // ✅ Jika user ke halaman admin tapi bukan admin
            if (pathname.startsWith("/admin") && !roles.includes("admin")) {
                return NextResponse.redirect(new URL("/login", req.url));
            }

            // ✅ Token valid dan halaman sesuai → lanjut
            return NextResponse.next();
        } catch {
            const res = NextResponse.redirect(new URL("/login", req.url));
            res.cookies.delete("access_token");
            return res;
        }
    }

    // 🧩 Jika TIDAK ADA TOKEN
    // hanya izinkan "/login"
    if (pathname.startsWith("/login")) {
        return NextResponse.next();
    }

    // jika mencoba akses halaman admin tanpa token
    return NextResponse.redirect(new URL("/login", req.url));
}
export const config = {
    matcher:
        [
            "/",
            "/login",
            "/admin/:path*"
        ],

};
