import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'atxxkdpgewnnhnlhkpdd.supabase.co',
        pathname: '/storage/v1/object/sign/images/**',
      },
    ],
  },
  // other config options here
};

export default withNextIntl(nextConfig);

