import { BusinessFormData } from './BusinessListTypes'

interface BusinessFormContactInfoProps {
  formData: BusinessFormData
  onContactUpdate: (field: keyof BusinessFormData['contact_info'], value: string) => void
}

export function BusinessFormContactInfo({ formData, onContactUpdate }: BusinessFormContactInfoProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={formData.contact_info.phone}
          onChange={(e) => onContactUpdate('phone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={formData.contact_info.email}
          onChange={(e) => onContactUpdate('email', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website
        </label>
        <input
          type="url"
          value={formData.contact_info.website}
          onChange={(e) => onContactUpdate('website', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  )
}

