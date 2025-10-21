import { NextResponse } from "next/server";
const mem:any = globalThis as any;
mem.__users ??= [{ id:"1", email:"admin@ps.id", name:"Admin", pass:"admin123", roles:["admin"] }];

export async function GET(){
    const rows = mem.__users.map((u:any)=>({ id:u.id, email:u.email, name:u.name, roles:u.roles }));
    return NextResponse.json(rows);
}
