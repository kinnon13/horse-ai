'use client'

import React from 'react'

interface ChatStatusBannerProps {
  isLoading: boolean
  error: string | null
}

export function ChatStatusBanner({ isLoading, error }: ChatStatusBannerProps) {
  if (isLoading) {
    return (
      <div className="flex justify-start">
        <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
          <p className="text-sm">Thinking...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return null
}


