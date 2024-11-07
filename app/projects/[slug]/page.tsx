import type { Metadata } from 'next'

import Article from '@/app/components/article'
import { getProjectsDetail } from '@/lib/microcms'

type Props = {
  params: {
    slug: string
  }
  searchParams: {
    dk: string
  }
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const data = await getProjectsDetail(params.slug, {
    draftKey: searchParams.dk,
  })

  return {
    title: data.meta?.title,
    description: data.meta?.description,
    twitter: {
      title: data.meta?.title,
      description: data.meta?.description,
    },
  }
}

export default async function Page({ params, searchParams }: Props) {
  const data = await getProjectsDetail(params.slug, {
    draftKey: searchParams.dk,
  })

  return (
    <>
      <Article data={data} />
    </>
  )
}
