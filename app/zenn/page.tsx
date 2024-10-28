import ArticleList from '@/app/components/article-list'
import Container from '@/app/components/container'
import ScrapList from '@/app/components/scrap-list'
import { getZennArticles, getZennScraps } from '@/lib/zenn'

import styles from './index.module.css'

export default async function ZennPage() {
  const articleData = await getZennArticles()
  const scrapData = await getZennScraps()

  return (
    <Container type="subpage">
      <h1 className={styles.title}>&quot;Zenn&quot; Contents</h1>
      <div className={styles.contents}>
        <section className={styles.articles}>
          <h2 className={styles.sectionTitle}>Articles</h2>
          <ArticleList posts={articleData.articles} />
        </section>

        <section className={styles.scrap}>
          <h2 className={styles.sectionTitle}>Scrap</h2>
          <ScrapList scraps={scrapData} />
        </section>
      </div>
    </Container>
  )
}
