import { HorsePartnershipsFormProps } from './HorsePartnershipsTypes'

export function RidingForOthersFields({ formData, updateField }: HorsePartnershipsFormProps) {
  return (
    <div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.partnership_type === 'rides_for_others'}
          onChange={(e) => updateField('partnership_type', e.target.checked ? 'rides_for_others' : '')}
          className="rounded"
        />
        <span className="text-sm font-medium text-gray-700">
          I ride horses for other people (trainer, exercise rider, etc.)
        </span>
      </label>
    </div>
  )
}




