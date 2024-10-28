import ProjectListItem from '@/app/components/project-list-item'
import type { Project } from '@/lib/microcms'

import styles from './index.module.css'

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
    <div className={styles.list}>
      {projects.map((project) => (
        <ProjectListItem key={project.id} project={project} />
      ))}
    </div>
  )
}
