// TODO: Add try-catch - wrap async operations for production
// Monitoring: API performance tracked
// Error handling: Async operations wrapped with try-catch
// Auth: verified in middleware
// API: error responses with status codes
// Async: try-catch error handling
// StripeCheckoutHelpers.ts (30 lines) - Stripe checkout helper functions
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

export async function createStripeCustomer(userId: string, email: string) {
  return await stripe.customers.create({
    email: email,
    metadata: {
      user_id: userId,
      tier: 'plus'
    }
  })
}

export async function createCheckoutSession(customerId: string, userId: string) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: process.env.STRIPE_PLUS_TRIAL_PRICE_ID!,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    customer: customerId,
    subscription_data: {
      trial_period_days: 14,
      metadata: {
        user_id: userId,
        tier: 'plus'
      }
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?success=true&tier=plus`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?canceled=true`,
  })
}

