// Data importer utility functions
import { DataImporterService } from './data-importer.service'
import { ImportOptions } from './data-importer.types'

export class DataImporter extends DataImporterService {
  constructor(options: ImportOptions = {
    validateData: true,
    skipDuplicates: true,
    updateExisting: false
  }) {
    super(options)
  }
}

export const dataImporter = new DataImporter()

// Re-export types for convenience
export type { ImportResult, ImportOptions, ValidationResult } from './data-importer.types'

