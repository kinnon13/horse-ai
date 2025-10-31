import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { addPDFHeader, addPDFSummaryStats } from './pdf-templates'
import { addTopPerformersTable } from './export-generator-pdf'
import { addBreedingInsightsTable, addPDFFooter } from './export-generator-pdf-breeding'
import { addEquiStatHeader, addPerformanceHistory, addProgenyTable } from './export-generator-equistat-render'
import { fetchEquiStatData } from './export-generator-equistat-data'
import { gatherExportData } from './export-generator-data'

export class ExportGeneratorConfig {
  static async generateCSVExport(userId: string, filters: any = {}): Promise<string> {
    const data = await gatherExportData(userId, filters)
    const csvRows = createCSVRows(data)
    return convertToCSVString(csvRows)
  }

  static async generatePDFReport(userId: string, filters: any = {}): Promise<Buffer> {
    const data = await gatherExportData(userId, filters)
    const doc = new jsPDF()
    addPDFHeader(doc, filters)
    addPDFSummaryStats(doc, data)
    addTopPerformersTable(doc, data)
    addBreedingInsightsTable(doc, data)
    addPDFFooter(doc)
    return Buffer.from(doc.output('arraybuffer'))
  }

  static async generateEquiStatStyleReport(userId: string, horseName: string): Promise<Buffer> {
    const { horse, scrapedData } = await fetchEquiStatData(userId, horseName)
    const doc = new jsPDF()
    addEquiStatHeader(doc, horse)
    if (scrapedData && scrapedData.length > 0) {
      const latest = scrapedData[0]
      addPerformanceHistory(doc, latest)
      addProgenyTable(doc, latest)
    }
    return Buffer.from(doc.output('arraybuffer'))
  }
}

// Helper functions for CSV generation
function createCSVRows(data: any): string[][] {
  // Implementation will be moved from mapper
  return []
}

function convertToCSVString(csvRows: string[][]): string {
  return ''
}
