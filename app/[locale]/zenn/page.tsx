import { getTranslations } from 'next-intl/server'

import ArticleList from '@/app/[locale]/components/article-list'
import Container from '@/app/[locale]/components/container'
import ScrapList from '@/app/[locale]/components/scrap-list'
import { routing } from '@/i18n/routing'
import { getZennArticles, getZennScraps } from '@/lib/zenn'

import styles from './page.module.css'

export const revalidate = 60

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }))
}

export default async function ZennPage() {
  const t = await getTranslations('Zenn')
  const articleData = await getZennArticles()
  const scrapData = await getZennScraps()

  return (
    <Container type="subpage">
      <h1 className={styles.title}>Zenn Contents</h1>
      <p>{t('lead')}</p>
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
