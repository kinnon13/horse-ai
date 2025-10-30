// API route - exempt from single-task audit
import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, createCustomer } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { priceId, userId, userEmail, userName } = await request.json()

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get or create Stripe customer
    let customerId: string

    // Check if user already has a Stripe customer ID
    const { data: user } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (user?.stripe_customer_id) {
      customerId = user.stripe_customer_id
    } else {
      // Create new Stripe customer
      const customer = await createCustomer(userEmail, userName)
      customerId = customer.id

      // Save customer ID to database
      await supabase
        .from('users')
        .update({ 
          stripe_customer_id: customerId,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
    }

    // Create checkout session
    const session = await createCheckoutSession(
      priceId,
      customerId,
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`
    )

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create checkout session'
    }, { status: 500 })
  }
}
