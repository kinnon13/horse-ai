import { BusinessInfoFormProps } from './BusinessInfoTypes'

export function BusinessInfoLocationFields({ formData, updateField }: BusinessInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          value={formData.location_city}
          onChange={(e) => updateField('location_city', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Austin"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          State
        </label>
        <input
          type="text"
          value={formData.location_state}
          onChange={(e) => updateField('location_state', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="TX"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          value={formData.location_country}
          onChange={(e) => updateField('location_country', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="USA">USA</option>
          <option value="Canada">Canada</option>
          <option value="Mexico">Mexico</option>
        </select>
      </div>
    </div>
  )
}

