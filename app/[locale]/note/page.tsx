'use server'

import { getTranslations } from 'next-intl/server'

import Container from '@/app/[locale]/components/container'
import NoteList from '@/app/[locale]/components/note-list'
import TagList from '@/app/[locale]/components/tag-list'
import { listContentMeta } from '@/lib/content'

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations('Note')

  const locale = params.locale
  const items = listContentMeta(locale)

  return (
    <Container type="subpage">
      <h1>Note</h1>
      <p>{t('lead')}</p>
      <TagList />
      <NoteList items={items} />
    </Container>
  )
}
