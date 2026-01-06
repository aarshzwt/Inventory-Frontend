import type { NextConfig } from "next";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/uploads/image/:path*',
        destination: `${BACKEND_URL}/uploads/image/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/uploads/image/:path*',
        headers: [
          {
            key: 'ngrok-skip-browser-warning',
            value: 'true',
          },
        ],
      },
    ];
  }
};

export default nextConfig;
