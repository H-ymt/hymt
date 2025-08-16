import type { Metadata } from 'next'

import Container from '@/app/[locale]/components/container'
import NoteList from '@/app/[locale]/components/note-list'
import TagList from '@/app/[locale]/components/tag-list'
import { listAllTags, listContentMeta } from '@/lib/content'

import styles from './page.module.css'

export const revalidate = 60

export async function generateStaticParams(): Promise<{ tag: string }[]> {
  const map = listAllTags()
  return Object.keys(map).map((tag) => ({ tag }))
}

export async function generateMetadata({ params }: { params: { tag: string; locale?: string } }): Promise<Metadata> {
  const tag = params.tag
  return { title: `Tag: ${tag}` }
}

export default function TagPage({ params }: { params: { tag: string; locale?: string } }) {
  const tag = params.tag
  const locale = params.locale
  const map = listAllTags()
  const slugs = map[tag] || []

  const meta = listContentMeta(locale)
  const items = slugs
    .map((s) => meta.find((m) => m.slug === s))
    .filter((x): x is { slug: string; data: Record<string, unknown> } => Boolean(x))

  return (
    <Container type="subpage">
      <h1 className={styles.tagName}>{tag}</h1>
      <TagList />
      <NoteList items={items} />
    </Container>
  )
}
