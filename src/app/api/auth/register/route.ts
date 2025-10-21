import { NextRequest, NextResponse } from "next/server";
const mem: any = globalThis as any;
mem.__users ??= [];

export async function POST(req: NextRequest){
    const { name, email, password } = await req.json();
    if(mem.__users.some((u:any)=>u.email===email))
        return NextResponse.json({ ok:false, message:"Email exists" }, { status:409 });
    const u = { id: String(mem.__users.length+1), email, name, pass: password, roles: ["admin"] };
    mem.__users.push(u);
    return NextResponse.json({ ok:true, user: { id:u.id, email, name, roles:u.roles } });
}
