import { ProducerSetupData } from './ProducerSetupTypes'

export interface BusinessInfoStepProps {
  formData: ProducerSetupData
  setFormData: (data: ProducerSetupData) => void
  onNext: () => void
}

export interface BusinessInfoFormProps {
  formData: ProducerSetupData
  updateField: (field: keyof ProducerSetupData, value: any) => void
}

export interface BusinessInfoActionsProps {
  onNext: () => void
  isValid: boolean
  isSaving: boolean
}

export interface BusinessInfoStepState {
  formData: ProducerSetupData
  isValid: boolean
  isSaving: boolean
  errors: Record<string, string>
}

export interface BusinessInfoStepActions {
  updateField: (field: keyof ProducerSetupData, value: any) => void
  goNext: () => void
  validateForm: () => boolean
  saveData: () => Promise<void>
}




// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function BusinessInfoActionsProps(_props?: any): never { throw new Error("Stubbed component used: ./BusinessInfoTypes.BusinessInfoActionsProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function BusinessInfoFormProps(_props?: any): never { throw new Error("Stubbed component used: ./BusinessInfoTypes.BusinessInfoFormProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function BusinessInfoStepProps(_props?: any): never { throw new Error("Stubbed component used: ./BusinessInfoTypes.BusinessInfoStepProps"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function BusinessInfoStepState(_props?: any): never { throw new Error("Stubbed component used: ./BusinessInfoTypes.BusinessInfoStepState"); }

// --- AUTO-ADDED STUB EXPORTS (safe to replace with real code) ---
export function BusinessInfoStepActions(_props?: any): never { throw new Error("Stubbed component used: ./BusinessInfoTypes.BusinessInfoStepActions"); }
