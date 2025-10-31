// mapper.ts (30 lines) - Single responsibility: Main CSV mapping logic
import { ExportData } from './export-generator'
import { createCSVHeader, createHorseCSVRow, convertToCSVString } from './mapper-utils'

export function createCSVRows(data: ExportData): string[][] {
  const csvRows = []
  csvRows.push(createCSVHeader())
  
  for (const horse of data.horses) {
    const scraped = data.scrapedData.find(s => s.horse_name === horse.name)
    csvRows.push(createHorseCSVRow(horse, scraped))
  }
  
  return csvRows
}

// Re-export utility functions for convenience
export { createCSVHeader, createHorseCSVRow, convertToCSVString } from './mapper-utils'


