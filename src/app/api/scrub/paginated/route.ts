// API route - exempt from single-task audit
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { PaginationHelper } from '@/lib/pagination'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const options = PaginationHelper.createPaginationOptions(page, limit, sortBy, sortOrder)
    
    const query = supabase
      .from('scraped_data')
      .select('*')
      .eq('user_id', userId)

    const result = await PaginationHelper.paginateQuery(query, options)

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    })

  } catch (error) {
    console.error('Paginated scrub data error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch paginated scrub data'
    }, { status: 500 })
  }
}
