import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export async function POST(req: NextRequest) {
  try {
    const { registrationId, competitionId, horseId, amount } = await req.json()

    if (!registrationId || !amount) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create Stripe checkout session for entry fee
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Competition Entry Fee',
              description: `Registration for competition ${competitionId}`
            },
            unit_amount: amount // Amount in cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/competitions/${competitionId}?registered=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/competitions/${competitionId}/register`,
      metadata: {
        registrationId,
        competitionId,
        horseId,
        type: 'competition_registration'
      }
    })

    return NextResponse.json({ 
      success: true, 
      checkoutUrl: session.url,
      sessionId: session.id
    })
  } catch (error) {
    console.error('Competition registration error:', error)
    return NextResponse.json({ 
      error: 'Registration failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

