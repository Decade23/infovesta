import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {jwtVerify, SignJWT} from "jose";

const ttlMinutes = Number(process.env.ACCESS_TOKEN_TTL_MINUTES ?? 30);
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev");

export const dynamic = "force-dynamic";

export async function POST() {
    const c = await cookies();               // ← WAJIB pakai await di Next 15
    const refresh = c.get("refresh_token")?.value;

    if (!refresh) {
        return NextResponse.json({ ok: false, error: "no-refresh" }, { status: 401 });
    }

    try {
        const { payload } = await jwtVerify(refresh, secret);

        // bikin access token baru
        const exp = new Date(Date.now() + ttlMinutes * 60_000);
        const newAccessToken = await new SignJWT({ sub: payload.sub })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime(`${ttlMinutes}m`)
            .sign(secret);

        const res = NextResponse.json({ ok: true, exp: exp.toISOString() });
        res.cookies.set("access_token", newAccessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: true,
            expires: exp,
        });
        return res;
    } catch (err) {
        return NextResponse.json({ ok: false, error: "invalid-refresh" }, { status: 401 });
    }
}
