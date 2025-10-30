import { supabaseAdmin } from '@/lib/supabase'

export async function generateReferralCode(params: { reward_type?: string, reward_value?: number, max_uses?: number }) {
  const { reward_type = 'free_month', reward_value = 1, max_uses = 100 } = params
  const code = `REF${Date.now().toString(36).toUpperCase()}`
  
  const { data, error } = await supabaseAdmin
    .from('referral_codes')
    .insert({ code, reward_type, reward_value, max_uses, used_count: 0, is_active: true })
    .select()
    .single()

  if (error) throw new Error(`Failed to create referral code: ${error.message}`)
  return { success: true, code: data.code }
}

export async function createTestProvider(params: { name?: string, service_type?: string, location?: string }) {
  const { name = 'Test Provider', service_type = 'farrier', location = 'Test City, TX' } = params
  
  const { data, error } = await supabaseAdmin
    .from('providers')
    .insert({
      business_name: name,
      service_type,
      location_city: location.split(',')[0].trim(),
      location_state: location.split(',')[1]?.trim() || 'TX',
      is_verified: true,
      contact_email: `test@${name.toLowerCase().replace(/\s+/g, '')}.com`,
      contact_phone: '555-0123'
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create test provider: ${error.message}`)
  return { success: true, provider: data }
}



