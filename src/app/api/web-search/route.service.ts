import { NextRequest, NextResponse } from 'next/server'
import { WebSearchRequest } from './route.types'
import { checkWebSearchAuth } from './route-auth-handler'
import { performWebSearch } from './route-search-handler'

export class WebSearchApiService {
  static async handlePost(request: NextRequest): Promise<NextResponse> {
    try {
      const { query, user_id }: WebSearchRequest = await request.json()

      if (!query || !user_id) return NextResponse.json({ error: 'Query and user_id are required' }, { status: 400 })

      const authError = await checkWebSearchAuth(user_id)
      if (authError) return authError

      const results = await performWebSearch(query)
      return NextResponse.json({ success: true, results, query })

    } catch (error) {
      console.error('Web search error:', error)
      return NextResponse.json({ error: 'Search failed' }, { status: 500 })
    }
  }
}
