import { supabase } from '@/lib/supabase'

export async function findServiceProviders(criteria: any) {
  const { data: providers, error } = await supabase
    .from('providers')
    .select('*')
    .eq('provider_active', true)
    .eq('admin_blocked', false)
    .limit(10)

  if (error) throw error

  return (providers || []).map((provider: any) => ({
    id: provider.id,
    name: provider.business_name || '',
    email: provider.email || '',
    phone: provider.phone || '',
    location: `${provider.city || ''}, ${provider.state || ''}`,
    service_type: provider.service_type || '',
    type: 'service_provider'
  }))
}

