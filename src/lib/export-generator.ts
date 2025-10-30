import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { createCSVRows, convertToCSVString } from './export-generator-helpers'
import { addPDFHeader, addPDFSummaryStats, addTopPerformersTable } from './export-generator-pdf'
import { addBreedingInsightsTable, addPDFFooter } from './export-generator-pdf-breeding'
import { addEquiStatHeader, addPerformanceHistory, addProgenyTable } from './export-generator-equistat-render'
import { fetchEquiStatData } from './export-generator-equistat-data'
import { gatherExportData } from './export-generator-data'

export interface ExportFilters {
  dateRange?: {
    start: string
    end: string
  }
  breed?: string
  discipline?: string
  minEarnings?: number
  maxEarnings?: number
  includeScrapedData?: boolean
  includeLinkedEntities?: boolean
}

export interface ExportData {
  horses: any[]
  events: any[]
  scrapedData: any[]
  linkedEntities: any[]
  searchAnalytics: any[]
}

export class ExportGenerator {
  async generateCSVExport(userId: string, filters: ExportFilters = {}): Promise<string> {
    const data = await gatherExportData(userId, filters)
    const csvRows = createCSVRows(data)
    return convertToCSVString(csvRows)
  }

  async generatePDFReport(userId: string, filters: ExportFilters = {}): Promise<Buffer> {
    const data = await gatherExportData(userId, filters)
    const doc = new jsPDF()
    
    addPDFHeader(doc, filters)
    addPDFSummaryStats(doc, data)
    addTopPerformersTable(doc, data)
    addBreedingInsightsTable(doc, data)
    addPDFFooter(doc)
    
    return Buffer.from(doc.output('arraybuffer'))
  }

  async generateEquiStatStyleReport(userId: string, horseName: string): Promise<Buffer> {
    const { horse, scrapedData } = await fetchEquiStatData(userId, horseName)
    const doc = new jsPDF()
    
    addEquiStatHeader(doc, horse)
    
    if (scrapedData && scrapedData.length > 0) {
      const latest = scrapedData[0]
      addPerformanceHistory(doc, latest)
      
      if (latest?.progeny) {
        addProgenyTable(doc, latest.progeny)
      }
    }
    
    return Buffer.from(doc.output('arraybuffer'))
  }

}
