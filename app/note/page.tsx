import Link from 'next/link'
import React from 'react'

import Container from '@/app/components/container'
import ConvertDate from '@/lib/convert-date'

import styles from './page.module.css'

type Gist = {
  id: string
  html_url: string
  description: string | null
  created_at: string
  files: Record<string, { filename: string }>
}

async function fetchGists(): Promise<Gist[]> {
  const response = await fetch('https://api.github.com/users/H-ymt/gists', {
    // cache: 'no-store', // SSR
    headers: {
      Authorization: `token ${process.env.GITHUB_ACCESS_TOKEN}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch Gists')
  }

  return response.json()
}

export default async function GistsPage() {
  const gists = await fetchGists()

  return (
    <Container type="subpage">
      <h1 className={styles.title}>Gist List</h1>
      <ul className={styles.list}>
        {gists.map((gist) => (
          <li key={gist.id}>
            <Link className={styles.link} href={gist.html_url} target="_blank" rel="noopener noreferrer">
              {gist.description || Object.keys(gist.files)[0]}
              <span className={styles.date}>
                <ConvertDate convertDate={gist.created_at} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}
