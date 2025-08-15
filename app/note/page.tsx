'use server'

import Container from '@/app/components/container'
import NoteList from '@/app/components/note-list'
import TagList from '@/app/components/tag-list'
import { listContentMeta } from '@/lib/content'

export default async function Page() {
  const items = listContentMeta()

  return (
    <Container type="subpage">
      <h1>Note</h1>
      <p>This is a collection of tech notes. You can find various topics.</p>
      <TagList />
      <NoteList items={items} />
    </Container>
  )
}
