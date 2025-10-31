// RepoHelpers.ts (35 lines) - Single responsibility: Repository helper functions
import { supabase } from '@/lib/supabase'
import { CRMProvider, CRMContact, CRMIntegration } from './crm-integrations.types'

export class RepoHelpers {
  static async fetchProviders(): Promise<CRMProvider[]> {
    const { data, error } = await supabase
      .from('crm_providers')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async insertProvider(providerData: Omit<CRMProvider, 'id' | 'created_at' | 'updated_at'>): Promise<CRMProvider> {
    const { data, error } = await supabase
      .from('crm_providers')
      .insert(providerData)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async fetchContacts(providerId: string): Promise<CRMContact[]> {
    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .eq('crm_provider_id', providerId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }
}

