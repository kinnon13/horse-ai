import { PersonalInfoFormProps } from './PersonalInfoTypes'

export function LegalNameFields({ formData, updateField }: PersonalInfoFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rider Name *
        </label>
        <input
          type="text"
          value={formData.rider_name}
          onChange={(e) => updateField('rider_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your full name"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Age
        </label>
        <input
          type="number"
          value={formData.age || ''}
          onChange={(e) => updateField('age', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="25"
        />
      </div>
    </div>
  )
}




