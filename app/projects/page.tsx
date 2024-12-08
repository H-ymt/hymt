import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'
import { getProjectsList } from '@/lib/microcms'

import styles from './page.module.css'

export default async function ProjectsPage() {
  const data = await getProjectsList({
    limit: 10,
  })

  return (
    <Container type="subpage">
      <h1 className={styles.title}>Projects</h1>
      <div className={styles.projects}>
        <ProjectList projects={data.contents} />
      </div>
    </Container>
  )
}
