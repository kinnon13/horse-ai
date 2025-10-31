// CompetitionHorseCareInfo.tsx (25 lines) - Single responsibility: Main care info container
'use client'

import React from 'react'
import { CompetitionHorseCareFields } from './CompetitionHorseCareFields'

interface CompetitionHorseCareInfoProps {
  form: any
}

export default function CompetitionHorseCareInfo({ form }: CompetitionHorseCareInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Care Information</h3>
      <CompetitionHorseCareFields form={form} />
    </div>
  )
}