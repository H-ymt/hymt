import parse from 'html-react-parser'
import Image from 'next/image'

import Container from '@/app/components/container'
import { formatRichText } from '@/app/lib/utils'
import type { Project } from '@/lib/microcms'

type ArticleProps = {
  data: Project
}

export default function ArticleComponent({ data }: ArticleProps) {
  return (
    <Container>
      <h1>{data.title}</h1>
      {data.thumbnail && (
        <Image
          src={data.thumbnail?.url}
          alt=""
          width={data.thumbnail?.width}
          height={data.thumbnail?.height}
          className=""
        />
      )}

      <div>{parse(formatRichText(data.content))}</div>
    </Container>
  )
}
