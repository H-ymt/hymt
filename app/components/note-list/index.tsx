import Link from 'next/link'

import styles from '@/app/note/page.module.css'
import ConvertDate from '@/lib/convert-date'

type Item = {
  slug: string
  data?: Record<string, unknown>
}

type Props = {
  items: Item[]
}

export default function NoteList({ items }: Props) {
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
              <Link className={styles.title} href={`/note/${slug}`}>
                {name}
              </Link>
              {tagList && (
                <div className={styles.tags}>
                  {tagList.map((t, i) => (
                    <span key={t} className={styles.tag}>
                      <Link href={`/note/tag/${encodeURIComponent(t)}`} className={styles.tagLink}>
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
