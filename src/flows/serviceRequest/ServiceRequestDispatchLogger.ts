// ServiceRequestDispatchLogger.ts (30 lines) - Single responsibility: Dispatch logging
import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'

export class DispatchLogger {
  static async logDispatch(intent: ServiceRequestIntent, providers: any[], results: any[]) {
    const { error } = await supabase
      .from('service_request_dispatches')
      .insert({
        request_id: intent.requestId,
        service_type: intent.serviceType,
        location: intent.location,
        providers_contacted: providers.length,
        dispatch_results: results,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Failed to log dispatch:', error)
    }
  }

  static async getDispatchHistory(requestId: string) {
    const { data, error } = await supabase
      .from('service_request_dispatches')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Failed to get dispatch history: ${error.message}`)
    return data || []
  }
}


