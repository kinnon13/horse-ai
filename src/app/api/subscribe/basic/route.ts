// Monitoring: API performance tracked
// Auth: verified in middleware
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
})

// POST /api/subscribe/basic - Create Stripe checkout for Basic ($9.99/mo)
export async function POST(request: NextRequest) {
  try {
    const { user_id, email } = await request.json()
    
    if (!user_id || !email) {
      return NextResponse.json({ error: 'User ID and email required' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID!, // $9.99 Basic plan
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: email,
      metadata: {
        user_id: user_id,
        tier: 'basic'
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/chat?success=true&tier=basic`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating Basic checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
