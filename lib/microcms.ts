import type {
  MicroCMSContentId,
  MicroCMSDate,
  MicroCMSImage,
  MicroCMSQueries,
} from 'microcms-js-sdk'
import { createClient } from 'microcms-js-sdk'
import { notFound } from 'next/navigation'

export type Projects = {
  thumbnail?: MicroCMSImage
  title: string
  content: string
  url?: string
  source?: string
  created: string
  category: Category[]
  meta?: Meta
}

export type Category = {
  id: string
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

export type Project = Projects & Meta & MicroCMSContentId & MicroCMSDate

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

export const getProjectsList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Projects>({
      endpoint: 'works',
      queries,
    })
    .catch(notFound)

  return listData
}

export const getProjectsDetail = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client.getListDetail<Projects>({
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
