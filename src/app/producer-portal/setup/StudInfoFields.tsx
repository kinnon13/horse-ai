import { BreedingOperationFormProps } from './BreedingOperationTypes'

export function StudInfoFields({ formData, updateField }: BreedingOperationFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Mares
        </label>
        <input
          type="number"
          value={formData.total_mares}
          onChange={(e) => updateField('total_mares', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total Stallions
        </label>
        <input
          type="number"
          value={formData.total_stallions}
          onChange={(e) => updateField('total_stallions', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Annual Foals
        </label>
        <input
          type="number"
          value={formData.annual_foals}
          onChange={(e) => updateField('annual_foals', parseInt(e.target.value) || 0)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
        />
      </div>
    </div>
  )
}




