// FormFields.tsx (50 lines) - Single responsibility: Main form fields component
'use client'
import React from 'react'
import { CompetitionHorseFormState } from './CompetitionHorseFormTypes'
import { FormFieldsHelpers } from './FormFieldsHelpers'

interface CompetitionHorseFormFieldsProps {
  form: CompetitionHorseFormState
}

export function FormFields({ form }: CompetitionHorseFormFieldsProps) {
  const genderOptions = [
    { value: 'Stallion', label: 'Stallion' },
    { value: 'Mare', label: 'Mare' },
    { value: 'Gelding', label: 'Gelding' }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {FormFieldsHelpers.renderTextField('Name', 'name', form.formData.name, form.errors.name, (value) => form.setFormData({ name: value }))}
      {FormFieldsHelpers.renderTextField('Breed', 'breed', form.formData.breed, form.errors.breed, (value) => form.setFormData({ breed: value }))}
      {FormFieldsHelpers.renderTextField('Age', 'age', form.formData.age, form.errors.age, (value) => form.setFormData({ age: value }))}
      {FormFieldsHelpers.renderSelectField('Gender', form.formData.gender, form.errors.gender, (value) => form.setFormData({ gender: value }), genderOptions)}
    </div>
  )
}