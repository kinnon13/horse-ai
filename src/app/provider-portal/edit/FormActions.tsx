'use client'

import React from 'react'

interface FormActionsProps {
  saving: boolean
}

export function FormActions({ saving }: FormActionsProps) {
  return (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={() => window.location.href = '/provider-portal'}
        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  )
}

