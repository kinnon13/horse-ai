// UsersDataHelpers.ts - Helper functions for user data operations
import { User } from './UsersTypes'

export function createSampleUser(
  id: string, 
  email: string, 
  phone: string, 
  tier: string, 
  daysAgo: number, 
  horsesClaimed: number, 
  serviceRequests: number, 
  churnRisk: string
): User {
  return {
    id,
    email,
    phone,
    tier,
    last_activity: new Date(Date.now() - 86400000 * daysAgo).toISOString(),
    horses_claimed: horsesClaimed,
    service_requests: serviceRequests,
    churn_risk: churnRisk
  }
}


