// CompetitionHorseFormValidation.ts (20 lines) - Single responsibility: Form validation
import { CompetitionHorseFormData } from './CompetitionHorseFormTypes'

export class CompetitionHorseFormValidation {
  static validateForm(
    formData: CompetitionHorseFormData,
    setError: (field: string, error: string) => void,
    clearErrors: () => void
  ): boolean {
    clearErrors()
    let isValid = true
    
    if (!formData.name.trim()) { setError('name', 'Name is required'); isValid = false }
    if (!formData.breed.trim()) { setError('breed', 'Breed is required'); isValid = false }
    if (!formData.age.trim()) { setError('age', 'Age is required'); isValid = false }
    if (!formData.gender.trim()) { setError('gender', 'Gender is required'); isValid = false }
    
    return isValid
  }
}

