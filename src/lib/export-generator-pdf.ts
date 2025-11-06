// pdf-generator.ts (30 lines) - Single responsibility: Main PDF generation
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { ExportData } from './export-generator'
import { addPDFHeader, addPDFSummaryStats } from './pdf-templates'

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
  
  // @ts-expect-error - jsPDF autotable types
  doc.autoTable({
    head: [['Horse', 'Breed', 'Earnings', 'Discipline']],
    body: tableData,
    startY: 140,
    styles: { fontSize: 8 }
  })
  
  return (doc as any).lastAutoTable?.finalY || 140
}

// Re-export template functions for convenience
export { addPDFHeader, addPDFSummaryStats } from './pdf-templates'


