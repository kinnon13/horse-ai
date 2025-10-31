// CompetitionHorseCareFields.tsx (15 lines) - Main care fields container
'use client'

import React from 'react'
import { CompetitionHorseCareBasicFields } from './CompetitionHorseCareBasicFields'
import { CompetitionHorseCareAdditionalFields } from './CompetitionHorseCareAdditionalFields'

interface CompetitionHorseCareFieldsProps {
  form: any
}

export function CompetitionHorseCareFields({ form }: CompetitionHorseCareFieldsProps) {
  return (
    <div className="space-y-4">
      <CompetitionHorseCareBasicFields form={form} />
      <CompetitionHorseCareAdditionalFields form={form} />
    </div>
  )
}
