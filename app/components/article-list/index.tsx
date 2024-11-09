import ArticleListItem from '@/app/components/article-list-item'
import type { ZennArticle } from '@/lib/zenn'

import styles from './index.module.css'

type ArticleProps = {
  posts: ZennArticle[]
}

export default function ArticleList({ posts }: ArticleProps) {
  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <ArticleListItem key={post.id} posts={post} />
      ))}
    </div>
  )
}
