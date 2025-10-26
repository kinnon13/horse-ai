import Stripe from 'stripe'

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  : null

export const subscriptionTiers = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Basic horse profiles',
      'Limited AI queries (5/month)',
      'CSV upload (100 rows)',
      'Community access'
    ]
  },
  intro: {
    name: 'Intro',
    price: 499, // $4.99 in cents
    features: [
      'Everything in Free',
      'Unlimited AI queries',
      'CSV upload (1000 rows)',
      'Advanced analytics',
      'Priority support'
    ]
  },
  pro: {
    name: 'Pro',
    price: 1499, // $14.99 in cents
    features: [
      'Everything in Intro',
      'Unlimited CSV uploads',
      'Custom reports',
      'API access',
      'White-label options'
    ]
  }
}

export async function createCheckoutSession(
  priceId: string,
  customerId?: string,
  successUrl?: string,
  cancelUrl?: string
) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
  })

  return session
}

export async function createCustomer(email: string, name?: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  return await stripe.customers.create({
    email,
    name,
  })
}

export async function getSubscription(subscriptionId: string) {
  if (!stripe) {
    throw new Error('Stripe not configured')
  }
  
  return await stripe.subscriptions.retrieve(subscriptionId)
}
