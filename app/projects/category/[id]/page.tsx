import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'
import TransitionLink from '@/app/components/transition-link'
import { getCategoryDetail, getCategoryList, getProjectsList } from '@/lib/microcms'

import styles from './page.module.css'

type Props = {
  params: Promise<{
    id: string
  }>
}

export const revalidate = 60

export async function generateStaticParams(): Promise<{ id: string }[]> {
  const list = await getCategoryList()
  const ids = (list?.contents || []).map((c) => ({ id: c.id }))
  return ids
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
