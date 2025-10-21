/*
 * Author: Dedi Fardiyanto Copyright (c) 2025.
 *
 * Created At: 6/15/25, 11:21 PM
 * Filename: next.config.ts
 * Last Modified: 6/15/25, 8:12 PM
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    allowedDevOrigins: ['localhost', '192.168.1.5', 'dediajeng.id', '*dediajeng.id']
};

export default nextConfig;
