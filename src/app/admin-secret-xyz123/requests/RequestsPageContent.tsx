'use client'

import React, { useEffect } from 'react'
import { useServiceRequests } from '@/hooks/useServiceRequests'
import { useAuth } from '@/components/AuthProvider'
import { RequestsStatsCards } from './RequestsStatsCards'
import { RequestsFilter } from './RequestsFilter'
import { RequestsList } from './RequestsList'
import { useRequestsState } from './useRequestsState'
import { useRequestsHandlers } from './useRequestsHandlers'

export function RequestsPageContent() {
  const { user } = useAuth()
  const { serviceRequests, loading, error, updateServiceRequest } = useServiceRequests()
  const { filter, setFilter, dispatchStats, setDispatchStats, loadingStats, setLoadingStats } = useRequestsState()
  const { fetchDispatchStats, handleUpdateStatus } = useRequestsHandlers(updateServiceRequest, setDispatchStats, setLoadingStats)

  useEffect(() => {
    fetchDispatchStats()
  }, [])

  const filteredRequests = serviceRequests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Service Requests</h1>
        
        <RequestsStatsCards stats={dispatchStats} loading={loadingStats} />
        
        <RequestsFilter filter={filter} setFilter={setFilter} />
        
        <RequestsList 
          requests={filteredRequests} 
          loading={loading} 
          onUpdateStatus={handleUpdateStatus}
        />
      </div>
    </div>
  )
}
