import type { Metadata } from 'next'

import Article from '@/app/[locale]/components/article'
import { routing } from '@/i18n/routing'
import { getProjectsDetail, getProjectsList } from '@/lib/microcms'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ dk: string }>
}

export const revalidate = 60

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const list = await getProjectsList()
  const contents = list?.contents || []

  // Generate params for each locale and each project slug
  const params: { locale: string; slug: string }[] = []

  for (const locale of routing.locales) {
    for (const project of contents) {
      params.push({
        locale,
        slug: project.id as string,
      })
    }
  }

  return params
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
