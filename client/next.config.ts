import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,  // отключить source maps для браузера
  experimental: {
    serverSourceMaps: false,           // отключить source maps для сервера
  },
    typescript: {
    // Позволяет собирать проект, даже если есть ошибки типов (используйте с осторожностью)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Отключает проверку и ошибки ESLint при сборке
    ignoreDuringBuilds: true,
  },
  
  /* config options here */
};

export default nextConfig;
