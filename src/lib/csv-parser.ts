import Papa from 'papaparse'

export interface CSVHorseData {
  'Horse Name': string
  'Reg Number'?: string
  'Breed': string
  'Sire'?: string
  'Dam'?: string
  'Owner Name'?: string
  'Rider Name'?: string
  'Breeder Name'?: string
  'Event Name'?: string
  'Event Date'?: string
  'Placement'?: string
  'Earnings'?: string
  'Discipline'?: string
  'Notes'?: string
}

export interface ParsedHorseData {
  name: string
  breed: string
  reg_number?: string
  sire?: string
  dam?: string
  owner_name?: string
  rider_name?: string
  breeder_name?: string
  discipline?: string
  notes?: string
  earnings?: number
}

export class CSVParser {
  static parseCSV(csvText: string): ParsedHorseData[] {
    const results = Papa.parse<CSVHorseData>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize headers to match our expected format
        const normalized = header.trim()
        const mappings: { [key: string]: string } = {
          'Horse Name': 'Horse Name',
          'Reg Number': 'Reg Number',
          'Breed': 'Breed',
          'Sire': 'Sire',
          'Dam': 'Dam',
          'Owner Name': 'Owner Name',
          'Rider Name': 'Rider Name',
          'Breeder Name': 'Breeder Name',
          'Event Name': 'Event Name',
          'Event Date': 'Event Date',
          'Placement': 'Placement',
          'Earnings': 'Earnings',
          'Discipline': 'Discipline',
          'Notes': 'Notes'
        }
        return mappings[normalized] || normalized
      }
    })

    if (results.errors.length > 0) {
      throw new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`)
    }

    return results.data.map(row => this.transformRow(row))
  }

  private static transformRow(row: CSVHorseData): ParsedHorseData {
    return {
      name: row['Horse Name']?.trim() || '',
      breed: row['Breed']?.trim() || '',
      reg_number: row['Reg Number']?.trim(),
      sire: row['Sire']?.trim(),
      dam: row['Dam']?.trim(),
      owner_name: row['Owner Name']?.trim(),
      rider_name: row['Rider Name']?.trim(),
      breeder_name: row['Breeder Name']?.trim(),
      discipline: row['Discipline']?.trim(),
      notes: row['Notes']?.trim(),
      earnings: row['Earnings'] ? parseFloat(row['Earnings'].replace(/[^0-9.-]/g, '')) : undefined
    }
  }

  static validateRequiredFields(data: ParsedHorseData[]): {
    valid: boolean
    errors: string[]
  } {
    const errors: string[] = []

    data.forEach((row, index) => {
      if (!row.name) {
        errors.push(`Row ${index + 1}: Horse Name is required`)
      }
      if (!row.breed) {
        errors.push(`Row ${index + 1}: Breed is required`)
      }
    })

    return {
      valid: errors.length === 0,
      errors
    }
  }

  static generateTemplate(): string {
    const headers = [
      'Horse Name',
      'Reg Number',
      'Breed',
      'Sire',
      'Dam',
      'Owner Name',
      'Rider Name',
      'Breeder Name',
      'Event Name',
      'Event Date',
      'Placement',
      'Earnings',
      'Discipline',
      'Notes'
    ]

    const sampleData = [
      'Dash Ta Fame',
      '1234567',
      'AQHA',
      'First Down Dash',
      'Sudden Fame',
      'John Doe',
      'Brittany Pozzi',
      'Ranch XYZ',
      'Diamond Classic',
      '2025-10-01',
      '1st',
      '5000',
      'Barrel Racing',
      'Aluminum shoes for speed'
    ]

    return [headers, sampleData].map(row => row.join(',')).join('\n')
  }
}
