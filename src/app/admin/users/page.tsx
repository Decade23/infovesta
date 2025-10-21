"use client";
import { useEffect, useState } from "react";
import UserService from "@/services/UserService";
import { User } from "@/domain/models";
import SimpleTable from "@/components/data/SimpleTable";

export default function UsersPage(){
    const [data, setData] = useState<User[]>([]);
    useEffect(()=>{ UserService.i.list().then(setData).catch(console.error); },[]);
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Users</h1>
            <SimpleTable<User> cols={[
                {key:"email", label:"Email"},
                {key:"name",  label:"Name"},
                {key:"roles", label:"Roles"},
            ]} rows={data.map(u=>({...u, roles: u.roles.join(", ")} as any))}/>
        </div>
    );
}
