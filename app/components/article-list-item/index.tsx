import Link from 'next/link'

import ConvertDate from '@/app/components/convert-date'
import type { ZennArticle } from '@/lib/zenn'

import styles from './index.module.css'

type ArticleListItemProps = {
  posts?: ZennArticle
}

export default function ArticleListItem({ posts }: ArticleListItemProps) {
  return (
    <Link
      key={posts?.id}
      href={`https://zenn.dev/${posts?.path}`}
      target="_blank"
      className={styles.item}
    >
      <div className={styles.text}>
        <h2 className={styles.title}>{posts?.title}</h2>
        <ConvertDate convertDate={posts?.published_at ?? ''} className={styles.date} />
        <span className={styles.liked}>
          <span>❤️</span>
          <span>{posts?.liked_count}</span>
        </span>
      </div>
      <span className={styles.emoji}>{posts?.emoji}</span>
    </Link>
  )
}
