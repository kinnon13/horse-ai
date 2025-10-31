'use client'

export function CompetitionHorseDetailsFields({ form }: { form: any }) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Year</label>
        <input
          type="number"
          value={form.formData.birth_year}
          onChange={(e) => form.updateField('birth_year', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="1900"
          max="2024"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
        <input
          type="text"
          value={form.formData.color}
          onChange={(e) => form.updateField('color', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </>
  )
}
