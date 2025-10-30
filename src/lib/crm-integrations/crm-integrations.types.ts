export interface CRMProvider {
  id: string
  name: string
  type: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom'
  api_endpoint?: string
  api_key?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CRMContact {
  id: string
  crm_provider_id: string
  external_id: string
  name: string
  email?: string
  phone?: string
  company?: string
  created_at: string
  updated_at: string
}

export interface CRMIntegration {
  provider: CRMProvider
  contacts: CRMContact[]
  sync_status: 'active' | 'paused' | 'error'
  last_sync: string
}
