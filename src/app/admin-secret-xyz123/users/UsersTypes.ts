export interface User {
  id: string
  email: string
  phone: string
  tier: string
  last_activity: string
  horses_claimed: number
  service_requests: number
  churn_risk: string
}

export interface UserStats {
  totalUsers: number
  activeUsers: number
  payingUsers: number
  churnRiskUsers: number
}

