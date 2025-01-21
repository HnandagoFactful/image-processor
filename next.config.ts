import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();
const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/en/image-process'
      },
      {
        source: '/home',
        destination: '/en/image-process'
      },
      {
        source: '/en',
        destination: '/en/image-process'
      },
    ]
  },
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default withNextIntl(nextConfig);
