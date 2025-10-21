"use client";
import { useEffect, useMemo, useState } from "react";
import type { Training } from "@/domain/models";
import TrainingService from "@/services/TrainingService";
import {
    ColumnDef, flexRender, getCoreRowModel,
    getSortedRowModel, SortingState, useReactTable
} from "@tanstack/react-table";

export default function TrainingsPage(){
    const [rows, setRows] = useState<Training[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    useEffect(()=>{ TrainingService.i.list().then(setRows).catch(console.error); },[]);

    const columns = useMemo<ColumnDef<Training>[]>(() => [
        { header: "Title", accessorKey: "title" },
        { header: "Slug", accessorKey: "slug" },
        { header: "Level", accessorKey: "level" },
        { header: "Mode", accessorKey: "mode" },
        { header: "Active", accessorKey: "active",
            cell: ({ getValue }) => (getValue<boolean>() ? "Yes" : "No")
        }
    ], []);

    const table = useReactTable({
        data: rows, columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Trainings</h1>
            <div className="overflow-auto rounded-xl border bg-white">
                <table className="min-w-[720px] w-full text-sm">
                    <thead className="bg-zinc-50">
                    {table.getHeaderGroups().map(hg=>(
                        <tr key={hg.id}>
                            {hg.headers.map(h=>(
                                <th key={h.id} className="px-3 py-2 font-semibold cursor-pointer"
                                    onClick={h.column.getToggleSortingHandler()}>
                                    {flexRender(h.column.columnDef.header, h.getContext())}
                                    {{asc:" ↑", desc:" ↓"}[h.column.getIsSorted() as string] ?? null}
                                </th>
                            ))}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {table.getRowModel().rows.map(r=>(
                        <tr key={r.id} className="border-t">
                            {r.getVisibleCells().map(c=>(
                                <td key={c.id} className="px-3 py-2">
                                    {flexRender(c.column.columnDef.cell, c.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
