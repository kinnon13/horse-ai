'use client'

import React from 'react'
import AthleteProfileSection from './AthleteProfileSection'
import AthleteHorseManagerSection from './AthleteHorseManagerSection'
import AthleteEventTrackerSection from './AthleteEventTrackerSection'
import AthletePerformanceAnalyticsSection from './AthletePerformanceAnalyticsSection'
import CompetitionHorseFormModal from './CompetitionHorseFormModal'
import { useAthleteData } from './useAthleteData'
import { useAthleteHandlers } from './useAthleteHandlers'

export default function AthletePortal() {
  const { athlete, horses, events, loadingProfile, setHorses, setEvents } = useAthleteData()
  const handlers = useAthleteHandlers(athlete, setHorses, setEvents)

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading athlete portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Athlete Portal</h1>
          <p className="text-gray-600 mt-2">Manage your competition horses, events, and performance tracking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <AthleteProfileSection athlete={athlete} loading={loadingProfile} onEdit={() => {}} />
            <AthleteHorseManagerSection horses={horses} loading={loadingProfile} onAddHorse={handlers.handleAddHorse} onEditHorse={handlers.handleEditHorse} onDeleteHorse={handlers.handleDeleteHorse} />
            <AthleteEventTrackerSection events={events} horses={horses} loading={loadingProfile} onAddEvent={handlers.handleAddEvent} onEditEvent={handlers.handleEditEvent} onDeleteEvent={handlers.handleDeleteEvent} />
          </div>
          <div className="space-y-8">
            <AthletePerformanceAnalyticsSection horses={horses} events={events} loading={loadingProfile} />
          </div>
        </div>
      </div>

      {handlers.showHorseForm && (
        <CompetitionHorseFormModal horse={handlers.editingHorse} onSave={handlers.handleHorseSubmit} onClose={() => { handlers.setShowHorseForm(false); handlers.setEditingHorse(null) }} />
      )}
    </div>
  )
}