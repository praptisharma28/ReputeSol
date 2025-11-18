/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },
  turbopack: {}, // Silence Turbopack warning
};

module.exports = nextConfig;
