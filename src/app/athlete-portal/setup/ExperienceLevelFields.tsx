import { RidingExperienceFormProps, SKILL_LEVELS, COMPETITION_LEVELS } from './RidingExperienceTypes'

export function ExperienceLevelFields({ formData, updateField }: RidingExperienceFormProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skill Level
        </label>
        <select
          value={formData.skill_level}
          onChange={(e) => updateField('skill_level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select skill level</option>
          {SKILL_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Competition Level
        </label>
        <select
          value={formData.competition_level}
          onChange={(e) => updateField('competition_level', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select competition level</option>
          {COMPETITION_LEVELS.map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>
    </div>
  )
}



