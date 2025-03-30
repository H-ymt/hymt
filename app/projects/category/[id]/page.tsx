import Container from '@/app/components/container'
import ProjectList from '@/app/components/project-list'
import { getCategoryDetail, getProjectsList } from '@/lib/microcms'

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function Page(props: Props) {
  const params = await props.params
  const { contents: project } = await getProjectsList({
    filters: `category[contains]${params.id}`,
  })

  const category = await getCategoryDetail(params.id)

  return (
    <Container type="subpage">
      <p>{category.name}</p>
      <ProjectList projects={project} />
    </Container>
  )
}
