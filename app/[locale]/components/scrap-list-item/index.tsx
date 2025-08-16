import Link from 'next/link'

import type { ZennScraps } from '@/lib/zenn'

import styles from './index.module.css'

type ScrapListItemProps = {
  scrap: ZennScraps
}

export default function ScrapListItem({ scrap }: ScrapListItemProps) {
  return (
    <>
      <Link
        key={scrap.id}
        href={`https://zenn.dev/${scrap.path}`}
        className={styles.item}
        target="_blank"
      >
        <h2 className={styles.title}>{scrap.title}</h2>
        {Array.isArray(scrap.topics) && (
          <div className={styles.topics}>
            {scrap.topics.map((topic) => (
              <span key={topic.id} className={styles.topic}>
                {topic.name}
              </span>
            ))}
          </div>
        )}
      </Link>
    </>
  )
}
