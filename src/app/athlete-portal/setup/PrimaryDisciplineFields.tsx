import { RidingExperienceFormProps, RIDING_DISCIPLINES } from './RidingExperienceTypes'

export function PrimaryDisciplineFields({ formData, updateField }: RidingExperienceFormProps) {
  const handleDisciplineChange = (discipline: string, checked: boolean) => {
    if (checked) {
      updateField('primary_disciplines', [...formData.primary_disciplines, discipline])
    } else {
      updateField('primary_disciplines', formData.primary_disciplines.filter(d => d !== discipline))
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Primary Disciplines
      </label>
      <div className="grid grid-cols-2 gap-2">
        {RIDING_DISCIPLINES.map((discipline) => (
          <label key={discipline} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.primary_disciplines.includes(discipline)}
              onChange={(e) => handleDisciplineChange(discipline, e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">{discipline}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

