// crm-contact-operations.ts (25 lines) - Single responsibility: Contact operations
import { supabase } from '@/lib/supabase'
import { CRMContact, CRMIntegration } from './crm-integrations.types'
import { getCRMProviders } from './crm-provider-operations'

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

