// SocialPageStates.tsx (20 lines) - Loading and error states
'use client'

import React from 'react'

interface SocialPageLoadingProps {
  loading: boolean
}

export function SocialPageLoading({ loading }: SocialPageLoadingProps) {
  if (!loading) return null
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading social...</p>
      </div>
    </div>
  )
}

interface SocialPageErrorProps {
  error: string | null
  setError: (error: string | null) => void
}

export function SocialPageError({ error, setError }: SocialPageErrorProps) {
  if (!error) return null
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
