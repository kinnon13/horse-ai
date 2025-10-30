import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { stripe } from '@/lib/stripe'

/**
 * Service Request Checkout API
 * 
 * This handles booking fees for service requests.
 * This is the money engine - we charge upfront to secure services.
 */

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
    }

    if (!stripe) {
      return NextResponse.json({ error: 'Payment system unavailable' }, { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('id')
    
    if (!requestId) {
      return NextResponse.json({ error: 'Missing request ID' }, { status: 400 })
    }

    const body = await request.json()
    const { user_id, amount = 20 } = body // Default $20 booking fee

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 })
    }

    // Get service request details
    const { data: serviceRequest, error: requestError } = await supabaseAdmin
      .from('service_requests')
      .select(`
        *,
        users (
          email,
          full_name
        )
      `)
      .eq('id', requestId)
      .single()

    if (requestError || !serviceRequest) {
      return NextResponse.json({ error: 'Service request not found' }, { status: 404 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({payment_method_types: ['card'],
      line_items: [{price_data: {currency: 'usd',
            product_data: {name: `${serviceRequest.request_type} Dispatch Fee`,
              description: `Booking fee for ${serviceRequest.request_type} in ${serviceRequest.location_city}, ${serviceRequest.location_state}`,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success&request=${requestId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=cancelled`,
      metadata: {service_request_id: requestId,
        user_id: user_id,
        booking_fee: amount.toString(),
      },
      customer_email: serviceRequest.users?.email,
    })

    return NextResponse.json({checkout_url: session.url,
      session_id: session.id 
    }, { status: 200 })

  } catch (error) {
    console.error('❌ POST /api/service-requests/checkout error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
