export { getCurrentMetrics } from './valuationTracker.helpers'

interface ValuationGoal {
  month: number
  targetUsers: number
  targetRevenue: number
  targetValuation: number
}

export const VALUATION_PATH: ValuationGoal[] = [
  { month: 1, targetUsers: 10000, targetRevenue: 200000, targetValuation: 50000000 },
  { month: 2, targetUsers: 25000, targetRevenue: 500000, targetValuation: 100000000 },
  { month: 3, targetUsers: 50000, targetRevenue: 1000000, targetValuation: 200000000 },
  { month: 4, targetUsers: 75000, targetRevenue: 1500000, targetValuation: 300000000 },
  { month: 5, targetUsers: 100000, targetRevenue: 2000000, targetValuation: 400000000 },
  { month: 6, targetUsers: 150000, targetRevenue: 3000000, targetValuation: 600000000 },
  { month: 7, targetUsers: 175000, targetRevenue: 3500000, targetValuation: 800000000 },
  { month: 8, targetUsers: 200000, targetRevenue: 4000000, targetValuation: 1000000000 }
]

export function getRedLights(current: any, target: ValuationGoal) {
  const redLights = []
  if (current.totalUsers < target.targetUsers) {
    const deficit = target.targetUsers - current.totalUsers
    const daysLeft = 30 - new Date().getDate()
    const dailyNeeded = Math.ceil(deficit / daysLeft)
    redLights.push({
      metric: 'Users',
      status: 'RED',
      current: current.totalUsers,
      target: target.targetUsers,
      deficit,
      solution: `Need ${dailyNeeded} signups/day. Email ${dailyNeeded * 5} leads/day.`
    })
  }
  if (current.monthlyRevenue < target.targetRevenue) {
    const deficit = target.targetRevenue - current.monthlyRevenue
    const neededConversions = Math.ceil(deficit / 20)
    redLights.push({
      metric: 'Revenue',
      status: 'RED',
      current: current.monthlyRevenue,
      target: target.targetRevenue,
      deficit,
      solution: `Need ${neededConversions} more paid users.`
    })
  }
  return redLights
}

