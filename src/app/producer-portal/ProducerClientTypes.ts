export interface ProducerClient {
  id: string
  producer_id: string
  client_name: string
  email: string
  phone?: string
  relationship_type: 'breeder' | 'owner' | 'trainer' | 'other'
  start_date: string
  status: 'active' | 'inactive' | 'suspended'
  notes?: string
  created_at: string
  updated_at: string
}

export interface ProducerClientRelationship {
  id: string
  producer_id: string
  client_id: string
  relationship_type: string
  start_date: string
  end_date?: string
  terms: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}
