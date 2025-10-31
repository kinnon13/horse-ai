import { PersonalInfoFormProps } from './PersonalInfoTypes'
import { LegalNameFields } from './LegalNameFields'
import { ContactFields } from './ContactFields'
import { LocationFields } from './LocationFields'

export function PersonalInfoForm({ formData, updateField }: PersonalInfoFormProps) {
  return (
    <div className="space-y-6">
      <LegalNameFields formData={formData} updateField={updateField} />
      <ContactFields formData={formData} updateField={updateField} />
      <LocationFields formData={formData} updateField={updateField} />
    </div>
  )
}




