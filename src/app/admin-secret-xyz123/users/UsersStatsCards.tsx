import React from 'react'
import { UserStats } from './UsersTypes'

interface UsersStatsCardsProps {
  stats: UserStats
}

export function UsersStatsCards({ stats }: UsersStatsCardsProps) {
  const statCards = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Active Users', value: stats.activeUsers },
    { label: 'Paying Users', value: stats.payingUsers },
    { label: 'Churn Risk Users', value: stats.churnRiskUsers },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">{card.label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}




