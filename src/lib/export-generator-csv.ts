import { ExportData } from './export-generator'
import { createCSVHeader, createHorseCSVRow } from './export-generator-csv-parsers'

export function createCSVRows(data: ExportData): string[][] {
  const csvRows = []
  csvRows.push(createCSVHeader())
  
  for (const horse of data.horses) {
    const scraped = data.scrapedData.find(s => s.horse_name === horse.name)
    csvRows.push(createHorseCSVRow(horse, scraped))
  }
  
  return csvRows
}

export function convertToCSVString(csvRows: string[][]): string {
  return csvRows.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n')
}

