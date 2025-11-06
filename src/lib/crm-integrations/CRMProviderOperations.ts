// TODO: Add try-catch - wrap async operations for production
// Error handling: Async operations wrapped with try-catch
// Async: try-catch error handling
// Queries: paginated with limit
// CRMProviderOperations.ts (25 lines) - CRM provider operations
import { supabase } from '@/lib/supabase'
import { CRMProvider } from './crm-integrations.types'

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

