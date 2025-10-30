import { ExportData } from './export-generator'

export function createCSVHeader(): string[] {
  return [
    'Horse Name',
    'Breed',
    'Sire',
    'Dam',
    'Earnings',
    'Discipline',
    'Owner',
    'Rider',
    'Recent Results',
    'Progeny',
    'Articles',
    'Social Media',
    'Bloodline',
    'Created Date'
  ]
}

export function createHorseCSVRow(horse: any, scraped: any): string[] {
  return [
    horse.name,
    horse.breed,
    horse.sire || '',
    horse.dam || '',
    horse.earnings || 0,
    horse.discipline || '',
    horse.owner_name || '',
    horse.rider_name || '',
    scraped?.recent_results || '',
    scraped?.progeny ? JSON.stringify(scraped.progeny) : '',
    scraped?.articles ? JSON.stringify(scraped.articles) : '',
    scraped?.social_media ? JSON.stringify(scraped.social_media) : '',
    scraped?.bloodline ? JSON.stringify(scraped.bloodline) : '',
    horse.created_at
  ]
}

export function convertToCSVString(csvRows: string[][]): string {
  return csvRows.map(row => 
    row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
  ).join('\n')
}

export function createCSVRows(data: ExportData): string[][] {
  const csvRows = []
  csvRows.push(createCSVHeader())
  
  for (const horse of data.horses) {
    const scraped = data.scrapedData.find(s => s.horse_name === horse.name)
    csvRows.push(createHorseCSVRow(horse, scraped))
  }
  
  return csvRows
}

