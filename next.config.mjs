/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    viewTransition: true,
  },
  images: {
    domains: ['images.microcms-assets.io'],
  },
}

export default nextConfig
