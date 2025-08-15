import Container from '@/app/components/container'
import NoteList from '@/app/components/note-list'
import TagList from '@/app/components/tag-list'
import { listContentMeta } from '@/lib/content'

export default function TagIndexPage() {
  const meta = listContentMeta()
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
