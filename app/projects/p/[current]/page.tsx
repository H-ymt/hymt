import ProjectList from '@/app/components/project-list'
import { getProjectsList } from '@/lib/microcms'

type Props = {
  params: {
    current: string
  }
}

export default async function Page({ params }: Props) {
  const current = Number.parseInt(params.current as string, 10)
  const data = await getProjectsList({
    limit: 10,
  })

  return (
    <>
      <ProjectList projects={data.contents} />
    </>
  )
}
