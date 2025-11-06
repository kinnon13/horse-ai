import jsPDF from 'jspdf'
import { ExportData } from './export-generator'

export function addBreedingInsightsTable(doc: jsPDF, data: ExportData): number {
  if (data.scrapedData.length === 0) return 200
  
  doc.setFontSize(14)
  doc.text('Breeding Insights', 20, 200)
  
  const breedingData = data.scrapedData
    .filter(s => s.bloodline)
    .slice(0, 5)
    .map(s => [
      s.horse_name,
      s.bloodline?.sire || '',
      s.bloodline?.dam || '',
      s.earnings ? `$${s.earnings.toLocaleString()}` : ''
    ])
  
  if (breedingData.length > 0) {
    // @ts-expect-error
    doc.autoTable({
      head: [['Horse', 'Sire', 'Dam', 'Earnings']],
      body: breedingData,
      startY: 210,
      styles: { fontSize: 8 }
    })
  }
  
  return (doc as any).lastAutoTable?.finalY || 200
}

export function addPDFFooter(doc: jsPDF): void {
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`Horse.AI Report - Page ${i} of ${pageCount}`, 20, doc.internal.pageSize.height - 10)
  }
}


