/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  basePath: '/DuoMaoFF',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['sharp'],
  },
}

module.exports = nextConfig
