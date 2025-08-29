import Container from '@/app/[locale]/components/container'
import ProjectList from '@/app/[locale]/components/project-list'
import TransitionLink from '@/app/[locale]/components/transition-link'
import { routing } from '@/i18n/routing'
import { getCategoryDetail, getCategoryList, getProjectsList } from '@/lib/microcms'

import styles from './page.module.css'

type Props = {
  params: Promise<{
    locale: string
    id: string
  }>
}

export const revalidate = 60

export async function generateStaticParams(): Promise<{ locale: string; id: string }[]> {
  const list = await getCategoryList()
  const categories = list?.contents || []

  // Generate params for each locale and each category id
  const params: { locale: string; id: string }[] = []

  for (const locale of routing.locales) {
    for (const category of categories) {
      params.push({
        locale,
        id: category.id,
      })
    }
  }

  return params
}

export default async function Page(props: Props) {
  const params = await props.params
  const { contents: project } = await getProjectsList({
    filters: `category[contains]${params.id}`,
  })
  const categories = await getCategoryList()
  const category = await getCategoryDetail(params.id)

  return (
    <Container type="subpage">
      <p>Tag: {category.name}</p>
      <ul className={styles.category}>
        {categories &&
          categories.contents.map((category) => (
            <li key={category.id} className={styles.categoryItem}>
              <TransitionLink href={`/projects/category/${category.id}`}>{category.name}</TransitionLink>
            </li>
          ))}
      </ul>
      <div className={styles.projects}>
        <ProjectList projects={project} />
      </div>
    </Container>
  )
}
