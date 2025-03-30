import Link from 'next/link'

import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'
import { getCategoryList, getProjectsList } from '@/lib/microcms'

import styles from './page.module.css'

export default async function ProjectsPage() {
  const data = await getProjectsList({
    limit: 10,
  })
  const categories = await getCategoryList()

  return (
    <Container type="subpage">
      <h1 className={styles.title}>Projects</h1>
      <ul>
        {categories &&
          categories.contents.map((category) => (
            <li key={category.id}>
              <Link href={`/projects/category/${category.id}`}>{category.name}</Link>
            </li>
          ))}
      </ul>
      <div className={styles.projects}>
        <ProjectList projects={data.contents} />
      </div>
    </Container>
  )
}
