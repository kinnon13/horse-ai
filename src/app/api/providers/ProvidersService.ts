import { supabaseAdmin } from '@/lib/supabase'

export class ProvidersService {
  async getProviders(filters: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    let query = supabaseAdmin
      .from('providers')
      .select('*')
      .eq('provider_active', true)
      .eq('admin_blocked', false)

    if (filters.serviceType) query = query.eq('service_type', filters.serviceType)
    if (filters.city) query = query.eq('city', filters.city)
    if (filters.state) query = query.eq('state', filters.state)
    if (filters.verified) query = query.eq('is_verified', filters.verified === 'true')

    query = query.order('created_at', { ascending: false })
    query = query.limit(filters.limit || 50)

    const { data: providers, error } = await query

    if (error) throw error
    return providers || []
  }

  async createProvider(providerData: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: provider, error } = await supabaseAdmin
      .from('providers')
      .insert([{
        ...providerData,
        provider_active: true,
        admin_blocked: false,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return provider
  }

  async updateProvider(providerId: string, updates: any) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: provider, error } = await supabaseAdmin
      .from('providers')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', providerId)
      .select()
      .single()

    if (error) throw error
    return provider
  }

  async deleteProvider(providerId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { error } = await supabaseAdmin
      .from('providers')
      .update({ provider_active: false })
      .eq('id', providerId)

    if (error) throw error
    return { success: true }
  }

  async verifyProvider(providerId: string) {
    if (!supabaseAdmin) {
      throw new Error('Database not available')
    }

    const { data: provider, error } = await supabaseAdmin
      .from('providers')
      .update({is_verified: true,
        verified_at: new Date().toISOString()
      })
      .eq('id', providerId)
      .select()
      .single()

    if (error) throw error
    return provider
  }
}

