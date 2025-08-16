'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

import ConvertDate from '@/lib/convert-date'

import styles from './index.module.css'

type Item = {
  slug: string
  data?: Record<string, unknown>
}

type Props = {
  items: Item[]
}

export default function NoteList({ items }: Props) {
  const params = useParams() as { locale?: string }
  const locale = params?.locale
  return (
    <ul className={styles.list}>
      {items.map(({ slug, data }) => {
        const title = data && (data as Record<string, unknown>).title
        const name = (typeof title === 'string' ? title : undefined) || slug.split('/').pop() || slug
        const publishedAt = data && (data as Record<string, unknown>).publishedAt
        const tags = data && (data as Record<string, unknown>).tags
        const dateStr = typeof publishedAt === 'string' ? publishedAt : undefined
        const tagList = Array.isArray(tags) ? (tags as string[]) : undefined
        return (
          <li key={slug} className={styles.item}>
            <span className={styles.itemContent}>
              <Link className={styles.title} href={`/${locale ?? ''}/note/${slug}`}>
                {name}
              </Link>
              {tagList && (
                <div className={styles.tags}>
                  {tagList.map((t, i) => (
                    <span key={t} className={styles.tag}>
                      <Link href={`/${locale ?? ''}/note/tag/${encodeURIComponent(t)}`} className={styles.tagLink}>
                        {t}
                      </Link>
                      {i < tagList.length - 1 && ', '}
                    </span>
                  ))}
                </div>
              )}
            </span>
            {dateStr && (
              <div className={styles.date}>
                <ConvertDate convertDate={dateStr} />
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
