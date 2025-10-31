import React from 'react'
import { ComposeData } from './OutreachData'

interface OutreachFormTextareaProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export function OutreachFormTextarea({
  composeData,
  setComposeData
}: OutreachFormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Content *</label>
      <textarea
        value={composeData.content}
        onChange={(e) => setComposeData({ ...composeData, content: e.target.value })}
        rows={6}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      />
    </div>
  )
}




