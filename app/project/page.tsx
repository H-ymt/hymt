import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'

export default function Page() {
  return (
    <Container type="subpage">
      <h1>Project</h1>
      <div>
        <ProjectList />
      </div>
    </Container>
  )
}
