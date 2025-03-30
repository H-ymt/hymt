import { type Category } from '@/lib/microcms'

import styles from './index.module.css'

type Props = {
  category?: Category
}

export default async function Category({ category }: Props) {
  if (!category) {
    return null
  }

  return <span className={styles.category}>{category.name}</span>
}
