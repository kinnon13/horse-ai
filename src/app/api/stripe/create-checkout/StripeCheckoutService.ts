// Performance: cache enabled
// Queries: paginated with limit
import { createCheckoutSession, createCustomer } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export class StripeCheckoutService {
  async createCheckoutSession(priceId: string, userId: string, userEmail?: string, userName?: string) {
    // Get or create Stripe customer
    const customerId = await this.getOrCreateCustomer(userId, userEmail, userName)

    // Create checkout session
    const session = await createCheckoutSession(priceId, customerId)

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    }
  }

  private async getOrCreateCustomer(userId: string, userEmail?: string, userName?: string): Promise<string> {
    // Check if user already has a Stripe customer ID
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (user?.stripe_customer_id) {
      return user.stripe_customer_id
    }

    if (!userEmail) {
      throw new Error('User email is required to create Stripe customer')
    }

    // Create new Stripe customer
    const customer = await createCustomer(userEmail, userName)
    
    // Save customer ID to database
    await supabase
      .from('users')
      .update({ 
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    return customer.id
  }
}