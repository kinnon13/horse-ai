// Creator.ts (35 lines) - Single responsibility: Main service request creation
import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'
import { CreatorHelpers } from './CreatorHelpers'

export class Creator {
  static async createServiceRequest(
    intent: ServiceRequestIntent,
    userId: string,
    horseContext?: string
  ): Promise<{ id: string }> {
    
    const serviceRequestData = CreatorHelpers.buildServiceRequestData(intent, userId, horseContext)
    
    const { data, error } = await supabase
      .from('service_requests')
      .insert(serviceRequestData)
      .select('id')
      .single()
    
    if (error) {
      console.error('Error creating service request:', error)
      throw new Error('Failed to create service request')
    }
    
    return data
  }

  static async createServiceRequestWithAudit(
    intent: ServiceRequestIntent,
    userId: string,
    horseContext?: string
  ): Promise<{ id: string }> {
    const serviceRequest = await this.createServiceRequest(intent, userId, horseContext)
    await CreatorHelpers.logServiceRequestCreation(serviceRequest.id, userId, intent)
    return serviceRequest
  }
}
