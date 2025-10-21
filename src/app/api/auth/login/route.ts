import { NextRequest } from "next/server";
import { SignJWT } from "jose";
import { ok, fail } from "@/lib/respond";
import { withValidation } from "@/lib/zod-helpers";
import { LoginSchema, LoginInput } from "@/validation/auth";
import type { User } from "@/domain/models";

const mem: { users: (User & { pass: string })[]; me?: User } = {
    users: [{ id:"1", email:"admin@ps.id", name:"Admin", roles:["admin"], pass:"admin1" }],
};

export async function GET() { return ok<User | null>(mem.me ?? null); }

export async function POST(req: NextRequest) {
    const v = await withValidation<LoginInput>(req, LoginSchema);
    if (!v.ok) return fail(v.body.message, v.body.errors, v.status);
    const { email, password } = v.data;

    const u = mem.users.find(x => x.email === email && x.pass === password);
    if (!u) return fail("Invalid credentials", undefined, 401);

    const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? "dev");
    const token = await new SignJWT({ sub: u.id, email: u.email, roles: u.roles })
        .setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("15m").sign(secret);

    const refreshToken = await new SignJWT({ sub: u.id })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // refresh token lebih lama
        .sign(secret);

    mem.me = { id: u.id, email: u.email, name: u.name, roles: u.roles };

    const res = ok<User>(mem.me);
    res.cookies.set("access_token", token, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
    res.cookies.set("refresh_token", refreshToken, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
    return res;
}
