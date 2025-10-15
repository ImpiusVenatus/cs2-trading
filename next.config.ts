import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'community.akamai.steamstatic.com',
        port: '',
        pathname: '/economy/image/**',
      },
      {
        protocol: 'https',
        hostname: 'steamcommunity-a.akamaihd.net',
        port: '',
        pathname: '/economy/image/**',
      },
      {
        protocol: 'https',
        hostname: 'community.cloudflare.steamstatic.com',
        port: '',
        pathname: '/economy/image/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.steamcommunity.com',
        port: '',
        pathname: '/economy/image/**',
      },
      {
        protocol: 'https',
        hostname: 'steamcdn-a.akamaihd.net',
        port: '',
        pathname: '/economy/image/**',
      }
    ],
  },
};

export default nextConfig;
