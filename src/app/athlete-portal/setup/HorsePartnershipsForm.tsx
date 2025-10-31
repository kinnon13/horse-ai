import { HorsePartnershipsFormProps } from './HorsePartnershipsTypes'
import { HorseOwnershipFields } from './HorseOwnershipFields'
import { RidingForOthersFields } from './RidingForOthersFields'
import { BioFields } from './BioFields'

export function HorsePartnershipsForm({ formData, updateField }: HorsePartnershipsFormProps) {
  return (
    <div className="space-y-6">
      <HorseOwnershipFields formData={formData} updateField={updateField} />
      <RidingForOthersFields formData={formData} updateField={updateField} />
      <BioFields formData={formData} updateField={updateField} />
    </div>
  )
}




