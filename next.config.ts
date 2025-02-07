import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'atxxkdpgewnnhnlhkpdd.supabase.co',
        pathname: '/storage/v1/object/public/images/**',
      },
    ],
  },
  /* other config options here */
};

export default nextConfig;
