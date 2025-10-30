import { BreedingOperationFormProps, BREEDING_SPECIALTIES } from './BreedingOperationTypes'

export function MareServicesFields({ formData, updateField }: BreedingOperationFormProps) {
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    if (checked) {
      updateField('specialties', [...formData.specialties, specialty])
    } else {
      updateField('specialties', formData.specialties.filter(s => s !== specialty))
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Specialties
      </label>
      <div className="grid grid-cols-2 gap-2">
        {BREEDING_SPECIALTIES.map((specialty) => (
          <label key={specialty} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.specialties.includes(specialty)}
              onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{specialty}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

