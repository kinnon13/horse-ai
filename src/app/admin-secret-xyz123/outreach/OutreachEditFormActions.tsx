import React from 'react'

interface OutreachEditFormActionsProps {
  onCancel: () => void
}

export function OutreachEditFormActions({ onCancel }: OutreachEditFormActionsProps) {
  return (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
      >
        Update Message
      </button>
    </div>
  )
}




