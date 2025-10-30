import { Provider, ServiceRequest } from './ProviderLoginTypes'
import { supabase } from '@/lib/supabase'

export async function fetchProviderData(userId: string): Promise<Provider | null> {
  try {
    const { data, error } = await supabase
      .from('providers')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching provider data:', error)
    return null
  }
}

