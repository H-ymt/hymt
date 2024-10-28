import Image from 'next/image'
import Link from 'next/link'

import type { Project } from '@/lib/microcms'

import styles from './index.module.css'

type ProjectListItemProps = {
  project: Project
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <Link className={styles.item} href={`/project/${project.id}`}>
      {project.thumbnail ? (
        <div className={styles.imageWrapper}>
          <Image
            src={`${project.thumbnail.url}?w=1200&h=900&format=webp`}
            alt=""
            width={project.thumbnail.width}
            height={project.thumbnail.height}
            className={styles.image}
          />
        </div>
      ) : (
        <p>No image</p>
      )}
      <h2 className={styles.title}>{project.title}</h2>
    </Link>
  )
}
