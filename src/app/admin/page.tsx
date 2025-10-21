"use client"

export default function AdminHome(){
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <StatCard label="Users" value="12" />
                <StatCard label="Roles" value="3" />
                <StatCard label="Trainings" value="8" />
            </div>
        </div>
    );
}
function StatCard({label, value}:{label:string; value:string}){
    return <div className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="text-sm text-zinc-500">{label}</div>
        <div className="text-3xl font-bold mt-1">{value}</div>
    </div>;
}
