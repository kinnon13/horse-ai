import { HorsePartnershipsFormProps } from './HorsePartnershipsTypes'

export function HorseOwnershipFields({ formData, updateField }: HorsePartnershipsFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Horses You Own
        </label>
        <input
          type="number"
          value={formData.owns_horses}
          onChange={(e) => updateField('owns_horses', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Horses You Lease
        </label>
        <input
          type="number"
          value={formData.leases_horses}
          onChange={(e) => updateField('leases_horses', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
    </div>
  )
}



