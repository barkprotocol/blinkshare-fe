import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Add your custom domains for images
  images: {
    domains: [
      "cdn.discordapp.com",
      "ucarecdn.com",
    ],
  },

  // Disable ESLint during the build process
  eslint: {
    ignoreDuringBuilds: true, // This disables ESLint errors during build
  },

  /* config options here */
};

export default nextConfig;
