'use client'

import { CompetitionHorseNameFields } from './CompetitionHorseNameFields'
import { CompetitionHorseBreedFields } from './CompetitionHorseBreedFields'
import { CompetitionHorseDetailsFields } from './CompetitionHorseDetailsFields'

interface CompetitionHorseBasicInfoFieldsProps {
  form: any
}

export function CompetitionHorseBasicInfoFields({ form }: CompetitionHorseBasicInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CompetitionHorseNameFields form={form} />
      <CompetitionHorseBreedFields form={form} />
      <CompetitionHorseDetailsFields form={form} />
    </div>
  )
}
