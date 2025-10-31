'use client'

import React from 'react'
import { SocialPageLoading } from './SocialPageStates'
import { SocialPageError } from './SocialPageStates'

interface socialPageViewProps {
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
}

export default function socialPageView({ loading, error, setError }: socialPageViewProps) {
  if (loading) return <SocialPageLoading loading={loading} />
  if (error) return <SocialPageError error={error} setError={setError} />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Social</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Social</h2>
          <p className="text-gray-600">This is a placeholder page for social.</p>
        </div>
      </div>
    </div>
  )
}