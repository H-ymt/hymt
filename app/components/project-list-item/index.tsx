import Image from 'next/image'
import Link from 'next/link'

import { LinkOutIcon } from '@/app/components/icons'
import type { Project } from '@/lib/microcms'

import styles from './index.module.css'

type ProjectListItemProps = {
  project: Project
}

export default function ProjectListItem({ project }: ProjectListItemProps) {
  return (
    <div className={styles.container}>
      <Link className={styles.item} href={`/projects/${project.id}`}>
        <div className={styles.imageWrapper}>
          <Image
            src={`${project.thumbnail?.url}?w=1200&h=900&format=webp`}
            alt=""
            width={project.thumbnail?.width}
            height={project.thumbnail?.height}
            className={styles.image}
          />
          <div className={styles.meta}>
            <div className={styles.categories}>
              <span>Tag:</span>
              <span>{project.category.map((item) => item.name).join(', ')}</span>
            </div>
            <h2 className={styles.title}>{project.title}</h2>
          </div>
        </div>
      </Link>

      {project.url ? (
        <Link href={project.url} target="_blank" className={styles.link}>
          <LinkOutIcon aria-label="Webサイトをみる" className={styles.linkIcon} />
        </Link>
      ) : null}
    </div>
  )
}
