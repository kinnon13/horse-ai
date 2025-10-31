import { BusinessFormData } from './BusinessListTypes'

interface BusinessFormAdditionalInfoProps {
  formData: BusinessFormData
  onFieldUpdate: (field: keyof BusinessFormData, value: any) => void
}

export function BusinessFormAdditionalInfo({ formData, onFieldUpdate }: BusinessFormAdditionalInfoProps) {
  return (
    <>
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.taking_clients}
            onChange={(e) => onFieldUpdate('taking_clients', e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium text-gray-700">
            Currently taking new clients
          </span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => onFieldUpdate('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about your business..."
        />
      </div>
    </>
  )
}




