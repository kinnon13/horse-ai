// CompetitionHorsePerformanceFields.tsx (15 lines) - Main performance fields container
'use client'

import React from 'react'
import { CompetitionHorseDisciplineFields } from './CompetitionHorseDisciplineFields'
import { CompetitionHorseEarningsFields } from './CompetitionHorseEarningsFields'
import { CompetitionHorseStatusFields } from './CompetitionHorseStatusFields'
import { CompetitionHorseHighlightsFields } from './CompetitionHorseHighlightsFields'

interface CompetitionHorsePerformanceFieldsProps {
  form: any
}

export function CompetitionHorsePerformanceFields({ form }: CompetitionHorsePerformanceFieldsProps) {
  return (
    <div className="space-y-4">
      <CompetitionHorseDisciplineFields form={form} />
      <CompetitionHorseEarningsFields form={form} />
      <CompetitionHorseStatusFields form={form} />
      <CompetitionHorseHighlightsFields form={form} />
    </div>
  )
}
