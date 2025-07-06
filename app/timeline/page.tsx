import 'dayjs/locale/en'

import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

import Container from '@/app/components/container'
import type { Commit } from '@/lib/github'
import { fetchCommitsFromGraphQL } from '@/lib/github'

import styles from './page.module.css'

dayjs.extend(localizedFormat)
dayjs.locale('ja')

type GroupedCommits = Record<string, Commit[]>

function groupCommitsByMonth(commits: Commit[]): GroupedCommits {
  return commits.reduce((acc: GroupedCommits, commit) => {
    const month = dayjs(commit.committedDate).format('YYYY年 M月')
    if (!acc[month]) {
      acc[month] = []
    }
    acc[month].push(commit)
    return acc
  }, {})
}

export default async function CommitsPage() {
  const token = process.env.GITHUB_TOKEN
  if (!token) throw new Error('GITHUB_TOKEN is missing in .env.local')

  let commits: Commit[] = []

  try {
    commits = await fetchCommitsFromGraphQL(token)
  } catch (error) {
    console.error('Failed to fetch commits:', error)
    commits = []
  }

  const sortedCommits = commits.sort(
    (a, b) => new Date(b.committedDate).getTime() - new Date(a.committedDate).getTime()
  )

  const grouped = groupCommitsByMonth(sortedCommits)

  return (
    <Container type="subpage" className={styles.container}>
      <h1>Timeline</h1>
      <p>Here is a timeline of commits made to this repository, organized by month.</p>
      <div className={styles.timeline}>
        {commits.length === 0 ? (
          <p>No commits found. Please check your GitHub token and permissions.</p>
        ) : (
          Object.entries(grouped).map(([month, monthCommits]) => (
            <div key={month} className={styles.timelineGroup}>
              <h2 className={styles.month}>{month}</h2>
              {monthCommits.map((commit) => (
                <div key={commit.url} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <a href={commit.url} target="_blank" rel="noopener noreferrer" className={styles.commitMessage}>
                      {commit.messageHeadline}
                    </a>
                    <div className={styles.commitInfo}>
                      <span className="">
                        <a
                          href={`https://github.com/H-ymt/${commit.repoName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.repo}
                        >
                          {commit.repoName}
                        </a>
                      </span>
                      <time dateTime={commit.committedDate} className={styles.commitDate}>
                        {dayjs(commit.committedDate).format('MMM D')}
                      </time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </Container>
  )
}
