'use client'

import React from 'react'
import { UploadPageLoading } from './UploadPageStates'
import { UploadPageError } from './UploadPageStates'

interface uploadPageViewProps {
  loading: boolean
  error: string | null
  setError: (error: string | null) => void
}

export default function uploadPageView({ loading, error, setError }: uploadPageViewProps) {
  if (loading) return <UploadPageLoading loading={loading} />
  if (error) return <UploadPageError error={error} setError={setError} />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome to Upload</h2>
          <p className="text-gray-600">This is a placeholder page for upload.</p>
        </div>
      </div>
    </div>
  )
}