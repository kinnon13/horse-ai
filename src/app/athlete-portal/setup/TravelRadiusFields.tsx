import { RidingExperienceFormProps } from './RidingExperienceTypes'

export function TravelRadiusFields({ formData, updateField }: { formData: any, updateField: (field: string, value: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Years Riding
        </label>
        <input
          type="number"
          value={formData.years_riding || ''}
          onChange={(e) => updateField('years_riding', e.target.value ? parseInt(e.target.value) : null)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="5"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Travel Radius (miles)
        </label>
        <input
          type="number"
          value={formData.travel_radius_miles}
          onChange={(e) => updateField('travel_radius_miles', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="100"
        />
      </div>
    </div>
  )
}




