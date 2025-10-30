import React from 'react'
import { Provider } from './ProvidersTypes'

interface ProvidersStatsCardsProps {
  providers: Provider[]
  loading: boolean
}

export function ProvidersStatsCards({ providers, loading }: ProvidersStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const totalProviders = providers.length
  const verifiedProviders = providers.filter(p => p.is_verified).length
  const blockedProviders = providers.filter(p => p.is_blocked).length
  const avgRating = providers.length > 0 ? 
    providers.reduce((sum, p) => sum + (p.rating_safe + p.rating_reliable) / 2, 0) / providers.length : 0

  const statCards = [
    { label: 'Total Providers', value: totalProviders },
    { label: 'Verified Providers', value: verifiedProviders },
    { label: 'Blocked Providers', value: blockedProviders },
    { label: 'Avg Rating', value: avgRating.toFixed(1) },
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



