'use client'

import React from 'react'
import HorseProfileSection from './HorseProfileSection'
import HorseLineageSection from './HorseLineageSection'
import HorsePerformanceSection from './HorsePerformanceSection'
import { useHorsePortalData } from './useHorsePortalData'
import { useHorseHandlers } from './useHorseHandlers'

export default function HorsePortal() {
  const { owner, horses, loadingProfile, setHorses } = useHorsePortalData()
  const handlers = useHorseHandlers(owner, setHorses)

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading horse portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Horse Portal</h1>
          <p className="text-gray-600 mt-2">Manage your horses, track their health, performance, and lineage.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <HorseProfileSection horses={horses} loading={loadingProfile} onAddHorse={handlers.handleAddHorse} onEditHorse={handlers.handleEditHorse} onDeleteHorse={handlers.handleDeleteHorse} />
            <HorseLineageSection horses={horses} loading={loadingProfile} />
          </div>
          <div className="space-y-8">
            <HorsePerformanceSection horses={horses} loading={loadingProfile} />
          </div>
        </div>
      </div>
    </div>
  )
}