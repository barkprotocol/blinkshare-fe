import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use the new remotePatterns configuration instead of domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
    ],
  },

  // Disable ESLint during the build process
  eslint: {
    ignoreDuringBuilds: true, // This disables ESLint errors during build
  },

  /* config options here */
};

export default nextConfig;
