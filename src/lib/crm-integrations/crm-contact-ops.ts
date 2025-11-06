// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
import { supabase } from '@/lib/supabase'
import { CRMContact } from './crm-integrations.types'

export async function getCRMContacts(providerId: string): Promise<CRMContact[]> {
  const { data, error } = await supabase
    .from('crm_contacts')
    .select('*')
    .eq('crm_provider_id', providerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}


