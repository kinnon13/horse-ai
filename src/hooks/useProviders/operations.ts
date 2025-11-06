// TODO: Add try-catch - wrap async operations for production
import { supabase } from '@/lib/supabase'
import { Provider, ProviderFilters } from './types'
import { mapProviderFromDb, mapProviderToDb } from './operationsHelpers'

export const fetchProviders = async (filters: ProviderFilters): Promise<Provider[]> => {
  let query = supabase.from('providers').select('*')
  if (filters.service_type) query = query.eq('service_type', filters.service_type)
  if (filters.city) query = query.eq('city', filters.city)
  if (filters.state) query = query.eq('state', filters.state)
  if (filters.verified !== undefined) query = query.eq('verified', filters.verified)
  if (filters.limit) query = query.limit(filters.limit)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(mapProviderFromDb)
}

export const createProvider = async (
  providerData: Omit<Provider, 'id' | 'created_at' | 'updated_at'>
): Promise<Provider> => {
  const { data, error } = await supabase
    .from('providers')
    .insert(mapProviderToDb(providerData))
    .select()
    .single()
  if (error) throw error
  return mapProviderFromDb(data)
}

export const updateProvider = async (
  id: string,
  updateData: Partial<Provider>
): Promise<Provider> => {
  const { data, error } = await supabase
    .from('providers')
    .update(mapProviderToDb(updateData as Provider))
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return mapProviderFromDb(data)
}

export const deleteProvider = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('providers').delete().eq('id', id)
  if (error) throw error
  return true
}