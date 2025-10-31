export interface RidingExperienceFormData {
  skill_level: string
  competition_level: string
  primary_disciplines: string[]
  years_experience: number
  training_hours_per_week: number
  competition_frequency: string
  goals: string[]
  challenges: string[]
  preferred_training_style: string
  availability: string[]
}

export interface RidingExperienceFieldProps {
  formData: any
  updateField: (field: string, value: any) => void
}


