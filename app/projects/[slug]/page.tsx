import type { Metadata } from 'next'

import Article from '@/app/components/article'
import { getProjectsDetail } from '@/lib/microcms'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ dk: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const searchParams = await props.searchParams
  const params = await props.params
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

export default async function Page(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const data = await getProjectsDetail(params.slug, {
    draftKey: searchParams.dk,
  })

  return (
    <>
      <Article data={data} />
    </>
  )
}
