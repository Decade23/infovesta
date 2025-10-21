"use client";
import { useEffect, useState } from "react";
import type { Role } from "@/domain/models";

export default function RolesPage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // sementara: dummy
        setTimeout(() => {
            setRoles([{ id: "1", name: "admin", permissions: ["*"] }]);
            setLoading(false);
        }, 200);
    }, []);

    if (loading) return <p>Memuat…</p>;

    return (
        <section>
            <h1 className="text-2xl font-bold mb-4">Role Management</h1>
            <div className="rounded-xl border bg-white p-4">
                <table className="w-full text-sm">
                    <thead className="text-left text-zinc-600">
                    <tr><th className="py-2">Nama</th><th>Permissions</th></tr>
                    </thead>
                    <tbody>
                    {roles.map(r => (
                        <tr key={r.id} className="border-t">
                            <td className="py-2 font-medium">{r.name}</td>
                            <td className="text-zinc-600">{r.permissions?.join(", ") ?? "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
