import { AthleteSetupData } from './AthleteSetupTypes'

export interface PersonalInfoStepProps {
  formData: AthleteSetupData
  setFormData: (data: AthleteSetupData) => void
  onNext: () => void
}

export interface PersonalInfoFormProps {
  formData: AthleteSetupData
  updateField: (field: keyof AthleteSetupData, value: any) => void
}

export interface PersonalInfoActionsProps {
  onNext: () => void
  isValid: boolean
  isSaving: boolean
}

export interface PersonalInfoStepState {
  formData: AthleteSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface PersonalInfoStepActions {
  updateField: (field: keyof AthleteSetupData, value: any) => void
  goNext: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}

export const CONTACT_PREFERENCES = ['TEXT', 'CALL', 'EMAIL'] as const
export const ALLOWED_COUNTRIES = ['USA', 'Canada', 'Mexico'] as const




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function PersonalInfoFormProps(_props?: any): never { throw new Error("Stubbed component used: ./PersonalInfoTypes.PersonalInfoFormProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function PersonalInfoActionsProps(_props?: any): never { throw new Error("Stubbed component used: ./PersonalInfoTypes.PersonalInfoActionsProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function PersonalInfoStepProps(_props?: any): never { throw new Error("Stubbed component used: ./PersonalInfoTypes.PersonalInfoStepProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function PersonalInfoStepState(_props?: any): never { throw new Error("Stubbed component used: ./PersonalInfoTypes.PersonalInfoStepState"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function PersonalInfoStepActions(_props?: any): never { throw new Error("Stubbed component used: ./PersonalInfoTypes.PersonalInfoStepActions"); }
