import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// POST /api/subscribe/plus - Create Stripe checkout for Plus trial ($4.99 for 14 days, then $19.99/mo)
export async function POST(request: NextRequest) {
  try {
    const { user_id, email } = await request.json()
    
    if (!user_id || !email) {
      return NextResponse.json({ error: 'User ID and email required' }, { status: 400 })
    }

    // Create a customer first
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        user_id: user_id,
        tier: 'plus'
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PLUS_TRIAL_PRICE_ID!, // $4.99 trial price
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer: customer.id,
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          user_id: user_id,
          tier: 'plus'
        }
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?success=true&tier=plus`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating Plus checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
