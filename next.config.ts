import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['picsum.photos'],
  },
  // Enable compression and optimization
  compress: true,
  poweredByHeader: false,
  // Optimize build
  trailingSlash: false,
  // Optimize image loading
  experimental: {
    optimizeCss: true,
  },
};

export default nextConfig;
