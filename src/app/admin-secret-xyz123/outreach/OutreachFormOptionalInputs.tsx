import React from 'react'
import { ComposeData } from './OutreachData'

interface OutreachFormOptionalInputsProps {
  composeData: ComposeData
  setComposeData: (data: ComposeData) => void
}

export function OutreachFormOptionalInputs({
  composeData,
  setComposeData
}: OutreachFormOptionalInputsProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700">Horse Name</label>
        <input
          type="text"
          value={composeData.horse_name}
          onChange={(e) => setComposeData({ ...composeData, horse_name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Event Name</label>
        <input
          type="text"
          value={composeData.event_name}
          onChange={(e) => setComposeData({ ...composeData, event_name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
    </>
  )
}



