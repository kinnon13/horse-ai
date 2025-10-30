// Riding Experience Types - Single responsibility
export interface RidingExperienceFormProps {
  formData: {
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
  updateField: (field: string, value: any) => void
}

export const SKILL_LEVELS = [
  'Beginner',
  'Novice',
  'Intermediate',
  'Advanced',
  'Professional'
]

export const COMPETITION_LEVELS = [
  'Local',
  'Regional',
  'National',
  'International'
]

export const RIDING_DISCIPLINES = [
  'Dressage',
  'Jumping',
  'Eventing',
  'Western',
  'Trail',
  'Endurance',
  'Reining',
  'Barrel Racing'
]