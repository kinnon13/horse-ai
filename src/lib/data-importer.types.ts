// Data importer type definitions
export interface ImportResult {
  success: boolean
  importedCount: number
  errors: string[]
  warnings: string[]
}

export interface ImportOptions {
  validateData: boolean
  skipDuplicates: boolean
  updateExisting: boolean
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}
