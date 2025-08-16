import { getTranslations } from 'next-intl/server'

import Container from '@/app/[locale]/components/container'
import ProjectList from '@/app/[locale]/components/project-list'
import TransitionLink from '@/app/[locale]/components/transition-link'
import { getCategoryList, getProjectsList } from '@/lib/microcms'

import styles from './page.module.css'

export default async function ProjectsPage() {
  const t = await getTranslations('Project')

  const data = await getProjectsList({
    limit: 10,
  })
  const categories = await getCategoryList()

  return (
    <Container type="subpage">
      <h1 className={styles.title}>Projects</h1>
      <p>{t('lead')}</p>
      <ul className={styles.category}>
        {categories &&
          categories.contents.map((category) => (
            <li key={category.id} className={styles.categoryItem}>
              <TransitionLink href={`/projects/category/${category.id}`}>{category.name}</TransitionLink>
            </li>
          ))}
      </ul>
      <div className={styles.projects}>
        <ProjectList projects={data.contents} />
      </div>
    </Container>
  )
}
