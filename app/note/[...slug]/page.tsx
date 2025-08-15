import type { Metadata } from 'next'
import Link from 'next/link'

import Container from '@/app/components/container'
import { readContentBySlug } from '@/lib/content'
import ConvertDate from '@/lib/convert-date'

import { CustomMDX } from '../../mdx-remote'
import styles from './page.module.css'

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata | undefined> {
  const slugParts = params.slug || []
  const result = readContentBySlug(slugParts)
  if (!result) return undefined
  const { data } = result
  const title = data && typeof data.title === 'string' ? data.title : undefined
  const description = data && typeof data.description === 'string' ? data.description : undefined
  const thumbnail = data && typeof data.thumbnail === 'string' ? (data.thumbnail as string) : undefined
  const metadata: Metadata = {
    title,
    description,
    openGraph: thumbnail ? { images: [thumbnail] } : undefined,
  }
  return metadata
}

export default function Page({ params }: { params: { slug: string[] } }) {
  const slugParts = params.slug || []
  const result = readContentBySlug(slugParts)

  if (!result) {
    return (
      <Container type="subpage">
        <h1>Not found</h1>
      </Container>
    )
  }

  const { data: _data, content } = result
  const data = _data as Record<string, unknown>
  const title = data && typeof data.title === 'string' ? data.title : undefined
  const tags = data && (data.tags as unknown)
  const publishedAt = data && typeof data.publishedAt === 'string' ? (data.publishedAt as string) : undefined

  return (
    <Container type="subpage" className={styles.container}>
      {title && <h1>{title}</h1>}
      <div className={styles.meta}>
        {Array.isArray(tags) && tags.length > 0 && (
          <div className={styles.tags}>
            {tags
              .filter((t): t is string => typeof t === 'string')
              .map((t, i, arr) => (
                <span key={t}>
                  <Link href={`/note/tag/${encodeURIComponent(t)}`}>{t}</Link>
                  {i < arr.length - 1 ? ', ' : ''}
                </span>
              ))}
          </div>
        )}
        {publishedAt && (
          <span className={styles.publishedAt}>
            <ConvertDate convertDate={publishedAt} />
          </span>
        )}
      </div>
      <article className="markdown-body">
        <CustomMDX source={content} />
      </article>
    </Container>
  )
}
