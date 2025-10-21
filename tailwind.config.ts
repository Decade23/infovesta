/*
 * Author: Dedi Fardiyanto Copyright (c) 2025.
 *
 * Created At: 6/15/25, 11:21 PM
 * Filename: tailwind.config.ts
 * Last Modified: 6/15/25, 9:31 PM
 */

// tailwind.config.ts

import type {Config} from 'tailwindcss'
import colors from "tailwindcss/colors";

export default {
    // Bagian ini sangat penting untuk auto-completion
    content: [
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // Daftarkan font baru agar bisa dipakai sebagai class
                quran: ['var(--font-amiri-quran)'],
            },
            colors: {
                blue: colors.blue, // pastikan pakai warna HEX, bukan oklch
                zinc: colors.zinc,
                gray: colors.gray,
                white: "#ffffff",
            },
        },
    },
    plugins: [],
} satisfies Config