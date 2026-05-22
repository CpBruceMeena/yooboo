import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow origins for dev HMR WebSocket connections.
  // Set ALLOWED_ORIGINS env var (comma-separated) for ngrok/custom domains.
  // Next.js uses the Host header to verify dev WebSocket origins.
  allowedDevOrigins: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
    : [],
};

export default nextConfig;
