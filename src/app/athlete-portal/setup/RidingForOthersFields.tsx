import { HorsePartnershipsFormProps } from './HorsePartnershipsTypes'

export function RidingForOthersFields({ formData, updateField }: HorsePartnershipsFormProps) {
  return (
    <div>
      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={formData.rides_for_others}
          onChange={(e) => updateField('rides_for_others', e.target.checked)}
          className="rounded"
        />
        <span className="text-sm font-medium text-gray-700">
          I ride horses for other people (trainer, exercise rider, etc.)
        </span>
      </label>
    </div>
  )
}

