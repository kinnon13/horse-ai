import { stripe } from '@/lib/stripe'

export async function listPromotionCodes() {
  if (!stripe) throw new Error('Stripe not configured')

  const promotionCodes = await stripe.promotionCodes.list({
    limit: 100,
    active: true
  })

  return promotionCodes.data.map(pc => ({
    id: pc.id,
    code: pc.code,
    active: pc.active,
    maxRedemptions: pc.max_redemptions,
    timesRedeemed: pc.times_redeemed,
    expiresAt: pc.expires_at ? new Date(pc.expires_at * 1000).toISOString() : null,
    created: new Date(pc.created * 1000).toISOString()
  }))
}

export async function updatePromotionCode(promotionCodeId: string, updates: { active?: boolean }) {
  if (!stripe) throw new Error('Stripe not configured')

  const promotionCode = await stripe.promotionCodes.update(promotionCodeId, {
    active: updates.active
  })

  return {
    id: promotionCode.id,
    code: promotionCode.code,
    active: promotionCode.active
  }
}



