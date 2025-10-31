// route.ts (30 lines) - Single responsibility: HTTP handler
import { NextRequest, NextResponse } from 'next/server'
import { WebSearchService } from './WebSearchService'
import { WebSearchRequest } from './route.types'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { query, user_id }: WebSearchRequest = await request.json()

    if (!query || !user_id) {
      return NextResponse.json({ error: 'Query and user_id are required' }, { status: 400 })
    }

    const results = await WebSearchService.performSearch(query, user_id)

    return NextResponse.json({ 
      success: true, 
      results,
      query 
    })

  } catch (error) {
    console.error('Web search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}