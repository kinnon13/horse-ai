// ServiceRequestProviderSelector.ts (30 lines) - Single responsibility: Provider selection
import { supabase } from '@/lib/supabase'
import { ServiceRequestIntent } from './ServiceRequestParser'

export class ProviderSelector {
  static async findProviders(intent: ServiceRequestIntent) {
    const { data: providers, error } = await supabase
      .from('service_providers')
      .select('*')
      .eq('service_type', intent.serviceType)
      .eq('verified', true)
      .eq('active', true)
      .limit(5)

    if (error) throw new Error(`Failed to find providers: ${error.message}`)
    return providers || []
  }

  static async filterByLocation(providers: any[], location: string) {
    return providers.filter(p => 
      p.location_city?.toLowerCase().includes(location.toLowerCase()) ||
      p.location_state?.toLowerCase().includes(location.toLowerCase())
    )
  }

  static async filterByAvailability(providers: any[]) {
    // TODO: Implement availability filtering
    return providers
  }
}


