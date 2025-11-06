// paginationHelper.ts - Universal pagination utility
export interface PaginationParams {
  page?: number
  limit?: number
}

export function getPagination(page: number = 1, limit: number = 50) {
  const from = (page - 1) * limit
  const to = from + limit - 1
  
  return { from, to, limit }
}

export function paginateQuery(query: any, params: PaginationParams = {}) {
  const { page = 1, limit = 50 } = params
  const { from, to } = getPagination(page, Math.min(limit, 100)) // Max 100 per page
  
  return query.range(from, to)
}

