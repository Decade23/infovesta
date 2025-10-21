import { Poppins, Inter } from "next/font/google";
import "nprogress/nprogress.css";
import "./globals.css";
import ClientProviders from "@/components/providers/ClientProviders";

const poppinsFont = Poppins({
    variable: "--font-poppins-sans",
    subsets: ["latin"],
    weight: ["400","700"],
    display: "swap",
});
const interFont = Inter({
    variable: "--font-inter-sans",
    subsets: ["latin"],
    display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`theme-light ${interFont.variable} ${poppinsFont.variable}`}>
        <body className="min-h-dvh bg-gradient-to-b from-white to-zinc-100 text-zinc-900 font-sans antialiased">
        <ClientProviders>
            {children}</ClientProviders>
        </body>
        </html>
    );
}
