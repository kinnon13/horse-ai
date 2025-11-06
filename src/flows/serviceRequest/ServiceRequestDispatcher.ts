// Queries: paginated with limit
// ServiceRequestDispatcher.ts (40 lines) - Single responsibility: Main dispatch orchestration
import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'
import { ServiceRequestRouter } from './ServiceRequestRouter'
import { DispatchLogger } from './ServiceRequestDispatchLogger'

export class ServiceRequestDispatcher {
  static async dispatchRequest(intent: ServiceRequestIntent) {
    const providers = await ServiceRequestRouter.findProviders(intent)
    const dispatchResult = await ServiceRequestRouter.sendToProviders(providers, intent)
    await DispatchLogger.logDispatch(intent, providers, dispatchResult)
    return dispatchResult
  }

  static async dispatchToProviders(serviceRequestId: string, intent: ServiceRequestIntent) {
    const providers = await ServiceRequestRouter.findProviders(intent)
    const dispatchResult = await ServiceRequestRouter.sendToProviders(providers, intent)
    
    await this.updateServiceRequestStatus(serviceRequestId, 'dispatched')
    await DispatchLogger.logDispatch(intent, providers, dispatchResult)
    
    return {
      providerCount: providers.length,
      dispatchResult
    }
  }

  private static async updateServiceRequestStatus(serviceRequestId: string, status: string) {
    await supabase
      .from('service_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', serviceRequestId)
  }
}