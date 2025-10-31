// export-generator.ts (35 lines) - Single responsibility: Main export generator
import { ExportGeneratorConfig } from './export-generator-config'
import { createCSVRows, convertToCSVString } from './export-generator.mapper'

export class ExportGenerator {
  async generateCSVExport(userId: string, filters: any = {}): Promise<string> {
    return ExportGeneratorConfig.generateCSVExport(userId, filters)
  }

  async generatePDFReport(userId: string, filters: any = {}): Promise<Buffer> {
    return ExportGeneratorConfig.generatePDFReport(userId, filters)
  }

  async generateEquiStatStyleReport(userId: string, horseName: string): Promise<Buffer> {
    return ExportGeneratorConfig.generateEquiStatStyleReport(userId, horseName)
  }
}

export type { ExportFilters, ExportData } from './export-generator.types'
