/**
 * SERVICE REQUEST FLOW COORDINATOR
 * 
 * PURPOSE:
 * - Coordinates the service request flow process
 * - Handles the main service request logic
 * - Orchestrates all service request components
 * 
 * SAFETY:
 * - Every user input is timestamped with source_user_id
 * - We explicitly ask permission before storing any personal info
 * - We never assume consent - we ask "do you want me to reach out for you?"
 */

import { ServiceRequestDetector } from './ServiceRequestDetector'
import { ServiceRequestParser, ServiceRequestIntent } from './ServiceRequestParser'
import { ServiceRequestCreator } from './ServiceRequestCreator'
import { ServiceRequestDispatcher } from './ServiceRequestDispatcher'
import { ServiceRequestAuditLogger } from './ServiceRequestAuditLogger'
import { ServiceRequestResponseGenerator, ServiceRequestResponse } from './ServiceRequestResponseGenerator'
import { supabase } from '@/lib/supabase'

export class ServiceRequestFlow {
  static isServiceRequestIntent(message: string): boolean {
    return ServiceRequestDetector.isServiceRequestIntent(message)
  }

  static async processServiceRequest(
    message: string,
    userId: string,
    horseContext?: string
  ): Promise<ServiceRequestResponse> {
    
    await ServiceRequestAuditLogger.logServiceRequest(userId, 'request_received', { message })
    
    const intent = ServiceRequestParser.parseServiceRequest(message)
    
    const { data: userMemory } = await supabase
      .from('user_memory')
      .select('subscription_tier')
      .eq('user_id', userId)
      .single()
    
    const userTier = userMemory?.subscription_tier || 'free'
    
    if (userTier === 'free' || userTier === 'guest') {
      return ServiceRequestResponseGenerator.generateUpgradeResponse(intent)
    }
    
    const serviceRequest = await ServiceRequestCreator.createServiceRequest(intent, userId, horseContext)
    const dispatchResult = await ServiceRequestDispatcher.dispatchToProviders(serviceRequest.id, intent)
    
    await ServiceRequestAuditLogger.logServiceRequest(userId, 'providers_dispatched', {
      serviceRequestId: serviceRequest.id,
      providerCount: dispatchResult.providerCount,
      serviceType: intent.serviceType
    })
    
    return ServiceRequestResponseGenerator.generateSuccessResponse(intent, serviceRequest.id, dispatchResult.providerCount)
  }
}
