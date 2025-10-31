// OutreachPageHeader.tsx (25 lines) - Single responsibility: Page header
'use client'

import React from 'react'

interface OutreachPageHeaderProps {
  onCompose: () => void
}

export function OutreachPageHeader({ onCompose }: OutreachPageHeaderProps) {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Outreach Management</h1>
          <button
            onClick={onCompose}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Compose Message
          </button>
        </div>
      </div>
    </div>
  )
}
