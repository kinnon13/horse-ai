import { supabase } from '@/lib/supabase'

export class LeadGenerationFinderService {
  async findBuyers(criteria: any) {
    const { data: buyers, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, location_city, location_state')
      .eq('subscription_tier', 'plus')
      .limit(10)

    if (error) throw error

    return (buyers || []).map(buyer => ({id: buyer.id,
      name: `${buyer.first_name} ${buyer.last_name}`,
      email: buyer.email,
      location: `${buyer.location_city}, ${buyer.location_state}`,
      type: 'buyer'
    }))
  }

  async findSellers(criteria: any) {
    const { data: sellers, error } = await supabase
      .from('horse_owners')
      .select(`
        id,
        user_id,
        users:user_id (email, first_name, last_name, location_city, location_state)
      `)
      .limit(10)

    if (error) throw error

    return (sellers || []).map(seller => ({id: seller.id,
      name: `${seller.users.first_name} ${seller.users.last_name}`,
      email: seller.users.email,
      location: `${seller.users.location_city}, ${seller.users.location_state}`,
      type: 'seller'
    }))
  }

  async findBreeders(criteria: any) {
    const { data: breeders, error } = await supabase
      .from('producer_profiles')
      .select(`
        id,
        user_id,
        users:user_id (email, first_name, last_name, location_city, location_state)
      `)
      .limit(10)

    if (error) throw error

    return (breeders || []).map(breeder => ({id: breeder.id,
      name: `${breeder.users.first_name} ${breeder.users.last_name}`,
      email: breeder.users.email,
      location: `${breeder.users.location_city}, ${breeder.users.location_state}`,
      type: 'breeder'
    }))
  }

  async findServiceProviders(criteria: any) {
    const { data: providers, error } = await supabase
      .from('providers')
      .select('*')
      .eq('provider_active', true)
      .eq('admin_blocked', false)
      .limit(10)

    if (error) throw error

    return (providers || []).map(provider => ({id: provider.id,
      name: provider.business_name,
      email: provider.email,
      phone: provider.phone,
      location: `${provider.city}, ${provider.state}`,
      service_type: provider.service_type,
      type: 'service_provider'
    }))
  }
}

