import { HorsePartnershipsFormProps } from './HorsePartnershipsTypes'

export function BioFields({ formData, updateField }: HorsePartnershipsFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Bio
        </label>
        <textarea
          value={formData.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tell us about your riding journey, achievements, and goals..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Key Achievements
        </label>
        <textarea
          value={formData.achievements}
          onChange={(e) => updateField('achievements', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="List your major accomplishments, awards, and notable performances..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Goals
        </label>
        <textarea
          value={formData.goals}
          onChange={(e) => updateField('goals', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="What are your riding goals for the next year? What do you want to achieve?"
        />
      </div>
    </div>
  )
}



