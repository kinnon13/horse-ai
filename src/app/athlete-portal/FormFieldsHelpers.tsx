// FormFieldsHelpers.tsx (50 lines) - Single responsibility: Form field helper functions
import React from 'react'
import { CompetitionHorseFormState } from './CompetitionHorseFormTypes'

export class FormFieldsHelpers {
  static renderTextField(
    label: string,
    field: string,
    value: string,
    error: string | undefined,
    onChange: (value: string) => void
  ) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }

  static renderSelectField(
    label: string,
    value: string,
    error: string | undefined,
    onChange: (value: string) => void,
    options: { value: string; label: string }[]
  ) {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label} *</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${error ? 'border-red-500' : 'border-gray-300'}`}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    )
  }
}