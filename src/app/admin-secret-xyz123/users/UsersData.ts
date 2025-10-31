import { User, UserStats } from './UsersTypes'
import { createSampleUser } from './UsersDataHelpers'

export function getInitialUsers(): User[] {
  return [
    createSampleUser('1', 'sarah@example.com', '+1234567890', 'plus', 0, 3, 5, 'low'),
    createSampleUser('2', 'mike@example.com', '+1234567891', 'free', 14, 1, 0, 'high'),
    createSampleUser('3', 'jessica@example.com', '+1234567892', 'basic', 3, 2, 2, 'medium')
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

