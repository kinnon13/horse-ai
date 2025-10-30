import { supabaseAdmin } from '@/lib/supabase'
import { ProviderClaim } from './ServiceRequestClaimTypes'

export class ServiceRequestClaimRepo2 {
  static async createProviderClaim(claimData: Omit<ProviderClaim, 'id' | 'created_at' | 'updated_at'>): Promise<ProviderClaim> {
    if (!supabaseAdmin) throw new Error('Database not available')

    const { data: providerClaim, error } = await supabaseAdmin
      .from('provider_claims')
      .insert({
        ...claimData,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw new Error(`Failed to create provider claim: ${error.message}`)
    return providerClaim
  }

  static async notifyUserOfClaim(userId: string, providerName: string, serviceType: string): Promise<void> {
    if (!supabaseAdmin) throw new Error('Database not available')

    const { error } = await supabaseAdmin
      .from('notifications_outbox')
      .insert({
        user_id: userId,
        type: 'service_claim',
        title: 'New Service Provider Response',
        message: `${providerName} has responded to your ${serviceType} request`,
        status: 'pending',
        created_at: new Date().toISOString()
      })

    if (error) throw new Error(`Failed to create notification: ${error.message}`)
  }
}
