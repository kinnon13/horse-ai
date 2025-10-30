import { BusinessInfoFormProps } from './BusinessInfoTypes'
import { BusinessInfoBasicFields } from './BusinessInfoBasicFields'
import { BusinessInfoContactFields } from './BusinessInfoContactFields'
import { BusinessInfoLocationFields } from './BusinessInfoLocationFields'

export function BusinessInfoForm({ formData, updateField }: BusinessInfoFormProps) {
  return (
    <div className="space-y-6">
      <BusinessInfoBasicFields formData={formData} updateField={updateField} />
      <BusinessInfoContactFields formData={formData} updateField={updateField} />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => updateField('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://yourwebsite.com"
        />
      </div>

      <BusinessInfoLocationFields formData={formData} updateField={updateField} />
    </div>
  )
}