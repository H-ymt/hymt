import ProjectListItem from '@/app/components/project-list-item'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { Project } from '@/lib/microcms'

type ProjectListProps = {
  projects?: Project[]
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (!projects) {
    return null
  }

  if (projects.length === 0) {
    return <p>準備中です</p>
  }

  return (
    <div>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  )
}
