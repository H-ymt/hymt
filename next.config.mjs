import createMDX from '@next/mdx'
import createNextIntlPlugin from 'next-intl/plugin'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeHighlight],
  },
})

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    viewTransition: true,
  },
  images: {
    domains: ['images.microcms-assets.io'],
  },
  transpilePackages: ['next-mdx-remote'],
}

export default withNextIntl(withMDX(nextConfig))
