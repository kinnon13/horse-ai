'use client'

import React from 'react'
import StallionProfileSection from './StallionProfileSection'
import StallionBreedingManagerSection from './StallionBreedingManagerSection'
import StallionPerformanceTrackerSection from './StallionPerformanceTrackerSection'
import { useStallionData } from './useStallionData'
import { useStallionHandlers } from './useStallionHandlers'

export default function StallionPortal() {
  const { station, stallions, loadingProfile, setStallions } = useStallionData()
  const handlers = useStallionHandlers(station, setStallions)

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading stallion portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stallion Portal</h1>
          <p className="text-gray-600 mt-2">Manage your stallion station, breeding services, and performance tracking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <StallionProfileSection />
            <StallionBreedingManagerSection stallions={stallions} loading={loadingProfile} onAddStallion={handlers.handleAddStallion} onEditStallion={handlers.handleEditStallion} onDeleteStallion={handlers.handleDeleteStallion} />
          </div>
          <div className="space-y-8">
            <StallionPerformanceTrackerSection />
          </div>
        </div>
      </div>
    </div>
  )
}