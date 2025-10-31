// CRM integrations repository helpers
import { supabase } from '@/lib/supabase'
import { CRMProvider, CRMContact, CRMIntegration } from './crm-integrations.types'

export async function getCRMProviders(): Promise<CRMProvider[]> {
  const { data, error } = await supabase
    .from('crm_providers')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createCRMProvider(providerData: Omit<CRMProvider, 'id' | 'created_at' | 'updated_at'>): Promise<CRMProvider> {
  const { data, error } = await supabase
    .from('crm_providers')
    .insert(providerData)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getCRMContacts(providerId: string): Promise<CRMContact[]> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('crm_provider_id', providerId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function syncCRMData(providerId: string): Promise<CRMIntegration> {
  // This would implement actual CRM sync logic
  const provider = await getCRMProviders().then(providers => 
    providers.find(p => p.id === providerId)
  )
  if (!provider) throw new Error('CRM provider not found')
  const contacts = await getCRMContacts(providerId)
  return {
    provider,
    contacts,
    sync_status: 'active',
    last_sync: new Date().toISOString()
  }
}

