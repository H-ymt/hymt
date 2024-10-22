import ArticleList from '@/app/components/article-list'
import Container from '@/app/components/container'
import { getZennArticles } from '@/lib/zenn'

import styles from './index.module.css'

export default async function ZennPage() {
  const data = await getZennArticles()

  return (
    <Container type="subpage">
      <h1 className={styles.title}>&quot;Zenn&quot; Contents</h1>
      <div className={styles.contents}>
        <section className={styles.articles}>
          <h2 className={styles.sectionTitle}>Articles</h2>
          <ArticleList posts={data.articles} />
        </section>

        <section className={styles.scrap}>
          <h2>Scrap</h2>
        </section>
      </div>
    </Container>
  )
}
