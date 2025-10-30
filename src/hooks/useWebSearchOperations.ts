interface WebSearchResult {
  abstract?: string
  abstractText?: string
  abstractSource?: string
  abstractURL?: string
  answer?: string
  answerType?: string
  definition?: string
  definitionSource?: string
  definitionURL?: string
  relatedTopics?: Array<{
    FirstURL: string
    Text: string
  }>
  results?: Array<{
    FirstURL: string
    Text: string
  }>
}

interface WebSearchResponse {
  success: boolean
  results: WebSearchResult
  query: string
  error?: string
  upgradeRequired?: boolean
}

export async function performWebSearch(query: string, userId: string): Promise<WebSearchResponse | null> {
  try {
    const response = await fetch('/api/web-search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        user_id: userId
      })
    })

    const data = await response.json()

    if (!response.ok) {
      return data
    }

    return data
  } catch (err) {
    return { success: false, error: 'Network error during search', query, results: { results: [] } }
  }
}

