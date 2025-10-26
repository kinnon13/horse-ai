export interface PaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export class PaginationHelper {
  static createPaginationOptions(
    page: number = 1,
    limit: number = 20,
    sortBy: string = 'created_at',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): PaginationOptions {
    return {
      page: Math.max(1, page),
      limit: Math.min(100, Math.max(1, limit)), // Cap at 100 for performance
      sortBy,
      sortOrder
    }
  }

  static async paginateQuery<T>(
    query: any,
    options: PaginationOptions
  ): Promise<PaginatedResponse<T>> {
    const { page, limit, sortBy, sortOrder } = options
    const offset = (page - 1) * limit

    // Get total count
    const { count } = await query.select('*', { count: 'exact', head: true })

    // Get paginated data
    const { data, error } = await query
      .select('*')
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1)

    if (error) {
      throw new Error(`Pagination error: ${error.message}`)
    }

    const totalPages = Math.ceil(count / limit)

    return {
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  }

  static createCursorPagination(
    cursor?: string,
    limit: number = 20
  ): { cursor?: string; limit: number } {
    return {
      cursor,
      limit: Math.min(100, Math.max(1, limit))
    }
  }

  static async paginateWithCursor<T>(
    query: any,
    cursor?: string,
    limit: number = 20
  ): Promise<{ data: T[]; nextCursor?: string }> {
    const { data, error } = await query
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit + 1) // Get one extra to check if there's more

    if (error) {
      throw new Error(`Cursor pagination error: ${error.message}`)
    }

    const hasMore = data.length > limit
    const items = hasMore ? data.slice(0, -1) : data
    const nextCursor = hasMore ? data[data.length - 1].id : undefined

    return {
      data: items,
      nextCursor
    }
  }
}

// Performance optimization for large datasets
export class PerformanceOptimizer {
  static async batchProcess<T>(
    items: T[],
    batchSize: number = 100,
    processor: (batch: T[]) => Promise<void>
  ): Promise<void> {
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      await processor(batch)
      
      // Add small delay to prevent overwhelming the system
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  static createIndexes() {
    return `
      -- Performance indexes for large datasets
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_horses_user_id_created_at ON horses(user_id, created_at DESC);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_scraped_data_horse_name_created_at ON scraped_data(horse_name, created_at DESC);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_search_analytics_user_id_created_at ON search_analytics(user_id, created_at DESC);
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_export_jobs_user_id_status ON export_jobs(user_id, status);
      
      -- Composite indexes for common queries
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_horses_breed_earnings ON horses(breed, earnings DESC) WHERE earnings > 0;
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_horses_discipline_user_id ON horses(discipline, user_id);
    `
  }
}
