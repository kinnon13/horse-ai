import { BusinessInfoFormProps } from './BusinessInfoTypes'

export function BusinessInfoBasicFields({ formData, updateField }: BusinessInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <input
          type="text"
          value={formData.business_name}
          onChange={(e) => updateField('business_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your breeding operation name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Contact Name *
        </label>
        <input
          type="text"
          value={formData.contact_name}
          onChange={(e) => updateField('contact_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your full name"
        />
      </div>
    </div>
  )
}



