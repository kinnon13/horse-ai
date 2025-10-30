import React from 'react'
import { ComposeData } from './OutreachData'

interface OutreachFormRequiredInputsProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export function OutreachFormRequiredInputs({
  composeData,
  setComposeData
}: OutreachFormRequiredInputsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Target *</label>
        <input
          type="text"
          value={composeData.target}
          onChange={(e) => setComposeData({ ...composeData, target: e.target.value })}
          placeholder="Email or phone number"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Subject *</label>
        <input
          type="text"
          value={composeData.subject}
          onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </>
  )
}

