export type ZennArticle = {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports, @typescript-eslint/no-explicit-any
  map(arg0: (post: any) => import('react').JSX.Element): import('react').ReactNode
  id: number
  path: string
  liked_count: number
  emoji: string
  title: string
  published_at: string
}

export const getZennArticles = async () => {
  const res = await fetch('https://zenn.dev/api/articles?username=h_ymt&order=latest', {})
  const data = await res.json()

  return data
}

export type ZennScraps = {
  id: number
  path: string
  emoji: string
  title: string
  created_at: string
  last_comment_created_at: string
  topics: {
    id: number
    name: string
    image_url: string
  }[]
}

export const getZennScraps = async (): Promise<ZennScraps[]> => {
  const res = await fetch(
    'https://zenn.dev/api/scraps?username=h_ymt&count=100&order=last_comment_created_at'
  )
  const data = await res.json()

  return data.scraps ? data.scraps : data
}
