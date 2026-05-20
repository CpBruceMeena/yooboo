import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok/external origins for dev HMR. Set NEXT_PUBLIC_ALLOWED_ORIGINS as comma-separated.
  allowedDevOrigins: [
    'localhost', '127.0.0.1',
    ...(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || '')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean),
  ],
};

export default nextConfig;
