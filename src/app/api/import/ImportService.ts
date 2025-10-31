import { DataImporter } from '@/lib/data-importer'

export class ImportService {
  async importData(type: string, csvData: any) {
    switch (type) {
      case 'horses':
        return await DataImporter.importHorses(csvData)
      case 'results':
        return await DataImporter.importResults(csvData)
      case 'providers':
        return await DataImporter.importProviders(csvData)
      case 'contacts':
        return await DataImporter.importContacts(csvData)
      default:
        throw new Error('Invalid import type')
    }
  }

  async validateImportData(type: string, csvData: any) {
    switch (type) {
      case 'horses':
        return await DataImporter.validateHorsesData(csvData)
      case 'results':
        return await DataImporter.validateResultsData(csvData)
      case 'providers':
        return await DataImporter.validateProvidersData(csvData)
      case 'contacts':
        return await DataImporter.validateContactsData(csvData)
      default:
        throw new Error('Invalid validation type')
    }
  }
}




