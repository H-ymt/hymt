// app/gists/page.tsx
import Link from 'next/link'
import React from 'react'

import Container from '@/app/components/container'

import styles from './index.module.css'

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

const GistsPage = async () => {
  const gists = await fetchGists()

  return (
    <Container type="subpage">
      <h1>Gist List</h1>
      <ul className={styles.list}>
        {gists.map((gist) => (
          <li key={gist.id}>
            <Link
              className={styles.link}
              href={gist.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.date}>{gist.created_at}</span>
              {gist.description || Object.keys(gist.files)[0]}
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  )
}

export default GistsPage
