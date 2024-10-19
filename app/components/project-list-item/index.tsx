import Link from 'next/link'

import type { Project } from '@/lib/microcms'

type ProjectListItemProps = {
  project: Project
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <Link href={`/project/${project.id}`}>
      <h3>{project.title}</h3>
    </Link>
  )
}
