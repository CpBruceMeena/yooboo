import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allowedDevOrigins is intentionally omitted — the reverse proxy (port 3000) sits between the
  // browser and Next.js (port 3001). Since Next.js only sees localhost traffic from the proxy,
  // origin-based restrictions are unnecessary. This makes the app accessible from any IP/internet
  // tunnel without configuration.
};

export default nextConfig;
