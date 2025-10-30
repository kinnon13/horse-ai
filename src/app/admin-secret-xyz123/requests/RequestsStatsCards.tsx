import React from 'react'
import { DispatchStats } from './RequestsTypes'

interface RequestsStatsCardsProps {
  stats: DispatchStats
  loading: boolean
}

export function RequestsStatsCards({ stats, loading }: RequestsStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    { label: 'Total Requests', value: stats.totalRequests },
    { label: 'Open Requests', value: stats.openRequests },
    { label: 'Claimed Requests', value: stats.claimedRequests },
    { label: 'Completed Requests', value: stats.completedRequests },
    { label: 'Total Providers', value: stats.totalProviders },
    { label: 'Verified Providers', value: stats.verifiedProviders },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-4">
          <p className="text-sm font-medium text-gray-500">{card.label}</p>
          <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  )
}



