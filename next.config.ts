import type { NextConfig } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dnd-kat-gdcm.vercel.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '**.imagekit.io' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  // Tailwind CSS v4 with Turbopack — use the official @tailwindcss/turbopack loader.
  // The 'base' option points to the project root so the JIT scanner finds all tsx/ts files.
  turbopack: {
    rules: {
      '*.css': {
        loaders: [
          {
            loader: '@tailwindcss/turbopack',
            options: {
              base: process.cwd(),
            },
          },
        ],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
