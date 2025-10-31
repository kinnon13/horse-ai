// LeadCaptureTypes.ts - Service request types
export interface ServiceRequest {
  id: string
  user_id: string
  service_type: string
  description: string
  location: string
  budget?: number
  status: 'pending' | 'claimed' | 'completed'
  created_at: string
}