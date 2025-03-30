import Image from 'next/image'
import Link from 'next/link'

import Category from '@/app/components/category'
import Container from '@/app/components/container'
import { type Project } from '@/lib/microcms'

import styles from './index.module.css'

type ArticleProps = {
  data: Project
}

export default function ArticleComponent({ data }: ArticleProps) {
  return (
    <Container type="subpage">
      <h1 className={styles.title}>{data.title}</h1>
      {data.category ? (
        <Link href={`/projects/category/${data.category[0].id}`}>
          <Category category={data.category[0]} />
        </Link>
      ) : null}
      {data.thumbnail && (
        <Image
          src={data.thumbnail?.url}
          alt=""
          width={data.thumbnail?.width}
          height={data.thumbnail?.height}
          className={styles.image}
        />
      )}

      <div className={styles.content} dangerouslySetInnerHTML={{ __html: data.content }} />
    </Container>
  )
}
