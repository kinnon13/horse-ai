import { RidingExperienceFieldProps } from './RidingExperienceTypes'
import { PrimaryDisciplineFields } from './PrimaryDisciplineFields'
import { ExperienceLevelFields } from './ExperienceLevelFields'
import { TravelRadiusFields } from './TravelRadiusFields'

export function RidingExperienceForm({ formData, updateField }: RidingExperienceFieldProps) {
  return (
    <div className="space-y-6">
      <TravelRadiusFields formData={formData} updateField={updateField} />
      <PrimaryDisciplineFields formData={formData} updateField={updateField} />
      <ExperienceLevelFields formData={formData} updateField={updateField} />
    </div>
  )
}




