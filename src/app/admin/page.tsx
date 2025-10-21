"use client";

import { useState, useEffect, useRef } from "react";
import Papa from "papaparse";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Select from "react-select";

// Register Chart.js modules
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Filler,
    Title,
    Tooltip,
    Legend
);

// === Types ===
type EquityMeta = {
    portid: string;
    portname: string;
};
type EquityTrade = {
    txtno: string;
    portid: string;
    portdate: string;
    opening: string;
    high: string;
    low: string;
    closing: string;
    volume: string;
};

export default function AdminDashboard() {
    const [meta, setMeta] = useState<EquityMeta[]>([]);
    const [trades, setTrades] = useState<EquityTrade[]>([]);
    const [filtered, setFiltered] = useState<EquityTrade[]>([]);
    const [selectedTickers, setSelectedTickers] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" }>({
        key: "portdate",
        direction: "asc",
    });

    const chartRef = useRef<any>(null);

    // === Helper: get today's date in yyyy-MM-dd format ===
    const getToday = () => {
        const now = new Date();
        return now.toISOString().split("T")[0];
    };

    // === Load CSVs ===
    useEffect(() => {
        const loadCSVs = async () => {
            // set default date range to today
            const today = getToday();
            setDateRange({ start: today, end: today });

            // load meta
            Papa.parse("/msequity.csv", {
                download: true,
                header: true,
                complete: (metaResult) => setMeta(metaResult.data as EquityMeta[]),
            });

            // load trades
            Papa.parse("/trequity.csv", {
                download: true,
                header: true,
                complete: (tradeResult) => {
                    const rows = tradeResult.data as EquityTrade[];

                    // ambil semua ticker unik
                    const allTickers = Array.from(new Set(rows.map((r) => r.portid)));
                    setTrades(rows);
                    setSelectedTickers(allTickers);

                    // filter data untuk hari ini
                    const todayData = rows.filter((r) => r.portdate === today);
                    setFiltered(todayData);
                },
            });
        };
        loadCSVs();
    }, []);

    // === Update filter ===
    useEffect(() => {
        if (trades.length === 0) return;

        // ✅ jika belum pilih ticker, kosongkan data
        if (selectedTickers.length === 0) {
            setFiltered([]);
            return;
        }

        let result = trades.filter((r) => selectedTickers.includes(r.portid));

        if (dateRange.start && dateRange.end)
            result = result.filter(
                (r) => r.portdate >= dateRange.start && r.portdate <= dateRange.end
            );

        setFiltered(result);
    }, [selectedTickers, dateRange, trades]);

    // === Sort & search table ===
    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
        setSortConfig({ key, direction });
    };

    const displayedData = [...filtered]
        .filter((r) =>
            searchQuery.trim() === ""
                ? true
                : Object.values(r)
                    .join(" ")
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const aVal = a[sortConfig.key as keyof typeof a];
            const bVal = b[sortConfig.key as keyof typeof a];
            if (!isNaN(Number(aVal)) && !isNaN(Number(bVal)))
                return sortConfig.direction === "asc"
                    ? Number(aVal) - Number(bVal)
                    : Number(bVal) - Number(aVal);
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });

    // === Chart ===
    const getColor = (i: number) =>
        ["#1A57A8", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#14B8A6"][i % 6];

    const uniqueDates = Array.from(new Set(filtered.map((r) => r.portdate))).sort();
    const isSingleDay = dateRange.start === dateRange.end;

    const datasets =
        selectedTickers.length > 0 ?
            selectedTickers
                .filter((ticker) => ticker && ticker !== "undefined") // ✅ hindari ticker kosong
                .map((ticker, i) => {
                    const tickerData = filtered
                        .filter(
                            (r) =>
                                r.portid === ticker &&
                                r.closing &&
                                !isNaN(parseFloat(r.closing)) // ✅ pastikan closing valid
                        );

                    if (tickerData.length === 0) return null; // skip jika tidak ada data valid

                    const color = getColor(i);
                    const data = isSingleDay
                        ? [
                            {
                                x: ticker,
                                y: parseFloat(tickerData[0]?.closing ?? "0"),
                            },
                        ]
                        : tickerData.map((r) => ({
                            x: r.portdate,
                            y: parseFloat(r.closing),
                        }));

                    return {
                        label: `${ticker} Close`,
                        data,
                        borderColor: color,
                        backgroundColor: color + "33",
                        fill: true,
                        tension: 0.25,
                        spanGaps: true,
                    };
                })
                .filter(Boolean) // ✅ hapus null dataset
            : [];

    const chartData = { datasets };

    // === Export PDF ===
    const exportPDF = async () => {
        const pdf = new jsPDF("p", "mm", "a4");
        pdf.setFontSize(16);
        pdf.text("Stock Dashboard", 10, 12);
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleString()}`, 10, 18);
        pdf.text(`Tickers: ${selectedTickers.join(", ")}`, 10, 23);
        pdf.text(`Date Range: ${dateRange.start} → ${dateRange.end}`, 10, 28);

        const chartImg = chartRef.current?.toBase64Image("image/png", 1);
        if (chartImg) pdf.addImage(chartImg, "PNG", 10, 33, 190, 90);

        const rows = displayedData.map((r) => [
            r.portdate,
            r.portid,
            r.opening,
            r.high,
            r.low,
            r.closing,
            r.volume,
        ]);

        autoTable(pdf, {
            startY: 130,
            head: [["DATE", "TICKER", "OPEN", "HIGH", "LOW", "CLOSE", "VOLUME"]],
            body: rows,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [26, 87, 168] },
            theme: "grid",
        });

        pdf.save("stock-dashboard.pdf");
    };

    // === UI ===
    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Stock Dashboard</h1>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="w-64">
                    <Select
                        isMulti
                        options={meta
                            .filter((m) => m.portid && m.portname) // ✅ hanya ambil yang valid
                            .map((m) => ({ value: m.portid, label: `${m.portid} - ${m.portname}` }))
                        }
                        placeholder="Select Tickers..."
                        onChange={(vals) => setSelectedTickers(vals.map((v) => v.value))}
                        value={selectedTickers
                            .filter((t) => meta.some((m) => m.portid === t)) // ✅ hindari ticker invalid
                            .map((t) => {
                                const found = meta.find((m) => m.portid === t);
                                return {
                                    value: t,
                                    label: found ? `${found.portid} - ${found.portname}` : t,
                                };
                            })}
                    />
                </div>

                <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="border rounded p-2"
                />
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="border rounded p-2"
                />

                <button
                    onClick={exportPDF}
                    className="bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700"
                >
                    Export PDF
                </button>
            </div>

            {/* Chart */}
            {datasets.length === 0 ? (
                <div className="text-center text-zinc-500 bg-amber-100 rounded px-4 py-5 mt-8">
                    No data found for selected filters. <br />
                    Please select <b>at least one ticker or change date range</b> to view chart and data.
                </div>
            ) : (
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: { position: "bottom" },
                            title: { display: true, text: "Close Price Chart" },
                        },
                        scales: {
                            x: {
                                type: "category",
                                title: { display: true, text: isSingleDay ? "Ticker" : "Date" },
                            },
                            y: { title: { display: true, text: "Price" } },
                        },
                    }}
                />
            )}

            {/* Table */}
            <div className="mt-6 flex justify-between items-center">
                <h2 className="font-semibold text-lg">Trade Data</h2>
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="border rounded p-2 text-sm w-60"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {displayedData.length > 0 ? (
                <div className="mt-3 border rounded-md overflow-x-auto max-h-[500px]">
                    <table className="min-w-full text-sm border-collapse">
                        <thead className="bg-zinc-100 sticky top-0 z-10">
                        <tr>
                            {[
                                { key: "portdate", label: "DATE" },
                                { key: "portid", label: "TICKER" },
                                { key: "opening", label: "OPEN" },
                                { key: "high", label: "HIGH" },
                                { key: "low", label: "LOW" },
                                { key: "closing", label: "CLOSE" },
                                { key: "volume", label: "VOLUME" },
                            ].map(({ key, label }) => (
                                <th
                                    key={key}
                                    onClick={() => handleSort(key)}
                                    className="p-2 border font-semibold text-left bg-zinc-100 cursor-pointer select-none"
                                >
                                    {label}
                                    {sortConfig.key === key && (
                                        <span className="ml-1 text-xs text-zinc-500">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {displayedData.map((r, i) => (
                            <tr
                                key={i}
                                className={`text-center ${
                                    i % 2 === 0 ? "bg-white" : "bg-zinc-50"
                                } hover:bg-blue-50`}
                            >
                                <td className="border p-1">{r.portdate}</td>
                                <td className="border p-1">{r.portid}</td>
                                <td className="border p-1">{r.opening}</td>
                                <td className="border p-1">{r.high}</td>
                                <td className="border p-1">{r.low}</td>
                                <td className="border p-1">{r.closing}</td>
                                <td className="border p-1">{r.volume}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-zinc-500 mt-8">
                    No data found for selected filters.
                </div>
            )}
        </div>
    );
}