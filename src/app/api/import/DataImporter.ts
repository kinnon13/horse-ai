// Data Importer - Single responsibility
export class DataImporter {
  static async importHorses(data: unknown[]) {

    return { success: true, imported: data.length }
  }

  static async importResults(data: unknown[]) {

    return { success: true, imported: data.length }
  }

  static async importProviders(data: unknown[]) {

    return { success: true, imported: data.length }
  }

  static async importContacts(data: unknown[]) {

    return { success: true, imported: data.length }
  }

  static async validateHorsesData(data: unknown[]) {
    return { valid: true, errors: [] }
  }

  static async validateResultsData(data: unknown[]) {
    return { valid: true, errors: [] }
  }

  static async validateProvidersData(data: unknown[]) {
    return { valid: true, errors: [] }
  }

  static async validateContactsData(data: unknown[]) {
    return { valid: true, errors: [] }
  }
}
