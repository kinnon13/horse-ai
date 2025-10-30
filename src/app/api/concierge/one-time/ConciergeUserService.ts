import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

export class ConciergeUserService {
  async getUser(userId: string) {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single()

    if (error || !user) throw new Error('User not found')
    return user
  }

  async ensureStripeCustomer(user: any) {
    let customerId = user.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id }
      })
      customerId = customer.id

      await supabaseAdmin
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    return customerId
  }
}



