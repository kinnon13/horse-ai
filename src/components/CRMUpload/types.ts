export interface CRMUploadProps {
  businessType: 'producer' | 'stallion_station' | 'athlete' | 'horse_owner'
  onUploadComplete?: (results: any) => void
}

export interface FieldMapping {
  [key: string]: string
}

export interface UploadResults {
  success: boolean
  processed: number
  errors: string[]
  warnings: string[]
}

export interface PreviewRow {
  [key: string]: string
}

export const BUSINESS_TYPE_LABELS = {
  producer: 'Producer',
  stallion_station: 'Stallion Station',
  athlete: 'Athlete',
  horse_owner: 'Horse Owner'
} as const




