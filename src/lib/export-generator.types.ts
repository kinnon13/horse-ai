export interface ExportFilters {
  dateRange?: { start: string; end: string }
  breed?: string
  discipline?: string
  minEarnings?: number
  maxEarnings?: number
  includeScrapedData?: boolean
  includeLinkedEntities?: boolean
}

export interface ExportData {
  horses: any[]
  events: any[]
  scrapedData: any[]
  linkedEntities: any[]
  searchAnalytics: any[]
}

