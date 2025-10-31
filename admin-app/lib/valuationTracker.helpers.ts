import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export async function getCurrentMetrics() {
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: users } = await supabase.from('users').select('id')
  const { data: paid } = await supabase.from('users').select('*').eq('subscription_status', 'active')
  
  const totalUsers = users?.length || 0
  const paidUsers = paid?.length || 0
  const monthlyRevenue = paidUsers * 20
  const projectedARR = monthlyRevenue * 12
  const estimatedValuation = projectedARR * 20
  
  return { totalUsers, paidUsers, monthlyRevenue, projectedARR, estimatedValuation }
}
