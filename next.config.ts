import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Désactiver la télémétrie en production
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    // Désactive la vérification ESLint pendant le build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
