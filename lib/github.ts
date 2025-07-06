export type Commit = {
  oid: string
  messageHeadline: string
  committedDate: string
  url: string
  author: {
    name: string
  } | null
  repoName: string
}

type GraphQLResponse = {
  data?: {
    viewer?: {
      repositories: {
        nodes: {
          name: string
          defaultBranchRef: {
            target: {
              history: {
                edges: {
                  node: {
                    messageHeadline: string
                    committedDate: string
                    url: string
                    author: {
                      name: string
                    } | null
                  }
                }[]
              }
            }
          } | null
        }[]
      }
    }
  }
  errors?: Array<{
    message: string
    locations?: Array<{
      line: number
      column: number
    }>
    path?: string[]
  }>
}

export async function fetchCommitsFromGraphQL(token: string): Promise<Commit[]> {
  if (!token) {
    throw new Error('GitHub token is required')
  }

  const query = `
    query {
      viewer {
        repositories(first: 30, orderBy: {field: UPDATED_AT, direction: DESC}) {
          nodes {
            name
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: 3) {
                    edges {
                      node {
                        messageHeadline
                        committedDate
                        url
                        author {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
    next: { revalidate: 60 * 30 },
  })

  if (!res.ok) {
    throw new Error(`GitHub API request failed: ${res.status} ${res.statusText}`)
  }

  const json: GraphQLResponse = await res.json()

  if (json.errors) {
    console.error('GitHub GraphQL errors:', json.errors)
    throw new Error(`GitHub GraphQL errors: ${json.errors.map((e) => e.message).join(', ')}`)
  }

  if (!json.data || !json.data.viewer) {
    console.error('Invalid response structure:', json)
    throw new Error('Invalid response structure: missing data.viewer')
  }

  if (!json.data.viewer.repositories || !json.data.viewer.repositories.nodes) {
    console.error('Invalid response structure: missing repositories.nodes')
    return []
  }

  const commits: Commit[] = json.data.viewer.repositories.nodes.flatMap(
    (repo) =>
      repo.defaultBranchRef?.target?.history.edges.map(({ node }) => ({
        oid: (() => {
          try {
            const url = new URL(node.url)
            const segments = url.pathname.split('/')
            return segments.pop() || ''
          } catch {
            return ''
          }
        })(),
        messageHeadline: node.messageHeadline,
        committedDate: node.committedDate,
        url: node.url,
        author: node.author,
        repoName: repo.name,
      })) ?? []
  )

  return commits
}
