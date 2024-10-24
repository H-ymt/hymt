import type {
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSImage,
  MicroCMSQueries,
} from 'microcms-js-sdk'
import { createClient } from 'microcms-js-sdk'
import { notFound } from 'next/navigation'

export type Works = {
  thumbnail?: MicroCMSImage
  title: string
  content: string
  url: string
  source: string
  created: string
  category: Category[]
  meta: Meta
}

export type Category = {
  id: string
  createdAt: string
  updateAt: string
  publishedAt: string
  revisedAt: string
  name: string
} & MicroCMSContentId &
  MicroCMSDate

export type Meta = {
  title?: string
  description?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: MicroCMSImage
}

export type Project = Works & Meta & MicroCMSContentId & MicroCMSDate

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOAMIN is required')
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required')
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
})

export const getWorksList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Works>({
      endpoint: 'works',
      queries,
    })
    .catch(notFound)

  return listData
}

export const getWorksDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Works>({
    endpoint: 'works',
    contentId,
    queries,
  })

  return detailData
}

export const getCategoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Category>({
      endpoint: 'categories',
      queries,
    })
    .catch(notFound)

  return listData
}

export const getCategoryDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Category>({
      endpoint: 'categories',
      contentId,
      queries,
    })
    .catch(notFound)

  return detailData
}

export const getMeta = async (queries?: MicroCMSQueries) => {
  const data = await client
    .getObject<Meta>({
      endpoint: 'meta',
      queries,
    })
    .catch(() => null)

  return data
}
