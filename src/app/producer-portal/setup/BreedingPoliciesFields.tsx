import { BreedingOperationFormProps, BREEDING_METHODS } from './BreedingOperationTypes'

export function BreedingPoliciesFields({ formData, updateField }: BreedingOperationFormProps) {
  const handleMethodChange = (method: string, checked: boolean) => {
    if (checked) {
      updateField('breeding_methods', [...formData.breeding_methods, method])
    } else {
      updateField('breeding_methods', formData.breeding_methods.filter(m => m !== method))
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Breeding Focus
        </label>
        <input
          type="text"
          value={formData.breeding_focus}
          onChange={(e) => updateField('breeding_focus', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Performance horses, show horses, etc."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Breeding Methods
        </label>
        <div className="grid grid-cols-2 gap-2">
          {BREEDING_METHODS.map((method) => (
            <label key={method} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.breeding_methods.includes(method)}
                onChange={(e) => handleMethodChange(method, e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">{method}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.taking_clients}
            onChange={(e) => updateField('taking_clients', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Currently taking new clients
          </span>
        </label>
      </div>
    </div>
  )
}

