// AnalyticsTypes.ts (30 lines) - Core analytics types
export interface SearchAnalytics {
  query: string
  niche: string
  resultsCount: number
  timestamp: Date
  userId: string
}

export interface NicheInsights {
  niche: string
  trendingSearches: string[]
  popularHorses: string[]
  topOwners: string[]
  topRiders: string[]
  earningsTrends: {
    year: number
    total: number
    average: number
  }[]
  breedingInsights: {
    topSires: string[]
    topDams: string[]
    successfulCrosses: string[]
  }
}

export interface UserAnalytics {
  userId: string
  totalSearches: number
  favoriteNiches: string[]
  searchHistory: string[]
  engagementScore: number
}

