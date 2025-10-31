// Lead generation API types
export interface LeadGenerationRequest {
  type: string
  user_id: string
  criteria: any
  message?: string
}

export interface LeadGenerationResponse {
  success: boolean
  leads?: any[]
  leadData?: any
  error?: string
  upgradeRequired?: boolean
}

export interface LeadGenerationHistoryResponse {
  success: boolean
  leadGenerations: any[]
  error?: string
}

export interface LeadGenerationData {
  type: string
  criteria: any
  message?: string
  leads_count: number
}
