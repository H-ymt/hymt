import ScrapListItem from '@/app/components/scrap-list-item'
import type { ZennScraps } from '@/lib/zenn'

import styles from './index.module.css'

type ScrapListProps = {
  scraps: ZennScraps[]
}

export default async function ScrapList({ scraps }: ScrapListProps) {
  if (!scraps) {
    return null
  }

  return (
    <div className={styles.list}>
      {scraps.map((scrap) => (
        <ScrapListItem key={scrap.id} scrap={scrap} />
      ))}
    </div>
  )
}
