// Real metrics from database
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function getRealMetrics() {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true })

    // Get active users (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const { count: activeUsers } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString())

    // Get premium users
    const { count: premiumUsers } = await supabase
      .from('user_subscriptions')
      .select('*', { count: 'exact', head: true })
      .in('tier', ['plus', 'pro'])
      .eq('status', 'active')

    // Get revenue (this month)
    const monthStart = new Date()
    monthStart.setDate(1)
    
    const { data: transactions } = await supabase
      .from('subscription_payments')
      .select('amount_cents')
      .gte('created_at', monthStart.toISOString())

    const monthlyRevenue = (transactions || []).reduce((sum, t) => sum + (t.amount_cents || 0), 0) / 100

    const safeTotal = totalUsers || 0
    const safePremium = premiumUsers || 0
    
    return {
      totalUsers: safeTotal,
      activeUsers: activeUsers || 0,
      premiumUsers: safePremium,
      monthlyRevenue,
      conversionRate: safeTotal ? (safePremium / safeTotal) : 0,
      hasRealData: safeTotal > 0
    }
  } catch (error) {
    console.error('Error getting metrics:', error)
    return null
  }
}

