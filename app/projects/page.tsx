import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'

export default function ProjectsPage() {
  return (
    <Container type="subpage">
      <h1>Projects</h1>
      <div>
        <ProjectList />
      </div>
    </Container>
  )
}
