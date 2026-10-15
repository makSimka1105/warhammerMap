import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${process.env.API_ORIGIN ?? "http://localhost:5000"}/:path*`,
      },
    ];
  },
};

export default nextConfig;
