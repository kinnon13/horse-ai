import { BusinessFormData, AVAILABLE_SERVICES } from './BusinessListTypes'

interface BusinessFormBasicInfoProps {formData: BusinessFormData
  onServiceToggle: (service: string) => void
  onFieldUpdate: (field: keyof BusinessFormData, value: any) => void
}

export function BusinessFormBasicInfo({ formData, onServiceToggle, onFieldUpdate }: BusinessFormBasicInfoProps) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <input
          type="text"
          value={formData.business_name}
          onChange={(e) => onFieldUpdate('business_name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your business name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => onFieldUpdate('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="City, State"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Services Offered *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {AVAILABLE_SERVICES.map((service) => (
            <label key={service} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => onServiceToggle(service)}
                className="rounded"
              />
              <span className="text-sm">{service}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  )
}

