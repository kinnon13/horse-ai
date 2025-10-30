'use client'

import React from 'react'
import { useProviders } from '@/hooks/useProviders'
import { useAuth } from '@/components/AuthProvider'
import { ProvidersStatsCards } from './ProvidersStatsCards'
import { ProvidersList } from './ProvidersList'
import { useProvidersState } from './useProvidersState'
import { useProvidersHandlers } from './useProvidersHandlers'

export function ProvidersPageContent() {
  const { user } = useAuth()
  const { providers, loading, error, createProvider, updateProvider } = useProviders()
  const { showAddForm, setShowAddForm, editingProvider, setEditingProvider } = useProvidersState()
  const { handleCreateProvider, handleUpdateProvider, handleToggleBlocked, handleToggleVerified } = useProvidersHandlers(
    createProvider, updateProvider, setShowAddForm, setEditingProvider
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Providers</h1>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Provider
          </button>
        </div>
        
        <ProvidersStatsCards providers={providers} loading={loading} />
        
        <ProvidersList 
          providers={providers} 
          loading={loading} 
          onEdit={setEditingProvider}
          onToggleBlocked={handleToggleBlocked}
          onToggleVerified={handleToggleVerified}
        />
      </div>
    </div>
  )
}
