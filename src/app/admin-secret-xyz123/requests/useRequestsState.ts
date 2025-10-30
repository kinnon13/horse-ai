import { useState } from 'react'
import { DispatchStats } from './RequestsTypes'

export function useRequestsState() {
  const [filter, setFilter] = useState<'all' | 'open' | 'claimed' | 'completed'>('all')
  const [dispatchStats, setDispatchStats] = useState<DispatchStats>({
    totalRequests: 0,
    openRequests: 0,
    claimedRequests: 0,
    completedRequests: 0,
    totalProviders: 0,
    verifiedProviders: 0
  })
  const [loadingStats, setLoadingStats] = useState(true)

  return {
    filter,
    setFilter,
    dispatchStats,
    setDispatchStats,
    loadingStats,
    setLoadingStats
  }
}



