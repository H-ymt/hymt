import 'github-markdown-css/github-markdown.css'

import type { MDXComponents } from 'mdx/types'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}

type ShikiChild = { type: string; value?: string; children?: ShikiChild[] }
type ShikiNode = { children?: ShikiChild[] }

const prettyCodeOptions = {
  theme: 'github-dark',
  onVisitLine(node: unknown) {
    if (!node || typeof node !== 'object') return
    const n = node as ShikiNode
    if (!Array.isArray(n.children)) return
    if (n.children.length === 0) {
      n.children.push({ type: 'text', value: ' ' })
    }
  },
}

export function CustomMDX(props: { source: string; [key: string]: unknown }) {
  return (
    <MDXRemote
      {...props}
      components={{ ...components, ...(props.components || {}) }}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
        },
      }}
    />
  )
}
