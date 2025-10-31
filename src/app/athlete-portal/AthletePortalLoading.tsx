// AthletePortalLoading.tsx (15 lines) - Loading state component
'use client'

import React from 'react'

interface AthletePortalLoadingProps {
  loading: boolean
}

export function AthletePortalLoading({ loading }: AthletePortalLoadingProps) {
  if (!loading) return null
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading athlete portal...</p>
      </div>
    </div>
  )
}
