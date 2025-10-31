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




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function User(_props?: any): never { throw new Error("Stubbed component used: ./UsersTypes.User"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function UserStats(_props?: any): never { throw new Error("Stubbed component used: ./UsersTypes.UserStats"); }

