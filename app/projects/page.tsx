import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'
import { getProjectsList } from '@/lib/microcms'

export default async function ProjectsPage() {
  const data = await getProjectsList({
    limit: 10,
  })

  return (
    <Container type="subpage">
      <h1>Projects</h1>
      <div>
        <ProjectList projects={data.contents} />
      </div>
    </Container>
  )
}
