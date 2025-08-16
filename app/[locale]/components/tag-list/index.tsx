import Link from 'next/link'

import { listAllTags } from '@/lib/content'

import styles from './index.module.css'

type Props = {
  tags?: Record<string, string[]>
  hrefPrefix?: string
  showCount?: boolean
  className?: string
}

export default function TagList({ tags, hrefPrefix = '/note/tag', className }: Props) {
  const map = tags || listAllTags()
  const entries = Object.entries(map).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))

  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>
      <li className={styles.item}>
        <Link className={styles.link} href={hrefPrefix}>
          All Tags
        </Link>
      </li>
      {entries.map(([tag]) => (
        <li key={tag} className={styles.item}>
          <Link className={styles.link} href={`${hrefPrefix}/${encodeURIComponent(tag)}`}>
            {tag}
          </Link>
          {/* {showCount && <span className={styles.tagCount}>{slugs.length}</span>} */}
        </li>
      ))}
    </ul>
  )
}
