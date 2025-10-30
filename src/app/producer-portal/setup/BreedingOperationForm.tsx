import { BreedingOperationFormProps } from './BreedingOperationTypes'
import { StudInfoFields } from './StudInfoFields'
import { MareServicesFields } from './MareServicesFields'
import { BreedingPoliciesFields } from './BreedingPoliciesFields'

export function BreedingOperationForm({ formData, updateField }: BreedingOperationFormProps) {
  return (
    <div className="space-y-6">
      <StudInfoFields formData={formData} updateField={updateField} />
      <MareServicesFields formData={formData} updateField={updateField} />
      <BreedingPoliciesFields formData={formData} updateField={updateField} />
    </div>
  )
}



