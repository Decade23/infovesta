export default function SimpleTable<T extends Record<string, any>>({
                                                                       cols, rows
                                                                   }: { cols: {key: keyof T; label: string}[]; rows: T[] }) {
    return (
        <div className="overflow-auto rounded-xl border bg-white">
            <table className="min-w-[600px] w-full text-sm">
                <thead className="bg-zinc-50">
                <tr>{cols.map(c => <th key={String(c.key)} className="text-left px-3 py-2 font-semibold">{c.label}</th>)}</tr>
                </thead>
                <tbody>
                {rows.map((r,i) => (
                    <tr key={i} className="border-t">
                        {cols.map(c => <td key={String(c.key)} className="px-3 py-2">{String(r[c.key] ?? "")}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
