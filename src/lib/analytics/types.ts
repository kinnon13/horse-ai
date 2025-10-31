// types.ts (18 lines) - Main analytics types coordinator
export type { SearchAnalytics, NicheInsights, UserAnalytics } from './AnalyticsTypes'

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
