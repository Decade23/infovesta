import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function decodeJwtExp(token: string): number | null {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
        const payload = JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8"));
        return typeof payload?.exp === "number" ? payload.exp : null;
    } catch { return null; }
}

// (opsional) memastikan ini selalu dinamis
export const dynamic = "force-dynamic";

export async function GET() {
    const c = await cookies();               // ← WAJIB pakai await di Next 15
    const access  = c.get("access_token")?.value ?? "";
    const refresh = c.get("refresh_token")?.value ?? "";

    let expiresAt: string | null = null;
    const expSec = access ? decodeJwtExp(access) : null;
    if (expSec) expiresAt = new Date(expSec * 1000).toISOString();

    return NextResponse.json({
        authenticated: Boolean(access),
        canRefresh: Boolean(refresh),
        expiresAt,
    });
}
