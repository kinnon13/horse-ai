import { stripe } from '@/lib/stripe'

export async function createCoupon(discountType: string, discountValue: number) {
  if (!stripe) throw new Error('Stripe not configured')

  const couponData: any = {
    name: `Beta Test ${discountType} ${discountValue}`,
    metadata: {
      created_by: 'admin',
      purpose: 'beta_testing'
    }
  }

  if (discountType === 'percentage') {
    couponData.percent_off = discountValue
  } else {
    couponData.amount_off = discountValue * 100 // Convert to cents
    couponData.currency = 'usd'
  }

  const coupon = await stripe.coupons.create(couponData)
  return coupon.id
}

export async function createPromotionCode(params: any) {
  if (!stripe) throw new Error('Stripe not configured')

  const couponId = await createCoupon(params.discountType, params.discountValue)
  
  const promotionCode = await stripe.promotionCodes.create({
    code: params.code.toUpperCase(),
    coupon: couponId,
    max_redemptions: params.maxRedemptions || null,
    expires_at: params.expiresAt ? Math.floor(new Date(params.expiresAt).getTime() / 1000) : undefined,
    active: true,
    metadata: {
      created_by: 'admin',
      purpose: 'beta_testing',
      created_at: new Date().toISOString()
    }
  })

  return {
    id: promotionCode.id,
    code: promotionCode.code,
    discountType: params.discountType,
    discountValue: params.discountValue,
    maxRedemptions: params.maxRedemptions,
    expiresAt: params.expiresAt,
    active: promotionCode.active
  }
}