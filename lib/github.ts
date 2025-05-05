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
  data: {
    viewer: {
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
}

export async function fetchCommitsFromGraphQL(token: string): Promise<Commit[]> {
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

  const json: GraphQLResponse = await res.json()

  const commits: Commit[] = json.data.viewer.repositories.nodes.flatMap(
    (repo) =>
      repo.defaultBranchRef?.target?.history.edges.map(({ node }) => ({
        oid: node.url.split('/').pop() || '',
        messageHeadline: node.messageHeadline,
        committedDate: node.committedDate,
        url: node.url,
        author: node.author,
        repoName: repo.name,
      })) ?? []
  )

  return commits
}
