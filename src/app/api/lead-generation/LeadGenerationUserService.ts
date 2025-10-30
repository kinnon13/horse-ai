import { supabase } from '@/lib/supabase'

export class LeadGenerationUserService {
  async checkUserSubscription(userId: string) {
    const { data: user, error } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    if (error || !user) throw new Error('User not found')
    if (user.subscription_tier !== 'plus') {
      throw new Error('Lead generation is only available for Plus tier subscribers')
    }

    return user
  }
}

