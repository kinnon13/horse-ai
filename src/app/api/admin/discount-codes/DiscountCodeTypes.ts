export interface DiscountCodeParams {
  code: string
  discountType: 'percentage' | 'fixed_amount'
  discountValue: number
  maxRedemptions?: number
  expiresAt?: string
}

