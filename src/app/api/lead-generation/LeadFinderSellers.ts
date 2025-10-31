import { supabase } from '@/lib/supabase'

export async function findSellers(criteria: any) {
  const { data: sellers, error } = await supabase
    .from('horse_owners')
    .select(`
      id,
      user_id,
      users:user_id (email, first_name, last_name, location_city, location_state)
    `)
    .limit(10)

  if (error) throw error

  return (sellers || []).map((seller: any) => ({
    id: seller.id,
    name: `${seller.users?.first_name || ''} ${seller.users?.last_name || ''}`,
    email: seller.users?.email || '',
    location: `${seller.users?.location_city || ''}, ${seller.users?.location_state || ''}`,
    type: 'seller'
  }))
}

