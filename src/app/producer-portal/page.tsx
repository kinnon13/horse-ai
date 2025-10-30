'use client'

import React from 'react'
import { useProducerData } from './useProducerData'
import { ProducerProfileSection } from './ProducerProfileSection'
import { ProducerHorsesSection } from './ProducerHorsesSection'
import { ProducerEventsSection } from './ProducerEventsSection'
import { ProducerStatsSection } from './ProducerStatsSection'

export default function ProducerPortal() {
  const { profile, horses, events, loading } = useProducerData()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading producer portal...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producer Portal</h1>
          <p className="text-gray-600 mb-8">Please complete your producer profile setup first.</p>
          <a href="/producer-portal/setup" className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700">
            Complete Setup
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{profile.business_name}</h1>
          <p className="text-gray-600">Producer Portal Dashboard</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProducerProfileSection profile={profile} />
            <ProducerHorsesSection horses={horses} />
            <ProducerEventsSection events={events} />
          </div>
          
          <div className="lg:col-span-1">
            <ProducerStatsSection profile={profile} horses={horses} events={events} />
          </div>
        </div>
      </div>
    </div>
  )
}