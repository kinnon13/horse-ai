import { User, UserStats } from './UsersTypes'

export function getInitialUsers(): User[] {
  return [
    {
      id: '1',
      email: 'sarah@example.com',
      phone: '+1234567890',
      tier: 'plus',
      last_activity: new Date().toISOString(),
      horses_claimed: 3,
      service_requests: 5,
      churn_risk: 'low'
    },
    {
      id: '2',
      email: 'mike@example.com',
      phone: '+1234567891',
      tier: 'free',
      last_activity: new Date(Date.now() - 86400000 * 14).toISOString(),
      horses_claimed: 1,
      service_requests: 0,
      churn_risk: 'high'
    },
    {
      id: '3',
      email: 'jessica@example.com',
      phone: '+1234567892',
      tier: 'basic',
      last_activity: new Date(Date.now() - 86400000 * 3).toISOString(),
      horses_claimed: 2,
      service_requests: 2,
      churn_risk: 'medium'
    }
  ]
}

export function calculateUserStats(users: User[]): UserStats {
  const totalUsers = users.length
  const activeUsers = users.filter(u => new Date(u.last_activity) > new Date(Date.now() - 86400000 * 7)).length
  const payingUsers = users.filter(u => u.tier !== 'free').length
  const churnRiskUsers = users.filter(u => u.churn_risk === 'high').length

  return {
    totalUsers,
    activeUsers,
    payingUsers,
    churnRiskUsers
  }
}

