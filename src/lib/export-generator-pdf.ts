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

export function addTopPerformersTable(doc: jsPDF, data: ExportData): number {
  const topPerformers = data.horses
    .filter(h => h.earnings > 0)
    .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
    .slice(0, 10)
  
  if (topPerformers.length === 0) return 140
  
  doc.setFontSize(14)
  doc.text('Top Performers by Earnings', 20, 130)
  
  const tableData = topPerformers.map(horse => [
    horse.name,
    horse.breed,
    `$${(horse.earnings || 0).toLocaleString()}`,
    horse.discipline || ''
  ])
  
  // @ts-ignore - jsPDF autotable types
  doc.autoTable({
    head: [['Horse', 'Breed', 'Earnings', 'Discipline']],
    body: tableData,
    startY: 140,
    styles: { fontSize: 8 }
  })
  
  return doc.lastAutoTable?.finalY || 140
}

