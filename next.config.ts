import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async redirects() {
        return [
            // Basic redirect
            {
                source: '/',
                destination: '/auth/login',
                permanent: true,
            },
            {
                source: '/auth',
                destination: '/auth/login',
                permanent: true,
            },
        ]
    },
};

export default nextConfig;
