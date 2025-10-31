'use client'

import React from 'react'
import { CompetitionHorseBasicInfoFields } from './CompetitionHorseBasicInfoFields'

interface CompetitionHorseBasicInfoProps {
  form: any
}

export default function CompetitionHorseBasicInfo({ form }: CompetitionHorseBasicInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
      <CompetitionHorseBasicInfoFields form={form} />
    </div>
  )
}