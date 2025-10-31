// pdf-templates.ts (35 lines) - Single responsibility: PDF template functions
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportData, ExportFilters } from './export-generator'

export function addPDFHeader(doc: jsPDF, filters: ExportFilters): void {
  doc.setFontSize(20)
  doc.text('Horse.AI Comprehensive Report', 20, 30)
  doc.setFontSize(12)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45)
  
  if (filters.dateRange) {
    doc.text(`Date Range: ${filters.dateRange.start} to ${filters.dateRange.end}`, 20, 55)
  }
}

export function addPDFSummaryStats(doc: jsPDF, data: ExportData): void {
  doc.setFontSize(14)
  doc.text('Summary Statistics', 20, 75)
  
  const totalEarnings = data.horses.reduce((sum, horse) => sum + (horse.earnings || 0), 0)
  const totalHorses = data.horses.length
  const totalScraped = data.scrapedData.length
  
  doc.setFontSize(10)
  doc.text(`Total Horses: ${totalHorses}`, 20, 90)
  doc.text(`Total Earnings: $${totalEarnings.toLocaleString()}`, 20, 100)
  doc.text(`Scraped Data Points: ${totalScraped}`, 20, 110)
}


