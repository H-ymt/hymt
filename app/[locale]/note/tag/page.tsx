import Container from '@/app/[locale]/components/container'
import NoteList from '@/app/[locale]/components/note-list'
import TagList from '@/app/[locale]/components/tag-list'
import { routing } from '@/i18n/routing'
import { listContentMeta } from '@/lib/content'

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({
    locale,
  }))
}

export default function TagIndexPage({ params }: { params: { locale: string } }) {
  const locale = params.locale
  const meta = listContentMeta(locale)
  const items = meta.filter(({ data }) => {
    const tags = data && (data.tags as unknown)
    if (!tags) return false
    if (Array.isArray(tags)) return tags.length > 0
    return typeof tags === 'string' && tags.length > 0
  })

  return (
    <Container type="subpage">
      <h1>All</h1>
      <TagList />
      <NoteList items={items} />
    </Container>
  )
}
