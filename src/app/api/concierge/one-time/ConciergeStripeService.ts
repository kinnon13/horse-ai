import { stripe } from '@/lib/stripe'

export class ConciergeStripeService {
  async createStripeSession(customerId: string, serviceType: string, location: string, amount: number, userId: string, urgency: string) {
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Concierge Service: ${serviceType}`,
            description: `Emergency ${serviceType} service in ${location}`
          },
          unit_amount: amount * 100
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?concierge=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?concierge=cancelled`,
      metadata: { 
        userId, 
        serviceType, 
        location, 
        urgency,
        type: 'concierge_one_time'
      }
    })
  }
}




