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

export interface SystemAnalytics {
  totalUsers: number
  totalSearches: number
  popularNiches: string[]
  systemHealth: {
    uptime: number
    responseTime: number
    errorRate: number
  }
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function SearchAnalytics(_props?: any): never { throw new Error("Stubbed component used: ./types.SearchAnalytics"); }
