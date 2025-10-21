import { NextResponse } from "next/server";

function makeResponse() {
    const res = NextResponse.json({ ok: true });
    // hapus cookie token
    res.cookies.set("access_token", "", {
        path: "/",
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        expires: new Date(0),
    });
    return res;
}

export async function POST() { return makeResponse(); }
export async function GET()  { return makeResponse(); } // jaga2 kalau terpanggil GET
