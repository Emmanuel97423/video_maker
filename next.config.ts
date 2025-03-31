import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Désactiver la télémétrie en production
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    // Désactive la vérification ESLint pendant le build
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
