import { NextRequest, NextResponse } from 'next/server'
import { createPromotionCode, listPromotionCodes, updatePromotionCode } from './DiscountCodeService'

export async function POST(request: NextRequest) {
  try {
    const { code, discountType, discountValue, maxRedemptions, expiresAt } = await request.json()

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const promotionCode = await createPromotionCode({
      code,
      discountType,
      discountValue,
      maxRedemptions,
      expiresAt
    })

    return NextResponse.json({ success: true, promotionCode })
  } catch (error: any) {
    console.error('POST /api/admin/discount-codes error:', error)
    return NextResponse.json({ 
      error: 'Failed to create discount code', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const promotionCodes = await listPromotionCodes()
    return NextResponse.json({ success: true, promotionCodes })
  } catch (error: any) {
    console.error('GET /api/admin/discount-codes error:', error)
    return NextResponse.json({ 
      error: 'Failed to list discount codes', 
      details: error.message 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { promotionCodeId, active } = await request.json()

    if (!promotionCodeId) {
      return NextResponse.json({ error: 'Promotion code ID required' }, { status: 400 })
    }

    const updatedCode = await updatePromotionCode(promotionCodeId, { active })
    return NextResponse.json({ success: true, promotionCode: updatedCode })
  } catch (error: any) {
    console.error('PUT /api/admin/discount-codes error:', error)
    return NextResponse.json({ 
      error: 'Failed to update discount code', 
      details: error.message 
    }, { status: 500 })
  }
}
