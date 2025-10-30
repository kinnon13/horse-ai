import React from 'react'

interface OutreachHeaderProps {
  onCompose: () => void
}

export function OutreachHeader({ onCompose }: OutreachHeaderProps) {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Outreach Management</h1>
            <p className="text-gray-600">Manage outreach messages and campaigns</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onCompose}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Compose Message
            </button>
            <a
              href="/admin-secret-xyz123"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}



