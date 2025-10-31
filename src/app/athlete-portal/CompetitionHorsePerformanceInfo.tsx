'use client'

import React from 'react'
import { CompetitionHorsePerformanceFields } from './CompetitionHorsePerformanceFields'

interface CompetitionHorsePerformanceInfoProps {
  form: any
}

export default function CompetitionHorsePerformanceInfo({ form }: CompetitionHorsePerformanceInfoProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Performance Information</h3>
      <CompetitionHorsePerformanceFields form={form} />
    </div>
  )
}

