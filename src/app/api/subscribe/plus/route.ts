// route.ts (25 lines) - Main Stripe checkout route
import { NextRequest, NextResponse } from 'next/server'
import { createStripeCustomer, createCheckoutSession } from './StripeCheckoutHelpers'

export async function POST(request: NextRequest) {
  try {
    const { user_id, email } = await request.json()
    
    if (!user_id || !email) {
      return NextResponse.json({ error: 'User ID and email required' }, { status: 400 })
    }

    const customer = await createStripeCustomer(user_id, email)
    const session = await createCheckoutSession(customer.id, user_id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating Plus checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}